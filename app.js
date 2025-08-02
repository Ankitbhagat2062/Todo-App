import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import conn from './conn/conn.js';
import auth from './routes/auth.js';
import list from './routes/list.js';
import Event from './routes/Event.js';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
conn();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: ['http://localhost:5173', 'https://todo-4fbfcyk8c-ankitbhagat2062s-projects.vercel.app'],
  credentials: true
}));

// Routes
app.use('/api/v1', auth);
app.use('/api/v2', list);
app.use('/api/v3', Event);

app.get('/', (req, res) => {
  res.status(200).send('OK');
});


// Start the server
app.listen(port, "0.0.0.0", function () {
  console.log(`Server listening at http://localhost:${port}`);
});
