import express from 'express';
import { chatWithBot } from '../controllers/chatbot.js';
import { verifyToken } from '../utils/verifyUtils.js';

const router = express.Router();

//Chatbot Interaction
router.post('/interact', verifyToken, chatWithBot);

export default router;