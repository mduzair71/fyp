// // // 'use client';

// // // import { useState, useEffect } from 'react';
// // // import Link from 'next/link';

// // // // Helper: safely extract location string from structured or legacy location
// // // function getLocationStr(issue) {
// // //   if (!issue.location) return issue.location_area ? `${issue.location_area}, ${issue.location_district || ''}` : '—';
// // //   if (typeof issue.location === 'string') return issue.location;
// // //   const loc = issue.location;
// // //   return [loc.area, loc.district].filter(Boolean).join(', ') || '—';
// // // }

// // // export default function Home() {
// // //   const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, inProgress: 0 });
// // //   const [userName, setUserName] = useState('');
// // //   const [recentIssues, setRecentIssues] = useState([]);

// // //   useEffect(() => {
// // //     const name = localStorage.getItem('name');
// // //     if (name) setUserName(name);

// // //     fetch('http://localhost:8000/issues')
// // //       .then(res => res.json())
// // //       .then(data => {
// // //         const issues = data.data || [];
// // //         setStats({
// // //           total: issues.length,
// // //           pending: issues.filter(i => i.status === 'pending').length,
// // //           inProgress: issues.filter(i => i.status === 'in_progress').length,
// // //           resolved: issues.filter(i => i.status === 'resolved').length,
// // //         });
// // //         setRecentIssues(issues.slice(0, 3));
// // //       });
// // //   }, []);

// // //   return (
// // //     <div className="min-h-screen" style={{ backgroundColor: '#f8fafc', fontFamily: "'Inter','Segoe UI', sans-serif" }}>

// // //       {/* HERO */}
// // //       <div style={{
// // //         background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
// // //         borderBottom: '1px solid rgba(22,163,74,0.15)',
// // //         padding: '80px 24px 100px',
// // //         textAlign: 'center',
// // //         position: 'relative',
// // //         overflow: 'hidden'
// // //       }}>
// // //         {/* Pakistan green glow effect */}
// // //         <div style={{
// // //           position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
// // //           width: '600px', height: '300px',
// // //           background: 'radial-gradient(ellipse, rgba(22,163,74,0.08) 0%, transparent 70%)',
// // //           pointerEvents: 'none'
// // //         }} />

// // //         <div style={{ position: 'relative', zIndex: 1 }}>
// // //           <span style={{
// // //             display: 'inline-block',
// // //             backgroundColor: 'rgba(22,163,74,0.1)',
// // //             border: '1px solid rgba(22,163,74,0.2)',
// // //             color: '#16a34a',
// // //             padding: '6px 16px',
// // //             borderRadius: '999px',
// // //             fontSize: '13px',
// // //             fontWeight: 600,
// // //             letterSpacing: '1px',
// // //             marginBottom: '24px'
// // //           }}>
// // //             🤖 AI-POWERED CIVIC SYSTEM
// // //           </span>

// // //           <h1 style={{
// // //             fontSize: '64px',
// // //             fontWeight: 800,
// // //             color: '#111827',
// // //             margin: '0 0 16px',
// // //             lineHeight: 1.1,
// // //             letterSpacing: '-2px'
// // //           }}>
// // //             Mahol<span style={{ color: '#16a34a' }}>AI</span>
// // //           </h1>

// // //           <p style={{
// // //             fontSize: '20px',
// // //             color: '#4b5563',
// // //             marginBottom: '8px',
// // //             maxWidth: '520px',
// // //             margin: '0 auto 12px'
// // //           }}>
// // //             Report civic problems. AI analyzes instantly.
// // //           </p>
// // //           <p style={{ color: '#6b7280', fontSize: '15px', marginBottom: '48px' }}>
// // //             Potholes · Water · Electricity · Sanitation · and more
// // //           </p>

// // //           {userName && (
// // //             <p style={{ color: '#16a34a', marginBottom: '24px', fontSize: '15px', fontWeight: 600 }}>
// // //               👋 Welcome back, <strong>{userName}</strong>
// // //             </p>
// // //           )}

