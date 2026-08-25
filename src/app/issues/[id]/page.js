
// 'use client';

// import { useState, useEffect, useMemo } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';

// function getLocationStr(issue) {
//   if (!issue.location) return issue.location_area ? `${issue.location_area}, ${issue.location_district || ''}` : '—';
//   if (typeof issue.location === 'string') return issue.location;
//   const loc = issue.location;
//   return [loc.area, loc.district].filter(Boolean).join(', ') || '—';
// }

// const STATUS_STEPS = ['PENDING', 'IN_PROGRESS', 'RESOLVED'];

// export default function MyIssuesDashboard() {
//   const router = useRouter();
//   const [issues, setIssues] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [activeTab, setActiveTab] = useState('ALL');
  
//   // Modal State
//   const [selectedIssue, setSelectedIssue] = useState(null);
//   const [supporting, setSupporting] = useState(false);

//   useEffect(() => {
//     const userId = localStorage.getItem('user_id');

//     if (!userId) {
//       router.push('/login');
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
//         setIssues(data.data || []);
//         setLoading(false);
//       })
//       .catch((err) => {
//         setError(err.message);
//         setLoading(false);
//       });
//   }, [router]);

//   const statusConfig = {
//     PENDING:     { bg: '#fef3c7', color: '#b45309', border: '#fde68a', dot: '#d97706', label: 'Pending', icon: '⚡' },
//     IN_PROGRESS: { bg: '#dbeafe', color: '#1d4ed8', border: '#bfdbfe', dot: '#2563eb', label: 'In Progress', icon: '🚀' },
//     RESOLVED:    { bg: '#dcfce7', color: '#15803d', border: '#bbf7d0', dot: '#16a34a', label: 'Resolved', icon: '✅' },
//     REJECTED:    { bg: '#fee2e2', color: '#b91c1c', border: '#fca5a5', dot: '#dc2626', label: 'Rejected', icon: '❌' },
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

//   const handleSupport = async (issueId) => {
//     setSupporting(true);
//     try {
//       const res = await fetch(`http://localhost:8000/issues/${issueId}/support`, {
//         method: 'POST',
//         credentials: 'include',
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.detail || 'Failed to update support');
      
//       const updatedCountDelta = data.supported ? 1 : -1;
      
//       // Update main state
//       setIssues(prev => prev.map(item => item._id === issueId ? { ...item, support_count: (item.support_count || 0) + updatedCountDelta } : item));
      
//       // Update modal state
//       setSelectedIssue(prev => prev ? { ...prev, supported: data.supported, support_count: (prev.support_count || 0) + updatedCountDelta } : null);
//     } catch (err) {
//       alert(err.message);
//     } finally {
//       setSupporting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', color: '#0284c7' }}>
//         <div style={{ width: '42px', height: '42px', border: '4px solid #e2e8f0', borderTopColor: '#0284c7', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
//         <p style={{ marginTop: '1rem', fontWeight: 700, fontSize: '0.95rem', color: '#64748b' }}>Loading dashboard...</p>
//         <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '1.5rem' }}>
//         <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '20px', border: '1px solid #fca5a5', textAlign: 'center', maxWidth: '420px', boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.1)' }}>
//           <p style={{ fontSize: '2.5rem', margin: 0 }}>🚨</p>
//           <h3 style={{ color: '#dc2626', margin: '0.5rem 0' }}>Dashboard Sync Error</h3>
//           <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '1.5rem' }}>{error}</p>
//           <button onClick={() => window.location.reload()} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '0.7rem 1.4rem', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={{ minHeight: '100vh', width: '100%', background: '#f8fafc', color: '#0f172a', fontFamily: "'Plus Jakarta Sans', sans-serif", paddingBottom: '5rem' }}>
      
//       {/* Header Banner */}
//       <div style={{ background: 'linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)', borderBottom: '1px solid #e2e8f0', padding: '3.5rem 1.5rem 2.5rem' }}>
//         <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
//           <div>
//             <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '20px', background: '#e0e7ff', border: '1px solid #c7d2fe', color: '#4338ca', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
//               User Workspace
//             </span>
//             <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, color: '#0f172a', letterSpacing: '-0.02em' }}>
//               My Issues Console
//             </h1>
//             <p style={{ color: '#64748b', margin: '0.4rem 0 0', fontSize: '0.95rem' }}>Real-time state tracking and resolution monitoring.</p>
//           </div>

//           <Link href="/report" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#ffffff', padding: '0.8rem 1.5rem', borderRadius: '12px', fontWeight: 800, textDecoration: 'none', fontSize: '0.9rem', boxShadow: '0 8px 20px -4px rgba(16,185,129,0.4)' }}>
//             <span>+</span> Report New Issue
//           </Link>
//         </div>
//       </div>

