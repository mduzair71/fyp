// // 'use client';

// // import Link from 'next/link';
// // import { usePathname } from 'next/navigation';
// // import { useState, useEffect } from 'react';

// // export default function Navbar() {
// //   const pathname = usePathname();
// //   const [userName, setUserName] = useState('');
// //   const [scrolled, setScrolled] = useState(false);

// //   useEffect(() => {
// //     const name = localStorage.getItem('name');
// //     if (name) setUserName(name);

// //     const onScroll = () => setScrolled(window.scrollY > 8);
// //     window.addEventListener('scroll', onScroll);
// //     return () => window.removeEventListener('scroll', onScroll);
// //   }, []);

// //   const handleLogout = () => {
// //     localStorage.removeItem('user_id');
// //     localStorage.removeItem('name');
// //     localStorage.removeItem('role');
// //     window.location.href = '/login';
// //   };

// //   // Do not render public citizen navbar on administrative pages
// //   if (pathname?.startsWith('/admin') || pathname?.startsWith('/super-admin')) {
// //     return null;
// //   }

// //   const links = [
// //     { href: '/issues', label: 'Issues', icon: '📋' },
// //     { href: '/report', label: 'Report', icon: '📝' },
// //     { href: '/issues/my-issues', label: 'My Issues', icon: '🗂️' },
// //   ];

// //   return (

// //     <nav

// //       className={`w-full sticky top-0 z-50 backdrop-blur-xl transition-all duration-300 border-b ${
// //         scrolled ? 'bg-[#0b0b0f]/95 border-white/10 shadow-lg shadow-black/30' : 'bg-[#0b0b0f]/70 border-white/5'
// //       }`}
// //     >
// //       <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

// //         {/* Logo */}
// //         <Link href="/" className="flex items-center gap-3 no-underline group">
// //           <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-lg shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
// //             🏘️
// //           </div>
// //           <span className="text-white font-extrabold text-xl tracking-tight">
// //             Mahol<span className="text-blue-500">AI</span>
// //           </span>
// //         </Link>

// //         {/* Nav Links */}
// //         <div className="flex items-center gap-1">
// //           {links.map((link) => {
// //             const isActive = pathname === link.href;
// //             return (
// //               <Link
// //                 key={link.href}
// //                 href={link.href}
// //                 className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium no-underline transition-colors duration-200 group ${
// //                   isActive ? 'text-white' : 'text-slate-400 hover:text-white'
// //                 }`}
// //               >
// //                 <span className="opacity-90">{link.icon}</span>
// //                 {link.label}
// //                 <span
// //                   className={`absolute left-4 right-4 -bottom-[1px] h-[2px] rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-transform duration-300 origin-left ${
// //                     isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
// //                   }`}
// //                 />
// //               </Link>
// //             );
// //           })}
// //         </div>

// //         {/* Auth */}
// //         <div className="flex items-center gap-3">
// //           {userName ? (
// //             <>
// //               <div className="flex items-center gap-2 bg-white/5 border border-white/10 pl-1.5 pr-4 py-1.5 rounded-full transition-colors duration-200 hover:border-white/20">
// //                 <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
// //                   {userName.charAt(0).toUpperCase()}
// //                 </div>
// //                 <span className="text-slate-200 text-sm font-medium">{userName}</span>
// //               </div>
// //               <button
// //                 onClick={handleLogout}
// //                 className="bg-white/5 border border-white/10 text-slate-300 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer"
// //               >
// //                 Logout
// //               </button>
// //             </>
// //           ) : (
// //             <>
// //               <Link
// //                 href="/login"
// //                 className="text-slate-300 hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/5 px-4 py-2 rounded-lg text-sm font-medium no-underline transition-all duration-200"
// //               >
// //                 Login
// //               </Link>
// //               <Link
// //                 href="/signup"
// //                 className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold no-underline shadow-lg shadow-blue-500/30 transition-all duration-200 hover:shadow-blue-500/50 hover:-translate-y-[1px]"
// //               >
// //                 Sign Up
// //               </Link>
// //             </>
// //           )}
// //         </div>

// //       </div>
// //     </nav>
// //   );
// // }

// 'use client';

// import Link from 'next/link';
// import { usePathname, useRouter } from 'next/navigation';
// import { useState, useEffect, useRef } from 'react';

// export default function Navbar() {
//   const pathname = usePathname();
//   const router = useRouter();

//   const [userName, setUserName] = useState(null);
//   const [mounted, setMounted] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     setMounted(true);
//     const name = localStorage.getItem('name');
//     if (name) setUserName(name);

//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem('user_id');
//     localStorage.removeItem('name');
//     localStorage.removeItem('role');
//     setUserName(null);
//     setDropdownOpen(false);
//     router.push('/login');
//     router.refresh();
//   };

