import express from 'express';
import conn from './conn/conn.js';
import auth from './routes/auth.js'
import list from './routes/list.js'
import Event from './routes/Event.js'
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Connect to MongoDB
conn();

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());  // Enable CORS for all routes
app.use('/api/v1', auth)
app.use('/api/v2', list)
app.use('/api/v3', Event)

// Serve static files from frontend/dist
app.use(express.static(path.resolve(__dirname, "frontend", "dist")));

app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

// Catch-all route to serve index.html for frontend routes (except API routes)
app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
