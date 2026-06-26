import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    excerpt: {
      type: String,
      // Short summary shown on blog listing page
    },
    author: {
      // Stores the MongoDB _id of the user who created the post
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',   // refers to the User model
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    coverImage: {
      type: String,
      default: '',
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const Post = mongoose.model('Post', postSchema);

export default Post;