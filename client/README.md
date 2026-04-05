# SwiftKart - Full-Stack E-Commerce Application

A modern, production-ready e-commerce platform built with React, Tailwind CSS, Node.js, Express, and MongoDB. Features Apple-inspired UI design for a premium user experience.

![SwiftKart](https://img.shields.io/badge/Status-In%20Development-yellow)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![Node](https://img.shields.io/badge/Node-Express-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)
![Tailwind](https://img.shields.io/badge/Styling-Tailwind%20CSS-38bdf8)

##  Features

### Implemented
-  Full backend API with Express and MongoDB
-  JWT authentication and authorization
-  Product catalog with filtering and search
-  Shopping cart with backend persistence
-  Order management system
-  User profile and address management
-  Apple-inspired UI with Tailwind CSS
-  Responsive design (mobile-first)
-  Toast notifications
-  Password strength indicator
-  Form validation

### In Progress
-  Complete page redesigns (Home, Products, Cart, etc.)
-  Product detail page
-  Checkout flow
-  Order history

##  Tech Stack

### Frontend
- **React** 19.1.0 - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **React Icons** - Icon library
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JSON Web Token** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

##  Project Structure

```
SwiftKart/
 server/                     # Backend API
    models/                # Mongoose models
       User.js
       Product.js
       Cart.js
       Order.js
    routes/                # API routes
       auth.js
       products.js
       cart.js
       orders.js
       user.js
    middleware/            # Custom middleware
       auth.js
    utils/                 # Utilities
       seedDatabase.js
    server.js              # Express app
    .env                   # Environment variables
    package.json
 src/                       # Frontend
    components/
       ui/               # Reusable UI components
          Button.jsx
          Input.jsx
          Card.jsx
          Skeleton.jsx
          EmptyState.jsx
       Navbar.jsx
       BottomNav.jsx
       ProtectedRoute.jsx
    pages/                # Page components
       Login.jsx
       Signup.jsx
       Home.jsx
       Products.jsx
       Cart.jsx
       Checkout.jsx
       Profile.jsx
       Orders.jsx
    services/             # API service layer
       api.js
       authService.js
       productService.js
       cartService.js
       orderService.js
       userService.js
    context/              # React Context
       AuthContext.jsx
       CartContext.jsx
    App.jsx
    main.jsx
    index.css
 tailwind.config.js         # Tailwind configuration
 postcss.config.js
 vite.config.js
 package.json
```

##  Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone Repository
```bash
git clone <repository-url>
cd SwiftKart
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# MONGODB_URI=mongodb://localhost:27017/swiftkart (for local)
# or
# MONGODB_URI=your_mongodb_atlas_connection_string (for cloud)

# Seed database with products
npm run seed

# Start backend server (development)
npm run dev

# Server runs on http://localhost:5000
```

### 3. Frontend Setup

```bash
# Navigate back to root directory
cd ..

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Start frontend development server
npm run dev

# Frontend runs on http://localhost:5173
```

### 4. Access Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **API Health Check**: http://localhost:5000/api/health

##  API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product

### Cart (Protected)
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:productId` - Update quantity
- `DELETE /api/cart/remove/:productId` - Remove item
- `DELETE /api/cart/clear` - Clear cart

### Orders (Protected)
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order

### User (Protected)
- `GET /api/user/profile` - Get profile
- `PUT /api/user/profile` - Update profile
- `POST /api/user/addresses` - Add address
- `PUT /api/user/addresses/:id` - Update address
- `DELETE /api/user/addresses/:id` - Delete address

##  Design System

### Colors
- **Primary**: #0F172A (Deep Slate)
- **Accent**: #38BDF8 (Soft Sky Blue)
- **Background**: #F8FAFC (Off-White)
- **Card**: #FFFFFF (White)

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Principles
- Minimalist layout
- Soft shadows only
- Rounded corners (8-12px)
- Mobile-first responsive
- Apple-inspired aesthetics

##  Testing

### Backend
```bash
cd server
# Test health endpoint
curl http://localhost:5000/api/health

# Test signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### Frontend
- Open browser to http://localhost:5173
- Create account via signup page
- Login and explore features

##  Environment Variables

### Backend (.env in /server)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/swiftkart
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Frontend (.env in root)
```env
VITE_API_URL=http://localhost:5000/api
```

##  Work Remaining

The backend and infrastructure are complete. Remaining work:

1. **Page Redesigns**: Home, Products, Cart, Checkout, Profile, Orders
2. **Product Detail Page**: Create new page
3. **Integration Testing**: End-to-end flows
4. **Final Polish**: Micro-interactions, animations

##  License

This project is private and for educational purposes.

##  Contributing

This is a personal project. Contributions are not currently accepted.

##  Support

For issues, please open an issue in the repository.

---

**Built with  using React, Tailwind CSS, Node.js, and MongoDB**
