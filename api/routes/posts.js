import express from 'express';
import { verifyToken } from '../utils/verifyUtils.js';
import { createPosts, getPosts } from '../controllers/posts.js';

const router = express.Router();

//Create Posts
router.post('/create-posts', verifyToken, createPosts);
//Get all the posts
router.get('/get-posts', getPosts);

export default router; 