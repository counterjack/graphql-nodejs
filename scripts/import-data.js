const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { User, Category, Product, Order, Review } = require('../models');
require('dotenv').config();

async function importData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce-graphql', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Read sample data
    const dataPath = path.join(__dirname, '../data/sample-data.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Review.deleteMany({});
    console.log('Cleared existing data');

    // Import data in order (due to dependencies)
    
    // 1. Import Users
    if (data.users) {
      await User.insertMany(data.users);
      console.log(`Imported ${data.users.length} users`);
    }

    // 2. Import Categories
    if (data.categories) {
      await Category.insertMany(data.categories);
      console.log(`Imported ${data.categories.length} categories`);
    }

    // 3. Import Products
    if (data.products) {
      await Product.insertMany(data.products);
      console.log(`Imported ${data.products.length} products`);
    }

    // 4. Import Orders
    if (data.orders) {
      await Order.insertMany(data.orders);
      console.log(`Imported ${data.orders.length} orders`);
    }

    // 5. Import Reviews
    if (data.reviews) {
      await Review.insertMany(data.reviews);
      console.log(`Imported ${data.reviews.length} reviews`);
    }

    console.log('Data import completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
}

importData();