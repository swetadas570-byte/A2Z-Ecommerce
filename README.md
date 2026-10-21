# A2Z - Full Stack E-Commerce Application

A2Z is a full-stack e-commerce web application built using the PERN stack. It provides a complete shopping experience for customers along with an administration system for managing products, categories, and orders.

## Features

### Customer Features

- User registration and login
- JWT-based authentication using HTTP-only cookies
- Persistent authentication sessions
- Browse all products
- Search products
- Filter products by category
- View detailed product information
- Select product quantity
- Add products to cart
- Update cart quantities
- Remove individual cart items
- Clear the entire cart
- Checkout with shipping address
- Place orders
- View order history
- View order details and order status
- Protected customer routes
- Responsive design for different screen sizes
- Light and dark mode with theme persistence

### Admin Features

- Admin authentication and authorization
- Category management
  - Add categories
  - Edit categories
  - Delete categories
- Product management
  - Add products
  - Edit products
  - Delete products
  - Manage price and stock
  - Assign products to categories
  - Add product image URLs
- View all customer orders
- Update order status
- Protected admin routes
- Separate administration interface

## Tech Stack

### Frontend

- React.js
- Vite
- JavaScript
- React Router
- Axios
- HTML
- CSS

### Backend

- Node.js
- Express.js
- PostgreSQL
- JWT
- bcrypt
- cookie-parser
- CORS
- dotenv

### Database

- PostgreSQL
- pgAdmin 4

## Project Architecture

```text
A2Z
├── backend
│   ├── config
│   │   └── db.js
│   ├── controllers
│   │   ├── authController.js
│   │   ├── cartController.js
│   │   ├── categoryController.js
│   │   ├── orderController.js
│   │   └── productController.js
│   ├── middleware
│   │   ├── adminMiddleware.js
│   │   └── authMiddleware.js
│   ├── routes
│   │   ├── authRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── orderRoutes.js
│   │   └── productRoutes.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── context
│   │   ├── pages
│   │   ├── services
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## Database Structure

The application uses six PostgreSQL tables:

```text
users
categories
products
cart_items
orders
order_items
```

The database includes relationships between users, products, categories, carts, and orders.

Order items also preserve the product name and price information required for order history, allowing historical orders to remain meaningful even if a product is later removed from the product catalogue.

## Authentication and Authorization

A2Z uses JWT-based authentication.

After successful registration or login:

1. The backend creates a JWT.
2. The JWT is stored in an HTTP-only cookie.
3. The authentication middleware verifies the token.
4. The authenticated user's ID and role are attached to the request.
5. Admin-only routes additionally use role-based authorization.

Customer and administrator functionality is separated using role-based access control.

## API Structure

The backend exposes REST API endpoints including:

```text
/api/auth
/api/categories
/api/products
/api/cart
/api/orders
```

The frontend communicates with these endpoints using Axios.

## Local Setup

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- PostgreSQL
- pgAdmin 4

### 1. Clone the repository

```bash
git clone https://github.com/swetadas570-byte/A2Z-Ecommerce.git
cd A2Z-Ecommerce
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure backend environment variables

Create a `.env` file inside the `backend` folder:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=a2z
DB_USER=postgres
DB_PASSWORD=your_postgresql_password

JWT_SECRET=your_jwt_secret
```

Do not commit the `.env` file to GitHub.

### 4. Start the backend

```bash
npm run dev
```

The backend runs locally on:

```text
http://localhost:5000
```

### 5. Install frontend dependencies

Open another terminal:

```bash
cd frontend
npm install
```

### 6. Start the frontend

```bash
npm run dev
```

The frontend runs locally on:

```text
http://localhost:5173
```

## Security

Sensitive environment variables are excluded from version control using `.gitignore`.

The application also uses:

- Password hashing with bcrypt
- JWT authentication
- HTTP-only cookies
- Parameterized SQL queries
- Authentication middleware
- Admin authorization middleware
- Protected frontend routes

## Responsive Design

The application is designed to work across:

- Desktop
- Laptop
- Tablet
- Mobile

The interface also supports light and dark themes.

## Future Improvements

Possible future enhancements include:

- Online payment integration
- Product reviews and ratings
- Wishlist functionality
- Product image uploads
- Pagination
- Advanced admin analytics
- Customer profile management
- Email notifications
- Production deployment

## Project Status

The core A2Z e-commerce application is fully implemented and tested locally.

The project includes customer shopping functionality, authentication, cart management, checkout, order management, and an admin dashboard.

## Author

**Sweta Das**

GitHub: https://github.com/swetadas570-byte