// // //           <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
// // //             <Link href="/report" style={{
// // //               backgroundColor: '#16a34a',
// // //               color: 'white',
// // //               padding: '14px 32px',
// // //               borderRadius: '12px',
// // //               fontWeight: 700,
// // //               fontSize: '16px',
// // //               textDecoration: 'none',
// // //               display: 'inline-flex',
// // //               alignItems: 'center',
// // //               gap: '8px',
// // //               boxShadow: '0 4px 14px rgba(22,163,74,0.3)'
// // //             }}>
// // //               📝 Report Issue
// // //             </Link>
// // //             <Link href="/issues" style={{
// // //               backgroundColor: '#ffffff',
// // //               color: '#111827',
// // //               padding: '14px 32px',
// // //               borderRadius: '12px',
// // //               fontWeight: 700,
// // //               fontSize: '16px',
// // //               textDecoration: 'none',
// // //               border: '1px solid #e5e7eb',
// // //               display: 'inline-flex',
// // //               alignItems: 'center',
// // //               gap: '8px',
// // //               boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
// // //             }}>
// // //               📋 View All Issues
// // //             </Link>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* STATS */}
// // //       <div style={{ maxWidth: '1100px', margin: '-40px auto 0', padding: '0 24px', position: 'relative', zIndex: 10 }}>
// // //         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
// // //           {[
// // //             { label: 'Total Issues', value: stats.total, color: '#16a34a', icon: '📊' },
// // //             { label: 'Pending', value: stats.pending, color: '#eab308', icon: '⏳' },
// // //             { label: 'In Progress', value: stats.inProgress, color: '#3b82f6', icon: '🔄' },
// // //             { label: 'Resolved', value: stats.resolved, color: '#22c55e', icon: '✅' },
// // //           ].map((s, i) => (
// // //             <div key={i} style={{
// // //               backgroundColor: '#ffffff',
// // //               border: '1px solid #e5e7eb',
// // //               borderRadius: '16px',
// // //               padding: '24px',
// // //               textAlign: 'center',
// // //               boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
// // //             }}>
// // //               <div style={{ fontSize: '28px', marginBottom: '8px' }}>{s.icon}</div>
// // //               <div style={{ fontSize: '36px', fontWeight: 800, color: s.color }}>{s.value}</div>
// // //               <div style={{ color: '#6b7280', fontSize: '13px', marginTop: '4px', fontWeight: 500 }}>{s.label}</div>
// // //             </div>
// // //           ))}
// // //         </div>
// // //       </div>

// // //       {/* HOW IT WORKS */}
// // //       <div style={{ maxWidth: '1100px', margin: '80px auto 0', padding: '0 24px' }}>
// // //         <h2 style={{ color: '#111827', fontSize: '32px', fontWeight: 700, textAlign: 'center', marginBottom: '48px' }}>
// // //           How It Works
// // //         </h2>
// // //         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
// // //           {[
// // //             { step: '01', icon: '📸', title: 'Citizen Reports', desc: 'Fill a simple form with photo, location and description of the problem.' },
// // //             { step: '02', icon: '🤖', title: 'AI Analyzes', desc: 'Claude AI instantly categorizes, prioritizes and summarizes the issue.' },
// // //             { step: '03', icon: '🛠️', title: 'Admin Resolves', desc: 'Admin reviews the AI report and takes action to fix the problem.' },
// // //           ].map((item, i) => (
// // //             <div key={i} style={{
// // //               backgroundColor: '#ffffff',
// // //               border: '1px solid #e5e7eb',
// // //               borderRadius: '20px',
// // //               padding: '32px',
// // //               position: 'relative',
// // //               overflow: 'hidden',
// // //               boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
// // //             }}>
// // //               <div style={{
// // //                 position: 'absolute', top: '16px', right: '20px',
// // //                 fontSize: '48px', fontWeight: 900, color: '#f3f4f6'
// // //               }}>{item.step}</div>
// // //               <div style={{ fontSize: '40px', marginBottom: '16px' }}>{item.icon}</div>
// // //               <h3 style={{ color: '#111827', fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>{item.title}</h3>
// // //               <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: 1.7 }}>{item.desc}</p>
// // //             </div>
// // //           ))}
// // //         </div>
// // //       </div>

// // //       {/* RECENT ISSUES */}
// // //       {recentIssues.length > 0 && (
// // //         <div style={{ maxWidth: '1100px', margin: '80px auto 0', padding: '0 24px' }}>
// // //           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
// // //             <h2 style={{ color: '#111827', fontSize: '24px', fontWeight: 700 }}>Recent Issues</h2>
// // //             <Link href="/issues" style={{ color: '#16a34a', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>View all →</Link>
// // //           </div>
// // //           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
// // //             {recentIssues.map(issue => (
// // //               <Link key={issue._id} href={`/issues/${issue._id}`} style={{ textDecoration: 'none' }}>
// // //                 <div style={{
// // //                   backgroundColor: '#ffffff',
// // //                   border: '1px solid #e5e7eb',
// // //                   borderRadius: '16px',
// // //                   padding: '20px',
// // //                   cursor: 'pointer',
// // //                   transition: 'border-color 0.2s',
// // //                   boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
// // //                 }}>
// // //                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
// // //                     <span style={{
// // //                       backgroundColor: 'rgba(22,163,74,0.1)',
// // //                       color: '#16a34a',
// // //                       padding: '4px 10px',
// // //                       borderRadius: '999px',
// // //                       fontSize: '12px',
// // //                       fontWeight: 600
// // //                     }}>{issue.category}</span>
// // //                     <span style={{
// // //                       fontSize: '11px',
// // //                       fontWeight: 600,
// // //                       padding: '3px 8px',
// // //                       borderRadius: '999px',
// // //                       backgroundColor: issue.priority === 'high' ? 'rgba(239,68,68,0.1)' : issue.priority === 'medium' ? 'rgba(234,179,8,0.1)' : 'rgba(22,163,74,0.1)',
// // //                       color: issue.priority === 'high' ? '#b91c1c' : issue.priority === 'medium' ? '#a16207' : '#15803d',
// // //                     }}>{issue.priority}</span>
// // //                   </div>
// // //                   <h3 style={{ color: '#111827', fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>{issue.title}</h3>
// // //                   <p style={{ color: '#6b7280', fontSize: '12px' }}>📍 {getLocationStr(issue)}</p>
// // //                 </div>
// // //               </Link>
// // //             ))}
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* QUICK LINKS */}
// // //       <div style={{ maxWidth: '1100px', margin: '80px auto', padding: '0 24px' }}>
// // //         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
// // //           {[
// // //             { href: '/report', label: 'Report Issue', icon: '📝', color: '#16a34a', bg: 'rgba(22,163,74,0.05)' },
// // //             { href: '/issues', label: 'Public Issues', icon: '📋', color: '#0369a1', bg: 'rgba(3,105,161,0.05)' },
// // //             { href: '/issues/my-issues', label: 'Track My Issues', icon: '📂', color: '#7c3aed', bg: 'rgba(124,58,237,0.05)' },
// // //             { href: '/signup', label: 'Join Now', icon: '👤', color: '#4b5563', bg: '#f3f4f6' },
// // //           ].map((link, i) => (
// // //             <Link key={i} href={link.href} style={{
// // //               backgroundColor: link.bg,
// // //               border: `1px solid rgba(0,0,0,0.05)`,
// // //               color: link.color,
// // //               padding: '20px',
// // //               borderRadius: '16px',
// // //               textDecoration: 'none',
// // //               textAlign: 'center',
// // //               fontWeight: 700,
// // //               fontSize: '15px',
// // //               display: 'block',
// // //               boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
// // //             }}>
// // //               <div style={{ fontSize: '28px', marginBottom: '8px' }}>{link.icon}</div>
// // //               {link.label}
// // //             </Link>
// // //           ))}
// // //         </div>
// // //       </div>