//       <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        
//         {/* Analytics Grid */}
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
//           <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.25rem' }}>
//             <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Total Reported</span>
//             <p style={{ fontSize: '2rem', fontWeight: 800, margin: '0.4rem 0 0', color: '#0f172a' }}>{metrics.total}</p>
//           </div>
//           <div style={{ background: '#ffffff', border: '1px solid #fef3c7', borderRadius: '16px', padding: '1.25rem' }}>
//             <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase' }}>Pending</span>
//             <p style={{ fontSize: '2rem', fontWeight: 800, margin: '0.4rem 0 0', color: '#d97706' }}>{metrics.pending}</p>
//           </div>
//           <div style={{ background: '#ffffff', border: '1px solid #dbeafe', borderRadius: '16px', padding: '1.25rem' }}>
//             <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase' }}>In Progress</span>
//             <p style={{ fontSize: '2rem', fontWeight: 800, margin: '0.4rem 0 0', color: '#2563eb' }}>{metrics.inProgress}</p>
//           </div>
//           <div style={{ background: '#ffffff', border: '1px solid #dcfce7', borderRadius: '16px', padding: '1.25rem' }}>
//             <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#15803d', textTransform: 'uppercase' }}>Resolved</span>
//             <p style={{ fontSize: '2rem', fontWeight: 800, margin: '0.4rem 0 0', color: '#16a34a' }}>{metrics.resolved}</p>
//           </div>
//         </div>

//         {/* Filter Tabs */}
//         <div style={{ display: 'flex', gap: '0.6rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.85rem', marginBottom: '1.75rem', overflowX: 'auto' }}>
//           {[
//             { id: 'ALL', label: `All Issues (${metrics.total})` },
//             { id: 'PENDING', label: `⚡ Pending (${metrics.pending})` },
//             { id: 'IN_PROGRESS', label: `🚀 In Progress (${metrics.inProgress})` },
//             { id: 'RESOLVED', label: `✅ Resolved (${metrics.resolved})` },
//             { id: 'REJECTED', label: `❌ Rejected (${metrics.rejected})` },
//           ].map((tab) => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               style={{
//                 padding: '0.65rem 1.2rem',
//                 borderRadius: '12px',
//                 border: activeTab === tab.id ? 'none' : '1px solid #e2e8f0',
//                 background: activeTab === tab.id ? 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)' : '#ffffff',
//                 color: activeTab === tab.id ? '#ffffff' : '#64748b',
//                 fontWeight: 700,
//                 fontSize: '0.85rem',
//                 cursor: 'pointer',
//                 whiteSpace: 'nowrap',
//               }}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </div>

//         {/* Issues List */}
//         {filteredIssues.length === 0 ? (
//           <div style={{ textAlign: 'center', padding: '4rem 1.5rem', background: '#ffffff', borderRadius: '20px', border: '2px dashed #cbd5e1' }}>
//             <p style={{ fontSize: '3rem', margin: '0 0 0.5rem' }}>📂</p>
//             <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#334155', margin: 0 }}>No Records Available</h3>
//           </div>
//         ) : (
//           <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
//             {filteredIssues.map((issue) => {
//               const stKey = getNormalizedStatus(issue.status);
//               const status = statusConfig[stKey];

//               return (
//                 <div
//                   key={issue._id}
//                   onClick={() => setSelectedIssue(issue)}
//                   style={{
//                     background: '#ffffff',
//                     border: '1px solid #e2e8f0',
//                     borderRadius: '18px',
//                     padding: '1.4rem 1.6rem',
//                     cursor: 'pointer',
//                     transition: 'all 0.2s ease',
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.borderColor = '#818cf8';
//                     e.currentTarget.style.transform = 'translateY(-2px)';
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.borderColor = '#e2e8f0';
//                     e.currentTarget.style.transform = 'translateY(0)';
//                   }}
//                 >
//                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
//                     {issue.category && (
//                       <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#0284c7', background: '#e0f2fe', padding: '0.2rem 0.65rem', borderRadius: '8px' }}>
//                         {issue.category}
//                       </span>
//                     )}

//                     <span style={{ padding: '0.35rem 0.85rem', borderRadius: '20px', background: status.bg, color: status.color, border: `1px solid ${status.border}`, fontSize: '0.75rem', fontWeight: 800 }}>
//                       {status.label}
//                     </span>
//                   </div>

//                   <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem' }}>
//                     {issue.title}
//                   </h3>

//                   {issue.summary && (
//                     <p style={{ color: '#475569', fontSize: '0.88rem', margin: '0 0 1rem' }}>
//                       {issue.summary}
//                     </p>
//                   )}

