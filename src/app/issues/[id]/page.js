
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

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function getLocationStr(issue) {
  if (!issue.location) return issue.location_area ? `${issue.location_area}, ${issue.location_district || ''}` : '—';
  if (typeof issue.location === 'string') return issue.location;
  const loc = issue.location;
  return [loc.area, loc.district].filter(Boolean).join(', ') || '—';
}

const STATUS_STEPS = ['PENDING', 'IN_PROGRESS', 'RESOLVED'];

export default function MyIssuesDashboard() {
  const router = useRouter();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');

  // Modal State
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [supporting, setSupporting] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('user_id');

    if (!userId) {
      router.push('/login');
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
    PENDING:     { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500', label: 'Pending', icon: '⚡' },
    IN_PROGRESS: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-600', label: 'In Progress', icon: '🚀' },
    RESOLVED:    { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-600', label: 'Resolved', icon: '✅' },
    REJECTED:    { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-600', label: 'Rejected', icon: '❌' },
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

  const handleSupport = async (issueId) => {
    setSupporting(true);
    try {
      const res = await fetch(`http://localhost:8000/issues/${issueId}/support`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to update support');

      const updatedCountDelta = data.supported ? 1 : -1;

      // Update main state
      setIssues(prev => prev.map(item => item._id === issueId ? { ...item, support_count: (item.support_count || 0) + updatedCountDelta } : item));

      // Update modal state
      setSelectedIssue(prev => prev ? { ...prev, supported: data.supported, support_count: (prev.support_count || 0) + updatedCountDelta } : null);
    } catch (err) {
      alert(err.message);
    } finally {
      setSupporting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-blue-600">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="mt-4 font-bold text-sm text-slate-500">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
        <div className="bg-white p-8 rounded-2xl border border-red-200 text-center max-w-md shadow-sm">
          <p className="text-4xl m-0">🚨</p>
          <h3 className="text-red-600 my-2 font-bold text-lg">Dashboard Sync Error</h3>
          <p className="text-slate-500 text-sm mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white border-none px-6 py-2.5 rounded-xl font-bold text-sm transition-colors cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 font-['Inter',sans-serif] pb-20">

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-white to-blue-50 border-b border-slate-200 px-6 pt-14 pb-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center flex-wrap gap-5">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-extrabold uppercase tracking-wider mb-2">
              User Workspace
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight m-0">
              My Issues Console
            </h1>
            <p className="text-slate-500 mt-1.5 text-sm">Real-time state tracking and resolution monitoring.</p>
          </div>

          <Link
            href="/report"
            className="inline-flex items-center gap-2 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-extrabold no-underline text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/35 transition-shadow"
          >
            <span>+</span> Report New Issue
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Analytics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wide">Total Reported</span>
            <p className="text-3xl font-extrabold mt-1.5 text-slate-900">{metrics.total}</p>
          </div>
          <div className="bg-white border border-amber-100 rounded-2xl p-5 shadow-sm">
            <span className="text-xs font-extrabold text-amber-700 uppercase tracking-wide">Pending</span>
            <p className="text-3xl font-extrabold mt-1.5 text-amber-600">{metrics.pending}</p>
          </div>
          <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm">
            <span className="text-xs font-extrabold text-blue-700 uppercase tracking-wide">In Progress</span>
            <p className="text-3xl font-extrabold mt-1.5 text-blue-600">{metrics.inProgress}</p>
          </div>
          <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-sm">
            <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wide">Resolved</span>
            <p className="text-3xl font-extrabold mt-1.5 text-emerald-600">{metrics.resolved}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 border-b border-slate-200 pb-3 mb-7 overflow-x-auto">
          {[
            { id: 'ALL', label: `All Issues (${metrics.total})` },
            { id: 'PENDING', label: `⚡ Pending (${metrics.pending})` },
            { id: 'IN_PROGRESS', label: `🚀 In Progress (${metrics.inProgress})` },
            { id: 'RESOLVED', label: `✅ Resolved (${metrics.resolved})` },
            { id: 'REJECTED', label: `❌ Rejected (${metrics.rejected})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-colors cursor-pointer border ${
                activeTab === tab.id
                  ? 'bg-gradient-to-br from-indigo-600 to-indigo-800 text-white border-transparent shadow-sm'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Issues List */}
        {filteredIssues.length === 0 ? (
          <div className="text-center py-16 px-6 bg-white rounded-2xl border-2 border-dashed border-slate-300">
            <p className="text-5xl m-0 mb-2">📂</p>
            <h3 className="text-lg font-extrabold text-slate-700 m-0">No Records Available</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredIssues.map((issue) => {
              const stKey = getNormalizedStatus(issue.status);
              const status = statusConfig[stKey];

              return (
                <div
                  key={issue._id}
                  onClick={() => setSelectedIssue(issue)}
                  className="bg-white border border-slate-200 rounded-2xl p-6 cursor-pointer transition-all hover:border-indigo-300 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex justify-between items-center flex-wrap gap-3 mb-3">
                    {issue.category && (
                      <span className="text-xs font-extrabold uppercase text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg">
                        {issue.category}
                      </span>
                    )}

                    <span className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold border ${status.bg} ${status.text} ${status.border}`}>
                      {status.label}
                    </span>
                  </div>

                  <h3 className="text-lg font-extrabold text-slate-900 m-0 mb-2">
                    {issue.title}
                  </h3>

                  {issue.summary && (
                    <p className="text-slate-600 text-sm m-0 mb-4">
                      {issue.summary}
                    </p>
                  )}

                  <div className="flex justify-between text-xs text-slate-500 pt-3.5 border-t border-slate-100">
                    <span>📍 {getLocationStr(issue)}</span>
                    {issue.createdAt && <span>🕒 {new Date(issue.createdAt).toLocaleDateString()}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Issue Details Modal */}
      {selectedIssue && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedIssue(null)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-7 animate-pop-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-extrabold uppercase text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg">
                  {selectedIssue.category}
                </span>
                <h2 className="text-2xl font-extrabold mt-2 text-slate-900">{selectedIssue.title}</h2>
              </div>
              <button
                onClick={() => setSelectedIssue(null)}
                className="bg-slate-100 hover:bg-slate-200 border-none rounded-full w-8 h-8 text-lg text-slate-500 cursor-pointer transition-colors shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Timeline */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-5">
              <p className="text-xs font-extrabold uppercase text-slate-500 m-0 mb-2">Status Progress</p>
              <div className="flex items-center justify-between">
                {STATUS_STEPS.map((step, i) => {
                  const currIdx = STATUS_STEPS.indexOf(selectedIssue.status);
                  return (
                    <span
                      key={step}
                      className={`text-xs ${step === selectedIssue.status ? 'font-extrabold' : 'font-semibold'} ${i <= currIdx ? 'text-emerald-600' : 'text-slate-400'}`}
                    >
                      {statusConfig[step]?.label || step}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div className="mb-5">
              <p className="text-xs font-extrabold uppercase text-slate-500 m-0 mb-1.5">Description</p>
              <p className="text-sm text-slate-700 leading-relaxed m-0">{selectedIssue.description || 'No description provided.'}</p>
            </div>

            {/* Photo Evidence */}
            {selectedIssue.photo_url && (
              <div className="mb-5">
                <p className="text-xs font-extrabold uppercase text-slate-500 m-0 mb-1.5">Photo Evidence</p>
                <div className="w-full max-h-72 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                  <img src={`http://localhost:8000/${selectedIssue.photo_url}`} alt="Evidence" className="w-full h-72 object-cover" />
                </div>
              </div>
            )}

            {/* Location & Action */}
            <div className="flex justify-between items-center flex-wrap gap-4 pt-4 border-t border-slate-100">
              <div>
                <p className="text-xs font-extrabold uppercase text-slate-500 m-0">Location</p>
                <p className="text-sm font-bold text-slate-800 m-0">📍 {getLocationStr(selectedIssue)}</p>
              </div>

              <button
                onClick={() => handleSupport(selectedIssue._id)}
                disabled={supporting}
                className={`text-white border-none px-5 py-2.5 rounded-xl font-extrabold text-sm cursor-pointer transition-colors disabled:opacity-60 ${
                  selectedIssue.supported ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                🙋 {selectedIssue.supported ? 'Supported' : "I'm Affected"} ({selectedIssue.support_count || 0})
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fadeIn 0.15s ease both; }

        @keyframes popIn {
          from { opacity: 0; transform: scale(0.96) translateY(-6px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-pop-in { animation: popIn 0.2s ease both; }

        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in, .animate-pop-in { animation: none !important; }
        }
      `}</style>
    </div>
  );
}