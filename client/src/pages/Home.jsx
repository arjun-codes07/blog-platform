import PerspectiveHero from '../components/PerspectiveHero.jsx';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllPosts } from '../api/posts.js';
import useAuth from '../hooks/useAuth.js';

// ── Helpers ────────────────────────────────────────────────
const readingTime = (content = '') =>
  Math.max(1, Math.ceil(content.trim().split(/\s+/).filter(Boolean).length / 200));

const CATEGORIES = ['All','React','JavaScript','Node.js','MongoDB','Career','Technology'];

const getCategory = (title = '', content = '') => {
  const t = (title + ' ' + content).toLowerCase();
  if (t.match(/react|jsx|component|hook/))            return 'React';
  if (t.match(/javascript|js|es6|async|promise/))     return 'JavaScript';
  if (t.match(/node|express|api|backend|server/))     return 'Node.js';
  if (t.match(/mongo|mongoose|database|db/))          return 'MongoDB';
  if (t.match(/career|job|interview|salary|resume/))  return 'Career';
  if (t.match(/tech|software|coding|programming|build|project|full.?stack/)) return 'Technology';
  return 'Technology';
};

const CAT_COLORS = {
  React:        { bg:'rgba(99,102,241,0.15)',  text:'#a5b4fc', border:'rgba(99,102,241,0.35)'  },
  JavaScript:   { bg:'rgba(245,158,11,0.15)',  text:'#fcd34d', border:'rgba(245,158,11,0.35)'  },
  'Node.js':    { bg:'rgba(16,185,129,0.15)',  text:'#6ee7b7', border:'rgba(16,185,129,0.35)'  },
  MongoDB:      { bg:'rgba(34,197,94,0.15)',   text:'#86efac', border:'rgba(34,197,94,0.35)'   },
  Career:       { bg:'rgba(59,130,246,0.15)',  text:'#93c5fd', border:'rgba(59,130,246,0.35)'  },
  Technology:   { bg:'rgba(139,92,246,0.15)',  text:'#c4b5fd', border:'rgba(139,92,246,0.35)'  },
  General:      { bg:'rgba(107,114,128,0.15)', text:'#9ca3af', border:'rgba(107,114,128,0.35)' },
};

const CategoryBadge = ({ title = '', content = '', override }) => {
  const cat = override || getCategory(title, content);
  const c   = CAT_COLORS[cat] || CAT_COLORS.General;
  return (
    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
      style={{ background:c.bg, color:c.text, border:`1px solid ${c.border}` }}>
      {cat}
    </span>
  );
};

// Deterministic gradient per post title
const coverGradient = (title = '') => {
  const gradients = [
    'linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#4c1d95 100%)',
    'linear-gradient(135deg,#0f172a 0%,#1e3a5f 50%,#1e40af 100%)',
    'linear-gradient(135deg,#1a0533 0%,#4a044e 50%,#6b21a8 100%)',
    'linear-gradient(135deg,#042f2e 0%,#065f46 50%,#047857 100%)',
    'linear-gradient(135deg,#1c1917 0%,#44403c 50%,#78716c 100%)',
    'linear-gradient(135deg,#1e1b4b 0%,#1d4ed8 50%,#0ea5e9 100%)',
  ];
  const idx = title.charCodeAt(0) % gradients.length;
  return gradients[idx];
};

