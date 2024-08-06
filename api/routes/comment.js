import express from 'express';
import { createComment } from '../controllers/comment.js ';
import { verifyToken } from '../utils/verifyUtils.js';
import { deleteComment, editComment, getAllComments, getComments, likeComment } from '../controllers/comment.js';

const router = express.Router();

//Post Comments
router.post('/create-comment',verifyToken ,createComment);
//Get Post Comments
router.get('/get-comments/:postId',getComments);
//Route for the Likes
router.put('/like-comment/:commentId', verifyToken, likeComment);
//Edit Comments
router.put('/edit-comment/:commentId', verifyToken, editComment);
//Delete Comment
router.delete('/delete-comment/:commentId', verifyToken, deleteComment);
//Get all the comments
router.get('/get-all-comments', verifyToken, getAllComments);
export default router; 