
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
  const [selectedCategory, setSelectedCategory] = useState('ALL');
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
    PENDING:     { bg: '#fef3c7', color: '#b45309', border: '#fcd34d', label: 'Pending', icon: '⏳' },
    IN_PROGRESS: { bg: '#dbeafe', color: '#1d4ed8', border: '#93c5fd', label: 'In Progress', icon: '🔄' },
    RESOLVED:    { bg: '#dcfce7', color: '#15803d', border: '#86efac', label: 'Resolved', icon: '✅' },
    REJECTED:    { bg: '#fee2e2', color: '#b91c1c', border: '#fca5a5', label: 'Rejected', icon: '❌' },
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

  // Dynamic Category Dropdown (Case-insensitive unique categories collection)
  const categories = useMemo(() => {
    const set = new Set(
      issues
        .map((i) => i.category)
        .filter(Boolean)
        .map((c) => c.trim())
    );
    return Array.from(set).sort();
  }, [issues]);

  // Filtering Logic
  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const issueDist = issue.location_district || issue.location?.district || '';
      const issueArea = issue.location_area || issue.location?.area || '';
      const issueCategory = issue.category || '';

      const matchesDistrict = selectedDistrict === 'ALL' || issueDist === selectedDistrict;
      const matchesArea = selectedArea === 'ALL' || issueArea === selectedArea;
      const matchesCategory = selectedCategory === 'ALL' || issueCategory.toLowerCase() === selectedCategory.toLowerCase();
      const matchesStatus = selectedStatus === 'ALL' || issue.status === selectedStatus;
      const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (issue.summary && issue.summary.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesDistrict && matchesArea && matchesCategory && matchesStatus && matchesSearch;
    });
  }, [issues, selectedDistrict, selectedArea, selectedCategory, selectedStatus, searchQuery]);

  // Selected Area Specific Stats
  const areaStats = useMemo(() => {
    if (selectedDistrict === 'ALL' && selectedArea === 'ALL') return null;

    const total = filteredIssues.length;
    const resolved = filteredIssues.filter((i) => i.status === 'RESOLVED').length;
    const pending = filteredIssues.filter((i) => i.status === 'PENDING').length;
    const inProgress = filteredIssues.filter((i) => i.status === 'IN_PROGRESS').length;

    return { total, resolved, pending, inProgress };
  }, [filteredIssues, selectedDistrict, selectedArea]);

  const setMyAreaFilter = () => {
    if (myDistrict) setSelectedDistrict(myDistrict);
    if (myArea) setSelectedArea(myArea);
  };

  const clearFilters = () => {
    setSelectedDistrict('ALL');
    setSelectedArea('ALL');
    setSelectedCategory('ALL');
    setSelectedStatus('ALL');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 text-slate-800 font-sans pb-16">
      
      {/* Dark Forest Green Hero Banner */}
      <div className="bg-[#102d21] text-white pt-10 pb-20 px-6 sm:px-10 border-b border-emerald-900/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">
              Public Issues Hub
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              <p className="text-emerald-100/80 text-sm sm:text-base font-medium">
                Browse, filter, and track community civic reports in real-time.
              </p>
              <span className="bg-emerald-900/80 text-emerald-300 text-xs font-bold px-3 py-1 rounded-md border border-emerald-700/50">
                Active Alerts: {issues.length}
              </span>
            </div>
          </div>

          <a 
            href="/report" 
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all no-underline"
          >
            <span>+</span> Report New Issue
          </a>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Floating Glassmorphic Filters Overlapping Banner */}
        <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-xl -mt-10 mb-8 relative z-20">
          
          {/* Top Search Bar & Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
              <input
                type="text"
                placeholder="Search issues by title, keyword, or problem..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
              />
            </div>

            {myDistrict && (
              <button 
                onClick={setMyAreaFilter} 
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <span>📍</span> Show My Area ({myDistrict})
              </button>
            )}

            {(selectedDistrict !== 'ALL' || selectedArea !== 'ALL' || selectedCategory !== 'ALL' || selectedStatus !== 'ALL' || searchQuery) && (
              <button 
                onClick={clearFilters} 
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer border-0"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Filter Dropdowns Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* District Filter */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                City / District
              </label>
              <select 
                value={selectedDistrict} 
                onChange={(e) => { setSelectedDistrict(e.target.value); setSelectedArea('ALL'); }}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold focus:outline-none focus:border-emerald-600"
              >
                <option value="ALL">All Districts</option>
                {districts.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            {/* Area Filter */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Local Area
              </label>
              <select 
                value={selectedArea} 
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold focus:outline-none focus:border-emerald-600"
              >
                <option value="ALL">All Areas</option>
                {areas.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Category / Problem
              </label>
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold focus:outline-none focus:border-emerald-600"
              >
                <option value="ALL">All Categories</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select 
                value={selectedStatus} 
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold focus:outline-none focus:border-emerald-600"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">⏳ Pending</option>
                <option value="IN_PROGRESS">🔄 In Progress</option>
                <option value="RESOLVED">✅ Resolved</option>
                <option value="REJECTED">❌ Rejected</option>
              </select>
            </div>

          </div>
        </div>

        {/* Area Stats Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <p className="text-xs font-semibold text-slate-500 m-0">
            Showing <span className="text-slate-900 font-bold">{filteredIssues.length}</span> issues
          </p>

          {areaStats && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg">
                Total: {areaStats.total}
              </span>
              <span className="text-[11px] font-bold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-lg">
                Pending: {areaStats.pending}
              </span>
              <span className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2.5 py-1 rounded-lg">
                In Progress: {areaStats.inProgress}
              </span>
              <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg">
                Resolved: {areaStats.resolved}
              </span>
            </div>
          )}
        </div>

        {/* Loading / Error States */}
        {loading && <p className="text-center text-slate-500 py-12 text-sm">Loading reported issues...</p>}
        {error && <p className="text-center text-red-500 py-12 text-sm">Error loading data: {error}</p>}

        {/* Empty State */}
        {!loading && !error && filteredIssues.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300">
            <p className="text-4xl mb-2">🔍</p>
            <h3 className="text-base font-bold text-slate-800">No issues found</h3>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your category, area, or status filters.</p>
          </div>
        )}

        {/* Issues Grid Display */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredIssues.map((issue) => {
              const status = statusConfig[issue.status] || statusConfig.PENDING;
              
              // Dynamic Picture Auto-Detection
              const issueImg = issue.image || issue.image_url || issue.picture || issue.media || (Array.isArray(issue.photos) ? issue.photos[0] : null);

              // Multi-Report Counter Logic
              const reportCount = 
                issue.reports_count ?? 
                issue.report_count ?? 
                issue.reported_by_count ?? 
                issue.duplicate_count ??
                (Array.isArray(issue.reports) ? issue.reports.length : undefined) ?? 
                (Array.isArray(issue.reported_by) ? issue.reported_by.length : undefined) ?? 
                (Array.isArray(issue.user_ids) ? issue.user_ids.length : 1);

              return (
                <div key={issue._id} className="bg-white border border-slate-200/90 rounded-2xl p-4 h-full flex flex-col justify-between hover:shadow-md transition-all duration-200">
                  
                  <div>
                    {/* Top Badges Bar */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      {issue.category ? (
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 tracking-wider">
                          {issue.category}
                        </span>
                      ) : <div />}
                      
                      <span 
                        className="text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border"
                        style={{ color: status.color, backgroundColor: status.bg, borderColor: status.border }}
                      >
                        <span>{status.icon}</span> {status.label}
                      </span>
                    </div>

                    {/* Fixed Height Suitable Image Preview */}
                    {issueImg && (
                      <div className="w-full h-40 mb-3 rounded-xl overflow-hidden bg-slate-100 border border-slate-100 relative">
                        <img 
                          src={issueImg} 
                          alt={issue.title}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    )}

                    {/* Title & Summary */}
                    <h3 className="text-sm font-bold text-slate-900 leading-snug mb-1 line-clamp-2">
                      {issue.title}
                    </h3>
                    
                    {issue.summary && (
                      <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-2 font-normal">
                        {issue.summary}
                      </p>
                    )}
                  </div>

                  {/* Clean Footer: Location & Accurate Reported Count */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-2">
                    <div className="flex items-center gap-1 overflow-hidden pr-2">
                      <span>📍</span>
                      <span className="font-medium truncate text-[11px]">
                        {getLocationStr(issue)}
                      </span>
                    </div>

                    {/* Dynamic Reported Count Badge */}
                    <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md whitespace-nowrap border border-slate-200/60">
                      👥 Reported by {reportCount} {reportCount === 1 ? 'person' : 'people'}
                    </span>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}