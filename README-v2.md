# GraphQL E-commerce API

A comprehensive GraphQL API for e-commerce applications built with Node.js, Express, Apollo Server, and MongoDB.

## 🚀 Features

- **GraphQL API** with queries and mutations
- **User Management** - Registration, authentication, and profiles
- **Product Catalog** - Browse products with categories and search
- **Shopping Cart** - Add/remove items and manage cart
- **Order Management** - Place orders and track order history
- **Category Management** - Organize products by categories
- **MongoDB Integration** - Persistent data storage
- **Sample Data** - Pre-populated database for testing

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.0 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd graphql-ecommerce-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configurations:
   ```
   PORT=4000
   MONGODB_URI=mongodb://localhost:27017/graphql-ecommerce
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=development
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or if using MongoDB service
   sudo systemctl start mongod
   ```

5. **Import sample data**
   ```bash
   npm run import-data
   ```

6. **Start the server**
   ```bash
   npm start
   ```

The GraphQL playground will be available at `http://localhost:4000/graphql`

## 📁 Project Structure

```
graphql-ecommerce-api/
├── package.json          # Project dependencies and scripts
├── .env                  # Environment variables
├── server.js            # Main server file
├── models/
│   └── index.js         # MongoDB models (User, Product, Category, Order)
├── schema/
│   ├── typeDefs.js      # GraphQL schema definitions
│   └── resolvers.js     # GraphQL resolvers
├── data/
│   └── sample-data.json # Sample data for MongoDB
├── scripts/
│   └── import-data.js   # Script to import sample data
└── README.md           # This file
```

## 🔧 Available Scripts

- `npm start` - Start the server
- `npm run dev` - Start server with nodemon for development
- `npm run import-data` - Import sample data to MongoDB
- `npm run clear-data` - Clear all data from MongoDB

## 📊 GraphQL Schema

### Types

- **User** - User account information
- **Product** - Product details with pricing and inventory
- **Category** - Product categories
- **Order** - Customer orders
- **CartItem** - Items in shopping cart

### Queries

```graphql
# Get all products
products: [Product!]!

# Get product by ID
product(id: ID!): Product

# Get products by category
productsByCategory(categoryId: ID!): [Product!]!

# Search products
searchProducts(query: String!): [Product!]!

# Get all categories
categories: [Category!]!

# Get user profile (requires authentication)
me: User

# Get user's orders (requires authentication)
myOrders: [Order!]!

# Get user's cart (requires authentication)
myCart: [CartItem!]!
```

### Mutations

```graphql
# User registration
register(input: RegisterInput!): AuthPayload!

# User login
login(input: LoginInput!): AuthPayload!

# Add product to cart
addToCart(productId: ID!, quantity: Int!): CartItem!

# Remove product from cart
removeFromCart(productId: ID!): Boolean!

# Update cart item quantity
updateCartItem(productId: ID!, quantity: Int!): CartItem!

# Place an order
placeOrder(input: OrderInput!): Order!

# Add new product (admin only)
addProduct(input: ProductInput!): Product!

# Update product (admin only)
updateProduct(id: ID!, input: ProductInput!): Product!
```

## 🔌 API Usage Examples

### Using GraphQL Playground

Visit `http://localhost:4000/graphql` in your browser to access the GraphQL playground.

### Using cURL

#### 1. Register a new user
```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { register(input: { email: \"user@example.com\", password: \"password123\", name: \"John Doe\" }) { token user { id name email } } }"
  }'
```

#### 2. Login
```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { login(input: { email: \"user@example.com\", password: \"password123\" }) { token user { id name email } } }"
  }'
```

#### 3. Get all products
```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { products { id name price description category { name } stock } }"
  }'
```

#### 4. Get product by ID
```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { product(id: \"PRODUCT_ID_HERE\") { id name price description category { name } stock } }"
  }'
```

#### 5. Search products
```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { searchProducts(query: \"laptop\") { id name price description } }"
  }'
```

#### 6. Get all categories
```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { categories { id name description } }"
  }'
```

#### 7. Add product to cart (requires authentication)
```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "mutation { addToCart(productId: \"PRODUCT_ID_HERE\", quantity: 2) { id product { name price } quantity } }"
  }'
```

#### 8. Get user's cart (requires authentication)
```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "query { myCart { id product { name price } quantity } }"
  }'
```

#### 9. Place an order (requires authentication)
```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "mutation { placeOrder(input: { shippingAddress: \"123 Main St, City, State 12345\" }) { id total status items { product { name } quantity price } } }"
  }'
```

#### 10. Get user's orders (requires authentication)
```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "query { myOrders { id total status createdAt items { product { name } quantity price } } }"
  }'
```

## 🗄️ Database Schema

### Collections

- **users** - User accounts and authentication
- **products** - Product catalog
- **categories** - Product categories
- **orders** - Customer orders
- **cartitems** - Shopping cart items

### Sample Data

The project includes sample data with:
- 3 categories (Electronics, Clothing, Books)
- 6 products across different categories
- Realistic pricing and descriptions

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

Protected routes require authentication:
- `me` query
- `myOrders` query
- `myCart` query
- `addToCart` mutation
- `removeFromCart` mutation
- `updateCartItem` mutation
- `placeOrder` mutation

## 🚀 Deployment

### Environment Variables for Production

```env
PORT=4000
MONGODB_URI=mongodb://your-mongodb-url/graphql-ecommerce
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=production
```

### Docker Deployment

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 4000
CMD ["npm", "start"]
```

## 🧪 Testing

You can test the API using:
- GraphQL Playground at `http://localhost:4000/graphql`
- cURL commands (examples provided above)
- Postman or Insomnia
- Any GraphQL client

## 📝 Common GraphQL Queries

### Get products with categories
```graphql
query {
  products {
    id
    name
    price
    description
    category {
      id
      name
    }
    stock
  }
}
```

### Get user profile with orders
```graphql
query {
  me {
    id
    name
    email
    createdAt
  }
  myOrders {
    id
    total
    status
    createdAt
    items {
      product {
        name
        price
      }
      quantity
    }
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you have any questions or issues, please:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

## 🔄 Changelog

### v1.0.0
- Initial release
- Basic GraphQL API with products, categories, users, and orders
- JWT authentication
- MongoDB integration
- Sample data import script