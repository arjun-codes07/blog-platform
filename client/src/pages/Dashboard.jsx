import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyPosts, deletePost } from '../api/posts.js';
import useAuth from '../hooks/useAuth.js';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const { data } = await getMyPosts();
        setPosts(data);
      } catch {
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchMyPosts();
  }, []);

  const handleDelete = async (postId) => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return;
    try {
      await deletePost(postId);
      setPosts(posts.filter((p) => p._id !== postId));
    } catch {
      alert('Failed to delete post');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-gray-500 animate-pulse">Loading dashboard...</div>
    </div>
  );

  const initials = user?.name?.charAt(0).toUpperCase() || '?';

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* ── Profile Header ───────────────────────────── */}
      <div className="border-b border-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[400px] h-[200px] bg-indigo-600 opacity-10 blur-3xl rounded-full" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 py-10">
          <div className="flex items-center justify-between flex-wrap gap-6">

            {/* Left — avatar + info */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-extrabold shadow-lg shadow-indigo-500/20">
                {initials}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {user?.name}
                </h1>
                <p className="text-gray-500 text-sm mt-0.5">{user?.email}</p>
              </div>
            </div>

            {/* Right — new post button */}
            <Link
              to="/create"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors duration-200 text-sm"
            >
              + New Post
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-8 mt-8">
            <div>
              <p className="text-2xl font-bold text-white">{posts.length}</p>
              <p className="text-gray-500 text-xs mt-0.5">Total posts</p>
            </div>
            <div className="w-px h-8 bg-gray-800" />
            <div>
              <p className="text-2xl font-bold text-white">
                {posts.filter((p) => p.isPublished).length}
              </p>
              <p className="text-gray-500 text-xs mt-0.5">Published</p>
            </div>
            <div className="w-px h-8 bg-gray-800" />
            <div>
              <p className="text-2xl font-bold text-white">
                {posts.filter((p) => !p.isPublished).length}
              </p>
              <p className="text-gray-500 text-xs mt-0.5">Drafts</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Posts Section ────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Your Posts</h2>
          <span className="text-sm text-gray-600">{posts.length} articles</span>
        </div>

        {/* Empty state */}
        {posts.length === 0 && (
          <div className="border border-dashed border-gray-700 rounded-2xl p-16 text-center">
            <div className="text-5xl mb-4">✍️</div>
            <h3 className="text-white font-semibold text-lg mb-2">
              No posts yet
            </h3>
            <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
              You haven't published anything yet. Share your first idea with the world.
            </p>
            <Link
              to="/create"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              Write your first post
            </Link>
          </div>
        )}

        {/* Posts list */}
        {posts.length > 0 && (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostRow
                key={post._id}
                post={post}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Post Row ──────────────────────────────────────────── */
const PostRow = ({ post, onDelete }) => {
  return (
    <div className="group bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl p-5 flex items-start justify-between gap-4 transition-all duration-200">

      {/* Left content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {/* Status badge */}
          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${
            post.isPublished
              ? 'bg-green-500/10 text-green-400 border-green-500/20'
              : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              post.isPublished ? 'bg-green-400' : 'bg-yellow-400'
            }`} />
            {post.isPublished ? 'Published' : 'Draft'}
          </span>

          <span className="text-gray-600 text-xs">
            {new Date(post.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>

        {/* Title */}
        <Link
          to={`/post/${post._id}`}
          className="text-white font-semibold text-base hover:text-indigo-400 transition-colors line-clamp-1"
        >
          {post.title}
        </Link>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-gray-500 text-sm mt-1 line-clamp-1">
            {post.excerpt}
          </p>
        )}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Link
          to={`/edit/${post._id}`}
          className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg border border-gray-700 transition-colors"
        >
          Edit
        </Link>
        <button
          onClick={() => onDelete(post._id)}
          className="text-xs bg-red-600/10 hover:bg-red-600/20 text-red-400 px-3 py-1.5 rounded-lg border border-red-500/20 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Dashboard;