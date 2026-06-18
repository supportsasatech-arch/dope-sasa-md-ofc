import express from 'express';
import path from 'path';
const router = express.Router();
const __dirname = path.resolve();

router.get('/terms', (req, res) => res.sendFile(path.join(__dirname, 'web', 'terms.html')));

export default router;
