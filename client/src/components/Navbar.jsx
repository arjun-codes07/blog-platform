import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? 'rgba(2, 6, 23, 0.85)'
          : 'rgba(2, 6, 23, 0.6)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: scrolled
          ? '1px solid rgba(255,255,255,0.08)'
          : '1px solid rgba(255,255,255,0.04)',
        boxShadow: scrolled
          ? '0 4px 30px rgba(0,0,0,0.4)'
          : 'none',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-black"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            B
          </div>
          <span
            className="text-lg font-extrabold tracking-tight"
            style={{
              background: 'linear-gradient(to right, #e0e7ff, #c4b5fd)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            BlogSpace
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/">Home</NavLink>

          {user ? (
            <>
              <NavLink to="/dashboard">Dashboard</NavLink>

              <Link
                to="/create"
                className="ml-2 text-sm font-semibold px-4 py-1.5 rounded-lg transition-all duration-200 text-white"
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  boxShadow: '0 0 20px rgba(99,102,241,0.3)',
                }}
              >
                + Write
              </Link>

              <div className="flex items-center gap-2 ml-3 pl-3 border-l border-white/10">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                >
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-gray-300 text-sm hidden lg:block">
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-400 text-xs ml-1 transition-colors"
                >
                  ✕
                </button>
              </div>
            </>
          ) : (
            <>
              <NavLink to="/login">Sign in</NavLink>
              <Link
                to="/register"
                className="ml-2 text-sm font-semibold px-4 py-1.5 rounded-lg transition-all duration-200 text-white"
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  boxShadow: '0 0 20px rgba(99,102,241,0.3)',
                }}
              >
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-gray-400 hover:text-white p-1"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="md:hidden px-4 py-4 space-y-2 border-t"
          style={{
            background: 'rgba(2,6,23,0.95)',
            borderColor: 'rgba(255,255,255,0.06)',
          }}
        >
          <MobileLink to="/" onClick={() => setMenuOpen(false)}>Home</MobileLink>
          {user ? (
            <>
              <MobileLink to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</MobileLink>
              <MobileLink to="/create" onClick={() => setMenuOpen(false)}>+ Write</MobileLink>
              <button
                onClick={() => { handleLogout(); setMenuOpen(false); }}
                className="block text-red-400 text-sm py-1"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <MobileLink to="/login" onClick={() => setMenuOpen(false)}>Sign in</MobileLink>
              <MobileLink to="/register" onClick={() => setMenuOpen(false)}>Get started</MobileLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ to, children }) => (
  <Link
    to={to}
    className="text-sm text-gray-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all duration-200"
  >
    {children}
  </Link>
);

const MobileLink = ({ to, onClick, children }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block text-gray-400 hover:text-white text-sm py-1.5"
  >
    {children}
  </Link>
);

export default Navbar;