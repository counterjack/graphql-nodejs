graphql-ecommerce-api/
├── package.json
├── .env
├── server.js
├── models/
│   └── index.js
├── schema/
│   ├── typeDefs.js
│   └── resolvers.js
├── data/
│   └── sample-data.json
├── scripts/
│   └── import-data.js
└── README.md# graphql-nodejs



# GraphQL E-commerce API with Node.js

A comprehensive e-commerce GraphQL API built with Node.js, Express, Apollo Server, and MongoDB. This project demonstrates industry-standard GraphQL implementation with complex relationships and real-world use cases.

## Features

- **Complete E-commerce Schema**: Products, Categories, Users, Orders, Reviews
- **Advanced GraphQL Operations**: Queries, Mutations, Subscriptions
- **Database Relationships**: Complex data relationships with MongoDB
- **Authentication**: JWT-based user authentication
- **Filtering & Sorting**: Advanced product filtering and sorting
- **Search Functionality**: Full-text search across products
- **Data Validation**: Input validation and error handling
- **Sample Data**: Pre-populated database with realistic e-commerce data

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Apollo Server** - GraphQL server
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Project Structure

```
graphql-ecommerce-api/
├── package.json
├── .env
├── server.js
├── models/
│   └── index.js
├── schema/
│   ├── typeDefs.js
│   └── resolvers.js
├── data/
│   └── sample-data.json
├── scripts/
│   └── import-data.js
└── README.md
```

## Setup Instructions

### 1. Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### 2. Installation

```bash
# Clone the repository
git clone <repository-url>
cd graphql-ecommerce-api

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### 3. Configure Environment Variables

Edit the `.env` file with your settings:

```env
MONGODB_URI=mongodb://localhost:27017/ecommerce-graphql
JWT_SECRET=your-super-secret-jwt-key-here
PORT=4000
NODE_ENV=development
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# For local MongoDB
mongod

# Or use MongoDB Atlas connection string in .env
```

### 5. Import Sample Data

```bash
# Run the import script
node scripts/import-data.js
```

### 6. Start the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start at `http://localhost:4000/graphql`

## API Usage

### GraphQL Playground

Visit `http://localhost:4000/graphql` in your browser to access the GraphQL Playground where you can:

- Explore the schema
- Write and test queries
- View documentation
- Test mutations

### Sample Queries

#### Get All Products
```graphql
query GetProducts {
  products {
    id
    name
    price
    discountPrice
    brand
    stock
    category {
      name
    }
    rating {
      average
      count
    }
  }
}
```

#### Get Product with Reviews
```graphql
query GetProduct($id: ID!) {
  product(id: $id) {
    id
    name
    description
    price
    discountPrice
    brand
    images
    stock
    sku
    tags
    specifications {
      weight
      dimensions
      color
      material
    }
    rating {
      average
      count
    }
    category {
      name
    }
    reviews {
      id
      rating
      comment
      title
      user {
        firstName
        lastName
      }
    }
  }
}
```

#### Search Products
```graphql
query SearchProducts($query: String!) {
  searchProducts(query: $query) {
    id
    name
    price
    brand
    category {
      name
    }
  }
}
```

#### Filter Products
```graphql
query GetProductsFiltered($filter: ProductFilter, $sort: ProductSort) {
  products(filter: $filter, sort: $sort) {
    id
    name
    price
    brand
    stock
    category {
      name
    }
  }
}
```

Variables:
```json
{
  "filter": {
    "categoryId": "507f1f77bcf86cd799439022",
    "minPrice": 500,
    "maxPrice": 2000
  },
  "sort": {
    "field": "PRICE",
    "order": "ASC"
  }
}
```

### Sample Mutations

#### Register User
```graphql
mutation RegisterUser($username: String!, $email: String!, $password: String!, $firstName: String!, $lastName: String!) {
  register(input: { username: $username, email: $email, password: $password, firstName: $firstName, lastName: $lastName }) {
    token
    user {
      id
      username
      email
      firstName
      lastName
    }
  }
}
```

Variables:
```json
{
  "username": "ankuragarwa",
  "email": "ankuragarwa@gmail.com",
  "password": "your-password",