import express from 'express';
import { createComment } from '../controllers/comment.js ';
import { verifyToken } from '../utils/verifyUtils.js';

const router = express.Router();

router.post('/create-comment',verifyToken ,createComment);

export default router; 