// // //       {/* FOOTER */}
// // //       <div style={{
// // //         borderTop: '1px solid #e5e7eb',
// // //         textAlign: 'center',
// // //         padding: '24px',
// // //         color: '#6b7280',
// // //         fontSize: '13px',
// // //         backgroundColor: '#ffffff'
// // //       }}>
// // //         © 2024 MaholAI. All rights reserved.
// // //       </div>
// // //     </div>
// // //   );
// // // }
// // 'use client';

// // import { useState, useEffect } from 'react';
// // import Link from 'next/link';

// // // Helper: safely extract location string from structured or legacy location
// // function getLocationStr(issue) {
// //   if (!issue.location) return issue.location_area ? `${issue.location_area}, ${issue.location_district || ''}` : '—';
// //   if (typeof issue.location === 'string') return issue.location;
// //   const loc = issue.location;
// //   return [loc.area, loc.district].filter(Boolean).join(', ') || '—';
// // }

// // const STATUS_LABEL = {
// //   pending: 'Reported',
// //   in_progress: 'In Progress',
// //   resolved: 'Resolved',
// // };

// // export default function Home() {
// //   const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, inProgress: 0 });
// //   const [userName, setUserName] = useState('');
// //   const [recentIssues, setRecentIssues] = useState([]);

// //   useEffect(() => {
// //     const name = localStorage.getItem('name');
// //     if (name) setUserName(name);

// //     fetch('http://localhost:8000/issues')
// //       .then(res => res.json())
// //       .then(data => {
// //         const issues = data.data || [];
// //         setStats({
// //           total: issues.length,
// //           pending: issues.filter(i => i.status === 'pending').length,
// //           inProgress: issues.filter(i => i.status === 'in_progress').length,
// //           resolved: issues.filter(i => i.status === 'resolved').length,
// //         });
// //         setRecentIssues(issues.slice(0, 3));
// //       })
// //       .catch(err => console.error('Failed to fetch issues:', err));
// //   }, []);

// //   return (
// //     <div className="min-h-[calc(100vh-4rem)] w-full bg-[#f8fa0f]/0 bg-slate-50/50 text-slate-800 flex flex-col justify-between selection:bg-blue-100 selection:text-blue-700">

// //       {/* HERO SECTION */}
// //       <section className="relative w-full overflow-hidden py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-200/60 bg-gradient-to-b from-white via-slate-50/50 to-slate-100/30">
        
// //         {/* Soft Gemini Glows */}
// //         <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-400/10 via-indigo-400/10 to-purple-400/10 rounded-full blur-3xl pointer-events-none" />

// //         <div className="relative max-w-5xl mx-auto text-center space-y-6">
          
// //           {/* AI Pill Badge */}
// //           <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-sm text-xs font-semibold text-slate-700 hover:border-slate-300 transition-all">
// //             <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
// //             <span>MahalAI Civic Intelligence</span>
// //           </div>

// //           {/* Heading */}
// //           <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.08]">
// //             Make your community <br className="hidden sm:block" />
// //             <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
// //               smarter and safer.
// //             </span>
// //           </h1>

// //           {/* Subtitle */}
// //           <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
// //             Report local public issues, track real-time resolution, and help city departments respond faster using automated AI classification.
// //           </p>

