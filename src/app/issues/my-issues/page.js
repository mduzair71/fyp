// // // 'use client';

// // // import { useState, useEffect } from 'react';
// // // import { useRouter } from 'next/navigation';
// // // import Link from 'next/link';

// // // function getLocationStr(issue) {
// // //   if (!issue.location) return issue.location_area ? `${issue.location_area}, ${issue.location_district || ''}` : '—';
// // //   if (typeof issue.location === 'string') return issue.location;
// // //   const loc = issue.location;
// // //   return [loc.area, loc.district].filter(Boolean).join(', ') || '—';
// // // }

// // // export default function MyIssuesPage() {
// // //   const router = useRouter();
// // //   const [issues, setIssues] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState('');

// // //   // useEffect(() => {
// // //   //   const userId = localStorage.getItem('user_id');
// // //   //   console.log('[MyIssues] localStorage user_id:', userId); // 👈 DEBUG

// // //   //   if (!userId) {
// // //   //     router.push('/login');
// // //   //     return;
// // //   //   }

// // //   //   const url = `http://localhost:8000/issues/user/${userId}`;
// // //   //   console.log('[MyIssues] fetching:', url); // 👈 DEBUG

// // //   //   fetch(url)
// // //   //     .then(async (res) => {
// // //   //       console.log('[MyIssues] response status:', res.status); // 👈 DEBUG
// // //   //       const data = await res.json();
// // //   //       console.log('[MyIssues] response body:', data); // 👈 DEBUG — check this in console!
// // //   //       if (!res.ok) {
// // //   //         throw new Error(data.detail || `Request failed with status ${res.status}`);
// // //   //       }
// // //   //       return data;
// // //   //     })
// // //   //     .then((data) => {
// // //   //       setIssues(data.data || []);
// // //   //       setLoading(false);
// // //   //     })
// // //   //     .catch((err) => {
// // //   //       console.error('[MyIssues] fetch error:', err); // 👈 DEBUG
// // //   //       setError(err.message);
// // //   //       setLoading(false);
// // //   //     });
// // //   // }, [router]);
// // // useEffect(() => {
// // //   const userId = localStorage.getItem('user_id');

// // //   if (!userId) {
// // //     router.push('/login');
// // //     return;
// // //   }

// // //   const url = `http://localhost:8000/issues/user/${userId}`;

// // //   fetch(url, { credentials: 'include' })   // 👈 ye change
// // //     .then(async (res) => {
// // //       const data = await res.json();
// // //       if (!res.ok) {
// // //         throw new Error(data.detail || `Request failed with status ${res.status}`);
// // //       }
// // //       return data;
// // //     })
// // //     .then((data) => {
// // //       setIssues(data.data || []);
// // //       setLoading(false);
// // //     })
// // //     .catch((err) => {
// // //       setError(err.message);
// // //       setLoading(false);
// // //     });
// // // }, [router]);
// // //   const statusConfig = {
// // //     pending:     { bg: 'rgba(234,179,8,0.1)',  color: '#a16207', label: 'Pending' },
// // //     in_progress: { bg: 'rgba(59,130,246,0.1)', color: '#1d4ed8', label: 'In Progress' },
// // //     resolved:    { bg: 'rgba(22,163,74,0.1)',  color: '#15803d', label: 'Resolved' },
// // //   };

// // //   const S = {
// // //     page:    { minHeight: '100vh', background: '#f8fafc', color: '#111827', fontFamily: "'Inter','Segoe UI',sans-serif" },
// // //     inner:   { maxWidth: '800px', margin: '0 auto', padding: '3rem 1.5rem' },
// // //     heading: { fontSize: '1.6rem', fontWeight: 700, color: '#111827', margin: '0 0 0.25rem' },
// // //     sub:     { color: '#6b7280', fontSize: '0.85rem', margin: 0 },
// // //     btn:     { display: 'flex', alignItems: 'center', gap: '6px', background: '#16a34a', color: '#fff', padding: '0.55rem 1rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' },
// // //     card:    { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '14px', padding: '1.2rem 1.4rem', marginBottom: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
// // //   };

// // //   if (loading) return (
// // //     <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
// // //       <div style={{ textAlign: 'center' }}>
// // //         <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Loading your issues...</p>
// // //       </div>
// // //     </div>
// // //   );

// // //   if (error) return (
// // //     <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
// // //       <p style={{ color: '#ef4444', fontSize: '0.9rem' }}>Something went wrong: {error}</p>
// // //     </div>
// // //   );

// // //   return (
// // //     <div style={S.page}>
// // //       <div style={S.inner}>
// // //         <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem' }}>
// // //           <div>
// // //             <h1 style={S.heading}>My Reported Issues</h1>
// // //             <p style={S.sub}>{issues.length} issue{issues.length !== 1 ? 's' : ''} you've submitted</p>
// // //           </div>
// // //           <Link href="/report" style={S.btn}>+ Report Issue</Link>
// // //         </div>

// // //         {issues.length === 0 ? (
// // //           <div style={{ textAlign: 'center', padding: '4rem 0', border: '1px dashed #d1d5db', borderRadius: '16px', background: '#ffffff' }}>
// // //             <p style={{ fontSize: '2.5rem', margin: '0 0 0.75rem' }}>📭</p>
// // //             <p style={{ color: '#6b7280', marginBottom: '0.75rem' }}>You haven't reported anything yet</p>
// // //             <Link href="/report" style={{ color: '#16a34a', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
// // //               Report your first issue →
// // //             </Link>
// // //           </div>
// // //         ) : (
// // //           <div>
// // //             {issues.map(issue => {
// // //               const s = statusConfig[issue.status] || statusConfig.pending;
// // //               return (
// // //                 <Link key={issue._id} href={`/issues/${issue._id}`} style={{textDecoration: 'none'}}>
// // //                   <div style={S.card}>
// // //                     <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.5rem' }}>
// // //                       <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: 0 }}>{issue.title}</h3>
// // //                       <span style={{ padding: '0.22rem 0.6rem', borderRadius: '20px', background: s.bg, color: s.color, fontSize: '0.72rem', fontWeight: 700, flexShrink: 0 }}>{s.label}</span>
// // //                     </div>
// // //                     {issue.summary && <p style={{ color: '#6b7280', fontSize: '0.82rem', margin: '0 0 0.5rem' }}>{issue.summary}</p>}
// // //                     <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#6b7280' }}>
// // //                       <span>📍 {getLocationStr(issue)}</span>
// // //                       {issue.category && <span>🏷️ {issue.category}</span>}
// // //                     </div>
// // //                   </div>
// // //                 </Link>
// // //               );
// // //             })}
// // //           </div>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // 'use client';

