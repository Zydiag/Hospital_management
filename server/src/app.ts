import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

export const app = express();

// using this to allow access to our backend from specific URLs
app.use(
  cors({
    origin: process.env.CORS_ORIGINS,
    credentials: true,
  })
);

app.use(express.json({ limit: '16kb' }));
