import express from 'express';
import { createComment } from '../controllers/comment.js ';
import { verifyToken } from '../utils/verifyUtils.js';
import { getComments } from '../controllers/comment.js';

const router = express.Router();

//Post Comments
router.post('/create-comment',verifyToken ,createComment);
//Get Comments
router.get('/get-comments/:postId',getComments);

export default router; 