// // import { useState, useEffect, useMemo } from 'react';
// // import { useRouter } from 'next/navigation';
// // import Link from 'next/link';

// // function getLocationStr(issue) {
// //   if (!issue.location) return issue.location_area ? `${issue.location_area}, ${issue.location_district || ''}` : '—';
// //   if (typeof issue.location === 'string') return issue.location;
// //   const loc = issue.location;
// //   return [loc.area, loc.district].filter(Boolean).join(', ') || '—';
// // }

// // export default function MyIssuesDashboard() {
// //   const router = useRouter();
// //   const [issues, setIssues] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState('');
// //   const [activeTab, setActiveTab] = useState('ALL');

// //   useEffect(() => {
// //     const userId = localStorage.getItem('user_id');

// //     // app/my-issues/page.js inside useEffect:
// // if (!userId) {
// //   router.push('/citizen/login'); // Sahi path update karein
// //   return;
// // }
// //     const url = `http://localhost:8000/issues/user/${userId}`;

// //     fetch(url, { credentials: 'include' })
// //       .then(async (res) => {
// //         const data = await res.json();
// //         if (!res.ok) {
// //           throw new Error(data.detail || `Request failed with status ${res.status}`);
// //         }
// //         return data;
// //       })
// //       .then((data) => {
// //         setIssues(data.data || []);
// //         setLoading(false);
// //       })
// //       .catch((err) => {
// //         setError(err.message);
// //         setLoading(false);
// //       });
// //   }, [router]);

// //   const statusConfig = {
// //     PENDING:     { bg: '#fef3c7', color: '#b45309', border: '#fde68a', dot: '#d97706', label: 'Pending', icon: '⚡' },
// //     IN_PROGRESS: { bg: '#dbeafe', color: '#1d4ed8', border: '#bfdbfe', dot: '#2563eb', label: 'In Progress', icon: '🚀' },
// //     RESOLVED:    { bg: '#dcfce7', color: '#15803d', border: '#bbf7d0', dot: '#16a34a', label: 'Resolved', icon: '✅' },
// //     REJECTED:    { bg: '#fee2e2', color: '#b91c1c', border: '#fca5a5', dot: '#dc2626', label: 'Rejected', icon: '❌' },
// //   };

// //   const getNormalizedStatus = (status) => {
// //     if (!status) return 'PENDING';
// //     const upper = status.toUpperCase();
// //     return statusConfig[upper] ? upper : 'PENDING';
// //   };

// //   const metrics = useMemo(() => {
// //     const counts = { total: issues.length, pending: 0, inProgress: 0, resolved: 0, rejected: 0 };
// //     issues.forEach((issue) => {
// //       const st = getNormalizedStatus(issue.status);
// //       if (st === 'PENDING') counts.pending++;
// //       else if (st === 'IN_PROGRESS') counts.inProgress++;
// //       else if (st === 'RESOLVED') counts.resolved++;
// //       else if (st === 'REJECTED') counts.rejected++;
// //     });
// //     return counts;
// //   }, [issues]);

// //   const filteredIssues = useMemo(() => {
// //     if (activeTab === 'ALL') return issues;
// //     return issues.filter((i) => getNormalizedStatus(i.status) === activeTab);
// //   }, [issues, activeTab]);

// //   if (loading) {
// //     return (
// //       <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', color: '#0284c7' }}>
// //         <div style={{ width: '42px', height: '42px', border: '4px solid #e2e8f0', borderTopColor: '#0284c7', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
// //         <p style={{ marginTop: '1rem', fontWeight: 700, fontSize: '0.95rem', color: '#64748b' }}>Loading your dashboard...</p>
// //         <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '1.5rem' }}>
// //         <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '20px', border: '1px solid #fca5a5', textAlign: 'center', maxWidth: '420px', boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.1)' }}>
// //           <p style={{ fontSize: '2.5rem', margin: 0 }}>🚨</p>
// //           <h3 style={{ color: '#dc2626', margin: '0.5rem 0' }}>Dashboard Sync Error</h3>
// //           <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '1.5rem' }}>{error}</p>
// //           <button onClick={() => window.location.reload()} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '0.7rem 1.4rem', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>
// //             Try Again
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div style={{ minHeight: '100vh', width: '100%', background: '#f8fafc', color: '#0f172a', fontFamily: "'Plus Jakarta Sans', sans-serif", paddingBottom: '5rem' }}>
      
// //       {/* Dynamic Background Accents */}
// //       <div style={{ position: 'fixed', top: 0, left: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none' }} />
// //       <div style={{ position: 'fixed', top: '250px', right: '5%', width: '450px', height: '450px', background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none' }} />

// //       {/* Bright Header Banner */}
// //       <div style={{ background: 'linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)', borderBottom: '1px solid #e2e8f0', padding: '3.5rem 1.5rem 2.5rem', boxShadow: '0 4px 20px -5px rgba(0,0,0,0.03)' }}>
// //         <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
// //           <div>
// //             <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '20px', background: '#e0e7ff', border: '1px solid #c7d2fe', color: '#4338ca', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
// //               User Workspace
// //             </span>
// //             <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, color: '#0f172a', letterSpacing: '-0.02em' }}>
// //               My Issues Console
// //             </h1>
// //             <p style={{ color: '#64748b', margin: '0.4rem 0 0', fontSize: '0.95rem' }}>Real-time state tracking and resolution monitoring.</p>
// //           </div>