//   if (pathname?.startsWith('/admin') || pathname?.startsWith('/super-admin')) {
//     return null;
//   }

//   const links = [
//     { href: '/', label: 'Home' },
//     { href: '/issues', label: 'Explore Issues' },
//     { href: '/map', label: 'Map' },
//     { href: '/issues/my-issues', label: 'My Issues' },
//     { href: '/about', label: 'About Us' },
//   ];

//   return (
//     <>
//       {/* Desktop & Tablet Top Navbar */}
//       <nav className="w-full sticky top-0 z-50 bg-white border-b border-slate-200/80 shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
//           {/* Logo */}
//           <Link href="/" className="flex items-center gap-2.5 no-underline">
//             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-base font-bold shadow-sm">
//               🏠
//             </div>
//             <span className="text-slate-900 font-black text-xl tracking-tight">
//               Mahal<span className="text-blue-600">AI</span>
//             </span>
//           </Link>

//           {/* Desktop Center Links */}
//           <div className="hidden md:flex items-center gap-8">
//             {links.map((link) => {
//               const isActive = pathname === link.href;
//               return (
//                 <Link
//                   key={link.href}
//                   href={link.href}
//                   className={`relative py-1 text-sm font-semibold no-underline transition-colors ${
//                     isActive ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
//                   }`}
//                 >
//                   {link.label}
//                   {isActive && (
//                     <span className="absolute left-0 right-0 -bottom-[19px] h-[3px] bg-blue-600 rounded-t-full" />
//                   )}
//                 </Link>
//               );
//             })}
//           </div>

//           {/* Right Action Items */}
//           <div className="flex items-center gap-3">
            
//             {/* Notification Bell */}
//             {mounted && userName && (
//               <button
//                 className="relative p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer border-none bg-transparent"
//                 title="Notifications"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
//                 </svg>
//                 <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
//                   3
//                 </span>
//               </button>
//             )}

//             {/* User Dropdown */}
//             {mounted && userName ? (
//               <div className="relative" ref={dropdownRef}>
//                 <button
//                   onClick={() => setDropdownOpen(!dropdownOpen)}
//                   className="flex items-center gap-2 hover:bg-slate-100 p-1.5 rounded-full transition-colors cursor-pointer border-none bg-transparent"
//                 >
//                   <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
//                     {userName.charAt(0).toUpperCase()}
//                   </div>
//                   <span className="hidden sm:inline text-slate-800 text-sm font-semibold">{userName}</span>
//                   <span className="text-xs text-slate-500">▼</span>
//                 </button>

