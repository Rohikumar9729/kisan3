# 🌾 Kisan — India's Farmer Marketplace

A full-stack marketplace connecting farmers directly with buyers. Built with **React + Vite** (frontend) and **Express + MongoDB** (backend), designed for independent deployment.

---

## 📁 Project Structure

```
kisan3/
├── client/          # React + Vite frontend  →  deploy to Vercel
│   ├── src/
│   │   ├── lib/api.js     ← Axios instance (reads VITE_BACKEND_URL)
│   │   ├── pages/
│   │   └── components/
│   ├── .env               ← VITE_CLERK_PUBLISHABLE_KEY, VITE_BACKEND_URL
│   └── verce.json         ← Vercel deployment config
│
├── server/          # Express + MongoDB backend  →  deploy to Render/Railway/Vercel
│   ├── routes/
│   ├── models/
│   ├── configs/
│   ├── inngest/
│   ├── .env               ← MONGODB_URI, CLERK_SECRET_KEY, etc.
│   └── verce.json         ← Vercel deployment config
│
└── package.json     # Root monorepo runner (dev only — uses concurrently)
```

---

## ⚡ Local Development

### Prerequisites
- Node.js >= 18
- npm >= 9
- MongoDB Atlas account
- Clerk account

### 1. Install all dependencies

```bash
# From the project root
npm run install:all
```

### 2. Configure environment variables

**`server/.env`**
```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxx.mongodb.net
PORT=4000
CLIENT_URL=http://localhost:5173

CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

INNGEST_EVENT_KEY=...
INNGEST_SIGNING_KEY=...

CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

**`client/.env`**
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_BACKEND_URL=http://localhost:4000
```

### 3. Run both servers simultaneously

```bash
# From the project root
npm run dev
```

This starts:
- **Frontend** on `http://localhost:5173` (Vite dev server)
- **Backend** on `http://localhost:4000` (Express via nodemon)

Or run them separately:

```bash
# Terminal 1 — backend
npm run server

# Terminal 2 — frontend
npm run client
```

---

## 🌐 API Reference

| Method | Endpoint              | Description            |
|--------|-----------------------|------------------------|
| GET    | `/api/products`       | List all products      |
| POST   | `/api/products`       | Create a new product   |
| GET    | `/api/orders/my`      | My orders              |
| POST   | `/api/orders`         | Place an order         |
| GET    | `/api/cart`           | Get cart items         |
| POST   | `/api/cart/add`       | Add item to cart       |
| GET    | `/api/users/me`       | Get current user info  |
| POST   | `/api/inngest`        | Inngest event handler  |

---

## 🚀 Deployment (Separate Frontend & Backend)

### Backend → Render (recommended) or Railway

1. Create a new **Web Service** on https://render.com
2. Connect your repo and set **Root Directory** to `server`
3. Set **Build Command**: `npm install`
4. Set **Start Command**: `node server.js`
5. Add all environment variables from `server/.env`
6. Note your deployed URL, e.g. `https://kisan-api.onrender.com`

### Backend → Vercel (alternative)

```bash
cd server
vercel --prod
# Deploy config is in server/verce.json
```

---

### Frontend → Vercel

1. Create a new project on https://vercel.com
2. Set **Root Directory** to `client`
3. Set **Framework Preset** to `Vite`
4. Add environment variables:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
   VITE_BACKEND_URL=https://kisan-api.onrender.com   (your deployed backend URL)
   ```
5. Deploy — Vercel uses `client/verce.json` for SPA rewrites automatically

Or via CLI:
```bash
cd client
vercel --prod
```

---

## 🔌 Making API Calls in the Frontend

Use the pre-configured axios instance from `src/lib/api.js`:

```js
import api from '../lib/api'

// GET request
const { data } = await api.get('/api/products')

// POST request
const { data } = await api.post('/api/cart/add', { productId, quantity })
```

The `baseURL` is automatically set from `VITE_BACKEND_URL`:
- **Dev**: `http://localhost:4000` (also proxied via Vite — no CORS issues)
- **Production**: your deployed backend URL

---

## 🧰 Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, Vite, TailwindCSS v4      |
| Auth       | Clerk (frontend + backend)          |
| Backend    | Express 5, Node.js                  |
| Database   | MongoDB Atlas via Mongoose          |
| Images     | Cloudinary                          |
| Jobs       | Inngest                             |
| Deployment | Vercel (frontend), Render (backend) |
