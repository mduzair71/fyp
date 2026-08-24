// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';

// function getLocationStr(issue) {
//   if (!issue.location) return issue.location_area ? `${issue.location_area}, ${issue.location_district || ''}` : '—';
//   if (typeof issue.location === 'string') return issue.location;
//   const loc = issue.location;
//   return [loc.area, loc.district].filter(Boolean).join(', ') || '—';
// }

// export default function MyIssuesPage() {
//   const router = useRouter();
//   const [issues, setIssues] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   // useEffect(() => {
//   //   const userId = localStorage.getItem('user_id');
//   //   console.log('[MyIssues] localStorage user_id:', userId); // 👈 DEBUG

//   //   if (!userId) {
//   //     router.push('/login');
//   //     return;
//   //   }

//   //   const url = `http://localhost:8000/issues/user/${userId}`;
//   //   console.log('[MyIssues] fetching:', url); // 👈 DEBUG

//   //   fetch(url)
//   //     .then(async (res) => {
//   //       console.log('[MyIssues] response status:', res.status); // 👈 DEBUG
//   //       const data = await res.json();
//   //       console.log('[MyIssues] response body:', data); // 👈 DEBUG — check this in console!
//   //       if (!res.ok) {
//   //         throw new Error(data.detail || `Request failed with status ${res.status}`);
//   //       }
//   //       return data;
//   //     })
//   //     .then((data) => {
//   //       setIssues(data.data || []);
//   //       setLoading(false);
//   //     })
//   //     .catch((err) => {
//   //       console.error('[MyIssues] fetch error:', err); // 👈 DEBUG
//   //       setError(err.message);
//   //       setLoading(false);
//   //     });
//   // }, [router]);
// useEffect(() => {
//   const userId = localStorage.getItem('user_id');

//   if (!userId) {
//     router.push('/login');
//     return;
//   }

//   const url = `http://localhost:8000/issues/user/${userId}`;

//   fetch(url, { credentials: 'include' })   // 👈 ye change
//     .then(async (res) => {
//       const data = await res.json();
//       if (!res.ok) {
//         throw new Error(data.detail || `Request failed with status ${res.status}`);
//       }
//       return data;
//     })
//     .then((data) => {
//       setIssues(data.data || []);
//       setLoading(false);
//     })
//     .catch((err) => {
//       setError(err.message);
//       setLoading(false);
//     });
// }, [router]);
//   const statusConfig = {
//     pending:     { bg: 'rgba(234,179,8,0.1)',  color: '#a16207', label: 'Pending' },
//     in_progress: { bg: 'rgba(59,130,246,0.1)', color: '#1d4ed8', label: 'In Progress' },
//     resolved:    { bg: 'rgba(22,163,74,0.1)',  color: '#15803d', label: 'Resolved' },
//   };

//   const S = {
//     page:    { minHeight: '100vh', background: '#f8fafc', color: '#111827', fontFamily: "'Inter','Segoe UI',sans-serif" },
//     inner:   { maxWidth: '800px', margin: '0 auto', padding: '3rem 1.5rem' },
//     heading: { fontSize: '1.6rem', fontWeight: 700, color: '#111827', margin: '0 0 0.25rem' },
//     sub:     { color: '#6b7280', fontSize: '0.85rem', margin: 0 },
//     btn:     { display: 'flex', alignItems: 'center', gap: '6px', background: '#16a34a', color: '#fff', padding: '0.55rem 1rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' },
//     card:    { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '14px', padding: '1.2rem 1.4rem', marginBottom: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
//   };

//   if (loading) return (
//     <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//       <div style={{ textAlign: 'center' }}>
//         <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Loading your issues...</p>
//       </div>
//     </div>
//   );

//   if (error) return (
//     <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//       <p style={{ color: '#ef4444', fontSize: '0.9rem' }}>Something went wrong: {error}</p>
//     </div>
//   );

//   return (
//     <div style={S.page}>
//       <div style={S.inner}>
//         <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem' }}>
//           <div>
//             <h1 style={S.heading}>My Reported Issues</h1>
//             <p style={S.sub}>{issues.length} issue{issues.length !== 1 ? 's' : ''} you've submitted</p>
//           </div>
//           <Link href="/report" style={S.btn}>+ Report Issue</Link>
//         </div>

