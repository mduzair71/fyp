// 'use client';

// import { useState, useEffect } from 'react';
// import { useParams } from 'next/navigation';
// import Link from 'next/link';

// function getLocationStr(issue) {
//   if (!issue.location) return issue.location_area ? `${issue.location_area}, ${issue.location_district || ''}` : '—';
//   if (typeof issue.location === 'string') return issue.location;
//   const loc = issue.location;
//   return [loc.area, loc.district].filter(Boolean).join(', ') || '—';
// }

// // ── Inline icons, consistent with the Report page ─────────────
// const IconBack = (p) => (
//   <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
//   </svg>
// );
// const IconPin = (p) => (
//   <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
//     <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-6.4 7-11.5A7 7 0 105 9.5C5 14.6 12 21 12 21z" />
//     <circle cx="12" cy="9.5" r="2.3" />
//   </svg>
// );
// const IconUser = (p) => (
//   <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
//     <circle cx="12" cy="8" r="4" />
//     <path strokeLinecap="round" d="M4 20c0-4 3.5-6 8-6s8 2 8 6" />
//   </svg>
// );
// const IconCalendar = (p) => (
//   <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
//     <rect x="3.5" y="5" width="17" height="16" rx="2" />
//     <path strokeLinecap="round" d="M8 3v4M16 3v4M3.5 10h17" />
//   </svg>
// );
// const IconInfo = (p) => (
//   <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
//     <circle cx="12" cy="12" r="9" />
//     <path strokeLinecap="round" d="M12 11v5M12 8h.01" />
//   </svg>
// );
// const IconSparkle = (p) => (
//   <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
//     <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
//   </svg>
// );
// const IconCamera = (p) => (
//   <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
//     <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h3l2-2.5h6L17 8h3a1 1 0 011 1v9a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1z" />
//     <circle cx="12" cy="13" r="3.3" />
//   </svg>
// );
// const IconCheck = (p) => (
//   <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
//     <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//   </svg>
// );
// const IconGear = (p) => (
//   <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
//     <circle cx="12" cy="12" r="3" />
//     <path strokeLinecap="round" strokeLinejoin="round" d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.6 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.9.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.9V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" />
//   </svg>
// );
// const IconDot = (p) => (
//   <svg {...p} viewBox="0 0 24 24" fill="currentColor">
//     <circle cx="12" cy="12" r="5" />
//   </svg>
// );

// const STATUS_STEPS = [
//   { key: 'pending', label: 'Pending', icon: IconDot },
//   { key: 'in_progress', label: 'In Progress', icon: IconGear },
//   { key: 'resolved', label: 'Resolved', icon: IconCheck },
// ];

// function StatusTracker({ status }) {
//   const currentIdx = STATUS_STEPS.findIndex((s) => s.key === status);
//   const activeIdx = currentIdx === -1 ? 0 : currentIdx;

//   return (
//     <div className="flex items-center bg-teal-50 border border-teal-100 rounded-2xl px-6 py-5">
//       {STATUS_STEPS.map((s, idx) => {
//         const reached = idx <= activeIdx;
//         const StepIcon = s.icon;
//         return (
//           <div key={s.key} className="flex items-center flex-1 last:flex-none">
//             <div className="flex flex-col items-center">
//               <div
//                 className={`w-11 h-11 rounded-full flex items-center justify-center border-2 transition-colors ${
//                   reached ? 'bg-teal-700 border-teal-700 text-white' : 'bg-white border-gray-300 text-gray-400'
//                 }`}
//               >
//                 <StepIcon className="w-5 h-5" />
//               </div>
//               <span className={`mt-2 text-xs font-bold whitespace-nowrap ${reached ? 'text-teal-800' : 'text-gray-400'}`}>
//                 {s.label}
//               </span>
//             </div>
//             {idx < STATUS_STEPS.length - 1 && (
//               <div className="flex-1 flex items-center px-3">
//                 <div className={`h-0.5 w-full ${idx < activeIdx ? 'bg-teal-700' : 'bg-teal-200'}`} />
//                 <svg
//                   className={`w-4 h-4 -ml-1 shrink-0 ${idx < activeIdx ? 'text-teal-700' : 'text-teal-200'}`}
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2.4"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
//                 </svg>
//               </div>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// export default function IssuePage() {
//   const params = useParams();
//   const [issue, setIssue] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [statusDraft, setStatusDraft] = useState('');
//   const [updating, setUpdating] = useState(false);
//   const [updateError, setUpdateError] = useState('');
//   const [updateSuccess, setUpdateSuccess] = useState(false);

//   useEffect(() => {
//     const role = localStorage.getItem('role');
//     setIsAdmin(role === 'admin' || role === 'sub_admin' || role === 'super_admin');
//   }, []);