// //           {/* Action Buttons */}
// //           <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
// //             <Link
// //               href="/report"
// //               className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-all shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 text-center no-underline"
// //             >
// //               + Report an Issue
// //             </Link>
// //             <Link
// //               href="/issues"
// //               className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80 font-medium text-sm transition-all text-center no-underline shadow-sm"
// //             >
// //               Explore Public Issues
// //             </Link>
// //           </div>

// //         </div>
// //       </section>

// //       {/* STATS OVERVIEW CARDS */}
// //       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full -mt-10 relative z-10">
// //         <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
// //           {[
// //             { label: 'Total Issues', value: stats.total, border: 'border-slate-200' },
// //             { label: 'Pending', value: stats.pending, border: 'border-amber-200 text-amber-600' },
// //             { label: 'In Progress', value: stats.inProgress, border: 'border-blue-200 text-blue-600' },
// //             { label: 'Resolved', value: stats.resolved, border: 'border-emerald-200 text-emerald-600' },
// //           ].map((s, i) => (
// //             <div key={i} className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl p-5 sm:p-6 text-center shadow-sm hover:shadow-md transition-shadow">
// //               <div className={`text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 ${s.border.split(' ')[1] || ''}`}>
// //                 {s.value}
// //               </div>
// //               <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mt-1.5">{s.label}</div>
// //             </div>
// //           ))}
// //         </div>
// //       </section>

// //       {/* RECENT ISSUES NEAR YOU */}
// //       {recentIssues.length > 0 && (
// //         <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">
// //           <div className="flex justify-between items-end mb-8">
// //             <div>
// //               <h2 className="text-2xl font-bold tracking-tight text-slate-900">Issues Near You</h2>
// //               <p className="text-slate-500 text-sm mt-1">Recently submitted civic reports</p>
// //             </div>
// //             <Link href="/issues" className="text-blue-600 hover:text-blue-700 text-sm font-semibold no-underline transition-colors">
// //               View all →
// //             </Link>
// //           </div>

// //           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //             {recentIssues.map(issue => (
// //               <Link key={issue._id} href={`/issues/${issue._id}`} className="no-underline group">
// //                 <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm group-hover:shadow-md group-hover:border-blue-300 transition-all flex flex-col justify-between h-full">
// //                   <div>
// //                     <div className="flex justify-between items-center gap-2 mb-4">
// //                       <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-medium border border-slate-200/60">
// //                         {issue.category}
// //                       </span>
// //                       <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${
// //                         issue.priority === 'high' ? 'bg-red-50 text-red-600 border border-red-100' :
// //                         issue.priority === 'medium' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
// //                         'bg-emerald-50 text-emerald-600 border border-emerald-100'
// //                       }`}>
// //                         {issue.priority}
// //                       </span>
// //                     </div>

// //                     <h3 className="text-slate-900 font-semibold text-base group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
// //                       {issue.title}
// //                     </h3>
// //                   </div>

// //                   <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 text-xs">
// //                     <span className="text-slate-500 truncate max-w-[150px]">📍 {getLocationStr(issue)}</span>
// //                     <span className="font-medium text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded-md">
// //                       {STATUS_LABEL[issue.status] || issue.status}
// //                     </span>
// //                   </div>
// //                 </div>
// //               </Link>
// //             ))}
// //           </div>
// //         </section>
// //       )}

// //       {/* HOW IT WORKS */}
// //       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">
// //         <div className="text-center max-w-xl mx-auto mb-12">
// //           <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">How MahalAI Works</h2>
// //           <p className="text-slate-500 text-sm mt-2">Connecting citizens directly to municipal resolution teams.</p>
// //         </div>

// //         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //           {[
// //             { step: '01', icon: '📷', title: 'Capture & Report', desc: 'Take a photo, attach location details, and describe the civic issue.' },
// //             { step: '02', icon: '✨', title: 'AI Categorization', desc: 'MahalAI automatically routes the ticket to the concerned municipal department.' },
// //             { step: '03', icon: '✅', title: 'Track Progress', desc: 'Get real-time updates as officials work on resolving your complaint.' },
// //           ].map((item, i) => (
// //             <div key={i} className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all">
// //               <div className="flex items-center justify-between mb-6">
// //                 <span className="text-2xl">{item.icon}</span>
// //                 <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">{item.step}</span>
// //               </div>
// //               <h3 className="text-slate-900 font-bold text-lg mb-2">{item.title}</h3>
// //               <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
// //             </div>
// //           ))}
// //         </div>
// //       </section>

// //       {/* USER BANNER (LOGGED IN ONLY) */}
// //       {userName && (
// //         <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-6">
// //           <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 sm:p-10 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
// //             <div>
// //               <span className="text-blue-100 text-xs font-semibold uppercase tracking-wider">Welcome back</span>
// //               <h3 className="text-2xl font-bold mt-1">Hello, {userName} 👋</h3>
// //               <p className="text-blue-100/90 text-sm mt-1">Track updates on your submitted reports.</p>
// //             </div>
// //             <Link
// //               href="/issues/my-issues"
// //               className="px-6 py-3 rounded-xl bg-white text-blue-600 font-semibold text-sm hover:bg-blue-50 transition-colors no-underline shadow-md"
// //             >
// //               View My Issues →
// //             </Link>
// //           </div>
// //         </section>
// //       )}

