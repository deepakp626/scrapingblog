import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add shadow and border on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    // { name: 'About', path: '/about' },
    // { name: 'Contact', path: '/contact' },
    { name: 'All Blogs', path: '/allblogs' },
    { name: 'Write Post', path: '/write-post' },
    { name: "Update Blog", path: '/update-blog'}
  ];

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-[#020618]/80 backdrop-blur-md border-b border-slate-800/80 shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              {/* Floating animated icon */}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-rose-600 flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.4)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
              </div>
              <span className="font-extrabold text-xl tracking-wider bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
                ScrapeBlog
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `relative py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-orange-500 font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{link.name}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-500 to-rose-600 rounded-full shadow-[0_1px_5px_rgba(249,115,22,0.6)] animate-[pulse_2s_infinite]" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Search and Action Button */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Input */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-4 w-4 text-slate-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search articles..."
                className="w-48 xl:w-60 bg-slate-900/60 hover:bg-slate-900/80 focus:bg-[#020618] border border-slate-800 focus:border-orange-500/50 rounded-full py-1.5 pl-9 pr-4 text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500/20 transition-all duration-300"
              />
            </div>

            {/* Action CTA Button */}
            <button className="relative group overflow-hidden bg-gradient-to-r from-orange-500 to-rose-600 text-white font-semibold text-xs py-2 px-5 rounded-full hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer">
              <span className="relative z-10">Write Post</span>
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-rose-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900/60 focus:outline-none transition-all duration-200 cursor-pointer"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              <div className="relative w-6 h-6">
                <span
                  className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${
                    isOpen ? 'rotate-45 top-3' : 'top-1.5'
                  }`}
                />
                <span
                  className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${
                    isOpen ? 'opacity-0' : 'top-3'
                  }`}
                />
                <span
                  className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${
                    isOpen ? '-rotate-45 top-3' : 'top-4.5'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100 border-b border-slate-800' : 'max-h-0 opacity-0'
        } bg-[#020618]/95 backdrop-blur-xl`}
      >
        <div className="px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-orange-500 bg-orange-500/10 font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          {/* Search bar inside mobile menu */}
          <div className="relative px-4 py-1">
            <span className="absolute inset-y-0 left-4 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-4 w-4 text-slate-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full bg-slate-900/60 border border-slate-800 focus:border-orange-500/50 rounded-full py-2 pl-9 pr-4 text-xs text-slate-300 placeholder-slate-500 focus:outline-none transition-all duration-300"
            />
          </div>

          <div className="px-4 pt-2">
            <button className="w-full bg-gradient-to-r from-orange-500 to-rose-600 text-white font-semibold text-sm py-2.5 px-4 rounded-full shadow-[0_4px_12px_rgba(249,115,22,0.25)] hover:shadow-[0_4px_18px_rgba(249,115,22,0.35)] transition-all duration-200">
              Write Post
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