//                   <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b', paddingTop: '0.85rem', borderTop: '1px solid #f1f5f9' }}>
//                     <span>📍 {getLocationStr(issue)}</span>
//                     {issue.createdAt && <span>🕒 {new Date(issue.createdAt).toLocaleDateString()}</span>}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//       </div>

//       {/* Suitable-sized Modal (Popup) Component */}
//       {selectedIssue && (
//         <div style={{
//           position: 'fixed',
//           top: 0,
//           left: 0,
//           width: '100vw',
//           height: '100vh',
//           background: 'rgba(15, 23, 42, 0.5)',
//           backdropFilter: 'blur(4px)',
//           zIndex: 9999,
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           padding: '1rem',
//         }}>
//           <div style={{
//             background: '#ffffff',
//             borderRadius: '24px',
//             width: '100%',
//             maxWidth: '620px',
//             maxHeight: '90vh',
//             overflowY: 'auto',
//             boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
//             position: 'relative',
//             padding: '1.75rem',
//             animation: 'fadeIn 0.2s ease-out',
//           }}>
//             {/* Modal Header */}
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
//               <div>
//                 <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#0284c7', background: '#e0f2fe', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
//                   {selectedIssue.category}
//                 </span>
//                 <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0.5rem 0 0', color: '#0f172a' }}>{selectedIssue.title}</h2>
//               </div>
//               <button
//                 onClick={() => setSelectedIssue(null)}
//                 style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', fontSize: '1.1rem', cursor: 'pointer', color: '#64748b' }}
//               >
//                 ✕
//               </button>
//             </div>

//             {/* Timeline */}
//             <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1.25rem' }}>
//               <p style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', margin: '0 0 0.5rem' }}>Status Progress</p>
//               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//                 {STATUS_STEPS.map((step, i) => {
//                   const currIdx = STATUS_STEPS.indexOf(selectedIssue.status);
//                   return (
//                     <span key={step} style={{ fontSize: '0.75rem', fontWeight: step === selectedIssue.status ? 800 : 600, color: i <= currIdx ? '#16a34a' : '#94a3b8' }}>
//                       {statusConfig[step]?.label || step}
//                     </span>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Description */}
//             <div style={{ marginBottom: '1.25rem' }}>
//               <p style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', margin: '0 0 0.4rem' }}>Description</p>
//               <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.6, margin: 0 }}>{selectedIssue.description || 'No description provided.'}</p>
//             </div>

//             {/* Photo Evidence */}
//             {selectedIssue.photo_url && (
//               <div style={{ marginBottom: '1.25rem' }}>
//                 <p style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', margin: '0 0 0.4rem' }}>Photo Evidence</p>
//                 <div style={{ width: '100%', maxHeight: '280px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', background: '#f1f5f9' }}>
//                   <img src={`http://localhost:8000/${selectedIssue.photo_url}`} alt="Evidence" style={{ width: '100%', height: '280px', objectFit: 'cover' }} />
//                 </div>
//               </div>
//             )}

//             {/* Location & Action */}
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
//               <div>
//                 <p style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', margin: 0 }}>Location</p>
//                 <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>📍 {getLocationStr(selectedIssue)}</p>
//               </div>

//               <button
//                 onClick={() => handleSupport(selectedIssue._id)}
//                 disabled={supporting}
//                 style={{
//                   background: selectedIssue.supported ? '#10b981' : '#4f46e5',
//                   color: '#ffffff',
//                   border: 'none',
//                   padding: '0.65rem 1.25rem',
//                   borderRadius: '10px',
//                   fontWeight: 800,
//                   fontSize: '0.85rem',
//                   cursor: 'pointer',
//                 }}
//               >
//                 🙋 {selectedIssue.supported ? 'Supported' : "I'm Affected"} ({selectedIssue.support_count || 0})
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }



'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

function getImageUrl(photoUrl) {
  if (!photoUrl) return null;
  if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
    return photoUrl;
  }
  const cleanPath = photoUrl.replace(/^\/+/, '');
  return `http://localhost:8000/${cleanPath}`;
}

function getLocationStr(issue) {
  if (!issue?.location) return issue?.location_area ? `${issue.location_area}, ${issue.location_district || ''}` : 'Location details not available';
  if (typeof issue.location === 'string') return issue.location;
  const loc = issue.location;
  return [loc.area, loc.district].filter(Boolean).join(', ') || 'Location details not available';
}

const STATUS_STEPS = [
  { id: 'PENDING', label: 'Pending', icon: '⏳' },
  { id: 'IN_PROGRESS', label: 'In Progress', icon: '🚀' },
  { id: 'RESOLVED', label: 'Resolved', icon: '✅' },
];

