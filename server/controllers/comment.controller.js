import Comment from '../models/Comment.model.js';
import Post from '../models/Post.model.js';

// ─── Get all comments for a post ─────────────────────────
// GET /api/comments/:postId  (public)
export const getCommentsByPost = async (req, res) => {
  try {
    // Check if the post exists first
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'name email')  // show author name instead of ID
      .sort({ createdAt: -1 });          // newest first

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Add a comment to a post ──────────────────────────────
// POST /api/comments/:postId  (protected)
export const addComment = async (req, res) => {
  const { content } = req.body;

  try {
    // Check if the post exists
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = await Comment.create({
      content,
      post: req.params.postId,
      author: req.user._id,   // from protect middleware
    });

    // Populate author info before sending response
    const populated = await comment.populate('author', 'name email');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Delete a comment ─────────────────────────────────────
// DELETE /api/comments/:commentId  (protected)
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Only the comment author can delete it
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};