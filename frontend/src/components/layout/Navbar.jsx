import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, LayoutDashboard, LogOut, User, Settings, Home, Wrench, Users, Info, Phone, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [dropOpen,  setDropOpen]  = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate  = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const close = (e) => { if (!e.target.closest('#user-dropdown')) setDropOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const navLinks = [
    { to: '/',         label: 'Home',            icon: Home     },
    { to: '/services', label: 'Services',         icon: Wrench   },
    { to: '/providers',label: 'Find Providers',   icon: Search   },
    { to: '/about',    label: 'About Us',         icon: Info     },
    { to: '/contact',  label: 'Contact',          icon: Phone    },
  ];

  const dashboardLink = !user ? '/login'
    : user.role === 'customer' ? '/customer/dashboard'
    : user.role === 'provider' ? '/provider/dashboard'
    : '/';

  const handleLogout = () => {
    logout();
    setDropOpen(false);
    navigate('/');
  };

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-sky-100/50 border-b border-sky-100' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">

          {/* ── Logo ───────────────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-md shadow-sky-200">
              <Home size={17} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-black bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent tracking-tight">
              Homents
            </span>
          </Link>

          {/* ── Desktop nav links ─────────────────────────────── */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive(to)
                    ? 'text-sky-600 bg-sky-50'
                    : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50/70'
                }`}
              >
                {label}
                {isActive(to) && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-sky-50 rounded-xl -z-10"
                    transition={{ type: 'spring', duration: 0.4 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* ── Right side ───────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div id="user-dropdown" className="relative">
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl border border-sky-200 bg-white/80 hover:border-sky-400 hover:bg-sky-50 transition-all shadow-sm"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs">
                    {user.fullName?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-slate-700 max-w-[100px] truncate">
                    {user.fullName?.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${dropOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {dropOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-12 w-52 bg-white rounded-2xl shadow-2xl shadow-slate-200/80 border border-slate-100 overflow-hidden p-1.5"
                    >
                      <div className="px-3 py-2 mb-1 border-b border-slate-100">
                        <p className="text-xs font-semibold text-slate-800 truncate">{user.fullName}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                        <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wide text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">
                          {user.role}
                        </span>
                      </div>
                      <Link
                        to={dashboardLink}
                        onClick={() => setDropOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-700 transition-all font-medium"
                      >
                        <LayoutDashboard size={15} className="text-sky-500" /> My Dashboard
                      </Link>
                      <Link
                        to={dashboardLink}
                        onClick={() => setDropOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-700 transition-all font-medium"
                      >
                        <User size={15} className="text-sky-500" /> Profile Settings
                      </Link>
                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-all font-medium"
                        >
                          <LogOut size={15} /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-sky-700 transition-colors px-3 py-2">
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-sky-500 to-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-sky-200/60 hover:shadow-lg hover:shadow-sky-300/50 hover:scale-[1.03] transition-all duration-200"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile hamburger ─────────────────────────────── */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/80 border border-sky-100 text-slate-600 hover:text-sky-700 hover:border-sky-300 transition-all shadow-sm"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ───────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-sky-100 shadow-xl overflow-hidden"
          >
            <div className="p-4 space-y-1">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                    isActive(to) ? 'bg-sky-500 text-white shadow-md shadow-sky-200' : 'text-slate-600 hover:bg-sky-50'
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              ))}
              <div className="pt-3 border-t border-sky-100 space-y-2">
                {user ? (
                  <>
                    <Link to={dashboardLink} onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold bg-sky-50 text-sky-700">
                      <LayoutDashboard size={16} /> My Dashboard
                    </Link>
                    <button onClick={() => { handleLogout(); setMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-red-600 hover:bg-red-50">
                      <LogOut size={16} /> Sign Out
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <Link to="/login" onClick={() => setMenuOpen(false)}
                      className="flex-1 text-center py-3 rounded-2xl text-sm font-semibold border border-sky-300 text-sky-700 hover:bg-sky-50">
                      Sign In
                    </Link>
                    <Link to="/register" onClick={() => setMenuOpen(false)}
                      className="flex-1 text-center py-3 rounded-2xl text-sm font-semibold bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md">
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