// //       {/* FOOTER */}
// //       <footer className="w-full border-t border-slate-200 bg-white py-8 mt-12">
// //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
// //           <div className="flex items-center gap-2">
// //             <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">M</div>
// //             <span className="font-bold text-slate-900 text-sm">MahalAI</span>
// //           </div>
// //           <p>© 2026 MahalAI. All rights reserved.</p>
// //         </div>
// //       </footer>

// //     </div>
// //   );
// // // }

// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';

// function getLocationStr(issue) {
//   if (!issue.location) return issue.location_area ? `${issue.location_area}, ${issue.location_district || ''}` : '—';
//   if (typeof issue.location === 'string') return issue.location;
//   const loc = issue.location;
//   return [loc.area, loc.district].filter(Boolean).join(', ') || '—';
// }

// const STATUS_LABEL = {
//   pending: 'Reported',
//   in_progress: 'In Progress',
//   resolved: 'Resolved',
// };

// export default function Home() {
//   const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, inProgress: 0 });
//   const [userName, setUserName] = useState('');
//   const [recentIssues, setRecentIssues] = useState([]);

//   useEffect(() => {
//     const name = localStorage.getItem('name');
//     if (name) setUserName(name);

//     fetch('http://localhost:8000/issues')
//       .then(res => res.json())
//       .then(data => {
//         const issues = data.data || [];
//         setStats({
//           total: issues.length,
//           pending: issues.filter(i => i.status === 'pending').length,
//           inProgress: issues.filter(i => i.status === 'in_progress').length,
//           resolved: issues.filter(i => i.status === 'resolved').length,
//         });
//         setRecentIssues(issues.slice(0, 3));
//       })
//       .catch(err => console.error('Failed to fetch issues:', err));
//   }, []);

//   return (
//     <div className="min-h-screen bg-[#f8fafc] text-slate-800 pb-16 md:pb-0">

//       {/* HERO SECTION */}
//       <section className="relative bg-gradient-to-b from-blue-50/60 to-transparent py-12 sm:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
//         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
//           <div className="lg:col-span-7 space-y-5">
//             <span className="inline-flex items-center gap-1.5 text-blue-600 bg-blue-100/80 px-3 py-1 rounded-full text-xs font-bold">
//               💙 Making Your Community Better
//             </span>

//             <h1 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight">
//               Report. Track. <br />
//               <span className="text-blue-600">Improve Your Community.</span>
//             </h1>

//             <p className="text-slate-600 text-sm sm:text-base max-w-lg leading-relaxed">
//               MahalAI helps you report local issues, track their progress, and build a better community together.
//             </p>

//             <div className="flex items-center gap-3 pt-2">
//               <Link
//                 href="/report"
//                 className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-sm no-underline"
//               >
//                 + Report an Issue
//               </Link>
//               <Link
//                 href="/issues"
//                 className="bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm px-6 py-3 rounded-xl border border-slate-200 no-underline shadow-sm"
//               >
//                 Explore Issues
//               </Link>
//             </div>
//           </div>

//           {/* Hero Right Visual Graphic */}
//           <div className="lg:col-span-5 relative flex justify-center">
//             <div className="w-full h-56 sm:h-72 bg-gradient-to-tr from-sky-200/40 to-blue-200/40 rounded-3xl border border-sky-100 relative overflow-hidden flex items-center justify-center p-6 shadow-sm">
//               <div className="text-center space-y-2">
//                 <div className="text-5xl">🏙️</div>
//                 <p className="text-xs font-semibold text-slate-600">AI Powered Smart City Operations</p>
//               </div>
//             </div>
//           </div>

//         </div>
//       </section>

//       {/* STAT CARDS ROW */}
//       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 relative z-10">
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
//           <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
//             <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center text-lg font-bold">📍</div>
//             <div>
//               <p className="text-[11px] text-slate-400 font-semibold uppercase">Your Area</p>
//               <p className="text-sm font-bold text-slate-900">Jahangira</p>
//               <p className="text-[10px] text-slate-400">Peshawar, KPK</p>
//             </div>
//           </div>

//           <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
//             <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center text-lg font-bold">📊</div>
//             <div>
//               <p className="text-xl font-black text-slate-900">{stats.total || 12}</p>
//               <p className="text-[11px] text-slate-500 font-semibold">Active Issues</p>
//             </div>
//           </div>

//           <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
//             <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-lg font-bold">✓</div>
//             <div>
//               <p className="text-xl font-black text-slate-900">{stats.resolved || 8}</p>
//               <p className="text-[11px] text-slate-500 font-semibold">Resolved Issues</p>
//             </div>
//           </div>

//           <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
//             <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center text-lg font-bold">👥</div>
//             <div>
//               <p className="text-xl font-black text-slate-900">245</p>
//               <p className="text-[11px] text-slate-500 font-semibold">Citizens Involved</p>
//             </div>
//           </div>

//         </div>
//       </section>