// //           <Link href="/report" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#ffffff', padding: '0.8rem 1.5rem', borderRadius: '12px', fontWeight: 800, textDecoration: 'none', fontSize: '0.9rem', boxShadow: '0 8px 20px -4px rgba(16,185,129,0.4)', transition: 'all 0.2s ease' }}>
// //             <span>+</span> Report New Issue
// //           </Link>
// //         </div>
// //       </div>

// //       <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem', position: 'relative', zIndex: 1 }}>
        
// //         {/* Light Analytics Cards Grid */}
// //         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          
// //           <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.03)' }}>
// //             <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Reported</span>
// //             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '0.4rem' }}>
// //               <p style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>{metrics.total}</p>
// //               <span style={{ fontSize: '1.2rem' }}>📋</span>
// //             </div>
// //           </div>

// //           <div style={{ background: '#ffffff', border: '1px solid #fef3c7', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 4px 6px -1px rgba(245, 158, 11, 0.05)' }}>
// //             <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pending</span>
// //             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '0.4rem' }}>
// //               <p style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: '#d97706' }}>{metrics.pending}</p>
// //               <span style={{ fontSize: '1.2rem' }}>⚡</span>
// //             </div>
// //           </div>

// //           <div style={{ background: '#ffffff', border: '1px solid #dbeafe', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.05)' }}>
// //             <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>In Progress</span>
// //             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '0.4rem' }}>
// //               <p style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: '#2563eb' }}>{metrics.inProgress}</p>
// //               <span style={{ fontSize: '1.2rem' }}>🚀</span>
// //             </div>
// //           </div>

// //           <div style={{ background: '#ffffff', border: '1px solid #dcfce7', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 4px 6px -1px rgba(34, 197, 94, 0.05)' }}>
// //             <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Resolved</span>
// //             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '0.4rem' }}>
// //               <p style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: '#16a34a' }}>{metrics.resolved}</p>
// //               <span style={{ fontSize: '1.2rem' }}>✅</span>
// //             </div>
// //           </div>

// //         </div>

// //         {/* Status Filter Tabs */}
// //         <div style={{ display: 'flex', gap: '0.6rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.85rem', marginBottom: '1.75rem', overflowX: 'auto' }}>
// //           {[
// //             { id: 'ALL', label: `All Issues (${metrics.total})` },
// //             { id: 'PENDING', label: `⚡ Pending (${metrics.pending})` },
// //             { id: 'IN_PROGRESS', label: `🚀 In Progress (${metrics.inProgress})` },
// //             { id: 'RESOLVED', label: `✅ Resolved (${metrics.resolved})` },
// //             { id: 'REJECTED', label: `❌ Rejected (${metrics.rejected})` },
// //           ].map((tab) => {
// //             const isActive = activeTab === tab.id;
// //             return (
// //               <button
// //                 key={tab.id}
// //                 onClick={() => setActiveTab(tab.id)}
// //                 style={{
// //                   padding: '0.65rem 1.2rem',
// //                   borderRadius: '12px',
// //                   border: isActive ? 'none' : '1px solid #e2e8f0',
// //                   background: isActive ? 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)' : '#ffffff',
// //                   color: isActive ? '#ffffff' : '#64748b',
// //                   fontWeight: 700,
// //                   fontSize: '0.85rem',
// //                   cursor: 'pointer',
// //                   whiteSpace: 'nowrap',
// //                   boxShadow: isActive ? '0 4px 12px rgba(79, 70, 229, 0.3)' : '0 1px 2px rgba(0,0,0,0.02)',
// //                   transition: 'all 0.15s ease',
// //                 }}
// //               >
// //                 {tab.label}
// //               </button>
// //             );
// //           })}
// //         </div>

// //         {/* Issues List Container */}
// //         {filteredIssues.length === 0 ? (
// //           <div style={{ textAlign: 'center', padding: '4rem 1.5rem', background: '#ffffff', borderRadius: '20px', border: '2px dashed #cbd5e1' }}>
// //             <p style={{ fontSize: '3rem', margin: '0 0 0.5rem' }}>📂</p>
// //             <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#334155', margin: 0 }}>No Records Available</h3>
// //             <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.4rem' }}>
// //               {issues.length === 0 ? "You haven't filed any civic issue tickets yet." : "There are no reports filed under this active filter."}
// //             </p>
// //             {issues.length === 0 && (
// //               <Link href="/report" style={{ display: 'inline-block', marginTop: '1.2rem', color: '#059669', fontSize: '0.9rem', fontWeight: 800, textDecoration: 'none' }}>
// //                 Create your first report →
// //               </Link>
// //             )}
// //           </div>
// //         ) : (
// //           <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
// //             {filteredIssues.map((issue) => {
// //               const stKey = getNormalizedStatus(issue.status);
// //               const status = statusConfig[stKey];

// //               return (
// //                 <Link key={issue._id} href={`/issues/${issue._id}`} style={{ textDecoration: 'none' }}>
// //                   <div
// //                     style={{
// //                       background: '#ffffff',
// //                       border: '1px solid #e2e8f0',
// //                       borderRadius: '18px',
// //                       padding: '1.4rem 1.6rem',
// //                       boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
// //                       transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
// //                       cursor: 'pointer',
// //                       position: 'relative',
// //                       overflow: 'hidden'
// //                     }}
// //                     onMouseEnter={(e) => {
// //                       e.currentTarget.style.borderColor = '#818cf8';
// //                       e.currentTarget.style.transform = 'translateY(-2px)';
// //                       e.currentTarget.style.boxShadow = '0 12px 24px -8px rgba(99,102,241,0.15)';
// //                     }}
// //                     onMouseLeave={(e) => {
// //                       e.currentTarget.style.borderColor = '#e2e8f0';
// //                       e.currentTarget.style.transform = 'translateY(0)';
// //                       e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)';
// //                     }}
// //                   >
// //                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
// //                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
// //                         {issue.category && (
// //                           <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#0284c7', background: '#e0f2fe', border: '1px solid #bae6fd', padding: '0.2rem 0.65rem', borderRadius: '8px' }}>
// //                             {issue.category}
// //                           </span>
// //                         )}
// //                       </div>

