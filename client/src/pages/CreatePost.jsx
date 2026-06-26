import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPost } from '../api/posts.js';

const CreatePost = () => {
  const [form, setForm] = useState({ title: '', content: '', excerpt: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await createPost(form);
      navigate(`/post/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* ── Top bar ──────────────────────────────────── */}
      <div className="border-b border-gray-800 bg-gray-950 px-4 py-3 flex items-center justify-between max-w-5xl mx-auto">
        <Link
          to="/dashboard"
          className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
        >
          ← Dashboard
        </Link>
        <h1 className="text-sm font-semibold text-gray-300">New Post</h1>
        <button
          form="post-form"
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors"
        >
          {loading ? 'Publishing...' : 'Publish'}
        </button>
      </div>

      {/* ── Form ─────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-8 text-sm">
            {error}
          </div>
        )}

        <form id="post-form" onSubmit={handleSubmit} className="space-y-6">

          {/* Title */}
          <div>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Your post title..."
              className="w-full bg-transparent border-0 border-b border-gray-800 focus:border-indigo-500 text-3xl font-bold text-white placeholder-gray-700 py-3 focus:outline-none transition-colors"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-widest mb-2">
              Short excerpt
            </label>
            <input
              type="text"
              name="excerpt"
              value={form.excerpt}
              onChange={handleChange}
              placeholder="A one-line summary of your post (optional)"
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-widest mb-2">
              Content
            </label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              required
              rows={18}
              placeholder="Write your story here..."
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-5 py-4 text-base text-gray-300 placeholder-gray-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors leading-relaxed resize-none"
            />
          </div>

          {/* Word count */}
          <p className="text-xs text-gray-700 text-right">
            {form.content.trim().split(/\s+/).filter(Boolean).length} words
          </p>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;