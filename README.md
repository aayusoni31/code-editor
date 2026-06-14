# SyncSpace: Real-Time Collaborative Coding Environment 🚀

SyncSpace is a full-stack, real-time collaborative coding editor and technical interview platform. It features secure user authentication, isolated live-sync coding rooms, remote code execution, and an integrated AI assistant to help debug and fix code on the fly.

### 🌐 Live Links
* **Frontend Application:** [Live on Vercel](https://code-editor-sooty-pi.vercel.app)
* **Backend API & WebSockets:** Hosted on Render

---

## 🛠 Tech Stack

### Frontend (`/client`)
* **Framework:** React.js + Vite
* **Styling:** Tailwind CSS & shadcn/ui
* **Editor:** Monaco Editor (`@monaco-editor/react`)
* **State & API:** Axios, Socket.io-client
* **Deployment:** Vercel

### Backend (Root)
* **Environment:** Node.js (ES Modules) & Express.js
* **Database:** MongoDB & Mongoose
* **Real-Time:** Socket.io
* **AI Integration:** Google GenAI SDK (`gemini-2.5-flash`)
* **Code Execution:** JDoodle Compiler API
* **Deployment:** Render (Dockerized)

---

## ✨ Core Features

* **Real-Time Synchronization:** Sub-second code syncing across multiple clients using WebSockets.
* **AI Code Assistant:** Built-in integration with Google Gemini to automatically analyze, debug, and suggest fixes for broken code.
* **Live Execution Engine:** Compile and run code in multiple languages directly within the browser.
* **Isolated Rooms:** Create unique interview rooms with unique IDs to keep sessions private.
* **Split Deployment Architecture:** Frontend optimized on Vercel's edge network, while the backend maintains persistent WebSocket connections on Render.

---

## 🚀 Local Development Setup

Because this repository contains both the frontend and backend, you will need to run two separate terminal windows for local development.

### Prerequisites
* Node.js (v20+)
* Git
* A MongoDB instance (Local or Atlas)

### 1. Backend Setup
Clone the repository and install the root dependencies:

```bash
git clone [https://github.com/aayusoni31/code-editor.git](https://github.com/aayusoni31/code-editor.git)
cd code-editor
npm install
```

Create a `.env` file in the root directory:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/syncspace
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
JDOODLE_CLIENT_ID=your_jdoodle_id
JDOODLE_CLIENT_SECRET=your_jdoodle_secret
FRONTEND_URL=http://localhost:5173
```

Start the backend server:

```bash
npm run dev
```

### 2. Frontend Setup
Open a second terminal window and navigate into the `client` directory:

```bash
cd client
npm install
```

Create a `.env` file inside the `client` directory:

```env
VITE_BACKEND_URL=http://localhost:3000
```

Start the Vite development server:

```bash
npm run dev
```

---

## 🧪 Testing

The backend utilizes an integration testing suite powered by **Jest**, **Supertest**, and **MongoMemoryServer** to ensure API reliability without polluting the database.

To run the backend tests:

```bash
# In the root directory
npm test
```

---

## 👤 Author
**Aayushi Verma**