// //                       <span style={{
// //                         padding: '0.35rem 0.85rem',
// //                         borderRadius: '20px',
// //                         background: status.bg,
// //                         color: status.color,
// //                         border: `1px solid ${status.border}`,
// //                         fontSize: '0.75rem',
// //                         fontWeight: 800,
// //                         display: 'inline-flex',
// //                         alignItems: 'center',
// //                         gap: '6px'
// //                       }}>
// //                         <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: status.dot }} />
// //                         {status.label}
// //                       </span>
// //                     </div>

// //                     <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem', lineHeight: 1.35 }}>
// //                       {issue.title}
// //                     </h3>

// //                     {issue.summary && (
// //                       <p style={{ color: '#475569', fontSize: '0.88rem', margin: '0 0 1rem', lineHeight: 1.5 }}>
// //                         {issue.summary}
// //                       </p>
// //                     )}

// //                     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', fontSize: '0.8rem', color: '#64748b', paddingTop: '0.85rem', borderTop: '1px solid #f1f5f9', flexWrap: 'wrap' }}>
// //                       <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#334155', fontWeight: 600 }}>
// //                         📍 {getLocationStr(issue)}
// //                       </span>

// //                       {issue.createdAt && (
// //                         <span>
// //                           🕒 {new Date(issue.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
// //                         </span>
// //                       )}
// //                     </div>

// //                   </div>
// //                 </Link>
// //               );
// //             })}
// //           </div>
// //         )}

// //       </div>
// //     </div>
// //   );
// // }




// 'use client';

// import { useState, useEffect, useMemo } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';

// // Backend Image URL Formatter (Fixes 404 local path issues)
// const getImageUrl = (url) => {
//   if (!url) return null;
//   if (url.startsWith('http://') || url.startsWith('https://')) return url;
//   return `http://localhost:8000${url.startsWith('/') ? '' : '/'}${url}`;
// };

// function getLocationStr(issue) {
//   if (!issue) return '—';
//   if (typeof issue.location === 'string') return issue.location;
//   if (issue.location && typeof issue.location === 'object') {
//     return [issue.location.area, issue.location.district].filter(Boolean).join(', ') || '—';
//   }
//   return [issue.location_area, issue.location_district].filter(Boolean).join(', ') || '—';
// }

// export default function MyIssuesDashboard() {
//   const router = useRouter();
//   const [issues, setIssues] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [activeTab, setActiveTab] = useState('ALL');

//   // Selected Issue for Modal Popup
//   const [selectedIssue, setSelectedIssue] = useState(null);

//   useEffect(() => {
//     const userId = localStorage.getItem('user_id');

//     if (!userId) {
//       router.push('/citizen/login');
//       return;
//     }

//     const url = `http://localhost:8000/issues/user/${userId}`;

//     fetch(url, { credentials: 'include' })
//       .then(async (res) => {
//         const data = await res.json();
//         if (!res.ok) {
//           throw new Error(data.detail || `Request failed with status ${res.status}`);
//         }
//         return data;
//       })
//       .then((data) => {
//         const issueList = Array.isArray(data) ? data : (data.data || data.issues || []);
//         setIssues(issueList);
//         setLoading(false);
//       })
//       .catch((err) => {
//         setError(err.message);
//         setLoading(false);
//       });
//   }, [router]);

//   // Status Styling Configuration
//   const statusConfig = {
//     PENDING:     { bg: '#fef3c7', color: '#b45309', border: '#fcd34d', label: 'Pending', icon: '⏳' },
//     IN_PROGRESS: { bg: '#dbeafe', color: '#1d4ed8', border: '#93c5fd', label: 'In Progress', icon: '🔄' },
//     RESOLVED:    { bg: '#dcfce7', color: '#15803d', border: '#86efac', label: 'Resolved', icon: '✅' },
//     REJECTED:    { bg: '#fee2e2', color: '#b91c1c', border: '#fca5a5', label: 'Rejected', icon: '❌' },
//   };

//   const getNormalizedStatus = (status) => {
//     if (!status) return 'PENDING';
//     const upper = status.toUpperCase();
//     return statusConfig[upper] ? upper : 'PENDING';
//   };

//   const metrics = useMemo(() => {
//     const counts = { total: issues.length, pending: 0, inProgress: 0, resolved: 0, rejected: 0 };
//     issues.forEach((issue) => {
//       const st = getNormalizedStatus(issue.status);
//       if (st === 'PENDING') counts.pending++;
//       else if (st === 'IN_PROGRESS') counts.inProgress++;
//       else if (st === 'RESOLVED') counts.resolved++;
//       else if (st === 'REJECTED') counts.rejected++;
//     });
//     return counts;
//   }, [issues]);

//   const filteredIssues = useMemo(() => {
//     if (activeTab === 'ALL') return issues;
//     return issues.filter((i) => getNormalizedStatus(i.status) === activeTab);
//   }, [issues, activeTab]);

//   if (loading) {
//     return (
//       <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f4fbf7]">
//         <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
//         <p className="mt-4 font-bold text-sm text-emerald-800">Loading Mahol AI Workspace...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen w-full flex items-center justify-center bg-[#f4fbf7] p-6">
//         <div className="bg-white p-8 rounded-3xl border border-red-200 text-center max-w-md shadow-xl">
//           <p className="text-4xl m-0">🚨</p>
//           <h3 className="text-red-600 text-lg font-bold my-2">Dashboard Sync Error</h3>
//           <p className="text-slate-500 text-sm mb-6">{error}</p>
//           <button 
//             onClick={() => window.location.reload()} 
//             className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm cursor-pointer border-0 shadow-lg hover:bg-emerald-700 transition-all"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen w-full bg-[#f4fbf7] text-slate-800 font-sans pb-20">
      
