import Post from '../models/Post.model.js';

// ─── Get all posts ────────────────────────────────────────
// GET /api/posts  (public)
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({ isPublished: true })
      .populate('author', 'name email')  // replace author ID with name+email
      .sort({ createdAt: -1 });          // newest first

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Get single post ──────────────────────────────────────
// GET /api/posts/:id  (public)
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Get posts by logged in user ──────────────────────────
// GET /api/posts/myposts  (protected)
export const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id })
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Create post ──────────────────────────────────────────
// POST /api/posts  (protected)
export const createPost = async (req, res) => {
  const { title, content, excerpt, tags, coverImage } = req.body;

  try {
    const post = await Post.create({
      title,
      content,
      excerpt,
      tags,
      coverImage,
      author: req.user._id,  // from protect middleware
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Update post ──────────────────────────────────────────
// PUT /api/posts/:id  (protected)
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the logged in user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    const { title, content, excerpt, tags, coverImage, isPublished } = req.body;

    post.title       = title       ?? post.title;
    post.content     = content     ?? post.content;
    post.excerpt     = excerpt     ?? post.excerpt;
    post.tags        = tags        ?? post.tags;
    post.coverImage  = coverImage  ?? post.coverImage;
    post.isPublished = isPublished ?? post.isPublished;

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Delete post ──────────────────────────────────────────
// DELETE /api/posts/:id  (protected)
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Only the author can delete their post
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};