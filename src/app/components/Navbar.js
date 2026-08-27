'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [userName, setUserName] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const name = localStorage.getItem('name');
    const role = localStorage.getItem('role');
    if (name && role === 'citizen') setUserName(name);

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://10.248.141.146:8000/auth/logout', {}, { withCredentials: true });
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem('user_id');
      localStorage.removeItem('name');
      localStorage.removeItem('role');
      setUserName(null);
      setDropdownOpen(false);
      router.push('/login');
      router.refresh();
    }
  };

  if (pathname?.startsWith('/admin') || pathname?.startsWith('/super-admin')) {
    return null;
  }

  const links = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/issues', label: 'Explore Issues', icon: '🧩' },
    { href: '/map', label: 'Map', icon: '🗺️' },
    { href: '/issues/my-issues', label: 'My Issues', icon: '📋' },
    { href: '/about', label: 'About Us', icon: 'ℹ️' },
  ];

  return (
    <>
      {/* Floating Eco-Pill Navbar Container */}
      <nav className="sticky top-0 z-50 w-full">
  <div className="flex items-center justify-between bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm px-6 sm:px-10 h-16 w-full">
          {/* Extreme Left: Brand Logo (Eco Theme) */}
          <Link href="/" className="flex items-center gap-2.5 no-underline shrink-0 group">
            <div className="w-10 h-10 bg-emerald-100/90 text-emerald-700 rounded-full flex items-center justify-center text-lg font-bold shadow-inner group-hover:scale-105 transition-transform">
              🌱
            </div>
            <div className="flex flex-col">
              <span className="text-slate-900 font-extrabold text-xl tracking-tight leading-none">
                Mahol<span className="text-emerald-600">AI</span>
              </span>
              <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase mt-0.5">
                Report • Analyze • Resolve
              </span>
            </div>
          </Link>

          {/* Center: Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 text-xs lg:text-sm font-semibold no-underline transition-all duration-200 px-3 py-1.5 rounded-full ${
                    isActive 
                      ? 'text-emerald-700 bg-emerald-50' 
                      : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xs">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Extreme Right: Auth / User Profile */}
          <div className="flex items-center gap-2.5 shrink-0">

            {/* Notification Bell */}
            {mounted && userName && (
              <button
                className="relative p-2 rounded-full hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer border-none bg-transparent"
                title="Notifications"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
            )}

            {/* User Dropdown OR Login / Signup */}
            {mounted && userName ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 hover:bg-emerald-50 p-1.5 rounded-full transition-colors cursor-pointer border-none bg-transparent"
                >
                  <div className="w-8 h-8 bg-emerald-700 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline text-slate-800 text-xs font-semibold">{userName}</span>
                  <span className="text-[10px] text-slate-400">▼</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-52 bg-white/95 backdrop-blur-md border border-slate-100 rounded-2xl shadow-xl p-2 z-50">
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Signed in as</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{userName}</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl no-underline transition-colors"
                    >
                      👤 Profile Settings
                    </Link>
                    <Link
                      href="/issues/my-issues"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl no-underline transition-colors"
                    >
                      🗂️ My Reported Issues
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors mt-1 cursor-pointer border-none bg-transparent"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : mounted ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-slate-700 border border-slate-200 hover:bg-slate-50 px-4 py-1.5 rounded-full text-xs font-semibold no-underline transition-all"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-1.5 rounded-full text-xs font-semibold no-underline shadow-sm transition-all"
                >
                  Sign Up
                </Link>
              </div>
            ) : null}

            {/* Main Action Button */}
            <Link
              href="/report"
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full text-xs font-bold no-underline shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all"
            >
              <span>+</span>
              <span className="hidden sm:inline">Report Issue</span>
            </Link>

          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation (Eco Styled) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2 shadow-lg">
        <div className="flex items-center justify-around">
          <Link href="/" className={`flex flex-col items-center text-[10px] font-medium no-underline ${pathname === '/' ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}>
            <span className="text-base">🏠</span>
            <span>Home</span>
          </Link>
          <Link href="/map" className={`flex flex-col items-center text-[10px] font-medium no-underline ${pathname === '/map' ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}>
            <span className="text-base">🗺️</span>
            <span>Map</span>
          </Link>
          <Link href="/report" className="flex items-center justify-center w-12 h-12 -mt-6 bg-emerald-600 hover:bg-emerald-700 rounded-full text-white shadow-lg text-2xl font-bold no-underline transition-transform active:scale-95">
            +
          </Link>
          <Link href="/issues" className={`flex flex-col items-center text-[10px] font-medium no-underline ${pathname === '/issues' ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}>
            <span className="text-base">🧩</span>
            <span>Issues</span>
          </Link>
          <Link href="/issues/my-issues" className={`flex flex-col items-center text-[10px] font-medium no-underline ${pathname === '/issues/my-issues' ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}>
            <span className="text-base">📋</span>
            <span>My Issues</span>
          </Link>
        </div>
      </div>
    </>
  );
}