export default function SingleIssueDetails() {
  const params = useParams();
  const router = useRouter();
  const issueId = params?.id;

  const [mounted, setMounted] = useState(false);
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [supporting, setSupporting] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Hydration sync
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!issueId || !mounted) return;

    fetch(`http://localhost:8000/issues/${issueId}`, { credentials: 'include' })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || `Failed to fetch issue (${res.status})`);
        return data;
      })
      .then((data) => {
        setIssue(data.data || data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [issueId, mounted]);

  const handleSupport = async () => {
    if (!issue) return;
    setSupporting(true);
    try {
      const res = await fetch(`http://localhost:8000/issues/${issue._id || issueId}/support`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to update support status');

      const delta = data.supported ? 1 : -1;
      setIssue((prev) => ({
        ...prev,
        supported: data.supported,
        support_count: Math.max(0, (prev?.support_count || 0) + delta),
      }));
    } catch (err) {
      alert(err.message);
    } finally {
      setSupporting(false);
    }
  };

  const statusConfig = {
    PENDING: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', label: 'Pending', icon: '⚡' },
    IN_PROGRESS: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', label: 'In Progress', icon: '🚀' },
    RESOLVED: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', label: 'Resolved', icon: '✅' },
    REJECTED: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20', label: 'Rejected', icon: '❌' },
  };

  const getNormalizedStatus = (status) => {
    if (!status) return 'PENDING';
    const upper = status.toUpperCase();
    return statusConfig[upper] ? upper : 'PENDING';
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
        <div className="w-12 h-12 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin" />
        <p className="mt-4 font-semibold text-sm tracking-wide text-slate-300">Loading Issue Details...</p>
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center max-w-md shadow-2xl">
          <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center mx-auto mb-4 text-xl">⚠️</div>
          <h3 className="text-white font-bold text-lg mb-2">Issue Not Found</h3>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">{error || 'Could not load details for this issue.'}</p>
          <button
            onClick={() => router.back()}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-xl transition-all"
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  const currentStatus = getNormalizedStatus(issue.status);
  const statusInfo = statusConfig[currentStatus];
  const photoPath = getImageUrl(issue.photo_url || issue.image || issue.photo);
  const activeStepIdx = STATUS_STEPS.findIndex((s) => s.id === currentStatus);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased pb-20">
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 px-3.5 py-2 rounded-xl transition-all border border-slate-700/50"
          >
            ← Back
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold tracking-widest text-blue-400 uppercase bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">
              {issue.category || 'General'}
            </span>
            <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}>
              {statusInfo.icon} {statusInfo.label}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-8 space-y-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1">
                Reported on {issue.createdAt ? new Date(issue.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                {issue.title}
              </h1>
            </div>

            <button
              onClick={handleSupport}
              disabled={supporting}
              className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg self-start md:self-auto shrink-0 ${
                issue.supported
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20 hover:shadow-blue-600/30'
              } active:scale-95 disabled:opacity-50`}
            >
              <span>{issue.supported ? '✅ Supported' : "🙋 I'm Affected"}</span>
              <span className="bg-black/20 px-2 py-0.5 rounded-md text-xs font-mono">
                {issue.support_count || 0}
              </span>
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-slate-500 text-base">📍</span>
              <span className="font-medium">{getLocationStr(issue)}</span>
            </div>
            {issue.reporter_name && (
              <div className="flex items-center gap-2 text-slate-300 sm:justify-end">
                <span className="text-slate-500 text-base">👤</span>
                <span>Reported by: <strong className="text-white">{issue.reporter_name}</strong></span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Resolution Status Tracker</p>
          
          <div className="relative flex items-center justify-between max-w-2xl mx-auto">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2 z-0" />
            <div
              className="absolute top-1/2 left-0 h-1 bg-blue-500 -translate-y-1/2 z-0 transition-all duration-500"
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
                        ? 'bg-blue-600 text-white ring-4 ring-slate-950 shadow-md shadow-blue-500/20'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}
                  >
                    {step.icon}
                  </div>
                  <span className={`text-xs font-semibold mt-2 ${isCurrent ? 'text-blue-400' : 'text-slate-400'}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">Issue Description</h3>
            <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">
              {issue.description || issue.summary || 'No detailed description provided for this report.'}
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">Attached Photo</h3>

            {photoPath && !imgError ? (
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex-1 flex items-center justify-center group relative min-h-[220px]">
                <img
                  src={photoPath}
                  alt={issue.title}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover max-h-80 transition-transform duration-300 group-hover:scale-105"
                />
                <a
                  href={photoPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-3 right-3 bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  🔍 View Full
                </a>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/40 min-h-[200px] flex flex-col items-center justify-center text-slate-500 text-xs p-6 text-center">
                <span className="text-2xl mb-2">🖼️</span>
                <span>{imgError ? 'Failed to load photo attachment' : 'No photo attached to this issue'}</span>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}