import express from 'express';
import { verifyToken } from '../utils/verifyUtils.js';
import { createPosts, getPosts, deletePosts, updatePosts } from '../controllers/posts.js';

const router = express.Router();

//Create Posts
router.post('/create-posts', verifyToken, createPosts);
//Get all the posts
router.get('/get-posts', getPosts);
//Delete Posts
router.delete('/delete-posts/:postId/:userId',verifyToken , deletePosts);
//Update Posts
router.put('/update-posts/:postId/:userId', verifyToken, updatePosts);

export default router; 