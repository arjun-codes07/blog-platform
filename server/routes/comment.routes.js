import express from 'express';
import {
  getCommentsByPost,
  addComment,
  deleteComment,
} from '../controllers/comment.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

// Public — get all comments for a post
router.get('/:postId', getCommentsByPost);

// Protected — add a comment to a post
router.post('/:postId', protect, addComment);

// Protected — delete a comment
router.delete('/:commentId', protect, deleteComment);

export default router;