import express from 'express';
import { signin, signup, googleAuth } from '../controllers/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
// Google OAuth
router.post('/google', googleAuth);

export default router;