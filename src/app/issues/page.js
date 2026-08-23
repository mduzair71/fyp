// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';

// function getLocationStr(issue) {
//   if (!issue.location) return issue.location_area ? `${issue.location_area}, ${issue.location_district || ''}` : '—';
//   if (typeof issue.location === 'string') return issue.location;
//   const loc = issue.location;
//   return [loc.area, loc.district].filter(Boolean).join(', ') || '—';
// }

// export default function IssuesPage() {
//   const [issues, setIssues] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch('http://localhost:8000/issues')
//       .then(res => res.json())
//       .then(data => { setIssues(data.data || []); setLoading(false); })
//       .catch(() => setLoading(false));
//   }, []);

//   const S = {
//     page:    { minHeight: '100vh', background: '#f8fafc', color: '#111827', fontFamily: "'Inter','Segoe UI',sans-serif" },
//     inner:   { maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem' },
//     heading: { fontSize: '1.8rem', fontWeight: 800, color: '#111827', margin: '0 0 0.5rem' },
//     sub:     { color: '#6b7280', fontSize: '0.9rem', margin: '0 0 2rem' },
//     card:    { display: 'flex', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '1.5rem', marginBottom: '1rem', textDecoration: 'none', color: 'inherit', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', transition: 'transform 0.1s' },
//   };

//   const statusConfig = {
//     pending:     { bg: 'rgba(234,179,8,0.1)', color: '#a16207', icon: '⏳' },
//     in_progress: { bg: 'rgba(59,130,246,0.1)', color: '#1d4ed8', icon: '🔄' },
//     resolved:    { bg: 'rgba(22,163,74,0.1)', color: '#15803d', icon: '✅' },
//   };

//   return (
//     <div style={S.page}>
//       <div style={S.inner}>
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <div>
//             <h1 style={S.heading}>Public Issues</h1>
//             <p style={S.sub}>View all reported civic problems</p>
//           </div>
//           <Link href="/" style={{ color: '#16a34a', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>
//             ← Back Home
//           </Link>
//         </div>

//         {loading ? (
//           <p style={{ color: '#6b7280' }}>Loading issues...</p>
//         ) : (
//           <div>
//             {issues.map(issue => {
//               const s = statusConfig[issue.status] || statusConfig.pending;
//               return (
//                 <Link key={issue._id} href={`/issues/${issue._id}`} style={S.card}>
//                   <div style={{ flex: 1 }}>
//                     <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem' }}>
//                       <span style={{ padding: '0.2rem 0.6rem', background: 'rgba(22,163,74,0.1)', color: '#16a34a', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
//                         {issue.category}
//                       </span>
//                       <span style={{ padding: '0.2rem 0.6rem', background: s.bg, color: s.color, borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
//                         {s.icon} {issue.status.replace('_', ' ').toUpperCase()}
//                       </span>
//                     </div>
//                     <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', fontWeight: 700 }}>{issue.title}</h3>
//                     <p style={{ margin: 0, color: '#6b7280', fontSize: '0.85rem' }}>📍 {getLocationStr(issue)}</p>
//                   </div>
//                   {issue.photo_url && (
//                     <img
//                       src={`http://localhost:8000/${issue.photo_url}`}
//                       alt="Issue"
//                       style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '10px', marginLeft: '1rem', border: '1px solid #e5e7eb' }}
//                     />
//                   )}
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

import { useState, useEffect } from 'react';
import Link from 'next/link';

function getLocationStr(issue) {
  if (!issue.location) return issue.location_area ? `${issue.location_area}, ${issue.location_district || ''}` : '—';
  if (typeof issue.location === 'string') return issue.location;
  const loc = issue.location;
  return [loc.area, loc.district].filter(Boolean).join(', ') || '—';
}

