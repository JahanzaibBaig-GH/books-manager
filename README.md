# Books Manager

A RESTful API for managing books built with Node.js, Express.js, and MongoDB.

## Features

CRUD operations for books

#### API Endpoints

The API follows RESTful conventions and supports the following operations:

###### Create a new book

    POST /api/book

###### Retrieve all books

    GET /api/books

###### Retrieve a single book by ID

    GET /api/book/:id

###### Update a book by ID

    PUT /api/book/:id

###### Delete a book by ID

    DELETE /api/book/:id

## Requirements

- Node.js (v18.20.5)
- npm or yarn
- MongoDB (local or cloud instance)

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/jahanzaib-baig/books-manager.git
   cd books-manager

   ```

2. Install dependencies:

   ```
    npm install

   ```

3. Create a .env file in the root directory with your MongoDB connection string:

   ```
    MONGODB_URI=mongodb://localhost:27017/books-manager
    PORT=8000

   ```

4. Start the server:

   ```
   npm start
   ```

   For development with hot-reloading:

   ```
   npm run dev
   ```
