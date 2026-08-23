'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function getLocationStr(issue) {
  if (!issue.location) return issue.location_area ? `${issue.location_area}, ${issue.location_district || ''}` : '—';
  if (typeof issue.location === 'string') return issue.location;
  const loc = issue.location;
  return [loc.area, loc.district].filter(Boolean).join(', ') || '—';
}

export default function MyIssuesPage() {
  const router = useRouter();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // useEffect(() => {
  //   const userId = localStorage.getItem('user_id');
  //   console.log('[MyIssues] localStorage user_id:', userId); // 👈 DEBUG

  //   if (!userId) {
  //     router.push('/login');
  //     return;
  //   }

  //   const url = `http://localhost:8000/issues/user/${userId}`;
  //   console.log('[MyIssues] fetching:', url); // 👈 DEBUG

  //   fetch(url)
  //     .then(async (res) => {
  //       console.log('[MyIssues] response status:', res.status); // 👈 DEBUG
  //       const data = await res.json();
  //       console.log('[MyIssues] response body:', data); // 👈 DEBUG — check this in console!
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
  //       console.error('[MyIssues] fetch error:', err); // 👈 DEBUG
  //       setError(err.message);
  //       setLoading(false);
  //     });
  // }, [router]);
useEffect(() => {
  const userId = localStorage.getItem('user_id');

  if (!userId) {
    router.push('/login');
    return;
  }

  const url = `http://localhost:8000/issues/user/${userId}`;

  fetch(url, { credentials: 'include' })   // 👈 ye change
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
    pending:     { bg: 'rgba(234,179,8,0.1)',  color: '#a16207', label: 'Pending' },
    in_progress: { bg: 'rgba(59,130,246,0.1)', color: '#1d4ed8', label: 'In Progress' },
    resolved:    { bg: 'rgba(22,163,74,0.1)',  color: '#15803d', label: 'Resolved' },
  };

  const S = {
    page:    { minHeight: '100vh', background: '#f8fafc', color: '#111827', fontFamily: "'Inter','Segoe UI',sans-serif" },
    inner:   { maxWidth: '800px', margin: '0 auto', padding: '3rem 1.5rem' },
    heading: { fontSize: '1.6rem', fontWeight: 700, color: '#111827', margin: '0 0 0.25rem' },
    sub:     { color: '#6b7280', fontSize: '0.85rem', margin: 0 },
    btn:     { display: 'flex', alignItems: 'center', gap: '6px', background: '#16a34a', color: '#fff', padding: '0.55rem 1rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' },
    card:    { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '14px', padding: '1.2rem 1.4rem', marginBottom: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  };

  if (loading) return (
    <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Loading your issues...</p>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#ef4444', fontSize: '0.9rem' }}>Something went wrong: {error}</p>
    </div>
  );

  return (
    <div style={S.page}>
      <div style={S.inner}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h1 style={S.heading}>My Reported Issues</h1>
            <p style={S.sub}>{issues.length} issue{issues.length !== 1 ? 's' : ''} you've submitted</p>
          </div>
          <Link href="/report" style={S.btn}>+ Report Issue</Link>
        </div>

        {issues.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', border: '1px dashed #d1d5db', borderRadius: '16px', background: '#ffffff' }}>
            <p style={{ fontSize: '2.5rem', margin: '0 0 0.75rem' }}>📭</p>
            <p style={{ color: '#6b7280', marginBottom: '0.75rem' }}>You haven't reported anything yet</p>
            <Link href="/report" style={{ color: '#16a34a', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
              Report your first issue →
            </Link>
          </div>
        ) : (
          <div>
            {issues.map(issue => {
              const s = statusConfig[issue.status] || statusConfig.pending;
              return (
                <Link key={issue._id} href={`/issues/${issue._id}`} style={{textDecoration: 'none'}}>
                  <div style={S.card}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: 0 }}>{issue.title}</h3>
                      <span style={{ padding: '0.22rem 0.6rem', borderRadius: '20px', background: s.bg, color: s.color, fontSize: '0.72rem', fontWeight: 700, flexShrink: 0 }}>{s.label}</span>
                    </div>
                    {issue.summary && <p style={{ color: '#6b7280', fontSize: '0.82rem', margin: '0 0 0.5rem' }}>{issue.summary}</p>}
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#6b7280' }}>
                      <span>📍 {getLocationStr(issue)}</span>
                      {issue.category && <span>🏷️ {issue.category}</span>}
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
