# ShopEase (SwiftKart)

A modern, full-stack E-Commerce application built with the MERN stack (MongoDB, Express.js, React, Node.js). ShopEase provides a seamless shopping experience with a focus on ease of use, robust security, and an aesthetically pleasing interface.

![ShopEase Banner]("client/public/images/Screenshot 2026-04-21 at 10.09.47 PM.png") 

## Features

### User Experience
- **Modern UI/UX**: Built with React and styled using Tailwind CSS for a fully responsive and clean layout.
- **Smooth Animations**: Framer Motion and Lottie animations bring the interface to life.
- **Product Discovery**: Easy-to-use search, filtering, and browsing capabilities.

### Security & Authentication
- **Secure Authentication**: JWT-based authentication combined with bcrypt for password hashing.
- **Data Protection**: API protected using Helmet to set security HTTP headers and Express Rate Limit to prevent abuse.

### Complete Shopping Journey
- **Product Reviews & Ratings**: Users can leave reviews and rate products they've purchased.
- **Cart Management**: Add, remove, and update quantities seamlessly.
- **Payment Integration**: Secure payment processing utilizing Razorpay.
- **Order Tracking & Notifications**: Users get real-time info about their order status and automated cron-based notifications.

## Technology Stack

**Frontend (Client):**
*   **React** (v19) - UI Library
*   **Vite** - Build Tool & Development Server
*   **Tailwind CSS** - Utility-first CSS Framework
*   **React Router** (v7) - Client-side Routing
*   **Axios** - HTTP Client
*   **Framer Motion** - Animation Library
*   **React Toastify** - Toasts & Notifications

**Backend (Server):**
*   **Node.js & Express.js** - Backend API Framework
*   **MongoDB & Mongoose** - Database & Object Data Modeling
*   **Razorpay** - Payment Gateway
*   **JSON Web Tokens (JWT)** - Authentication
*   **node-cron** - Task Scheduler

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/en/) (v16 or higher)
*   [MongoDB](https://www.mongodb.com/) (Local or Atlas)
*   [Razorpay Account](https://razorpay.com/) (For payment gateway credentials)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ShopEase.git
   cd ShopEase
   ```

2. **Setup the Server**
   ```bash
   cd server
   npm install
   ```
   *Create a `.env` file in the `server` directory and add the following variables:*
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   ```

3. **Setup the Client**
   ```bash
   cd ../client
   npm install
   ```
   *Create a `.env` file in the `client` directory (if required by your setup) to store frontend environment variables like the API base URL.*

4. **Seed the Database (Optional)**
   If you want to populate your database with dummy data to test the platform:
   ```bash
   cd server
   npm run seed
   ```

### Running the Application

**Run the Backend Server:**
Open a new terminal and run:
```bash
cd server
npm run dev
```

**Run the Frontend Client:**
Open another terminal and run:
```bash
cd client
npm run dev
```

The application should now be running. The frontend typically runs on `https://ecommerce-assignment-ready.vercel.app/login` and expects the backend API at `https://pathrise-project.onrender.com`.

## Project Structure

```
ShopEase/
├── client/                 # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Full page views
│   │   ├── utils/          # Helpers & configuration
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── tailwind.config.js
└── server/                 # Node/Express Backend
    ├── models/             # Mongoose schemas (Order, Review, etc.)
    ├── routes/             # API endpoints (auth, products, user, etc.)
    ├── utils/              # Server utilities (notificationHelper, seed config)
    ├── server.js           # Express app entry point
    └── package.json
```

## License

This project is licensed under the MIT License.
