import express from 'express';
import path from 'path';
const router = express.Router();
const __dirname = path.resolve();

router.get('/faq', (req, res) => res.sendFile(path.join(__dirname, 'web', 'faq.html')));

export default router;