//       {/* Mahol AI Styled Header Banner */}
//       <div className="w-full bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-800 text-white pt-10 pb-16 px-6 sm:px-12 border-b border-emerald-900/40">
//         <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//           <div>
//             <span className="inline-block px-3 py-1 bg-emerald-600/50 border border-emerald-400/40 rounded-full text-[11px] font-extrabold uppercase tracking-wider text-emerald-100 mb-2">
//               Citizen Portal
//             </span>
//             <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white m-0">
//               My Issues Console
//             </h1>
//             <p className="text-emerald-100/90 text-sm font-medium mt-1">
//               Track and monitor resolution status of your reported civic problems.
//             </p>
//           </div>

//           <Link 
//             href="/report" 
//             className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl transition-all no-underline"
//           >
//             <span>+</span> Report New Issue
//           </Link>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 sm:px-12 -mt-8 relative z-10">
        
//         {/* Analytics Cards Grid */}
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          
//           <div className="bg-white border border-emerald-100 rounded-2xl p-4 shadow-sm">
//             <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Total Reported</span>
//             <div className="flex justify-between items-baseline mt-1">
//               <p className="text-2xl font-black text-slate-800 m-0">{metrics.total}</p>
//               <span className="text-lg">📋</span>
//             </div>
//           </div>

//           <div className="bg-white border border-amber-100 rounded-2xl p-4 shadow-sm">
//             <span className="text-[11px] font-extrabold text-amber-600 uppercase tracking-wider">Pending</span>
//             <div className="flex justify-between items-baseline mt-1">
//               <p className="text-2xl font-black text-amber-600 m-0">{metrics.pending}</p>
//               <span className="text-lg">⏳</span>
//             </div>
//           </div>

//           <div className="bg-white border border-blue-100 rounded-2xl p-4 shadow-sm">
//             <span className="text-[11px] font-extrabold text-blue-600 uppercase tracking-wider">In Progress</span>
//             <div className="flex justify-between items-baseline mt-1">
//               <p className="text-2xl font-black text-blue-600 m-0">{metrics.inProgress}</p>
//               <span className="text-lg">🔄</span>
//             </div>
//           </div>

//           <div className="bg-white border border-emerald-100 rounded-2xl p-4 shadow-sm">
//             <span className="text-[11px] font-extrabold text-emerald-600 uppercase tracking-wider">Resolved</span>
//             <div className="flex justify-between items-baseline mt-1">
//               <p className="text-2xl font-black text-emerald-600 m-0">{metrics.resolved}</p>
//               <span className="text-lg">✅</span>
//             </div>
//           </div>

//         </div>

//         {/* Filter Tabs */}
//         <div className="flex gap-2 border-b border-emerald-100 pb-3 mb-6 overflow-x-auto">
//           {[
//             { id: 'ALL', label: `All (${metrics.total})` },
//             { id: 'PENDING', label: `⏳ Pending (${metrics.pending})` },
//             { id: 'IN_PROGRESS', label: `🔄 In Progress (${metrics.inProgress})` },
//             { id: 'RESOLVED', label: `✅ Resolved (${metrics.resolved})` },
//             { id: 'REJECTED', label: `❌ Rejected (${metrics.rejected})` },
//           ].map((tab) => {
//             const isActive = activeTab === tab.id;
//             return (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`px-4 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer border ${
//                   isActive 
//                     ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' 
//                     : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'
//                 }`}
//               >
//                 {tab.label}
//               </button>
//             );
//           })}
//         </div>

