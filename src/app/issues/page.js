
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
//     PENDING:     { bg: 'rgba(234,179,8,0.1)',  color: '#a16207', label: 'Pending' },
//     IN_PROGRESS: { bg: 'rgba(59,130,246,0.1)', color: '#1d4ed8', label: 'In Progress' },
//     RESOLVED:    { bg: 'rgba(22,163,74,0.1)',  color: '#15803d', label: 'Resolved' },
//     REJECTED:    { bg: 'rgba(239,68,68,0.1)',  color: '#b91c1c', label: 'Rejected' },
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
//               const s = statusConfig[issue.status] || statusConfig.PENDING;
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
import Link from 'next/link';

function getLocationStr(issue) {
  if (!issue.location) return issue.location_area ? `${issue.location_area}, ${issue.location_district || ''}` : '—';
  if (typeof issue.location === 'string') return issue.location;
  const loc = issue.location;
  return [loc.area, loc.district].filter(Boolean).join(', ') || '—';
}

export default function AllIssuesPage() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters State
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [selectedArea, setSelectedArea] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // User Default Location
  const [myDistrict, setMyDistrict] = useState('');
  const [myArea, setMyArea] = useState('');

  useEffect(() => {
    // Localstorage se user ka district/area detect karo
    const district = localStorage.getItem('district') || '';
    const area = localStorage.getItem('area') || '';
    setMyDistrict(district);
    setMyArea(area);

    // Fetch all public issues
    fetch('http://localhost:8000/issues', { credentials: 'include' })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'Failed to fetch issues');
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
  }, []);

  // Status Badges Styling
  const statusConfig = {
    PENDING:     { bg: '#fef3c7', color: '#d97706', border: '#fcd34d', label: 'Pending', icon: '⏳' },
    IN_PROGRESS: { bg: '#dbeafe', color: '#2563eb', border: '#93c5fd', label: 'In Progress', icon: '🔄' },
    RESOLVED:    { bg: '#dcfce7', color: '#16a34a', border: '#86efac', label: 'Resolved', icon: '✅' },
    REJECTED:    { bg: '#fee2e2', color: '#dc2626', border: '#fca5a5', label: 'Rejected', icon: '❌' },
  };

  // Dynamic District & Area Dropdown Options
  const districts = useMemo(() => {
    const set = new Set(issues.map((i) => i.location_district || i.location?.district).filter(Boolean));
    return Array.from(set).sort();
  }, [issues]);

  const areas = useMemo(() => {
    const filtered = issues.filter((i) => {
      const dist = i.location_district || i.location?.district;
      return selectedDistrict === 'ALL' || dist === selectedDistrict;
    });
    const set = new Set(filtered.map((i) => i.location_area || i.location?.area).filter(Boolean));
    return Array.from(set).sort();
  }, [issues, selectedDistrict]);

  // Filtering Logic
  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const issueDist = issue.location_district || issue.location?.district || '';
      const issueArea = issue.location_area || issue.location?.area || '';
      const matchesDistrict = selectedDistrict === 'ALL' || issueDist === selectedDistrict;
      const matchesArea = selectedArea === 'ALL' || issueArea === selectedArea;
      const matchesStatus = selectedStatus === 'ALL' || issue.status === selectedStatus;
      const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (issue.summary && issue.summary.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesDistrict && matchesArea && matchesStatus && matchesSearch;
    });
  }, [issues, selectedDistrict, selectedArea, selectedStatus, searchQuery]);

  const setMyAreaFilter = () => {
    if (myDistrict) setSelectedDistrict(myDistrict);
    if (myArea) setSelectedArea(myArea);
  };

  const clearFilters = () => {
    setSelectedDistrict('ALL');
    setSelectedArea('ALL');
    setSelectedStatus('ALL');
    setSearchQuery('');
  };

  return (
    <div style={{ minHeight: '100vh', width: '100%', backgroundColor: '#f8fafc', color: '#0f172a', fontFamily: "'Inter', sans-serif", paddingBottom: '4rem' }}>
      
      {/* Header Banner - Full Width */}
      <div style={{ background: 'linear-[#0f172a], #1e293b', backgroundColor: '#0f172a', color: '#ffffff', padding: '3.5rem 2rem 2.5rem', borderBottom: '1px solid #334155' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, letterSpacing: '-0.025em' }}>Public Issues Hub</h1>
            <p style={{ color: '#94a3b8', margin: '0.5rem 0 0', fontSize: '1rem' }}>Browse, filter, and track community civic reports in real-time.</p>
          </div>
          <Link href="/report" style={{ backgroundColor: '#16a34a', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '10px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 12px rgba(22,163,74,0.3)', transition: 'all 0.2s' }}>
            + Report New Issue
          </Link>
        </div>
      </div>

      {/* Main Full-Width Container */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        
        {/* Filters Panel */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.25rem 1.5rem', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
          
          {/* Top Row: Search & My Area Shortcut */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="🔍 Search issues by title or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, minWidth: '260px', padding: '0.65rem 1rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '0.9rem', outline: 'none' }}
            />
            {myDistrict && (
              <button onClick={setMyAreaFilter} style={{ backgroundColor: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', padding: '0.65rem 1.2rem', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>
                📍 Show My Area ({myDistrict})
              </button>
            )}
            {(selectedDistrict !== 'ALL' || selectedArea !== 'ALL' || selectedStatus !== 'ALL' || searchQuery) && (
              <button onClick={clearFilters} style={{ backgroundColor: '#f1f5f9', color: '#64748b', border: 'none', padding: '0.65rem 1.2rem', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                Clear Filters
              </button>
            )}
          </div>

          {/* Filter Dropdowns Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            
            {/* District Filter */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.4rem' }}>City / District</label>
              <select value={selectedDistrict} onChange={(e) => { setSelectedDistrict(e.target.value); setSelectedArea('ALL'); }} style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.88rem', backgroundColor: '#fff' }}>
                <option value="ALL">All Districts</option>
                {districts.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            {/* Area Filter */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Local Area</label>
              <select value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)} style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.88rem', backgroundColor: '#fff' }}>
                <option value="ALL">All Areas</option>
                {areas.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Status</label>
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.88rem', backgroundColor: '#fff' }}>
                <option value="ALL">All Statuses</option>
                <option value="PENDING">⏳ Pending</option>
                <option value="IN_PROGRESS">🔄 In Progress</option>
                <option value="RESOLVED">✅ Resolved</option>
                <option value="REJECTED">❌ Rejected</option>
              </select>
            </div>

          </div>
        </div>

        {/* Results Counter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>
            Showing <span style={{ color: '#0f172a', fontWeight: 700 }}>{filteredIssues.length}</span> issues
          </p>
        </div>

        {/* Loading / Error States */}
        {loading && <p style={{ textAlign: 'center', color: '#64748b', padding: '3rem' }}>Loading reported issues...</p>}
        {error && <p style={{ textAlign: 'center', color: '#ef4444', padding: '3rem' }}>Error loading data: {error}</p>}

        {/* Empty State */}
        {!loading && !error && filteredIssues.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
            <p style={{ fontSize: '3rem', margin: 0 }}>🔍</p>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#334155', marginTop: '0.5rem' }}>No issues found</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Try adjusting your filters or search query to find results.</p>
          </div>
        )}

        {/* Issues Grid Display */}
        {!loading && !error && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {filteredIssues.map((issue) => {
              const status = statusConfig[issue.status] || statusConfig.PENDING;
              return (
                <Link key={issue._id} href={`/issues/${issue._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.25rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'transform 0.15s ease, box-shadow 0.15s ease', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 20px -5px rgba(0,0,0,0.08)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)'; }}
                  >
                    <div>
                      {/* Status & Category Bar */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        {issue.category ? (
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#475569', backgroundColor: '#f1f5f9', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                            {issue.category}
                          </span>
                        ) : <div />}
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: status.color, backgroundColor: status.bg, border: `1px solid ${status.border}`, padding: '0.2rem 0.6rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>{status.icon}</span> {status.label}
                        </span>
                      </div>

                      {/* Title & Summary */}
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem', lineHeight: '1.35' }}>
                        {issue.title}
                      </h3>
                      {issue.summary && (
                        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {issue.summary}
                        </p>
                      )}
                    </div>

                    {/* Location Footer */}
                    <div style={{ paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span>📍</span>
                      <span style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {getLocationStr(issue)}
                      </span>
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