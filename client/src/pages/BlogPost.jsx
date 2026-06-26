import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPostById, deletePost } from '../api/posts.js';
import { getComments, addComment, deleteComment } from '../api/comments.js';
import useAuth from '../hooks/useAuth.js';

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postRes, commentRes] = await Promise.all([
          getPostById(id),
          getComments(id),
        ]);
        setPost(postRes.data);
        setComments(commentRes.data);
      } catch {
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return;
    await deletePost(id);
    navigate('/dashboard');
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await addComment(id, { content: newComment });
      setComments([data, ...comments]);
      setNewComment('');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    await deleteComment(commentId);
    setComments(comments.filter((c) => c._id !== commentId));
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-gray-500 animate-pulse">Loading post...</div>
    </div>
  );

  if (!post) return null;

  const isAuthor = user?._id === post.author?._id;
  const initials = post.author?.name?.charAt(0).toUpperCase() || '?';
  const readTime = Math.max(1, Math.ceil(post.content?.split(' ').length / 200));

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* ── Hero Header ──────────────────────────────── */}
      <div className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-3xl mx-auto px-4 py-12">

          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-300 text-sm mb-8 transition-colors"
          >
            ← Back to posts
          </Link>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight tracking-tight text-white mb-6">
            {post.title}
          </h1>

          {/* Author bar */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                {initials}
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  {post.author?.name}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                  {' · '}
                  {readTime} min read
                </p>
              </div>
            </div>

            {/* Author actions */}
            {isAuthor && (
              <div className="flex items-center gap-2">
                <Link
                  to={`/edit/${post._id}`}
                  className="text-sm px-3 py-1.5 rounded-lg border border-gray-700 text-gray-300 hover:border-indigo-500 hover:text-indigo-400 transition-colors duration-200"
                >
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="text-sm px-3 py-1.5 rounded-lg border border-gray-700 text-gray-300 hover:border-red-500 hover:text-red-400 transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Post Content ─────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        {post.excerpt && (
          <p className="text-gray-400 text-lg leading-relaxed mb-8 pb-8 border-b border-gray-800 italic">
            {post.excerpt}
          </p>
        )}

        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 text-base leading-8 whitespace-pre-wrap">
            {post.content}
          </p>
        </div>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-gray-800">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-800 text-gray-400 text-xs px-3 py-1 rounded-full border border-gray-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* ── Comments ───────────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            Comments
            <span className="bg-gray-800 text-gray-400 text-sm font-normal px-2.5 py-0.5 rounded-full">
              {comments.length}
            </span>
          </h2>

          {/* Comment input */}
          {user ? (
            <form onSubmit={handleAddComment} className="mb-8">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-1">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts..."
                    rows={3}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none transition-colors"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      type="submit"
                      disabled={submitting || !newComment.trim()}
                      className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors duration-200"
                    >
                      {submitting ? 'Posting...' : 'Post comment'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8 text-center">
              <p className="text-gray-400 text-sm mb-3">
                Sign in to join the conversation
              </p>
              <Link
                to="/login"
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-1.5 rounded-lg transition-colors"
              >
                Sign in
              </Link>
            </div>
          )}

          {/* Comment list */}
          {comments.length === 0 ? (
            <div className="text-center py-10 text-gray-600 text-sm">
              No comments yet. Be the first to comment!
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <CommentCard
                  key={comment._id}
                  comment={comment}
                  user={user}
                  onDelete={handleDeleteComment}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Comment Card ──────────────────────────────────────── */
const CommentCard = ({ comment, user, onDelete }) => {
  const initials = comment.author?.name?.charAt(0).toUpperCase() || '?';
  const isOwner = user?._id === comment.author?._id;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-white">
                {comment.author?.name}
              </span>
              <span className="text-xs text-gray-600">
                {new Date(comment.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              {comment.content}
            </p>
          </div>
        </div>

        {isOwner && (
          <button
            onClick={() => onDelete(comment._id)}
            className="text-gray-600 hover:text-red-400 text-xs transition-colors flex-shrink-0"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default BlogPost;