//   useEffect(() => {
//     fetch(`http://localhost:8000/issues/${params.id}`, { credentials: 'include' })
//       .then((r) => r.json())
//       .then((data) => {
//         setIssue(data);
//         setStatusDraft(data?.status || '');
//         setLoading(false);
//       })
//       .catch((e) => {
//         console.log(e);
//         setLoading(false);
//       });
//   }, [params.id]);

//   const handleUpdateStatus = async () => {
//     if (!statusDraft || statusDraft === issue.status) return;
//     setUpdating(true);
//     setUpdateError('');
//     setUpdateSuccess(false);
//     try {
//       const form = new FormData();
//       form.append('status', statusDraft);
//       const res = await fetch(`http://localhost:8000/issues/${params.id}/status`, {
//         method: 'PATCH',
//         credentials: 'include',
//         body: form,
//       });
//       if (!res.ok) {
//         const err = await res.json().catch(() => ({}));
//         throw new Error(err.detail || 'Failed to update status');
//       }
//       setIssue((prev) => ({ ...prev, status: statusDraft }));
//       setUpdateSuccess(true);
//       setTimeout(() => setUpdateSuccess(false), 2500);
//     } catch (e) {
//       setUpdateError(e.message || 'Something went wrong');
//     } finally {
//       setUpdating(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-slate-50 flex items-center justify-center">
//         <div className="flex flex-col items-center gap-3">
//           <div className="w-8 h-8 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
//           <p className="text-gray-400 text-sm">Loading issue details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!issue || issue.detail) {
//     return (
//       <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
//         <div className="text-center bg-white border border-gray-100 rounded-2xl shadow-sm px-8 py-12 max-w-sm w-full">
//           <div className="w-14 h-14 mx-auto rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
//             <IconInfo className="w-7 h-7 text-gray-300" />
//           </div>
//           <p className="text-gray-500 text-sm mb-5">Issue not found.</p>
//           <Link
//             href="/issues"
//             className="inline-block px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold no-underline transition-colors"
//           >
//             Back to Issues
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const priorityConfig = {
//     high: { solid: 'bg-red-500', icon: '🔴' },
//     medium: { solid: 'bg-orange-500', icon: '🟠' },
//     low: { solid: 'bg-emerald-600', icon: '🟢' },
//   };

//   const priority = priorityConfig[issue.priority] || priorityConfig.medium;
//   const locationStr = getLocationStr(issue);

//   return (
//     <div className="min-h-screen bg-slate-100 px-4 py-10">
//       <div className="max-w-4xl mx-auto">
//         <Link
//           href="/issues"
//           className="inline-flex items-center gap-1.5 text-teal-700 hover:text-teal-800 text-sm font-semibold no-underline mb-5 transition-colors"
//         >
//           <IconBack className="w-4 h-4" /> Back to Issues
//         </Link>

//         <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-7 animate-fade-in-up">
//           {/* Header */}
//           <h1 className="text-lg sm:text-xl font-extrabold text-gray-900 leading-snug mb-4">
//             Specific Issue Details: {issue.title}
//             {issue._id && <span className="text-gray-400 font-bold"> ({issue._id.slice(-6).toUpperCase()})</span>}
//           </h1>

//           <div className="flex flex-wrap gap-2 mb-6">
//             <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white ${priority.solid}`}>
//               {priority.icon} {issue.priority ? `${issue.priority[0].toUpperCase()}${issue.priority.slice(1)}` : 'Medium'} Priority
//             </span>
//             {issue.category && (
//               <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-emerald-700">
//                 🎓 {issue.category}
//               </span>
//             )}
//             {issue.problem_type && (
//               <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold text-white bg-slate-600">
//                 {issue.problem_type}
//               </span>
//             )}
//           </div>

//           {/* Status tracker */}
//           <div className="mb-6">
//             <StatusTracker status={issue.status} />
//           </div>

//           {/* Admin-only: update status */}
//           {isAdmin && (
//             <div className="flex flex-wrap items-center gap-3 bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 mb-6">
//               <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Update Status</span>
//               <select
//                 value={statusDraft}
//                 onChange={(e) => setStatusDraft(e.target.value)}
//                 className="text-sm font-semibold px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:border-teal-600 transition-colors"
//               >
//                 <option value="pending">Pending</option>
//                 <option value="in_progress">In Progress</option>
//                 <option value="resolved">Resolved</option>
//               </select>
//               <button
//                 onClick={handleUpdateStatus}
//                 disabled={updating || statusDraft === issue.status}
//                 className="px-4 py-1.5 rounded-lg text-sm font-bold text-white bg-teal-700 hover:bg-teal-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {updating ? 'Updating...' : 'Update Status'}
//               </button>
//               {updateSuccess && <span className="text-xs font-semibold text-emerald-600">✅ Updated</span>}
//               {updateError && <span className="text-xs font-semibold text-red-600">⚠️ {updateError}</span>}
//             </div>
//           )}

//           {/* Two-column body */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
//             {/* Photo */}
//             {issue.photo_url ? (
//               <div>
//                 <a href={`http://localhost:8000/${issue.photo_url}`} target="_blank" rel="noreferrer">
//                   <img
//                     src={`http://localhost:8000/${issue.photo_url}`}
//                     alt={issue.title}
//                     className="w-full max-h-72 object-cover rounded-xl border border-gray-100 hover:opacity-90 transition-opacity"
//                   />
//                 </a>
//                 <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mt-2">
//                   <IconCamera className="w-3.5 h-3.5" /> Photo Evidence
//                 </p>
//               </div>
//             ) : (
//               <div className="flex items-center justify-center h-40 rounded-xl border border-dashed border-gray-200 bg-slate-50 text-gray-300 text-sm">
//                 No photo attached
//               </div>
//             )}

//             {/* Cards column */}
//             <div className="flex flex-col gap-4">
//               <div className="bg-white border border-gray-200 rounded-xl p-4">
//                 <h3 className="font-bold text-gray-900 text-sm mb-2">Description</h3>
//                 <p className="text-sm text-gray-600 leading-relaxed">{issue.description}</p>
//               </div>

//               {issue.additional_info && (
//                 <div className="bg-white border border-gray-200 rounded-xl p-4">
//                   <h3 className="font-bold text-gray-900 text-sm mb-2">Background Context</h3>
//                   <p className="text-sm text-gray-600 leading-relaxed">{issue.additional_info}</p>
//                 </div>
//               )}

//               {issue.summary && (
//                 <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
//                   <h3 className="flex items-center gap-1.5 font-bold text-orange-900 text-sm mb-2">
//                     <IconSparkle className="w-4 h-4" /> System & AI Analysis
//                   </h3>
//                   <p className="text-sm text-orange-900/80 leading-relaxed">{issue.summary}</p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Location / Reporter / Date */}
//           <div className="bg-white border border-gray-200 rounded-xl p-4 mt-5 flex flex-col sm:flex-row gap-5">
//             <div className="flex items-start gap-3 flex-1">
//               <div className="w-9 h-9 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
//                 <IconPin className="w-4.5 h-4.5 text-teal-700" />
//               </div>
//               <div>
//                 <p className="text-xs font-semibold text-gray-400">Location</p>
//                 <p className="text-sm font-bold text-gray-900">{locationStr}</p>
//               </div>
//             </div>
//             <div className="flex items-start gap-3 flex-1">
//               <div className="w-9 h-9 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
//                 <IconUser className="w-4.5 h-4.5 text-teal-700" />
//               </div>
//               <div>
//                 <p className="text-xs font-semibold text-gray-400">Reported By</p>
//                 <p className="text-sm font-bold text-gray-900">{issue.reporter_name || 'Anonymous Citizen'}</p>
//               </div>
//             </div>
//             <div className="flex items-start gap-3 flex-1">
//               <div className="w-9 h-9 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
//                 <IconCalendar className="w-4.5 h-4.5 text-teal-700" />
//               </div>
//               <div>
//                 <p className="text-xs font-semibold text-gray-400">Date</p>
//                 <p className="text-sm font-bold text-gray-900">
//                   {issue.created_at
//                     ? new Date(issue.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
//                     : '—'}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <style jsx global>{`
//         @keyframes fadeInUp {
//           from { opacity: 0; transform: translateY(8px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-fade-in-up { animation: fadeInUp 0.35s ease both; }

//         @media (prefers-reduced-motion: reduce) {
//           .animate-fade-in-up { animation: none !important; }
//         }
//       `}</style>
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

function getLocationStr(issue) {
  if (!issue.location) return issue.location_area ? `${issue.location_area}, ${issue.location_district || ''}` : '—';
  if (typeof issue.location === 'string') return issue.location;
  const loc = issue.location;
  return [loc.area, loc.district].filter(Boolean).join(', ') || '—';
}

const STATUS_STEPS = ['pending', 'in_progress', 'resolved'];

const statusConfig = {
  pending:     { bg: 'rgba(234,179,8,0.1)',  color: '#a16207', label: 'Pending' },
  in_progress: { bg: 'rgba(59,130,246,0.1)', color: '#1d4ed8', label: 'In Progress' },
  resolved:    { bg: 'rgba(22,163,74,0.1)',  color: '#15803d', label: 'Resolved' },
};

export default function IssueDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const issueId = params.id;

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [supporting, setSupporting] = useState(false);
  const [supported, setSupported] = useState(false);

  const fetchIssue = async () => {
    try {
      const res = await fetch(`http://localhost:8000/issues/${issueId}`, { credentials: 'include' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || `Request failed with status ${res.status}`);
      setIssue(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!issueId) return;
    fetchIssue();
  }, [issueId]);

  const handleSupport = async () => {
    setSupporting(true);
    try {
      const res = await fetch(`http://localhost:8000/issues/${issueId}/support`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to update support');
      setSupported(data.supported);
      setIssue(prev => ({
        ...prev,
        support_count: (prev.support_count || 0) + (data.supported ? 1 : -1),
      }));
    } catch (err) {
      alert(err.message);
    } finally {
      setSupporting(false);
    }
  };

  const S = {
    page:    { minHeight: '100vh', background: '#f8fafc', color: '#111827', fontFamily: "'Inter','Segoe UI',sans-serif" },
    inner:   { maxWidth: '760px', margin: '0 auto', padding: '3rem 1.5rem' },
    back:    { color: '#6b7280', fontSize: '0.85rem', textDecoration: 'none', marginBottom: '1.5rem', display: 'inline-block' },
    card:    { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '1.5rem', marginBottom: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
    label:   { fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#9ca3af', marginBottom: '0.4rem' },
  };

  if (loading) return (
    <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Loading issue...</p>
    </div>
  );

  if (error) return (
    <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#ef4444', fontSize: '0.9rem', marginBottom: '0.75rem' }}>{error}</p>
        <Link href="/my-issues" style={{ color: '#16a34a', fontSize: '0.85rem', fontWeight: 600 }}>← Back to My Issues</Link>
      </div>
    </div>
  );

  if (!issue) return null;

  const s = statusConfig[issue.status] || statusConfig.pending;
  const currentStepIndex = STATUS_STEPS.indexOf(issue.status);

  return (
    <div style={S.page}>
      <div style={S.inner}>
        <Link href="/my-issues" style={S.back}>← Back to My Issues</Link>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0 0 0.25rem' }}>
              {issue.category}{issue.problem_type ? ` — ${issue.problem_type}` : ''}
            </p>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>{issue.title}</h1>
          </div>
          <span style={{ padding: '0.3rem 0.7rem', borderRadius: '20px', background: s.bg, color: s.color, fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>
            {s.label}
          </span>
        </div>

        {/* Status Timeline */}
        <div style={S.card}>
          <p style={S.label}>Status Timeline</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {STATUS_STEPS.map((step, i) => (
              <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < STATUS_STEPS.length - 1 ? 1 : 'none' }}>
                <div style={{
                  width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0,
                  background: i <= currentStepIndex ? '#16a34a' : '#e5e7eb',
                }} />
                {i < STATUS_STEPS.length - 1 && (
                  <div style={{ flex: 1, height: '2px', background: i < currentStepIndex ? '#16a34a' : '#e5e7eb', margin: '0 4px' }} />
                )}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem' }}>
            {STATUS_STEPS.map(step => (
              <span key={step} style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: step === issue.status ? 700 : 400 }}>
                {statusConfig[step].label}
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <div style={S.card}>
          <p style={S.label}>Description</p>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#374151', margin: 0 }}>{issue.description}</p>
        </div>

        {/* AI Summary */}
        {issue.summary && (
          <div style={{ ...S.card, background: 'rgba(22,163,74,0.05)', borderColor: 'rgba(22,163,74,0.2)' }}>
            <p style={{ ...S.label, color: '#15803d' }}>🤖 AI Summary</p>
            <p style={{ fontSize: '0.9rem', color: '#166534', margin: 0 }}>{issue.summary}</p>
          </div>
        )}

        {/* Photo */}
        {issue.photo_url && (
          <div style={S.card}>
            <p style={S.label}>Photo Evidence</p>
            <img
              src={`http://localhost:8000/${issue.photo_url}`}
              alt="Evidence"
              style={{ width: '100%', maxHeight: '320px', objectFit: 'cover', borderRadius: '10px' }}
            />
          </div>
        )}

        {/* Location + Support */}
        <div style={S.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p style={S.label}>Location</p>
              <p style={{ fontSize: '0.85rem', color: '#374151', margin: 0 }}>📍 {getLocationStr(issue)}</p>
            </div>
            <button
              onClick={handleSupport}
              disabled={supporting}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: supported ? '#16a34a' : '#f3f4f6',
                color: supported ? '#fff' : '#374151',
                border: 'none', borderRadius: '10px',
                padding: '0.55rem 1rem', fontWeight: 700, fontSize: '0.85rem',
                cursor: supporting ? 'not-allowed' : 'pointer',
              }}
            >
              🙋 {supported ? 'Supported' : "I'm Affected"} ({issue.support_count || 0})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
