// Safe: restrict CORS origin
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors({ origin: 'https://example.com' }));

export default app;