export default function IssuesPage() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state — defaults to the logged-in user's own district/area if available
  const [myDistrict, setMyDistrict] = useState('');
  const [myArea, setMyArea] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('all');
  const [filterArea, setFilterArea] = useState('all');

  useEffect(() => {
    const district = localStorage.getItem('district') || '';
    const area = localStorage.getItem('area') || '';
    setMyDistrict(district);
    setMyArea(area);
    // Pre-fill filters to the user's own area by default, if they have one
    if (district) setFilterDistrict(district);
    if (area) setFilterArea(area);

    fetch('http://localhost:8000/issues')
      .then(res => res.json())
      .then(data => { setIssues(data.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Build the list of distinct districts/areas available from the actual data
  const districts = Array.from(new Set(issues.map(i => i.location_district).filter(Boolean))).sort();
  const areasForDistrict = Array.from(
    new Set(
      issues
        .filter(i => filterDistrict === 'all' || i.location_district === filterDistrict)
        .map(i => i.location_area)
        .filter(Boolean)
    )
  ).sort();

  const filteredIssues = issues.filter(i => {
    const matchesDistrict = filterDistrict === 'all' || i.location_district === filterDistrict;
    const matchesArea = filterArea === 'all' || i.location_area === filterArea;
    return matchesDistrict && matchesArea;
  });

  const handleDistrictChange = (value) => {
    setFilterDistrict(value);
    setFilterArea('all'); // reset area when district changes
  };

  const S = {
    page:    { minHeight: '100vh', background: '#f8fafc', color: '#111827', fontFamily: "'Inter','Segoe UI',sans-serif" },
    inner:   { maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem' },
    heading: { fontSize: '1.8rem', fontWeight: 800, color: '#111827', margin: '0 0 0.5rem' },
    sub:     { color: '#6b7280', fontSize: '0.9rem', margin: '0 0 2rem' },
    card:    { display: 'flex', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '1.5rem', marginBottom: '1rem', textDecoration: 'none', color: 'inherit', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', transition: 'transform 0.1s' },
  };

  const statusConfig = {
    pending:     { bg: 'rgba(234,179,8,0.1)', color: '#a16207', icon: '⏳' },
    in_progress: { bg: 'rgba(59,130,246,0.1)', color: '#1d4ed8', icon: '🔄' },
    resolved:    { bg: 'rgba(22,163,74,0.1)', color: '#15803d', icon: '✅' },
  };

  return (
    <div style={S.page}>
      <div style={S.inner}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={S.heading}>Public Issues</h1>
            <p style={S.sub}>
              {myArea
                ? `Showing issues near your area — ${myArea}, ${myDistrict}`
                : 'View all reported civic problems'}
            </p>
          </div>
          <Link href="/" style={{ color: '#16a34a', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>
            ← Back Home
          </Link>
        </div>

        {/* Filter bar */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'flex-end',
          background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '14px',
          padding: '1rem 1.2rem', marginBottom: '1.5rem'
        }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              District
            </label>
            <select
              value={filterDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '0.85rem', color: '#111827', background: '#fff' }}
            >
              <option value="all">All Districts</option>
              {districts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Area
            </label>
            <select
              value={filterArea}
              onChange={(e) => setFilterArea(e.target.value)}
              style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '0.85rem', color: '#111827', background: '#fff' }}
            >
              <option value="all">All Areas</option>
              {areasForDistrict.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          {myArea && (filterDistrict !== myDistrict || filterArea !== myArea) && (
            <button
              onClick={() => { setFilterDistrict(myDistrict); setFilterArea(myArea); }}
              style={{ padding: '0.5rem 0.9rem', borderRadius: '8px', border: '1px solid #16a34a', background: 'rgba(22,163,74,0.05)', color: '#16a34a', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
            >
              📍 My Area
            </button>
          )}

          {(filterDistrict !== 'all' || filterArea !== 'all') && (
            <button
              onClick={() => { setFilterDistrict('all'); setFilterArea('all'); }}
              style={{ padding: '0.5rem 0.9rem', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', color: '#6b7280', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Clear Filters
            </button>
          )}

          <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: '#6b7280', alignSelf: 'center' }}>
            {filteredIssues.length} issue{filteredIssues.length !== 1 ? 's' : ''}
          </span>
        </div>

        {loading ? (
          <p style={{ color: '#6b7280' }}>Loading issues...</p>
        ) : filteredIssues.length === 0 ? (
          <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '3rem', textAlign: 'center' }}>
            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>No issues found for this area yet.</p>
          </div>
        ) : (
          <div>
            {filteredIssues.map(issue => {
              const s = statusConfig[issue.status] || statusConfig.pending;
              return (
                <Link key={issue._id} href={`/issues/${issue._id}`} style={S.card}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ padding: '0.2rem 0.6rem', background: 'rgba(22,163,74,0.1)', color: '#16a34a', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                        {issue.category}
                      </span>
                      <span style={{ padding: '0.2rem 0.6rem', background: s.bg, color: s.color, borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                        {s.icon} {issue.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', fontWeight: 700 }}>{issue.title}</h3>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '0.85rem' }}>📍 {getLocationStr(issue)}</p>
                  </div>
                  {issue.photo_url && (
                    <img
                      src={`http://localhost:8000/${issue.photo_url}`}
                      alt="Issue"
                      style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '10px', marginLeft: '1rem', border: '1px solid #e5e7eb' }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}