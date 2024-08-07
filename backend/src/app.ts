import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import session from 'express-session';
import authRoutes from './routes/auth';
import postRoutes from './routes/posts';

const app = express();

app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use('/auth', authRoutes);
app.use('/posts', postRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));