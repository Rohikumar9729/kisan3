import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware())

app.get('/', (req, res) => 
  res.send('server is live !'))

app.use('/api/inngest', serve({ client: inngest, functions }))


// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => 
      console.log(`Server is running on http://localhost:${port}`)
    )
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();


