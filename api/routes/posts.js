import express from 'express';
import { verifyToken } from '../utils/verifyUtils.js';
import { createPosts } from '../controllers/posts.js';

const router = express.Router();

//Create Posts
router.post('/create-posts', verifyToken, createPosts);

export default router; 