//         {/* Issues Grid View */}
//         {filteredIssues.length === 0 ? (
//           <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-emerald-200">
//             <p className="text-4xl mb-2">📂</p>
//             <h3 className="text-base font-bold text-slate-700 m-0">No Issues Found</h3>
//             <p className="text-slate-400 text-xs mt-1">
//               {issues.length === 0 ? "You haven't submitted any civic reports yet." : "No reports match the selected status filter."}
//             </p>
//             {issues.length === 0 && (
//               <Link href="/report" className="inline-block mt-4 text-emerald-600 text-xs font-bold no-underline hover:underline">
//                 Create your first report →
//               </Link>
//             )}
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredIssues.map((issue) => {
//               const stKey = getNormalizedStatus(issue.status);
//               const status = statusConfig[stKey];
//               const rawImage = issue.photo_url || issue.image || issue.image_url;
//               const imageUrl = getImageUrl(rawImage);

//               return (
//                 <div
//                   key={issue._id || issue.id}
//                   onClick={() => setSelectedIssue(issue)}
//                   className="bg-white border border-emerald-100 rounded-2xl p-5 flex flex-col justify-between hover:shadow-xl hover:border-emerald-400 transition-all cursor-pointer"
//                 >
//                   <div>
//                     {/* Top Status & Category */}
//                     <div className="flex items-center justify-between gap-2 mb-3">
//                       <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 tracking-wider border border-emerald-200">
//                         {issue.category || 'General'}
//                       </span>
                      
//                       <span 
//                         className="text-[10px] font-bold px-2.5 py-1 rounded-full border"
//                         style={{ color: status.color, backgroundColor: status.bg, borderColor: status.border }}
//                       >
//                         {status.icon} {status.label}
//                       </span>
//                     </div>

//                     {/* Image Preview */}
//                     {imageUrl ? (
//                       <div className="w-full h-40 mb-3 rounded-xl overflow-hidden bg-slate-100 relative border border-slate-100">
//                         <img 
//                           src={imageUrl} 
//                           alt={issue.title}
//                           className="w-full h-full object-cover"
//                           onError={(e) => {
//                             e.currentTarget.style.display = 'none';
//                             e.currentTarget.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-3xl text-emerald-600/40">🏙️</div>';
//                           }}
//                         />
//                       </div>
//                     ) : (
//                       <div className="w-full h-32 mb-3 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-center text-emerald-700/40 text-3xl">
//                         🏙️
//                       </div>
//                     )}

//                     {/* Title & Summary */}
//                     <h3 className="text-sm font-bold text-slate-900 leading-snug mb-1 line-clamp-2">
//                       {issue.title}
//                     </h3>
                    
//                     <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-2">
//                       {issue.summary || issue.description || 'No additional summary provided.'}
//                     </p>
//                   </div>

//                   {/* Footer Location & Date */}
//                   <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
//                     <span className="font-semibold text-slate-700 truncate max-w-[60%]">
//                       📍 {getLocationStr(issue)}
//                     </span>

//                     {issue.createdAt && (
//                       <span className="text-[11px] text-slate-400 font-medium">
//                         🕒 {new Date(issue.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//       </div>

//       {/* Modern Pop-up Modal for Details */}
//       {selectedIssue && (
//         <div 
//           onClick={() => setSelectedIssue(null)} 
//           className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
//         >
//           <div 
//             onClick={(e) => e.stopPropagation()} 
//             className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative border border-emerald-100"
//           >
//             {/* Header */}
//             <div className="flex justify-between items-start gap-4 mb-4">
//               <div>
//                 <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 mb-2 inline-block">
//                   {selectedIssue.category || 'General'}
//                 </span>
//                 <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
//                   {selectedIssue.title}
//                 </h2>
//               </div>
//               <button 
//                 onClick={() => setSelectedIssue(null)} 
//                 className="bg-slate-100 hover:bg-slate-200 text-slate-600 w-8 h-8 rounded-full font-bold cursor-pointer border-0 flex items-center justify-center transition-all"
//               >
//                 ✕
//               </button>
//             </div>

//             {/* Image display in Modal */}
//             {getImageUrl(selectedIssue.photo_url || selectedIssue.image || selectedIssue.image_url) && (
//               <div className="w-full h-56 sm:h-64 rounded-2xl overflow-hidden bg-slate-100 mb-4 border border-slate-200">
//                 <img 
//                   src={getImageUrl(selectedIssue.photo_url || selectedIssue.image || selectedIssue.image_url)} 
//                   alt={selectedIssue.title} 
//                   className="w-full h-full object-cover" 
//                 />
//               </div>
//             )}

//             {/* Content Details */}
//             <div className="space-y-3">
//               <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
//                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Description / Summary</h4>
//                 <p className="text-sm text-slate-700 leading-relaxed m-0">
//                   {selectedIssue.description || selectedIssue.summary || 'No description available for this issue.'}
//                 </p>
//               </div>

//               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-100 text-xs font-medium">
//                 <span className="text-emerald-900">
//                   📍 <strong>Location:</strong> {getLocationStr(selectedIssue)}
//                 </span>
                
//                 {selectedIssue.createdAt && (
//                   <span className="text-emerald-700">
//                     🕒 {new Date(selectedIssue.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
//                   </span>
//                 )}
//               </div>
//             </div>

//             <button 
//               onClick={() => setSelectedIssue(null)} 
//               className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-2xl cursor-pointer border-0 shadow-lg transition-all"
//             >
//               Close Window
//             </button>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Backend Image URL Formatter
const getImageUrl = (photoUrl) => {
  if (!photoUrl) return null;
  if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
    return photoUrl;
  }
  const cleanPath = photoUrl.replace(/^\/+/, '');
  return `http://localhost:8000/${cleanPath}`;
};

// Location Formatter
function getLocationStr(issue) {
  if (!issue) return 'Location details not available';
  if (typeof issue.location === 'string') return issue.location;
  if (issue.location && typeof issue.location === 'object') {
    return [issue.location.area, issue.location.district].filter(Boolean).join(', ') || 'Location details not available';
  }
  return [issue.location_area, issue.location_district].filter(Boolean).join(', ') || 'Location details not available';
}

const STATUS_STEPS = [
  { id: 'PENDING', label: 'Pending', icon: '⏳' },
  { id: 'IN_PROGRESS', label: 'In Progress', icon: '🚀' },
  { id: 'RESOLVED', label: 'Resolved', icon: '✅' },
];

export default function MyIssuesDashboard() {
  const router = useRouter();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');

  // Selected Issue for Full Details Popup Modal
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [supporting, setSupporting] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Status Styling Configuration (Mahol AI Theme)
  const statusConfig = {
    PENDING:     { bg: '#fef3c7', color: '#b45309', border: '#fcd34d', label: 'Pending', icon: '⏳' },
    IN_PROGRESS: { bg: '#dbeafe', color: '#1d4ed8', border: '#93c5fd', label: 'In Progress', icon: '🚀' },
    RESOLVED:    { bg: '#dcfce7', color: '#15803d', border: '#86efac', label: 'Resolved', icon: '✅' },
    REJECTED:    { bg: '#fee2e2', color: '#b91c1c', border: '#fca5a5', label: 'Rejected', icon: '❌' },
  };

  const getNormalizedStatus = (status) => {
    if (!status) return 'PENDING';
    const upper = status.toUpperCase();
    return statusConfig[upper] ? upper : 'PENDING';
  };

  useEffect(() => {
    const userId = localStorage.getItem('user_id');

    if (!userId) {
      router.push('/citizen/login');
      return;
    }

    const url = `http://localhost:8000/issues/user/${userId}`;

    fetch(url, { credentials: 'include' })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || `Request failed with status ${res.status}`);
        return data;
      })
      .then((data) => {
        const issueList = Array.isArray(data) ? data : (data.data || data.issues || []);
        setIssues(issueList);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [router]);

  // Support / Affected Action inside Modal
  const handleSupport = async (issueId) => {
    if (!selectedIssue) return;
    setSupporting(true);
    try {
      const res = await fetch(`http://localhost:8000/issues/${issueId}/support`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to update support status');

      const delta = data.supported ? 1 : -1;
      const updatedCount = Math.max(0, (selectedIssue.support_count || 0) + delta);
      
      const updatedIssue = {
        ...selectedIssue,
        supported: data.supported,
        support_count: updatedCount,
      };

      // Update local states
      setSelectedIssue(updatedIssue);
      setIssues((prevList) =>
        prevList.map((item) =>
          (item._id || item.id) === issueId ? updatedIssue : item
        )
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setSupporting(false);
    }
  };

  const metrics = useMemo(() => {
    const counts = { total: issues.length, pending: 0, inProgress: 0, resolved: 0, rejected: 0 };
    issues.forEach((issue) => {
      const st = getNormalizedStatus(issue.status);
      if (st === 'PENDING') counts.pending++;
      else if (st === 'IN_PROGRESS') counts.inProgress++;
      else if (st === 'RESOLVED') counts.resolved++;
      else if (st === 'REJECTED') counts.rejected++;
    });
    return counts;
  }, [issues]);

  const filteredIssues = useMemo(() => {
    if (activeTab === 'ALL') return issues;
    return issues.filter((i) => getNormalizedStatus(i.status) === activeTab);
  }, [issues, activeTab]);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f4fbf7]">
        <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
        <p className="mt-4 font-bold text-sm text-emerald-800">Loading FixMyCity Workspace...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#f4fbf7] p-6">
        <div className="bg-white p-8 rounded-3xl border border-red-200 text-center max-w-md shadow-xl">
          <p className="text-4xl m-0">🚨</p>
          <h3 className="text-red-600 text-lg font-bold my-2">Dashboard Sync Error</h3>
          <p className="text-slate-500 text-sm mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm cursor-pointer border-0 shadow-lg hover:bg-emerald-700 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#f4fbf7] text-slate-800 font-sans pb-20">
      
      {/* Header Banner */}
      <div className="w-full bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-800 text-white pt-10 pb-16 px-6 sm:px-12 border-b border-emerald-900/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="inline-block px-3 py-1 bg-emerald-600/50 border border-emerald-400/40 rounded-full text-[11px] font-extrabold uppercase tracking-wider text-emerald-100 mb-2">
              Citizen Portal
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white m-0">
              My Compliant Console
            </h1>
            <p className="text-emerald-100/90 text-sm font-medium mt-1">
              Track and monitor resolution status of your reported civic problems.
            </p>
          </div>

          <Link 
            href="/report" 
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl transition-all no-underline"
          >
            <span>+</span> Report New Issue
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 -mt-8 relative z-10">
        
        {/* Analytics Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-emerald-100 rounded-2xl p-4 shadow-sm">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Total Reported</span>
            <div className="flex justify-between items-baseline mt-1">
              <p className="text-2xl font-black text-slate-800 m-0">{metrics.total}</p>
              <span className="text-lg">📋</span>
            </div>
          </div>

          <div className="bg-white border border-amber-100 rounded-2xl p-4 shadow-sm">
            <span className="text-[11px] font-extrabold text-amber-600 uppercase tracking-wider">Pending</span>
            <div className="flex justify-between items-baseline mt-1">
              <p className="text-2xl font-black text-amber-600 m-0">{metrics.pending}</p>
              <span className="text-lg">⏳</span>
            </div>
          </div>

          <div className="bg-white border border-blue-100 rounded-2xl p-4 shadow-sm">
            <span className="text-[11px] font-extrabold text-blue-600 uppercase tracking-wider">In Progress</span>
            <div className="flex justify-between items-baseline mt-1">
              <p className="text-2xl font-black text-blue-600 m-0">{metrics.inProgress}</p>
              <span className="text-lg">🚀</span>
            </div>
          </div>

          <div className="bg-white border border-emerald-100 rounded-2xl p-4 shadow-sm">
            <span className="text-[11px] font-extrabold text-emerald-600 uppercase tracking-wider">Resolved</span>
            <div className="flex justify-between items-baseline mt-1">
              <p className="text-2xl font-black text-emerald-600 m-0">{metrics.resolved}</p>
              <span className="text-lg">✅</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 border-b border-emerald-100 pb-3 mb-6 overflow-x-auto">
          {[
            { id: 'ALL', label: `All (${metrics.total})` },
            { id: 'PENDING', label: `⏳ Pending (${metrics.pending})` },
            { id: 'IN_PROGRESS', label: `🚀 In Progress (${metrics.inProgress})` },
            { id: 'RESOLVED', label: `✅ Resolved (${metrics.resolved})` },
            { id: 'REJECTED', label: `❌ Rejected (${metrics.rejected})` },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer border ${
                  isActive 
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' 
                    : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Issues Grid View */}
        {filteredIssues.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-emerald-200">
            <p className="text-4xl mb-2">📂</p>
            <h3 className="text-base font-bold text-slate-700 m-0">No Compliant Found</h3>
            <p className="text-slate-400 text-xs mt-1">
              {issues.length === 0 ? "You haven't submitted any civic reports yet." : "No reports match the selected status filter."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIssues.map((issue) => {
              const stKey = getNormalizedStatus(issue.status);
              const status = statusConfig[stKey];
              const rawImage = issue.photo_url || issue.image || issue.photo || issue.image_url;
              const imageUrl = getImageUrl(rawImage);

              return (
                <div
                  key={issue._id || issue.id}
                  onClick={() => {
                    setImgError(false);
                    setSelectedIssue(issue);
                  }}
                  className="bg-white border border-emerald-100 rounded-2xl p-5 flex flex-col justify-between hover:shadow-xl hover:border-emerald-400 transition-all cursor-pointer group"
                >
                  <div>
                    {/* Top Status & Category */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 tracking-wider border border-emerald-200">
                        {issue.category || 'General'}
                      </span>
                      
                      <span 
                        className="text-[10px] font-bold px-2.5 py-1 rounded-full border"
                        style={{ color: status.color, backgroundColor: status.bg, borderColor: status.border }}
                      >
                        {status.icon} {status.label}
                      </span>
                    </div>

                    {/* Image Preview */}
                    {imageUrl ? (
                      <div className="w-full h-40 mb-3 rounded-xl overflow-hidden bg-slate-100 relative border border-slate-100">
                        <img 
                          src={imageUrl} 
                          alt={issue.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-3xl text-emerald-600/40">🏙️</div>';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-32 mb-3 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-center text-emerald-700/40 text-3xl">
                        🏙️
                      </div>
                    )}

                    {/* Title & Summary */}
                    <h3 className="text-sm font-bold text-slate-900 leading-snug mb-1 line-clamp-2">
                      {issue.title}
                    </h3>
                    
                    <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-2">
                      {issue.summary || issue.description || 'No additional summary provided.'}
                    </p>
                  </div>

                  {/* Footer Location & Date */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-slate-700 truncate max-w-[60%]">
                      📍 {getLocationStr(issue)}
                    </span>

                    {issue.createdAt && (
                      <span className="text-[11px] text-slate-400 font-medium">
                        🕒 {new Date(issue.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* FULL ISSUE DETAILS MODAL (Merged from [id]/page.js)                       */}
      {/* ========================================================================= */}
      {selectedIssue && (() => {
        const currentStatus = getNormalizedStatus(selectedIssue.status);
        const statusInfo = statusConfig[currentStatus];
        const photoPath = getImageUrl(selectedIssue.photo_url || selectedIssue.image || selectedIssue.photo);
        const activeStepIdx = STATUS_STEPS.findIndex((s) => s.id === currentStatus);
        const targetId = selectedIssue._id || selectedIssue.id;

        return (
          <div 
            onClick={() => setSelectedIssue(null)} 
            className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="bg-white rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative border border-emerald-100 my-auto"
            >
              {/* Modal Top Nav Bar */}
              <div className="flex items-center justify-between gap-4 pb-4 mb-6 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold tracking-widest text-emerald-800 uppercase bg-emerald-100 px-3 py-1 rounded-md border border-emerald-200">
                    {selectedIssue.category || 'General'}
                  </span>
                  <span 
                    className="text-[10px] font-extrabold px-3 py-1 rounded-md border"
                    style={{ color: statusInfo.color, backgroundColor: statusInfo.bg, borderColor: statusInfo.border }}
                  >
                    {statusInfo.icon} {statusInfo.label}
                  </span>
                </div>

                <button 
                  onClick={() => setSelectedIssue(null)} 
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 w-8 h-8 rounded-full font-bold cursor-pointer border-0 flex items-center justify-center transition-all"
                >
                  ✕
                </button>
              </div>

              {/* Title Header & Support Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs font-semibold text-slate-400 mb-1">
                    Reported on {selectedIssue.createdAt ? new Date(selectedIssue.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}
                  </p>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug m-0">
                    {selectedIssue.title}
                  </h2>
                </div>

                <button
                  onClick={() => handleSupport(targetId)}
                  disabled={supporting}
                  className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs transition-all shadow-md self-start sm:self-auto shrink-0 border-0 cursor-pointer ${
                    selectedIssue.supported
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
                  } active:scale-95 disabled:opacity-50`}
                >
                  <span>{selectedIssue.supported ? '✅ Supported' : "🙋 I'm Affected"}</span>
                  <span className="bg-emerald-900/10 px-2 py-0.5 rounded-md text-xs font-mono font-bold">
                    {selectedIssue.support_count || 0}
                  </span>
                </button>
              </div>

              {/* Location & Reporter info */}
              <div className="bg-emerald-50/50 border border-emerald-100 p-3.5 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-6">
                <div className="flex items-center gap-2 text-slate-700">
                  <span>📍</span>
                  <span className="font-semibold">{getLocationStr(selectedIssue)}</span>
                </div>
                {selectedIssue.reporter_name && (
                  <div className="flex items-center gap-2 text-slate-600 sm:justify-end">
                    <span>👤</span>
                    <span>Reported by: <strong className="text-slate-900">{selectedIssue.reporter_name}</strong></span>
                  </div>
                )}
              </div>

              {/* Resolution Status Tracker */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-6">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Resolution Status Tracker</p>
                
                <div className="relative flex items-center justify-between max-w-xl mx-auto">
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />
                  <div
                    className="absolute top-1/2 left-0 h-1 bg-emerald-600 -translate-y-1/2 z-0 transition-all duration-500"
                    style={{
                      width: currentStatus === 'REJECTED' ? '0%' : `${(activeStepIdx / (STATUS_STEPS.length - 1)) * 100}%`,
                    }}
                  />

                  {STATUS_STEPS.map((step, idx) => {
                    const isCompleted = currentStatus !== 'REJECTED' && idx <= activeStepIdx;
                    const isCurrent = currentStatus === step.id;

                    return (
                      <div key={step.id} className="relative z-10 flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                            isCompleted
                              ? 'bg-emerald-600 text-white ring-4 ring-white shadow-md'
                              : 'bg-slate-200 text-slate-400 border border-slate-300'
                          }`}
                        >
                          {step.icon}
                        </div>
                        <span className={`text-xs font-semibold mt-2 ${isCurrent ? 'text-emerald-700' : 'text-slate-400'}`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Description & Photo Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-50 border border-slate-200 rounded-2xl p-5">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Issue Description</h4>
                  <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-wrap m-0">
                    {selectedIssue.description || selectedIssue.summary || 'No detailed description provided for this report.'}
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Attached Photo</h4>

                  {photoPath && !imgError ? (
                    <div className="rounded-xl overflow-hidden border border-slate-200 bg-white flex-1 flex items-center justify-center group relative min-h-[180px]">
                      <img
                        src={photoPath}
                        alt={selectedIssue.title}
                        onError={() => setImgError(true)}
                        className="w-full h-full object-cover max-h-64 transition-transform duration-300 group-hover:scale-105"
                      />
                      <a
                        href={photoPath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-2 right-2 bg-slate-900/80 hover:bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity no-underline"
                      >
                        🔍 View Full
                      </a>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white min-h-[160px] flex flex-col items-center justify-center text-slate-400 text-xs p-4 text-center">
                      <span className="text-2xl mb-1">🖼️</span>
                      <span>{imgError ? 'Failed to load photo attachment' : 'No photo attached'}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer Close Button */}
              <button 
                onClick={() => setSelectedIssue(null)} 
                className="w-full mt-6 bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-2xl cursor-pointer border-0 shadow-md transition-all text-xs"
              >
                Close Details
              </button>
            </div>
          </div>
        );
      })()}

    </div>
  );
}