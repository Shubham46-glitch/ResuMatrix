# 🚀 ResuMatrix - AI Interview & Resume Analyzer Platform

![MERN Stack](https://img.shields.io/badge/MERN-Stack-blue)
![Vite](https://img.shields.io/badge/Vite-Frontend-purple)
![Gemini AI](https://img.shields.io/badge/Google-Gemini%20AI-orange)

ResuMatrix is a powerful, full-stack AI-driven platform built to help job seekers prepare for interviews. It features an intelligent mock interview system that evaluates user responses in real-time using Google's Gemini AI, alongside tools for analyzing and tracking performance.

## 🌟 Key Features

*   **🤖 AI Mock Interviews:** Practice behavioral and technical questions with an intelligent AI interviewer.
*   **🎙️ Speech-to-Text Recognition:** Speak your answers naturally! The platform uses built-in browser speech recognition (optimized for English/Indian accents) to transcribe your voice.
*   **📊 Instant AI Evaluation:** Google's Gemini 1.5 Flash AI evaluates your answers, providing a score out of 10 and detailed, constructive feedback on how to improve.
*   **🔐 Secure Authentication:** Complete login, signup, and password reset flows using JWT (JSON Web Tokens) and secure password hashing.
*   **📈 History & Analytics:** Track all your past interviews and view your progress over time through a sleek dashboard.

## 🛠️ Technology Stack

**Frontend:**
*   **React + Vite:** For blazing fast rendering and development.
*   **Tailwind CSS:** For beautiful, responsive, modern UI design.
*   **Framer Motion:** For smooth page transitions and micro-animations.

**Backend:**
*   **Node.js & Express.js:** Robust RESTful API architecture.
*   **MongoDB Atlas & Mongoose:** Cloud database for scalable data storage.
*   **Google Gemini AI:** Intelligent processing for interview evaluation.

## 🚀 Live Demo
*   **Frontend Deployment:** Vercel
*   **Backend Deployment:** Render Web Services
*   **Database:** MongoDB Atlas

## 💻 Local Setup Instructions

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Shubham46-glitch/ResuMatrix.git
    cd ResuMatrix
    ```

2.  **Install Dependencies**
    You will need to install dependencies for both the frontend and backend.
    ```bash
    cd backend
    npm install
    cd ../frontend
    npm install
    ```

3.  **Environment Variables**
    Create a `.env` file in the `backend` folder and add the following:
    ```env
    PORT=5000
    MONGO_DB_URL=your_mongodb_atlas_connection_string
    JWT_SECRET=your_jwt_secret
    GEMINI_API_KEY=your_google_gemini_api_key
    ```
    Create a `.env` file in the `frontend` folder (if testing production build):
    ```env
    VITE_API_URL=http://localhost:5000
    ```

4.  **Run the Application**
    We use `concurrently` to run both servers with a single command from the root directory!
    ```bash
    npm run dev
    ```

---
*Built with ❤️ by Shubham Baikar*