// ── Main ───────────────────────────────────────────────────
const Home = () => {
  const [posts, setPosts]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [email, setEmail]         = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    getAllPosts()
      .then(({ data }) => setPosts(data))
      .catch(() => setError('Failed to load posts'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory === 'All'
    ? posts
    : posts.filter(p => getCategory(p.title, p.content) === activeCategory);

  const featured  = posts[0] || null;
  const trending  = [...posts].slice(0, 4);
  const gridPosts = filtered.slice(featured ? 1 : 0);

  return (
    <div className="min-h-screen text-white" style={{ background:'#020617' }}>

      {/* ━━ HERO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <PerspectiveHero
        user={user}
        postCount={posts.length}
        writerCount={[...new Set(posts.map(p => p.author?.name))].length}
      />


      <div style={{ height:'1px', background:'linear-gradient(to right,transparent,rgba(99,102,241,0.3),transparent)' }}/>

      <div className="max-w-6xl mx-auto px-4">

        {/* ━━ FEATURED ARTICLE ━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {!loading && featured && (
          <section className="py-12 fade-in-up">
            <SectionLabel label="✦ Featured" />
            <Link to={`/post/${featured._id}`}
              className="group block rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
              style={{ border:'1px solid rgba(99,102,241,0.2)' }}
              onMouseEnter={e=>e.currentTarget.style.boxShadow='0 0 60px rgba(99,102,241,0.15)'}
              onMouseLeave={e=>e.currentTarget.style.boxShadow='none'}
            >
              <div className="grid md:grid-cols-5">
                {/* Cover */}
                <div className="md:col-span-2 h-56 md:h-auto img-zoom relative">
                  <div className="cover-grad w-full h-full min-h-56"
                    style={{ background:coverGradient(featured.title) }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-8xl font-black opacity-20 select-none"
                        style={{ color:'#fff' }}>
                        {featured.title.charAt(0)}
                      </span>
                    </div>
                    <div className="absolute inset-0"
                      style={{ background:'linear-gradient(to right,transparent 60%,rgba(2,6,23,0.8))' }}/>
                  </div>
                </div>

                {/* Content */}
                <div className="md:col-span-3 p-8 md:p-10 flex flex-col justify-center"
                  style={{ background:'linear-gradient(135deg,rgba(99,102,241,0.05),rgba(139,92,246,0.03))' }}>
                  <div className="flex items-center gap-3 mb-4">
                    <CategoryBadge title={featured.title} content={featured.content}/>
                    <span className="text-gray-600 text-xs">{readingTime(featured.content)} min read</span>
                    <span className="text-gray-700 text-xs">·</span>
                    <span className="text-gray-600 text-xs">
                      {new Date(featured.createdAt).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}
                    </span>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-extrabold leading-tight mb-3 text-white group-hover:text-indigo-200 transition-colors duration-200">
                    {featured.title}
                  </h2>

                  {featured.excerpt && (
                    <p className="text-gray-400 text-base leading-relaxed mb-6 line-clamp-2">
                      {featured.excerpt}
                    </p>
                  )}

                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
                        style={{ background:'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                        {featured.author?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{featured.author?.name}</p>
                        <p className="text-gray-600 text-xs">Author</p>
                      </div>
                    </div>
                    <span className="text-indigo-400 group-hover:text-indigo-300 text-sm font-semibold transition-colors">
                      Read article →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* ━━ CATEGORY FILTER ━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section className="pb-8">
          <div className="flex items-center gap-3 flex-wrap">
            {CATEGORIES.map(cat => {
              const active = activeCategory === cat;
              const c = CAT_COLORS[cat] || { bg:'rgba(99,102,241,0.15)', text:'#a5b4fc', border:'rgba(99,102,241,0.3)' };
              return (
                <button key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="text-sm font-medium px-4 py-1.5 rounded-full transition-all duration-200 hover:scale-105"
                  style={active ? {
                    background:'linear-gradient(135deg,#6366f1,#8b5cf6)',
                    color:'#fff',
                    border:'1px solid transparent',
                    boxShadow:'0 0 20px rgba(99,102,241,0.35)',
                  } : {
                    background: c.bg,
                    color: c.text,
                    border:`1px solid ${c.border}`,
                  }}>
                  {cat}
                </button>
              );
            })}
          </div>
        </section>

        {/* ━━ LATEST POSTS GRID ━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section className="pb-12">
          <div className="flex items-center gap-3 mb-7">
            <h2 className="text-lg font-bold text-white">
              {activeCategory === 'All' ? 'Latest Posts' : activeCategory}
            </h2>
            <div className="flex-1 h-px" style={{ background:'linear-gradient(to right,rgba(255,255,255,0.06),transparent)' }}/>
            <span className="text-sm text-gray-600">{gridPosts.length} articles</span>
          </div>

          {loading && (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {[1,2,3].map(i => (
                <div key={i} className="rounded-xl h-64 animate-pulse"
                  style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.06)' }}/>
              ))}
            </div>
          )}

          {error && <p className="text-center py-16 text-red-400">{error}</p>}

          {!loading && gridPosts.length === 0 && (
            <div className="text-center py-16 text-gray-600">
              <p className="mb-3">No posts in this category yet.</p>
              {user && (
                <Link to="/create" className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors">
                  Write the first one →
                </Link>
              )}
            </div>
          )}

          {!loading && gridPosts.length > 0 && (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {gridPosts.map(post => <PostCard key={post._id} post={post}/>)}
            </div>
          )}
        </section>

        {/* ━━ TRENDING ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {!loading && trending.length > 0 && (
          <section className="pb-12 border-t pt-10" style={{ borderColor:'rgba(255,255,255,0.05)' }}>
            <div className="flex items-center gap-3 mb-7">
              <SectionLabel label="🔥 Trending" />
              <div className="flex-1 h-px" style={{ background:'linear-gradient(to right,rgba(255,255,255,0.06),transparent)' }}/>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {trending.map((post, idx) => (
                <Link key={post._id} to={`/post/${post._id}`}
                  className="group flex gap-3 p-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                  style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}
                  onMouseEnter={e=>{ e.currentTarget.style.borderColor='rgba(99,102,241,0.4)'; e.currentTarget.style.boxShadow='0 0 20px rgba(99,102,241,0.08)'; }}
                  onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'; e.currentTarget.style.boxShadow='none'; }}
                >
                  {/* Rank number */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black"
                    style={{
                      background: idx === 0 ? 'linear-gradient(135deg,#f59e0b,#d97706)' :
                                  idx === 1 ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' :
                                  'rgba(255,255,255,0.06)',
                      color: idx < 2 ? '#fff' : '#6b7280',
                    }}>
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold line-clamp-2 group-hover:text-indigo-300 transition-colors leading-snug mb-1">
                      {post.title}
                    </p>
                    <p className="text-gray-600 text-xs">{readingTime(post.content)} min read</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ━━ ABOUT CREATOR ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section className="py-12 border-t" style={{ borderColor:'rgba(255,255,255,0.06)' }}>
          <SectionLabel label="About the Creator" plain />

          <div className="rounded-2xl p-8 flex flex-col md:flex-row items-start md:items-center gap-8 mt-6"
            style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-black"
                style={{ background:'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow:'0 0 30px rgba(99,102,241,0.3)' }}>
                A
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-white">Arjun</h3>
                <span className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background:'rgba(99,102,241,0.15)', color:'#a5b4fc', border:'1px solid rgba(99,102,241,0.25)' }}>
                  Full-Stack Developer
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-5 max-w-xl">
                Passionate about building full-stack web applications from scratch.
                This blog platform was built to learn and demonstrate modern web development
                using the MERN stack — MongoDB, Express, React, and Node.js.
              </p>
              <div className="flex flex-wrap gap-2">
                {['React','Node.js','Express','MongoDB','JWT','Tailwind CSS','Vite'].map(tech => (
                  <span key={tech} className="text-xs px-3 py-1 rounded-lg font-medium"
                    style={{ background:'rgba(255,255,255,0.05)', color:'#94a3b8', border:'1px solid rgba(255,255,255,0.08)' }}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 flex-shrink-0">
              <a href="https://github.com" target="_blank" rel="noreferrer"
                className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg transition-all duration-200 hover:-translate-y-0.5"
                style={{ background:'rgba(255,255,255,0.05)', color:'#94a3b8', border:'1px solid rgba(255,255,255,0.08)' }}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/></svg>
                GitHub
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer"
                className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg transition-all duration-200 hover:-translate-y-0.5"
                style={{ background:'rgba(10,102,194,0.1)', color:'#60a5fa', border:'1px solid rgba(10,102,194,0.2)' }}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                LinkedIn
              </a>
            </div>
          </div>
        </section>

        {/* ━━ NEWSLETTER CTA ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section className="py-12 border-t" style={{ borderColor:'rgba(255,255,255,0.05)' }}>
          <div className="rounded-2xl p-10 text-center relative overflow-hidden"
            style={{ background:'linear-gradient(135deg,rgba(99,102,241,0.12),rgba(139,92,246,0.08))', border:'1px solid rgba(99,102,241,0.2)' }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ backgroundImage:'linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)', backgroundSize:'40px 40px' }}/>
            <div className="relative">
              <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4"
                style={{ background:'rgba(99,102,241,0.2)', color:'#a5b4fc', border:'1px solid rgba(99,102,241,0.3)' }}>
                ✦ Stay updated
              </span>
              <h3 className="text-2xl font-extrabold text-white mb-2">
                Never miss a great article
              </h3>
              <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
                Get the best stories delivered straight to your inbox. No spam, ever.
              </p>
              {subscribed ? (
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
                  style={{ background:'rgba(16,185,129,0.15)', color:'#6ee7b7', border:'1px solid rgba(16,185,129,0.3)' }}>
                  ✓ You're subscribed!
                </div>
              ) : (
                <div className="flex items-center gap-2 max-w-sm mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                    style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)' }}
                  />
                  <button
                    onClick={() => { if(email) setSubscribed(true); }}
                    className="px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all duration-200 hover:scale-105 whitespace-nowrap"
                    style={{ background:'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow:'0 0 20px rgba(99,102,241,0.3)' }}>
                    Subscribe
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ━━ FOOTER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <footer className="py-8 border-t" style={{ borderColor:'rgba(255,255,255,0.05)' }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-black"
                style={{ background:'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                B
              </div>
              <span className="font-bold text-sm"
                style={{ background:'linear-gradient(to right,#e0e7ff,#c4b5fd)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                BlogSpace
              </span>
            </div>
            <p className="text-gray-700 text-xs text-center">
              Built with React · Node.js · Express · MongoDB · JWT · Tailwind CSS
            </p>
            <div className="flex items-center gap-4">
              <a href="https://github.com" target="_blank" rel="noreferrer"
                className="text-gray-600 hover:text-gray-400 text-xs transition-colors">GitHub</a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer"
                className="text-gray-600 hover:text-gray-400 text-xs transition-colors">LinkedIn</a>
              <span className="text-gray-700 text-xs">© {new Date().getFullYear()} BlogSpace</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

// ── Post Card ──────────────────────────────────────────────
const PostCard = ({ post }) => {
  const initials = post.author?.name?.charAt(0).toUpperCase() || '?';
  const mins = readingTime(post.content);

  return (
    <Link to={`/post/${post._id}`}
      className="group flex flex-col rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-1"
      style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}
      onMouseEnter={e=>{ e.currentTarget.style.borderColor='rgba(99,102,241,0.45)'; e.currentTarget.style.boxShadow='0 0 30px rgba(99,102,241,0.1)'; }}
      onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'; e.currentTarget.style.boxShadow='none'; }}
    >
      {/* Cover image */}
      <div className="img-zoom h-40 relative">
        <div className="cover-grad w-full h-full"
          style={{ background:coverGradient(post.title) }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl font-black opacity-20 select-none text-white">
              {post.title.charAt(0)}
            </span>
          </div>
        </div>
        {/* Category on image */}
        <div className="absolute top-3 left-3">
          <CategoryBadge title={post.title} content={post.content}/>
        </div>
      </div>

      {/* Top accent line */}
      <div className="h-px w-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ background:'linear-gradient(to right,#6366f1,#8b5cf6)' }}/>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-gray-700 text-xs">{mins} min read</span>
        </div>

        <h3 className="text-white font-semibold text-base leading-snug mb-2 group-hover:text-indigo-300 transition-colors duration-200 line-clamp-2">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-3">
            {post.excerpt}
          </p>
        )}

        <div className="flex-1"/>

        <div className="flex items-center justify-between mt-3 pt-3"
          style={{ borderTop:'1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ background:'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
              {initials}
            </div>
            <span className="text-gray-500 text-xs">{post.author?.name}</span>
          </div>
          <span className="text-gray-700 text-xs">
            {new Date(post.createdAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
          </span>
        </div>
      </div>
    </Link>
  );
};

// ── Small helpers ──────────────────────────────────────────
const SectionLabel = ({ label, plain }) => (
  <div className="flex items-center gap-3 mb-6">
    {plain ? (
      <h2 className="text-lg font-bold text-white">{label}</h2>
    ) : (
      <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
        style={{ background:'rgba(99,102,241,0.15)', color:'#818cf8', border:'1px solid rgba(99,102,241,0.25)' }}>
        {label}
      </span>
    )}
    <div className="flex-1 h-px"
      style={{ background:'linear-gradient(to right,rgba(99,102,241,0.2),transparent)' }}/>
  </div>
);

export default Home;