import { useState, useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, Menu, X, User, LogOut, ChevronDown, Settings, History } from 'lucide-react';
import AuthContext from '../utils/AuthContext';
import SettingsDrawer from './Settingdrawer';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, logoutUser } = useContext(AuthContext);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'News', path: '/news' },
    { name: 'Analyze Footprint', path: '/quiz', highlight: true },
  ];

  const isActiveLink = (path) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'transparent' : 'rgba(255,255,255,0.88)',
          backdropFilter: scrolled ? 'none' : 'blur(14px)',
          borderBottom: scrolled ? '1px solid transparent' : '1px solid rgba(167,243,208,0.4)',
          boxShadow: scrolled ? 'none' : '0 1px 10px rgba(0,0,0,0.06)',
          opacity: scrolled ? 0 : 1,
          pointerEvents: scrolled ? 'none' : 'all',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-14">
          <div className="flex h-16 items-center justify-between">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center shadow-sm transition-colors group-hover:bg-emerald-700">
                <Leaf className="h-4.5 w-4.5 fill-white/10 text-white" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-emerald-600">
                Eco<span className="text-emerald-600">Berg</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center justify-between flex-1 ml-8">

              {/* Center — nav links */}
              <div className="flex items-center gap-1">
                {navLinks.map((link) =>
                  link.highlight ? (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="ml-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-sm font-semibold transition-all shadow-sm hover:shadow-md active:scale-95"
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        isActiveLink(link.path)
                          ? 'bg-emerald-50 text-emerald-900 font-bold'
                          : 'text-slate-500 hover:text-emerald-700 hover:bg-emerald-50/60'
                      }`}
                    >
                      {link.name}
                    </Link>
                  )
                )}
              </div>

              {/* Right — auth + settings */}
              <div className="flex items-center gap-3">
                <div className="border-l h-5 border-emerald-200" />

                {user ? (
                  <>
                    <Link
                      to="/company"
                      className="px-4 py-2 rounded-full text-sm font-semibold transition-all border-2 bg-transparent border-emerald-600 text-emerald-700 hover:bg-emerald-50 active:scale-95"
                    >
                      Register Your Company
                    </Link>

                    {/* Extra space before username */}
                    <div className="w-3" />

                    {/* User dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className="flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-semibold transition-all border text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border-emerald-200"
                      >
                        <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center">
                          <User className="w-3 h-3 text-white" />
                        </div>
                        {user.username || user.email}
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {userMenuOpen && (
                        <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden z-50">
                          <Link
                            to="/carbonhistory"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-3 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                          >
                            <History className="w-4 h-4" /> Your Carbon Footprint
                          </Link>
                          <div className="border-t border-emerald-50" />
                          <button
                            onClick={() => { setUserMenuOpen(false); logoutUser(); }}
                            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="w-4 h-4" /> Log Out
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Settings icon — far right corner, bigger */}
                    <div className="border-l h-5 border-emerald-200 ml-2" />
                    <button
                      onClick={() => setSettingsOpen(true)}
                      className="p-2.5 rounded-full text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                      title="Settings"
                    >
                      <Settings className="w-6 h-6" />
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="px-3.5 py-2 text-sm font-semibold text-emerald-700 hover:text-emerald-900 transition-colors"
                    >
                      Log In
                    </Link>
                    <Link
                      to="/register"
                      className="px-4 py-2 rounded-full text-sm font-semibold transition-all border-2 bg-transparent border-emerald-600 text-emerald-700 hover:bg-emerald-50 active:scale-95"
                    >
                      Sign Up
                    </Link>
                    <Link
                      to="/company"
                      className="px-4 py-2 rounded-full text-sm font-semibold transition-all border-2 bg-transparent border-emerald-600 text-emerald-700 hover:bg-emerald-50 active:scale-95"
                    >
                      Register Your Company
                    </Link>
                  </>
                )}
              </div>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-xl text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 focus:outline-none transition-colors"
              >
                <span className="sr-only">Open menu</span>
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-emerald-100 px-5 pt-2 pb-5 space-y-1 shadow-lg">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  link.highlight
                    ? 'bg-emerald-600 text-white font-semibold text-center'
                    : isActiveLink(link.path)
                    ? 'bg-emerald-50 text-emerald-900 font-bold border-l-4 border-emerald-600 pl-3'
                    : 'text-slate-600 hover:bg-emerald-50/50 hover:text-emerald-700'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="border-t border-emerald-100 pt-3 mt-1 space-y-2">
              {user ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-emerald-800">
                    <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    {user.username || user.email}
                  </div>
                  <Link
                    to="/company"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center px-4 py-2.5 rounded-full text-sm font-semibold border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 transition"
                  >
                    Register Your Company
                  </Link>
                  <button
                    onClick={() => { setIsOpen(false); setSettingsOpen(true); }}
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  >
                    <Settings className="w-4 h-4" /> Settings
                  </button>
                  <button
                    onClick={() => { setIsOpen(false); logoutUser(); }}
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Log Out
                  </button>
                </>
              ) : (
                <>
                  <div className="flex gap-2">
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="flex-1 text-center px-4 py-2.5 rounded-full text-sm font-semibold border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 transition"
                    >
                      Log In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="flex-1 text-center px-4 py-2.5 rounded-full text-sm font-semibold border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 transition"
                    >
                      Sign Up
                    </Link>
                  </div>
                  <Link
                    to="/company"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center px-4 py-2.5 rounded-full text-sm font-semibold border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 transition"
                  >
                    Register Your Company
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Settings Drawer */}
      <SettingsDrawer isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
};

export default Header;