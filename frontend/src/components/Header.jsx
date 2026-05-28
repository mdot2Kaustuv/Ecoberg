import React , { useState } from 'react';
import {Link, useNavigate,useLocation} from 'react-router-dom';
import {Leaf, Menu , X } from 'lucide-react';
import Register from './Register';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const navLinks = [
        { name: 'Home', path: '/' },
        {name : 'My dashboard' , path : '/dashboard'},
        {name : 'News' , path : '/news'},

    ];

    const isActiveLink = (path) => location.pathname === path;

    return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold shadow-sm transition-colors group-hover:bg-emerald-700">
              <Leaf className="h-5 w-5 fill-white/10 text-white" />
            </div>
            <span className="font-display font-extrabold text-xl tracking-tight text-emerald-950">
              Eco<span className="text-emerald-600">Berg</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-1 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActiveLink(link.path)
                    ? 'bg-emerald-50 text-emerald-900 font-bold'
                    : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/20'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="border-l h-6 border-emerald-300 mx-2" />
             <Link
                to="/Register"
                className="px-5 py-2.5 bg-transparent border-2 border-emerald-600 hover:bg-emerald-50 text-emerald-700 hover:text-emerald-800 rounded-full text-sm font-semibold transition-all shadow-sm hover:shadow-md active:scale-95"
              >
                Sign Up
              </Link>

            <Link
              to="/Quiz"
              className="ml-4 px-5 py-2.5 bg-emerald-900 hover:bg-emerald-800 text-white rounded-full text-sm font-semibold transition-all shadow-sm hover:shadow-lg hover:shadow-emerald-950/5 active:scale-98"
            >
              Analyze Footprint
            </Link>
          </nav>

          {/* Mobile hamburger button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 focus:outline-none transition-colors border border-transparent hover:border-emerald-100"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-emerald-100 px-4 pt-2 pb-4 space-y-1.5 shadow-lg shadow-emerald-950/5 animate-in fade-in slide-in-from-top-3 duration-200" id="mobile-menu">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 rounded-full text-base font-medium transition-colors ${
                isActive(link.path)
                  ? 'bg-emerald-50 text-emerald-900 font-bold border-l-4 border-emerald-600 pl-3'
                  : 'text-slate-600 hover:bg-emerald-50/30 hover:text-emerald-650'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 px-4">
            <Link
              to="/Quiz"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center px-4 py-3 rounded-full text-base font-semibold bg-emerald-900 hover:bg-emerald-800 text-white shadow-sm transition"
            >
              Start Carbon Quiz
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};




export default Header;