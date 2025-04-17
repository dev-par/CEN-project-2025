import express from "express";
import cors from "cors";
import path from "path";
import rootRouter from './routes/root.js';
import clubsRouter from './routes/clubs.js';
import authRouter from './routes/auth.js';
import { fileURLToPath } from "url";

const PORT = process.env.PORT || 5050;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// Serve static files first
app.use('/', express.static(path.join(__dirname, 'public')));

// ✅ Mount /api routes FIRST
app.use('/api', authRouter);
app.use('/api/clubs', clubsRouter);

// ✅ Mount root router LAST
app.use('/', rootRouter);

// ✅ Catch all 404
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    }
    else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' });
    }
    else {
        res.type('txt').send('404 Not Found');
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