//                 {dropdownOpen && (
//                   <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 z-50">
//                     <div className="px-3 py-2 border-b border-slate-100 mb-1">
//                       <p className="text-[11px] text-slate-400 font-medium">Signed in as</p>
//                       <p className="text-sm font-bold text-slate-800 truncate">{userName}</p>
//                     </div>
//                     <Link
//                       href="/profile"
//                       onClick={() => setDropdownOpen(false)}
//                       className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg no-underline"
//                     >
//                       👤 Profile Settings
//                     </Link>
//                     <Link
//                       href="/issues/my-issues"
//                       onClick={() => setDropdownOpen(false)}
//                       className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg no-underline"
//                     >
//                       🗂️ My Reported Issues
//                     </Link>
//                     <button
//                       onClick={handleLogout}
//                       className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-1 cursor-pointer border-none bg-transparent"
//                     >
//                       🚪 Logout
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ) : mounted ? (
//               <div className="hidden sm:flex items-center gap-2">
//                 <Link
//                   href="/login"
//                   className="text-slate-700 hover:bg-slate-100 px-4 py-2 rounded-xl text-xs font-semibold no-underline transition-colors"
//                 >
//                   Login
//                 </Link>
//               </div>
//             ) : null}

//             {/* Main Action Button */}
//             <Link
//               href="/report"
//               className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold no-underline shadow-sm transition-all"
//             >
//               <span>+</span>
//               <span>Report an Issue</span>
//             </Link>

//           </div>
//         </div>
//       </nav>

//       {/* Mobile Bottom Navigation */}
//       <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 px-4 py-2 shadow-lg">
//         <div className="flex items-center justify-around">
//           <Link href="/" className={`flex flex-col items-center text-xs no-underline ${pathname === '/' ? 'text-blue-600 font-bold' : 'text-slate-500'}`}>
//             <span className="text-base">🏠</span>
//             <span>Home</span>
//           </Link>
//           <Link href="/map" className={`flex flex-col items-center text-xs no-underline ${pathname === '/map' ? 'text-blue-600 font-bold' : 'text-slate-500'}`}>
//             <span className="text-base">🗺️</span>
//             <span>Map</span>
//           </Link>
//           <Link href="/report" className="flex items-center justify-center w-11 h-11 -mt-5 bg-blue-600 rounded-full text-white shadow-md text-xl font-bold no-underline">
//             +
//           </Link>
//           <Link href="/issues" className={`flex flex-col items-center text-xs no-underline ${pathname === '/issues' ? 'text-blue-600 font-bold' : 'text-slate-500'}`}>
//             <span className="text-base">📋</span>
//             <span>Issues</span>
//           </Link>
//           <Link href="/issues/my-issues" className={`flex flex-col items-center text-xs no-underline ${pathname === '/issues/my-issues' ? 'text-blue-600 font-bold' : 'text-slate-500'}`}>
//             <span className="text-base">🗂️</span>
//             <span>My Issues</span>
//           </Link>
//         </div>
//       </div>
//     </>
//   );
// }

'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

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
    if (name) setUserName(name);

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

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    setUserName(null);
    setDropdownOpen(false);
    router.push('/login');
    router.refresh();
  };

  if (pathname?.startsWith('/admin') || pathname?.startsWith('/super-admin')) {
    return null;
  }

  const links = [
    { href: '/', label: 'Home' },
    { href: '/issues', label: 'Explore Issues' },
    { href: '/map', label: 'Map' },
    { href: '/issues/my-issues', label: 'My Issues' },
    { href: '/about', label: 'About Us' },
  ];

  return (
    <>
      {/* Desktop & Tablet Top Navbar - Corner-to-Corner Layout */}
      <nav className="w-full sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="w-full px-4 sm:px-8 h-16 flex items-center justify-between">
          
          {/* Extreme Left: Logo */}
          <Link href="/" className="flex items-center gap-2.5 no-underline shrink-0">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white text-base font-bold shadow-md shadow-blue-500/20">
              🏠
            </div>
            <span className="text-slate-900 font-black text-xl tracking-tight">
              Mahal<span className="text-blue-600">AI</span>
            </span>
          </Link>

          {/* Center: Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative py-1 text-sm font-semibold no-underline transition-colors ${
                    isActive ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute left-0 right-0 -bottom-[21px] h-[3px] bg-blue-600 rounded-t-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Extreme Right: Auth / User Profile */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* Notification Bell */}
            {mounted && userName && (
              <button
                className="relative p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer border-none bg-transparent"
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
                  className="flex items-center gap-2 hover:bg-slate-100 p-1.5 rounded-full transition-colors cursor-pointer border-none bg-transparent"
                >
                  <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline text-slate-800 text-sm font-semibold">{userName}</span>
                  <span className="text-xs text-slate-500">▼</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 z-50">
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <p className="text-[11px] text-slate-400 font-medium">Signed in as</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{userName}</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg no-underline"
                    >
                      👤 Profile Settings
                    </Link>
                    <Link
                      href="/issues/my-issues"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg no-underline"
                    >
                      🗂️ My Reported Issues
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-1 cursor-pointer border-none bg-transparent"
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
                  className="text-slate-700 hover:bg-slate-100 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold no-underline transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-slate-100 hover:bg-slate-200 text-slate-900 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold no-underline transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            ) : null}

            {/* Main Action Button */}
            <Link
              href="/report"
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold no-underline shadow-sm transition-all"
            >
              <span>+</span>
              <span className="hidden sm:inline">Report an Issue</span>
            </Link>

          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 px-4 py-2 shadow-lg">
        <div className="flex items-center justify-around">
          <Link href="/" className={`flex flex-col items-center text-xs no-underline ${pathname === '/' ? 'text-blue-600 font-bold' : 'text-slate-500'}`}>
            <span className="text-base">🏠</span>
            <span>Home</span>
          </Link>
          <Link href="/map" className={`flex flex-col items-center text-xs no-underline ${pathname === '/map' ? 'text-blue-600 font-bold' : 'text-slate-500'}`}>
            <span className="text-base">🗺️</span>
            <span>Map</span>
          </Link>
          <Link href="/report" className="flex items-center justify-center w-11 h-11 -mt-5 bg-blue-600 rounded-full text-white shadow-md text-xl font-bold no-underline">
            +
          </Link>
          <Link href="/issues" className={`flex flex-col items-center text-xs no-underline ${pathname === '/issues' ? 'text-blue-600 font-bold' : 'text-slate-500'}`}>
            <span className="text-base">📋</span>
            <span>Issues</span>
          </Link>
          <Link href="/issues/my-issues" className={`flex flex-col items-center text-xs no-underline ${pathname === '/issues/my-issues' ? 'text-blue-600 font-bold' : 'text-slate-500'}`}>
            <span className="text-base">🗂️</span>
            <span>My Issues</span>
          </Link>
        </div>
      </div>
    </>
  );
}
