const { User, Category, Product, Order, Review } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const resolvers = {
  Query: {
    // User queries
    users: async () => {
      return await User.find();
    },
    user: async (_, { id }) => {
      return await User.findById(id);
    },

    // Product queries
    products: async (_, { filter, sort, limit = 10, offset = 0 }) => {
      let query = Product.find();
      
      // Apply filters
      if (filter) {
        if (filter.categoryId) query = query.where('category').equals(filter.categoryId);
        if (filter.minPrice) query = query.where('price').gte(filter.minPrice);
        if (filter.maxPrice) query = query.where('price').lte(filter.maxPrice);
        if (filter.brand) query = query.where('brand').equals(filter.brand);
        if (filter.inStock) query = query.where('stock').gt(0);
        if (filter.tags) query = query.where('tags').in(filter.tags);
      }
      
      // Apply sorting
      if (sort) {
        const sortOrder = sort.order === 'DESC' ? -1 : 1;
        switch (sort.field) {
          case 'NAME':
            query = query.sort({ name: sortOrder });
            break;
          case 'PRICE':
            query = query.sort({ price: sortOrder });
            break;
          case 'CREATED_AT':
            query = query.sort({ createdAt: sortOrder });
            break;
          case 'RATING':
            query = query.sort({ 'rating.average': sortOrder });
            break;
        }
      }
      
      return await query.skip(offset).limit(limit).populate('category');
    },
    
    product: async (_, { id }) => {
      return await Product.findById(id).populate('category');
    },
    
    productBySkU: async (_, { sku }) => {
      return await Product.findOne({ sku }).populate('category');
    },
    
    searchProducts: async (_, { query }) => {
      return await Product.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } }
        ]
      }).populate('category');
    },

    // Category queries
    categories: async () => {
      return await Category.find().populate('parentCategory');
    },
    
    category: async (_, { id }) => {
      return await Category.findById(id).populate('parentCategory');
    },
    
    topCategories: async () => {
      return await Category.find({ parentCategory: null });
    },

    // Order queries
    orders: async () => {
      return await Order.find().populate('user').populate('items.product');
    },
    
    order: async (_, { id }) => {
      return await Order.findById(id).populate('user').populate('items.product');
    },

    // Review queries
    reviews: async (_, { productId }) => {
      return await Review.find({ product: productId }).populate('user').populate('product');
    },
    
    review: async (_, { id }) => {
      return await Review.findById(id).populate('user').populate('product');
    }
  },

  Mutation: {
    // User mutations
    register: async (_, { username, email, password, firstName, lastName }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        username,
        email,
        password: hashedPassword,
        firstName,
        lastName
      });
      return await user.save();
    },
    
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user || !await bcrypt.compare(password, user.password)) {
        throw new Error('Invalid credentials');
      }
      return jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    },

    // Product mutations
    createProduct: async (_, { input }) => {
      const product = new Product(input);
      product.category = input.categoryId;
      return await product.save();
    },
    
    updateProduct: async (_, { id, input }) => {
      const updateData = { ...input, updatedAt: new Date() };
      if (input.categoryId) {
        updateData.category = input.categoryId;
        delete updateData.categoryId;
      }
      return await Product.findByIdAndUpdate(id, updateData, { new: true }).populate('category');
    },
    
    deleteProduct: async (_, { id }) => {
      const result = await Product.findByIdAndDelete(id);
      return !!result;
    },

    // Category mutations
    createCategory: async (_, { name, description, parentCategoryId }) => {
      const category = new Category({
        name,
        description,
        parentCategory: parentCategoryId || null
      });
      return await category.save();
    },
    
    updateCategory: async (_, { id, name, description }) => {
      return await Category.findByIdAndUpdate(
        id,
        { name, description },
        { new: true }
      ).populate('parentCategory');
    },
    
    deleteCategory: async (_, { id }) => {
      const result = await Category.findByIdAndDelete(id);
      return !!result;
    },

    // Order mutations
    createOrder: async (_, { input }) => {
      // Calculate total amount
      let totalAmount = 0;
      const orderItems = [];
      
      for (const item of input.items) {
        const product = await Product.findById(item.productId);
        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }
        
        const price = product.discountPrice || product.price;
        totalAmount += price * item.quantity;
        
        orderItems.push({
          product: item.productId,
          quantity: item.quantity,
          price: price
        });
        
        // Update stock
        product.stock -= item.quantity;
        await product.save();
      }
      
      const order = new Order({
        user: "507f1f77bcf86cd799439011", // Replace with actual user ID from context
        items: orderItems,
        totalAmount,
        shippingAddress: input.shippingAddress,
        paymentMethod: input.paymentMethod,
        notes: input.notes
      });
      
      return await order.save();
    },
    
    updateOrderStatus: async (_, { id, status }) => {
      return await Order.findByIdAndUpdate(
        id,
        { status, updatedAt: new Date() },
        { new: true }
      ).populate('user').populate('items.product');
    },
    
    cancelOrder: async (_, { id }) => {
      const order = await Order.findById(id);
      if (!order) {
        throw new Error('Order not found');
      }
      
      // Restore stock
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }
      
      order.status = 'CANCELLED';
      order.updatedAt = new Date();
      return await order.save();
    },

    // Review mutations
    createReview: async (_, { input }) => {
      const review = new Review({
        user: "507f1f77bcf86cd799439011", // Replace with actual user ID from context
        product: input.productId,
        rating: input.rating,
        comment: input.comment,
        title: input.title
      });
      
      const savedReview = await review.save();
      
      // Update product rating
      const reviews = await Review.find({ product: input.productId });
      const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      
      await Product.findByIdAndUpdate(input.productId, {
        'rating.average': averageRating,
        'rating.count': reviews.length
      });
      
      return savedReview;
    },
    
    updateReview: async (_, { id, rating, comment, title }) => {
      const updateData = {};
      if (rating !== undefined) updateData.rating = rating;
      if (comment !== undefined) updateData.comment = comment;
      if (title !== undefined) updateData.title = title;
      
      return await Review.findByIdAndUpdate(id, updateData, { new: true })
        .populate('user').populate('product');
    },
    
    deleteReview: async (_, { id }) => {
      const result = await Review.findByIdAndDelete(id);
      return !!result;
    }
  },

  // Field resolvers
  User: {
    orders: async (user) => {
      return await Order.find({ user: user.id }).populate('items.product');
    },
    reviews: async (user) => {
      return await Review.find({ user: user.id }).populate('product');
    }
  },

  Category: {
    subcategories: async (category) => {
      return await Category.find({ parentCategory: category.id });
    },
    products: async (category) => {
      return await Product.find({ category: category.id });
    }
  },

  Product: {
    category: async (product) => {
      return await Category.findById(product.category);
    },
    reviews: async (product) => {
      return await Review.find({ product: product.id }).populate('user');
    }
  },

  Order: {
    user: async (order) => {
      return await User.findById(order.user);
    },
    items: async (order) => {
      const populatedOrder = await Order.findById(order.id).populate('items.product');
      return populatedOrder.items;
    }
  },

  Review: {
    user: async (review) => {
      return await User.findById(review.user);
    },
    product: async (review) => {
      return await Product.findById(review.product);
    }
  }
};

module.exports = { resolvers };