//         {issues.length === 0 ? (
//           <div style={{ textAlign: 'center', padding: '4rem 0', border: '1px dashed #d1d5db', borderRadius: '16px', background: '#ffffff' }}>
//             <p style={{ fontSize: '2.5rem', margin: '0 0 0.75rem' }}>📭</p>
//             <p style={{ color: '#6b7280', marginBottom: '0.75rem' }}>You haven't reported anything yet</p>
//             <Link href="/report" style={{ color: '#16a34a', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
//               Report your first issue →
//             </Link>
//           </div>
//         ) : (
//           <div>
//             {issues.map(issue => {
//               const s = statusConfig[issue.status] || statusConfig.pending;
//               return (
//                 <Link key={issue._id} href={`/issues/${issue._id}`} style={{textDecoration: 'none'}}>
//                   <div style={S.card}>
//                     <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.5rem' }}>
//                       <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: 0 }}>{issue.title}</h3>
//                       <span style={{ padding: '0.22rem 0.6rem', borderRadius: '20px', background: s.bg, color: s.color, fontSize: '0.72rem', fontWeight: 700, flexShrink: 0 }}>{s.label}</span>
//                     </div>
//                     {issue.summary && <p style={{ color: '#6b7280', fontSize: '0.82rem', margin: '0 0 0.5rem' }}>{issue.summary}</p>}
//                     <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#6b7280' }}>
//                       <span>📍 {getLocationStr(issue)}</span>
//                       {issue.category && <span>🏷️ {issue.category}</span>}
//                     </div>
//                   </div>
//                 </Link>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function getLocationStr(issue) {
  if (!issue.location) return issue.location_area ? `${issue.location_area}, ${issue.location_district || ''}` : '—';
  if (typeof issue.location === 'string') return issue.location;
  const loc = issue.location;
  return [loc.area, loc.district].filter(Boolean).join(', ') || '—';
}

