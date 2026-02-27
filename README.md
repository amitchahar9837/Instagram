📸 Instagram Clone (MERN Stack)

A full-stack Instagram Clone built using the MERN stack with authentication, email verification, protected routes, and modern UI.
This project replicates core Instagram features like authentication, posting, profile management, and real-time UI updates.

🚀 Features

🔐 JWT Authentication (Login / Register)
📩 Email verification & Forgot Password (Nodemailer)
🔒 Protected Routes
🖼️ Image Upload (Firebase Storage)
👤 User Profiles
❤️ Like / Unlike Posts
💬 Comment System
🕒 Time formatting (Moment.js)
🧠 Redux Toolkit State Management
💾 Redux Persist
📱 Responsive UI (Flowbite React)
⚡ PWA Support (vite-plugin-pwa)

🛠️ Tech Stack
🔹 Frontend (client/)
React (Vite)
Redux Toolkit
React Router DOM
Firebase
Flowbite React
Moment.js
Redux Persist
Vite PWA Plugin

🔹 Backend (api/)

Node.js
Express.js
MongoDB (Mongoose)
JWT (jsonwebtoken)
bcryptjs
Nodemailer
Cookie-parser
dotenv
Cron jobs

📂 Project Structure
instagram/
│
├── api/              # Express Backend
│   └── index.js
│
├── client/           # React Frontend (Vite)
│
├── package.json      # Root scripts
└── README.md
⚙️ Environment Variables Setup

Create a .env file in the root folder (for backend) and add:

MONGOURI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
emailUser=your_email@gmail.com
emailPassword=your_email_app_password
NODE_ENV=development
PORT=5000

VITE_FIREBASE_API_KEY=your_firebase_api_key
🔎 Environment Variables Explanation
Variable	Description
MONGOURI	MongoDB Atlas connection string
JWT_SECRET	Secret key for signing JWT tokens
emailUser	Email used by Nodemailer to send verification emails
emailPassword	Email app password (not your normal password)
NODE_ENV	development / production
PORT	Backend server port
VITE_FIREBASE_API_KEY	Firebase configuration key
💻 Installation Guide
1️⃣ Clone Repository
git clone https://github.com/amitchahar9837/Instagram.git
cd instagram
2️⃣ Install Dependencies
Install Backend
npm install
Install Frontend
cd client
npm install
3️⃣ Run Development Server
Start Backend
npm run dev
Start Frontend
cd client
npm run dev
🏗️ Production Build

From root folder:

npm run build

This will:

Install backend dependencies

Install frontend dependencies

Build frontend for production

🔐 Security Notes

Never commit .env file.

Use App Password for Gmail (not actual password).

Keep JWT_SECRET strong and private.

Enable MongoDB IP whitelist in production.

🌍 Deployment Suggestions

Frontend → Vercel / Netlify

Backend → Render / Railway

Database → MongoDB Atlas

Image Storage → Firebase Storage

🔮 Future Improvements
📲 Follow / Unfollow system
🔔 Notifications
💬 Real-time chat
📸 Stories feature
🎥 Reels feature
📊 Admin dashboard

👨‍💻 Author

Amit

Full Stack Developer (MERN) 🚀
Focused on building scalable web applications.
