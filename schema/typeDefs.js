const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    firstName: String!
    lastName: String!
    role: UserRole!
    address: Address
    phone: String
    orders: [Order!]
    reviews: [Review!]
    createdAt: String!
    updatedAt: String!
  }

  type Address {
    street: String
    city: String
    state: String
    zipCode: String
    country: String
  }

  enum UserRole {
    USER
    ADMIN
  }

  type Category {
    id: ID!
    name: String!
    description: String
    image: String
    parentCategory: Category
    subcategories: [Category!]
    products: [Product!]
    createdAt: String!
  }

  type Product {
    id: ID!
    name: String!
    description: String!
    price: Float!
    discountPrice: Float
    category: Category!
    brand: String
    images: [String!]
    stock: Int!
    sku: String!
    tags: [String!]
    specifications: ProductSpecifications
    rating: ProductRating!
    isActive: Boolean!
    reviews: [Review!]
    createdAt: String!
    updatedAt: String!
  }

  type ProductSpecifications {
    weight: String
    dimensions: String
    color: String
    material: String
  }

  type ProductRating {
    average: Float!
    count: Int!
  }

  type Order {
    id: ID!
    user: User!
    items: [OrderItem!]!
    totalAmount: Float!
    status: OrderStatus!
    shippingAddress: Address!
    paymentMethod: String!
    paymentStatus: PaymentStatus!
    trackingNumber: String
    notes: String
    createdAt: String!
    updatedAt: String!
  }

  type OrderItem {
    product: Product!
    quantity: Int!
    price: Float!
  }

  enum OrderStatus {
    PENDING
    PROCESSING
    SHIPPED
    DELIVERED
    CANCELLED
  }

  enum PaymentStatus {
    PENDING
    PAID
    FAILED
    REFUNDED
  }

  type Review {
    id: ID!
    user: User!
    product: Product!
    rating: Int!
    comment: String
    title: String
    helpful: Int!
    verified: Boolean!
    createdAt: String!
  }

  # Input Types
  input AddressInput {
    street: String!
    city: String!
    state: String!
    zipCode: String!
    country: String!
  }

  input ProductSpecificationsInput {
    weight: String
    dimensions: String
    color: String
    material: String
  }

  input CreateProductInput {
    name: String!
    description: String!
    price: Float!
    discountPrice: Float
    categoryId: ID!
    brand: String
    images: [String!]
    stock: Int!
    sku: String!
    tags: [String!]
    specifications: ProductSpecificationsInput
  }

  input UpdateProductInput {
    name: String
    description: String
    price: Float
    discountPrice: Float
    categoryId: ID
    brand: String
    images: [String!]
    stock: Int
    tags: [String!]
    specifications: ProductSpecificationsInput
    isActive: Boolean
  }

  input CreateOrderInput {
    items: [OrderItemInput!]!
    shippingAddress: AddressInput!
    paymentMethod: String!
    notes: String
  }

  input OrderItemInput {
    productId: ID!
    quantity: Int!
  }

  input CreateReviewInput {
    productId: ID!
    rating: Int!
    comment: String
    title: String
  }

  input ProductFilter {
    categoryId: ID
    minPrice: Float
    maxPrice: Float
    brand: String
    inStock: Boolean
    tags: [String!]
  }

  input ProductSort {
    field: ProductSortField!
    order: SortOrder!
  }

  enum ProductSortField {
    NAME
    PRICE
    CREATED_AT
    RATING
  }

  enum SortOrder {
    ASC
    DESC
  }

  # Queries
  type Query {
    # User queries
    me: User
    users: [User!]!
    user(id: ID!): User

    # Product queries
    products(
      filter: ProductFilter
      sort: ProductSort
      limit: Int
      offset: Int
    ): [Product!]!
    product(id: ID!): Product
    productBySkU(sku: String!): Product
    searchProducts(query: String!): [Product!]!

    # Category queries
    categories: [Category!]!
    category(id: ID!): Category
    topCategories: [Category!]!

    # Order queries
    orders: [Order!]!
    order(id: ID!): Order
    myOrders: [Order!]!

    # Review queries
    reviews(productId: ID!): [Review!]!
    review(id: ID!): Review
  }

  # Mutations
  type Mutation {
    # User mutations
    register(
      username: String!
      email: String!
      password: String!
      firstName: String!
      lastName: String!
    ): User!
    login(email: String!, password: String!): String!

    # Product mutations
    createProduct(input: CreateProductInput!): Product!
    updateProduct(id: ID!, input: UpdateProductInput!): Product!
    deleteProduct(id: ID!): Boolean!

    # Category mutations
    createCategory(name: String!, description: String, parentCategoryId: ID): Category!
    updateCategory(id: ID!, name: String, description: String): Category!
    deleteCategory(id: ID!): Boolean!

    # Order mutations
    createOrder(input: CreateOrderInput!): Order!
    updateOrderStatus(id: ID!, status: OrderStatus!): Order!
    cancelOrder(id: ID!): Order!

    # Review mutations
    createReview(input: CreateReviewInput!): Review!
    updateReview(id: ID!, rating: Int, comment: String, title: String): Review!
    deleteReview(id: ID!): Boolean!
  }
`;

module.exports = { typeDefs };