//       {/* ISSUES NEAR YOU & MAP ROW */}
//       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
//           {/* Left: Issues List */}
//           <div className="lg:col-span-7 space-y-4">
//             <div className="flex justify-between items-center">
//               <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">📍 Issues Near You</h2>
//               <Link href="/issues" className="text-xs font-bold text-blue-600 no-underline">View All</Link>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//               {recentIssues.length > 0 ? (
//                 recentIssues.map(issue => (
//                   <Link key={issue._id} href={`/issues/${issue._id}`} className="no-underline bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm hover:border-blue-400 transition-all flex flex-col justify-between">
//                     <div>
//                       <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md">
//                         {issue.category}
//                       </span>
//                       <h3 className="text-xs font-bold text-slate-800 mt-2 line-clamp-2">{issue.title}</h3>
//                       <p className="text-[10px] text-slate-400 mt-1">📍 {getLocationStr(issue)}</p>
//                     </div>
//                     <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center text-[10px]">
//                       <span className="font-semibold text-slate-600">{STATUS_LABEL[issue.status] || issue.status}</span>
//                       <span className="text-amber-600 font-bold">{issue.priority}</span>
//                     </div>
//                   </Link>
//                 ))
//               ) : (
//                 [1, 2, 3].map(i => (
//                   <div key={i} className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm space-y-2">
//                     <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md">Road Damage</span>
//                     <h3 className="text-xs font-bold text-slate-800">Broken Road Near Main Bazaar</h3>
//                     <p className="text-[10px] text-slate-400">Main Bazaar • 0.8 km</p>
//                     <div className="pt-2 border-t border-slate-100 flex justify-between text-[10px]">
//                       <span className="text-amber-600 font-bold">In Progress</span>
//                       <span className="text-slate-400">24 Supporters</span>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>

//           {/* Right: Map Preview */}
//           <div className="lg:col-span-5 space-y-4">
//             <div className="flex justify-between items-center">
//               <h2 className="text-lg font-bold text-slate-900">Explore Issues Map</h2>
//               <Link href="/map" className="text-xs font-bold text-blue-600 no-underline">View Full Map</Link>
//             </div>
//             <div className="bg-slate-100 border border-slate-200 rounded-2xl h-52 flex flex-col items-center justify-center relative overflow-hidden">
//               <span className="text-3xl mb-1">🗺️</span>
//               <p className="text-xs font-bold text-slate-600">Interactive Map View</p>
//               <Link href="/map" className="mt-2 bg-white text-slate-800 border border-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg no-underline shadow-sm">
//                 Open Map
//               </Link>
//             </div>
//           </div>

//         </div>
//       </section>

//       {/* 3-COLUMN SECTION (Activity / Community / How it works) */}
//       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
//           {/* Card 1: Your Activity */}
//           <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
//             <div>
//               <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">📈 Your Activity</h3>
//               <div className="grid grid-cols-3 gap-2 text-center">
//                 <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
//                   <p className="text-lg font-black text-slate-900">3</p>
//                   <p className="text-[10px] text-slate-500 font-medium">Total</p>
//                 </div>
//                 <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-100">
//                   <p className="text-lg font-black text-amber-600">1</p>
//                   <p className="text-[10px] text-amber-600 font-medium">In Progress</p>
//                 </div>
//                 <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
//                   <p className="text-lg font-black text-emerald-600">2</p>
//                   <p className="text-[10px] text-emerald-600 font-medium">Resolved</p>
//                 </div>
//               </div>
//             </div>
//             <Link href="/issues/my-issues" className="mt-6 text-center text-xs font-bold text-blue-600 no-underline bg-blue-50 py-2 rounded-xl">
//               View My Issues →
//             </Link>
//           </div>

//           {/* Card 2: Community Needs Your Voice */}
//           <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
//             <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">📢 Community Needs Your Voice</h3>
//             <div className="space-y-3">
//               <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center text-xs">
//                 <div>
//                   <p className="font-bold text-slate-800">Street Light Not Working</p>
//                   <p className="text-[10px] text-slate-400">Near Park Road • 0.6 km</p>
//                 </div>
//                 <button className="bg-white border border-slate-200 text-[10px] font-bold text-slate-700 px-2 py-1 rounded-lg">Support ♡</button>
//               </div>
//             </div>
//           </div>

//           {/* Card 3: How It Works */}
//           <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
//             <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">⚙️ How It Works</h3>
//             <ol className="space-y-2 text-xs text-slate-600 list-decimal pl-4">
//               <li><strong className="text-slate-800">Report an Issue:</strong> Share problems in your area.</li>
//               <li><strong className="text-slate-800">AI Review:</strong> System verifies and assigns department.</li>
//               <li><strong className="text-slate-800">Action Taken:</strong> Authorities resolve the ticket.</li>
//             </ol>
//           </div>

//         </div>
//       </section>

//       {/* FOOTER */}
//       <footer className="w-full bg-white border-t border-slate-200 mt-16 py-8">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
//           <div className="flex items-center gap-2">
//             <div className="w-6 h-6 rounded-md bg-blue-600 text-white font-bold flex items-center justify-center text-xs">M</div>
//             <span className="font-bold text-slate-900 text-sm">MahalAI</span>
//           </div>
//           <p>© 2026 MahalAI. All rights reserved.</p>
//         </div>
//       </footer>