export default function MyIssuesDashboard() {
  const router = useRouter();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');

  useEffect(() => {
    const userId = localStorage.getItem('user_id');

    // app/my-issues/page.js inside useEffect:
if (!userId) {
  router.push('/citizen/login'); // Sahi path update karein
  return;
}
    const url = `http://localhost:8000/issues/user/${userId}`;

    fetch(url, { credentials: 'include' })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.detail || `Request failed with status ${res.status}`);
        }
        return data;
      })
      .then((data) => {
        setIssues(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [router]);

  const statusConfig = {
    PENDING:     { bg: '#fef3c7', color: '#b45309', border: '#fde68a', dot: '#d97706', label: 'Pending', icon: '⚡' },
    IN_PROGRESS: { bg: '#dbeafe', color: '#1d4ed8', border: '#bfdbfe', dot: '#2563eb', label: 'In Progress', icon: '🚀' },
    RESOLVED:    { bg: '#dcfce7', color: '#15803d', border: '#bbf7d0', dot: '#16a34a', label: 'Resolved', icon: '✅' },
    REJECTED:    { bg: '#fee2e2', color: '#b91c1c', border: '#fca5a5', dot: '#dc2626', label: 'Rejected', icon: '❌' },
  };

  const getNormalizedStatus = (status) => {
    if (!status) return 'PENDING';
    const upper = status.toUpperCase();
    return statusConfig[upper] ? upper : 'PENDING';
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
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', color: '#0284c7' }}>
        <div style={{ width: '42px', height: '42px', border: '4px solid #e2e8f0', borderTopColor: '#0284c7', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ marginTop: '1rem', fontWeight: 700, fontSize: '0.95rem', color: '#64748b' }}>Loading your dashboard...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '1.5rem' }}>
        <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '20px', border: '1px solid #fca5a5', textAlign: 'center', maxWidth: '420px', boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.1)' }}>
          <p style={{ fontSize: '2.5rem', margin: 0 }}>🚨</p>
          <h3 style={{ color: '#dc2626', margin: '0.5rem 0' }}>Dashboard Sync Error</h3>
          <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '1.5rem' }}>{error}</p>
          <button onClick={() => window.location.reload()} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '0.7rem 1.4rem', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', width: '100%', background: '#f8fafc', color: '#0f172a', fontFamily: "'Plus Jakarta Sans', sans-serif", paddingBottom: '5rem' }}>
      
      {/* Dynamic Background Accents */}
      <div style={{ position: 'fixed', top: 0, left: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', top: '250px', right: '5%', width: '450px', height: '450px', background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none' }} />

      {/* Bright Header Banner */}
      <div style={{ background: 'linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)', borderBottom: '1px solid #e2e8f0', padding: '3.5rem 1.5rem 2.5rem', boxShadow: '0 4px 20px -5px rgba(0,0,0,0.03)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '20px', background: '#e0e7ff', border: '1px solid #c7d2fe', color: '#4338ca', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
              User Workspace
            </span>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, color: '#0f172a', letterSpacing: '-0.02em' }}>
              My Issues Console
            </h1>
            <p style={{ color: '#64748b', margin: '0.4rem 0 0', fontSize: '0.95rem' }}>Real-time state tracking and resolution monitoring.</p>
          </div>

          <Link href="/report" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#ffffff', padding: '0.8rem 1.5rem', borderRadius: '12px', fontWeight: 800, textDecoration: 'none', fontSize: '0.9rem', boxShadow: '0 8px 20px -4px rgba(16,185,129,0.4)', transition: 'all 0.2s ease' }}>
            <span>+</span> Report New Issue
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem', position: 'relative', zIndex: 1 }}>
        
        {/* Light Analytics Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.03)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Reported</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '0.4rem' }}>
              <p style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>{metrics.total}</p>
              <span style={{ fontSize: '1.2rem' }}>📋</span>
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #fef3c7', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 4px 6px -1px rgba(245, 158, 11, 0.05)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pending</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '0.4rem' }}>
              <p style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: '#d97706' }}>{metrics.pending}</p>
              <span style={{ fontSize: '1.2rem' }}>⚡</span>
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #dbeafe', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.05)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>In Progress</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '0.4rem' }}>
              <p style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: '#2563eb' }}>{metrics.inProgress}</p>
              <span style={{ fontSize: '1.2rem' }}>🚀</span>
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #dcfce7', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 4px 6px -1px rgba(34, 197, 94, 0.05)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Resolved</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '0.4rem' }}>
              <p style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: '#16a34a' }}>{metrics.resolved}</p>
              <span style={{ fontSize: '1.2rem' }}>✅</span>
            </div>
          </div>

        </div>

        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.6rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.85rem', marginBottom: '1.75rem', overflowX: 'auto' }}>
          {[
            { id: 'ALL', label: `All Issues (${metrics.total})` },
            { id: 'PENDING', label: `⚡ Pending (${metrics.pending})` },
            { id: 'IN_PROGRESS', label: `🚀 In Progress (${metrics.inProgress})` },
            { id: 'RESOLVED', label: `✅ Resolved (${metrics.resolved})` },
            { id: 'REJECTED', label: `❌ Rejected (${metrics.rejected})` },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '0.65rem 1.2rem',
                  borderRadius: '12px',
                  border: isActive ? 'none' : '1px solid #e2e8f0',
                  background: isActive ? 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)' : '#ffffff',
                  color: isActive ? '#ffffff' : '#64748b',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: isActive ? '0 4px 12px rgba(79, 70, 229, 0.3)' : '0 1px 2px rgba(0,0,0,0.02)',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Issues List Container */}
        {filteredIssues.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1.5rem', background: '#ffffff', borderRadius: '20px', border: '2px dashed #cbd5e1' }}>
            <p style={{ fontSize: '3rem', margin: '0 0 0.5rem' }}>📂</p>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#334155', margin: 0 }}>No Records Available</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.4rem' }}>
              {issues.length === 0 ? "You haven't filed any civic issue tickets yet." : "There are no reports filed under this active filter."}
            </p>
            {issues.length === 0 && (
              <Link href="/report" style={{ display: 'inline-block', marginTop: '1.2rem', color: '#059669', fontSize: '0.9rem', fontWeight: 800, textDecoration: 'none' }}>
                Create your first report →
              </Link>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
            {filteredIssues.map((issue) => {
              const stKey = getNormalizedStatus(issue.status);
              const status = statusConfig[stKey];

              return (
                <Link key={issue._id} href={`/issues/${issue._id}`} style={{ textDecoration: 'none' }}>
                  <div
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '18px',
                      padding: '1.4rem 1.6rem',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#818cf8';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 12px 24px -8px rgba(99,102,241,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        {issue.category && (
                          <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#0284c7', background: '#e0f2fe', border: '1px solid #bae6fd', padding: '0.2rem 0.65rem', borderRadius: '8px' }}>
                            {issue.category}
                          </span>
                        )}
                      </div>

                      <span style={{
                        padding: '0.35rem 0.85rem',
                        borderRadius: '20px',
                        background: status.bg,
                        color: status.color,
                        border: `1px solid ${status.border}`,
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: status.dot }} />
                        {status.label}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem', lineHeight: 1.35 }}>
                      {issue.title}
                    </h3>

                    {issue.summary && (
                      <p style={{ color: '#475569', fontSize: '0.88rem', margin: '0 0 1rem', lineHeight: 1.5 }}>
                        {issue.summary}
                      </p>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', fontSize: '0.8rem', color: '#64748b', paddingTop: '0.85rem', borderTop: '1px solid #f1f5f9', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#334155', fontWeight: 600 }}>
                        📍 {getLocationStr(issue)}
                      </span>

                      {issue.createdAt && (
                        <span>
                          🕒 {new Date(issue.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      )}
                    </div>

                  </div>
                </Link>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}