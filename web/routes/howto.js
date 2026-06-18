import express from 'express';
import path from 'path';
const router = express.Router();
const __dirname = path.resolve();

router.get('/how-to-connect', (req, res) => res.sendFile(path.join(__dirname, 'web', 'how-to-connect.html')));

export default router;