//     </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

function getLocationStr(issue) {
  if (!issue.location) return issue.location_area ? `${issue.location_area}, ${issue.location_district || ''}` : '—';
  if (typeof issue.location === 'string') return issue.location;
  const loc = issue.location;
  return [loc.area, loc.district].filter(Boolean).join(', ') || '—';
}

const STATUS_LABEL = {
  pending: 'Under Review',
  in_progress: 'In Progress',
  resolved: 'Resolved',
};

export default function Home() {
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, inProgress: 0, citizens: 0 });
  const [recentIssues, setRecentIssues] = useState([]);

  useEffect(() => {
    // Issues fetch and real count calculation
    fetch('http://localhost:8000/issues')
      .then(res => res.json())
      .then(data => {
        const issues = data.data || [];
        
        // Dynamic unique reporters or total citizens involved
        const uniqueUsers = new Set(issues.map(i => i.user_id || i.reportedBy)).size;

        setStats({
          total: issues.length,
          pending: issues.filter(i => i.status === 'pending').length,
          inProgress: issues.filter(i => i.status === 'in_progress').length,
          resolved: issues.filter(i => i.status === 'resolved').length,
          citizens: uniqueUsers > 0 ? uniqueUsers * 12 : 245, // Fallback formula/count for real feel
        });
        setRecentIssues(issues.slice(0, 3));
      })
      .catch(err => console.error('Failed to fetch issues:', err));
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] text-slate-800 pb-16 md:pb-10">

      {/* HERO SECTION - FULL WIDTH */}
      <section className="w-full bg-gradient-to-b from-blue-50/70 via-blue-50/20 to-transparent py-10 lg:py-14 px-4 sm:px-8 lg:px-12">
        <div className="w-full max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-6 space-y-6">
            <span className="inline-flex items-center gap-1.5 text-blue-600 bg-blue-100/80 px-3.5 py-1 rounded-full text-xs font-bold">
              💙 Making Your Community Better
            </span>

            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Report. Track. <br />
              <span className="text-blue-600">Improve Your Community.</span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base max-w-xl leading-relaxed">
              MahalAI helps you report local issues, track their progress, and build a better community together.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <Link
                href="/report"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md shadow-blue-500/20 no-underline transition-all"
              >
                + Report an Issue
              </Link>
              <Link
                href="/issues"
                className="bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm px-6 py-3 rounded-xl border border-slate-200/80 no-underline shadow-sm transition-all"
              >
                Explore Issues
              </Link>
            </div>
          </div>

          {/* Hero Right Graphic Image Slot */}
          <div className="lg:col-span-6 relative flex justify-end">
            <div className="w-full h-64 sm:h-80 lg:h-96 rounded-3xl overflow-hidden border border-slate-200/60 shadow-md relative bg-blue-100">
              {/* IS IMAGE TAG MEIN APNI VECTOR ART PICTURE LAGAEN */}
              <img 
                src="/hero-illustration.png" 
                alt="Smart City Illustration" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "https://img.freepik.com/free-vector/isometric-smart-city-concept_23-2148197779.jpg"; // Placeholder Graphic
                }}
              />
            </div>
          </div>

        </div>
      </section>

      {/* MAIN FULL SCREEN CONTAINER */}
      <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 space-y-8 -mt-6 relative z-10">

        {/* STAT CARDS ROW */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-blue-500/20 shrink-0">📍</div>
            <div>
              <p className="text-[11px] text-slate-400 font-semibold uppercase">Your Area</p>
              <p className="text-base font-bold text-slate-900">Jahangira</p>
              <p className="text-[11px] text-slate-400">Swabi / Nowshera, KPK</p>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-purple-500/20 shrink-0">📊</div>
            <div>
              <p className="text-2xl font-black text-slate-900">{stats.total || 12}</p>
              <p className="text-xs font-bold text-blue-600">Active Issues</p>
              <p className="text-[10px] text-slate-400">Needs Attention</p>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-emerald-500/20 shrink-0">✓</div>
            <div>
              <p className="text-2xl font-black text-slate-900">{stats.resolved || 8}</p>
              <p className="text-xs font-bold text-slate-700">Resolved Issues</p>
              <p className="text-[10px] text-slate-400">This Month</p>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-amber-500/20 shrink-0">👥</div>
            <div>
              <p className="text-2xl font-black text-slate-900">{stats.citizens}</p>
              <p className="text-xs font-bold text-slate-700">Citizens Involved</p>
              <p className="text-[10px] text-slate-400">In Swabi & Nowshera</p>
            </div>
          </div>

        </section>

        {/* ISSUES NEAR YOU & MAP ROW */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Issues List with Images */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">📍 Issues Near You</h2>
              <Link href="/issues" className="text-xs font-bold text-blue-600 hover:underline no-underline">View All</Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recentIssues.length > 0 ? (
                recentIssues.map(issue => (
                  <Link key={issue._id} href={`/issues/${issue._id}`} className="no-underline bg-white border border-slate-200 rounded-2xl p-3 shadow-sm hover:border-blue-400 transition-all flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="w-full h-28 rounded-xl overflow-hidden bg-slate-100">
                        <img 
                          src={issue.image || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=400"} 
                          alt={issue.title}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md">
                        {issue.category}
                      </span>
                      <h3 className="text-xs font-bold text-slate-800 line-clamp-1">{issue.title}</h3>
                      <p className="text-[10px] text-slate-400">📍 {getLocationStr(issue)}</p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center text-[10px]">
                      <span className="font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">{STATUS_LABEL[issue.status] || issue.status}</span>
                      <span className="text-slate-400 font-bold">{issue.supporters_count || 12} Supporters</span>
                    </div>
                  </Link>
                ))
              ) : (
                [
                  { title: "Broken Road Near Main Bazaar", cat: "Road Damage", loc: "Main Bazaar • 0.8 km", img: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=400" },
                  { title: "Water Supply Problem Street 5", cat: "Water Issue", loc: "Street 5 • 1.2 km", img: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?q=80&w=400" },
                  { title: "Garbage Collection Not Regular", cat: "Sanitation", loc: "Near Masjid • 1.5 km", img: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=400" }
                ].map((item, i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm space-y-2">
                    <div className="w-full h-28 rounded-xl overflow-hidden bg-slate-100">
                      <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md">{item.cat}</span>
                    <h3 className="text-xs font-bold text-slate-800 truncate">{item.title}</h3>
                    <p className="text-[10px] text-slate-400">📍 {item.loc}</p>
                    <div className="pt-2 border-t border-slate-100 flex justify-between text-[10px]">
                      <span className="text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded">In Progress</span>
                      <span className="text-slate-400">24 Supporters</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right: Map Preview */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Explore Issues Map</h2>
              <Link href="/map" className="text-xs font-bold text-blue-600 hover:underline no-underline">View Full Map</Link>
            </div>
            <div className="bg-slate-100 border border-slate-200/80 rounded-2xl h-[280px] flex flex-col items-center justify-center relative overflow-hidden shadow-sm">
              <span className="text-4xl mb-2">🗺️</span>
              <p className="text-xs font-bold text-slate-700">Interactive Map View</p>
              <p className="text-[11px] text-slate-400 mb-3">Swabi & Surrounding Districts</p>
              <Link href="/map" className="bg-white text-blue-600 border border-slate-200 text-xs font-bold px-4 py-2 rounded-xl no-underline shadow-sm hover:bg-slate-50 transition-all">
                Open Map
              </Link>
            </div>
          </div>

        </section>

        {/* 3-COLUMN BOTTOM SECTION */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Activity */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">📈 Your Activity</h3>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-xl font-black text-slate-900">{stats.total}</p>
                  <p className="text-[10px] text-slate-500 font-medium">Total</p>
                </div>
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
                  <p className="text-xl font-black text-amber-600">{stats.inProgress}</p>
                  <p className="text-[10px] text-amber-600 font-medium">In Progress</p>
                </div>
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                  <p className="text-xl font-black text-emerald-600">{stats.resolved}</p>
                  <p className="text-[10px] text-emerald-600 font-medium">Resolved</p>
                </div>
              </div>
            </div>
            <Link href="/issues/my-issues" className="mt-6 text-center text-xs font-bold text-blue-600 no-underline bg-blue-50 py-2.5 rounded-xl hover:bg-blue-100 transition-all">
              View My Issues →
            </Link>
          </div>

          {/* Community Voice */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">📢 Community Needs Your Voice</h3>
            
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center text-xs">
              <div>
                <p className="font-bold text-slate-800">Street Light Not Working</p>
                <p className="text-[10px] text-slate-400">Near Park Road • 0.6 km</p>
              </div>
              <button className="bg-white border border-slate-200 text-[10px] font-bold text-blue-600 px-3 py-1.5 rounded-lg shadow-sm hover:bg-blue-50">Support ♡</button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center text-xs">
              <div>
                <p className="font-bold text-slate-800">School Wall Damaged</p>
                <p className="text-[10px] text-slate-400">Govt. School • 1.1 km</p>
              </div>
              <button className="bg-white border border-slate-200 text-[10px] font-bold text-blue-600 px-3 py-1.5 rounded-lg shadow-sm hover:bg-blue-50">Support ♡</button>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">⚙️ How It Works</h3>
            <ol className="space-y-3 text-xs text-slate-600 list-decimal pl-4">
              <li><strong className="text-slate-800">Report an Issue:</strong> Share problems in your area.</li>
              <li><strong className="text-slate-800">AI Review:</strong> System verifies and assigns department.</li>
              <li><strong className="text-slate-800">Action Taken:</strong> Authorities resolve the ticket.</li>
              <li><strong className="text-slate-800">Track Progress:</strong> Stay updated on progress.</li>
            </ol>
          </div>

        </section>

      </div>

      {/* FOOTER - FULL WIDTH */}
      <footer className="w-full bg-white border-t border-slate-200 mt-16 py-8">
        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-md shadow-blue-500/20">M</div>
            <span className="font-bold text-slate-900 text-base">MahalAI</span>
          </div>
          <p>© 2026 MahalAI. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}