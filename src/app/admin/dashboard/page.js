// // 'use client';

// // import { useState, useEffect } from 'react';
// // import { useRouter } from 'next/navigation';
// // import Link from 'next/link';
// // import axios from 'axios';

// // const STATUS_THEME = {
// //   pending:     { label: 'Pending',     bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30', badge: '🟡' },
// //   in_progress: { label: 'In Progress', bg: 'bg-blue-500/10',   text: 'text-blue-400',   border: 'border-blue-500/30',   badge: '🔄' },
// //   resolved:    { label: 'Resolved',    bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', badge: '✅' },
// // };

// // export default function SubAdminDashboard() {
// //   const router = useRouter();
// //   const [issues, setIssues] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState('');
// //   const [adminInfo, setAdminInfo] = useState({ name: '', department: '', district: '', area: '', role: '' });
  
// //   // Filter state
// //   const [filterStatus, setFilterStatus] = useState('all');
// //   const [search, setSearch] = useState('');
  
// //   // Modal state
// //   const [selectedIssue, setSelectedIssue] = useState(null);
// //   const [updatingId, setUpdatingId] = useState(null);

// //   const fetchDepartmentIssues = async () => {
// //     try {
// //       setLoading(true);
// //       setError('');
// //       const res = await axios.get('http://localhost:8000/issues', { withCredentials: true });
// //       setIssues(res.data.data || []);
// //     } catch (err) {
// //       if (err.response?.status === 403) {
// //         setError(err.response?.data?.detail || 'Account deactivated or unauthorized scope.');
// //       } else if (err.response?.status === 401) {
// //         router.push('/admin/login');
// //       } else {
// //         setError('Failed to load department issues.');
// //       }
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     const role = localStorage.getItem('role');
// //     if (role !== 'sub_admin' && role !== 'admin') {
// //       router.push('/admin/login');
// //       return;
// //     }

// //     setAdminInfo({
// //       name:       localStorage.getItem('user_name')  || 'Sub Admin',
// //       department: localStorage.getItem('department') || 'Department',
// //       district:   localStorage.getItem('district')   || '',
// //       area:       localStorage.getItem('area')       || '',
// //       role:       role,
// //     });

// //     fetchDepartmentIssues();
// //   }, [router]);

// //   const handleLogout = async () => {
// //     try {
// //       await axios.post('http://localhost:8000/auth/logout', {}, { withCredentials: true });
// //     } catch (err) {
// //       console.error(err);
// //     } finally {
// //       localStorage.clear();
// //       router.push('/admin/login');
// //     }
// //   };

// //   const handleUpdateStatus = async (issueId, newStatus) => {
// //     setUpdatingId(issueId);
// //     try {
// //       const formData = new FormData();
// //       formData.append('status', newStatus);
// //       await axios.patch(`http://localhost:8000/issues/${issueId}/status`, formData, { withCredentials: true });
// //       fetchDepartmentIssues();
// //       if (selectedIssue && selectedIssue._id === issueId) {
// //         setSelectedIssue(prev => ({ ...prev, status: newStatus }));
// //       }
// //     } catch (err) {
// //       alert(err.response?.data?.detail || 'Failed to update issue status');
// //     } finally {
// //       setUpdatingId(null);
// //     }
// //   };

// //   const handleDeleteIssue = async (issueId) => {
// //     if (!confirm('Are you sure you want to soft delete this issue?')) return;
// //     try {
// //       await axios.delete(`http://localhost:8000/issues/${issueId}`, { withCredentials: true });
// //       if (selectedIssue?._id === issueId) setSelectedIssue(null);
// //       fetchDepartmentIssues();
// //     } catch (err) {
// //       alert(err.response?.data?.detail || 'Failed to delete issue');
// //     }
// //   };

// //   // Filtered issues
// //   const filteredIssues = issues.filter(i => {
// //     const matchesStatus = filterStatus === 'all' || i.status === filterStatus;
// //     const matchesSearch = i.title?.toLowerCase().includes(search.toLowerCase()) ||
// //                           i.description?.toLowerCase().includes(search.toLowerCase()) ||
// //                           i.problem_type?.toLowerCase().includes(search.toLowerCase());
// //     return matchesStatus && matchesSearch;
// //   });

// //   const counts = {
// //     all:         issues.length,
// //     pending:     issues.filter(i => i.status === 'pending').length,
// //     in_progress: issues.filter(i => i.status === 'in_progress').length,
// //     resolved:    issues.filter(i => i.status === 'resolved').length,
// //     high:        issues.filter(i => i.priority === 'high').length,
// //   };

// //   return (
// //     <div className="min-h-screen bg-emerald-950 text-white font-['Inter',sans-serif]">
      
// //       {/* Pakistan Flag Emerald Header */}
// //       <header className="bg-emerald-900/90 border-b border-emerald-500/30 sticky top-0 z-40 backdrop-blur-md px-6 py-4">
// //         <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
          
// //           <div className="flex items-center gap-3">
// //             <div className="w-10 h-10 rounded-xl bg-white text-emerald-950 flex items-center justify-center font-extrabold text-xl shadow-lg">
// //               🇵🇰
// //             </div>
// //             <div>
// //               <div className="flex items-center gap-2">
// //                 <span className="font-extrabold text-xl text-white tracking-tight">Mahol<span className="text-emerald-400">AI</span></span>
// //                 <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-400/30">
// //                   {adminInfo.department} Admin
// //                 </span>
// //               </div>
// //               <p className="text-emerald-300/80 text-xs mt-0.5">
// //                 Assigned Scope: <strong>{adminInfo.district || 'District'}</strong> → <strong>{adminInfo.area || 'Area'}</strong>
// //               </p>
// //             </div>
// //           </div>

// //           <div className="flex items-center gap-4">
// //             <div className="text-right hidden sm:block">
// //               <p className="text-sm font-semibold text-white">{adminInfo.name}</p>
// //               <p className="text-xs text-emerald-300/70">Department Administrator</p>
// //             </div>
// //             <button
// //               onClick={handleLogout}
// //               className="px-4 py-2 bg-emerald-800/60 hover:bg-red-900/60 text-emerald-200 hover:text-red-200 border border-emerald-500/30 hover:border-red-500/40 rounded-xl text-xs font-bold transition-all"
// //             >
// //               Logout →
// //             </button>
// //           </div>

// //         </div>
// //       </header>

// //       {/* Main Content Area */}
// //       <main className="max-w-7xl mx-auto px-6 py-8">
        
// //         {/* Banner Section */}
// //         <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-900 border border-emerald-500/30 rounded-3xl p-6 mb-8 shadow-xl relative overflow-hidden">
// //           <div className="relative z-10 flex flex-wrap justify-between items-center gap-4">
// //             <div>
// //               <span className="px-3 py-1 bg-emerald-400/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-400/30 uppercase tracking-wider">
// //                 🏛️ {adminInfo.department} Department Scope
// //               </span>
// //               <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
// //                 {adminInfo.area} — {adminInfo.district} Overview
// //               </h1>
// //               <p className="text-emerald-200/80 text-xs sm:text-sm mt-1 max-w-2xl">
// //                 Showing exclusively <strong>{adminInfo.department}</strong> issues within your assigned <strong>{adminInfo.area} ({adminInfo.district})</strong> jurisdiction. Backend authorization automatically enforces scope protection.
// //               </p>
// //             </div>

// //             <div className="bg-emerald-950/60 backdrop-blur border border-emerald-500/30 rounded-2xl px-5 py-3 text-center">
// //               <span className="text-xs text-emerald-300 font-bold uppercase tracking-wider block">High Urgency</span>
// //               <span className="text-2xl font-black text-red-400">{counts.high}</span>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Error Alert */}
// //         {error && (
// //           <div className="bg-red-950/80 border-l-4 border-red-500 p-5 rounded-2xl mb-8 text-red-200 text-sm font-medium">
// //             ⚠️ {error}
// //           </div>
// //         )}

// //         {/* Department Stats Cards */}
// //         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
// //           {[
// //             { key: 'all',         label: 'Total Scope Issues', count: counts.all,         color: 'text-white',       bg: 'from-emerald-900/80 to-emerald-950/80', icon: '📋' },
// //             { key: 'pending',     label: 'Pending Action',     count: counts.pending,     color: 'text-yellow-400',  bg: 'from-yellow-950/30 to-emerald-950/80',  icon: '⏳' },
// //             { key: 'in_progress', label: 'In Progress',        count: counts.in_progress, color: 'text-blue-400',    bg: 'from-blue-950/30 to-emerald-950/80',    icon: '🔄' },
// //             { key: 'resolved',    label: 'Resolved',           count: counts.resolved,    color: 'text-emerald-400', bg: 'from-emerald-900/40 to-emerald-950/80', icon: '✅' },
// //           ].map((stat) => (
// //             <button
// //               key={stat.key}
// //               onClick={() => setFilterStatus(stat.key)}
// //               className={`p-5 rounded-2xl border text-left transition-all cursor-pointer bg-gradient-to-b ${stat.bg} ${
// //                 filterStatus === stat.key
// //                   ? 'border-emerald-400 ring-2 ring-emerald-400/30 shadow-lg'
// //                   : 'border-emerald-500/20 hover:border-emerald-500/40'
// //               }`}
// //             >
// //               <div className="flex justify-between items-center mb-2">
// //                 <span className="text-xl">{stat.icon}</span>
// //                 <span className={`text-2xl font-black ${stat.color}`}>{stat.count}</span>
// //               </div>
// //               <span className="text-xs font-semibold text-emerald-200/80 block">{stat.label}</span>
// //             </button>
// //           ))}
// //         </div>

// //         {/* Filter Controls & Search */}
// //         <div className="bg-emerald-900/40 border border-emerald-500/20 rounded-2xl p-4 mb-6 flex flex-wrap justify-between items-center gap-4">
          
// //           <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
// //             {['all', 'pending', 'in_progress', 'resolved'].map((st) => (
// //               <button
// //                 key={st}
// //                 onClick={() => setFilterStatus(st)}
// //                 className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all border ${
// //                   filterStatus === st
// //                     ? 'bg-emerald-500 text-emerald-950 border-emerald-400 shadow-md'
// //                     : 'bg-emerald-950/60 text-emerald-200 border-emerald-500/20 hover:border-emerald-500/40'
// //                 }`}
// //               >
// //                 {st.replace('_', ' ')} ({st === 'all' ? counts.all : counts[st]})
// //               </button>
// //             ))}
// //           </div>

// //           <div className="w-full sm:w-64">
// //             <input
// //               type="text"
// //               placeholder="Search title, description..."
// //               value={search}
// //               onChange={(e) => setSearch(e.target.value)}
// //               className="w-full px-3.5 py-2 bg-emerald-950/80 border border-emerald-500/30 rounded-xl text-xs text-white placeholder-emerald-400/50 focus:outline-none focus:border-emerald-400"
// //             />
// //           </div>

// //         </div>

// //         {/* Issues List */}
// //         {loading ? (
// //           <div className="bg-emerald-900/30 border border-emerald-500/20 rounded-3xl p-12 text-center text-emerald-300">
// //             Loading department issues...
// //           </div>
// //         ) : filteredIssues.length === 0 ? (
// //           <div className="bg-emerald-900/30 border border-emerald-500/20 rounded-3xl p-12 text-center">
// //             <span className="text-4xl block mb-3">🌿</span>
// //             <p className="text-emerald-200 font-semibold">No issues found in this category.</p>
// //             <p className="text-emerald-400/60 text-xs mt-1">Issues submitted by citizens in {adminInfo.area} ({adminInfo.department}) will appear here automatically.</p>
// //           </div>
// //         ) : (
// //           <div className="space-y-4">
// //             {filteredIssues.map((issue) => {
// //               const th = STATUS_THEME[issue.status] || STATUS_THEME.pending;
// //               return (
// //                 <div
// //                   key={issue._id}
// //                   className="bg-emerald-900/40 hover:bg-emerald-900/60 border border-emerald-500/20 hover:border-emerald-400/40 rounded-2xl p-5 transition-all shadow-md flex flex-wrap justify-between items-center gap-4"
// //                 >
// //                   <div className="space-y-2 flex-1 min-w-[280px]">
// //                     <div className="flex flex-wrap items-center gap-2">
// //                       <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-400/30">
// //                         {issue.category}
// //                       </span>
// //                       {issue.problem_type && (
// //                         <span className="px-2.5 py-0.5 bg-emerald-950/80 text-emerald-200/80 text-xs font-medium rounded-full border border-emerald-500/20">
// //                           {issue.problem_type}
// //                         </span>
// //                       )}
// //                       <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${th.bg} ${th.text} ${th.border}`}>
// //                         {th.badge} {th.label}
// //                       </span>
// //                       {issue.priority && (
// //                         <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
// //                           issue.priority === 'high' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-emerald-950 text-emerald-300'
// //                         }`}>
// //                           Priority: {issue.priority}
// //                         </span>
// //                       )}
// //                     </div>

// //                     <h3 className="text-lg font-bold text-white tracking-tight">{issue.title}</h3>

// //                     <p className="text-xs text-emerald-200/70 line-clamp-2">
// //                       {issue.summary || issue.description}
// //                     </p>

// //                     <div className="flex flex-wrap gap-4 text-xs text-emerald-300/80 pt-1">
// //                       <span>📍 <strong>{issue.location_area}</strong>, {issue.location_district}</span>
// //                       <span>👤 Reporter: <strong>{issue.reporter_name || issue.created_by}</strong></span>
// //                       {issue.created_at && <span>📅 {new Date(issue.created_at).toLocaleDateString()}</span>}
// //                     </div>
// //                   </div>

// //                   {/* Actions */}
// //                   <div className="flex items-center gap-2">
// //                     <select
// //                       value={issue.status}
// //                       disabled={updatingId === issue._id}
// //                       onChange={(e) => handleUpdateStatus(issue._id, e.target.value)}
// //                       className="px-3 py-1.5 bg-emerald-950 border border-emerald-500/40 rounded-xl text-xs font-bold text-emerald-200 focus:outline-none"
// //                     >
// //                       <option value="pending">pending</option>
// //                       <option value="in_progress">in_progress</option>
// //                       <option value="resolved">resolved</option>
// //                     </select>

// //                     <button
// //                       onClick={() => setSelectedIssue(issue)}
// //                       className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 rounded-xl text-xs font-bold transition-all"
// //                     >
// //                       View Details
// //                     </button>

// //                     <button
// //                       onClick={() => handleDeleteIssue(issue._id)}
// //                       className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-500/30 rounded-xl text-xs font-medium transition-all"
// //                     >
// //                       Delete
// //                     </button>
// //                   </div>
// //                 </div>
// //               );
// //             })}
// //           </div>
// //         )}

// //       </main>

// //       {/* ISSUE DETAILS MODAL */}
// //       {selectedIssue && (
// //         <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
// //           <div className="bg-emerald-900 border border-emerald-500/40 rounded-3xl max-w-2xl w-full p-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
// //             <div className="flex justify-between items-center border-b border-emerald-500/30 pb-4 mb-4">
// //               <div>
// //                 <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-400/30">
// //                   {selectedIssue.category} — {selectedIssue.problem_type}
// //                 </span>
// //                 <h2 className="text-xl font-bold text-white mt-1">{selectedIssue.title}</h2>
// //               </div>
// //               <button
// //                 onClick={() => setSelectedIssue(null)}
// //                 className="text-emerald-300 hover:text-white text-2xl font-bold px-2"
// //               >
// //                 ×
// //               </button>
// //             </div>

// //             <div className="overflow-y-auto space-y-4 pr-2 flex-1 text-xs sm:text-sm">
// //               <div className="bg-emerald-950/80 p-4 rounded-2xl border border-emerald-500/20">
// //                 <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">Issue Description</p>
// //                 <p className="text-emerald-100 leading-relaxed">{selectedIssue.description}</p>
// //               </div>

// //               {selectedIssue.summary && (
// //                 <div className="bg-emerald-950/80 p-4 rounded-2xl border border-emerald-500/20">
// //                   <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">🤖 AI Analysis & Priority Summary</p>
// //                   <p className="text-emerald-200">{selectedIssue.summary}</p>
// //                   <div className="mt-2 text-xs text-emerald-300">
// //                     Assigned Urgency: <strong className="uppercase">{selectedIssue.priority || 'medium'}</strong>
// //                   </div>
// //                 </div>
// //               )}

// //               <div className="grid grid-cols-2 gap-3 bg-emerald-950/80 p-4 rounded-2xl border border-emerald-500/20">
// //                 <div>
// //                   <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1">Reporter Name</p>
// //                   <p className="text-white font-medium">{selectedIssue.reporter_name || 'Anonymous Citizen'}</p>
// //                 </div>
// //                 <div>
// //                   <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1">Reporter CNIC</p>
// //                   <p className="text-white font-mono">{selectedIssue.reporter_cnic || 'N/A'}</p>
// //                 </div>
// //                 <div>
// //                   <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1">Location Jurisdiction</p>
// //                   <p className="text-white">{selectedIssue.location_area}, {selectedIssue.location_district}</p>
// //                 </div>
// //                 <div>
// //                   <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1">Current Status</p>
// //                   <span className="font-bold capitalize text-emerald-300">{selectedIssue.status}</span>
// //                 </div>
// //               </div>

// //               {selectedIssue.photo_url && (
// //                 <div className="bg-emerald-950/80 p-4 rounded-2xl border border-emerald-500/20">
// //                   <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">Uploaded Photo Evidence</p>
// //                   <img
// //                     src={`http://localhost:8000/${selectedIssue.photo_url}`}
// //                     alt="Evidence"
// //                     className="max-h-60 rounded-xl border border-emerald-500/30 object-cover w-full"
// //                   />
// //                 </div>
// //               )}
// //             </div>

// //             <div className="border-t border-emerald-500/30 pt-4 mt-4 flex justify-between items-center">
// //               <div className="flex gap-2">
// //                 {['pending', 'in_progress', 'resolved'].map((st) => (
// //                   <button
// //                     key={st}
// //                     onClick={() => handleUpdateStatus(selectedIssue._id, st)}
// //                     className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all border ${
// //                       selectedIssue.status === st
// //                         ? 'bg-emerald-500 text-emerald-950 border-emerald-400'
// //                         : 'bg-emerald-950 text-emerald-200 border-emerald-500/30 hover:border-emerald-500/50'
// //                     }`}
// //                   >
// //                     {st.replace('_', ' ')}
// //                   </button>
// //                 ))}
// //               </div>
// //               <button
// //                 onClick={() => setSelectedIssue(null)}
// //                 className="px-4 py-2 bg-emerald-950 text-emerald-200 border border-emerald-500/30 rounded-xl text-xs font-bold hover:bg-emerald-950/80"
// //               >
// //                 Close
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //     </div>
// //   );
// // }
// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';

// const STATUS_THEME = {
//   pending:     { label: 'Pending',     bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200' },
//   in_progress: { label: 'In Progress', bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200' },
//   resolved:    { label: 'Resolved',    bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
// };

// const PRIORITY_THEME = {
//   high:   'bg-red-50 text-red-700 border-red-200',
//   medium: 'bg-gray-100 text-gray-600 border-gray-200',
//   low:    'bg-gray-50 text-gray-500 border-gray-200',
// };

// // Decorative wavy underline used inside each stat card
// function Wave({ colorClass }) {
//   return (
//     <svg viewBox="0 0 120 20" className={`w-full h-4 mt-2 ${colorClass}`} preserveAspectRatio="none">
//       <path
//         d="M0 10 Q 15 0, 30 10 T 60 10 T 90 10 T 120 10"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//       />
//     </svg>
//   );
// }

// export default function SubAdminDashboard() {
//   const router = useRouter();
//   const [issues, setIssues] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [adminInfo, setAdminInfo] = useState({ name: '', department: '', district: '', area: '', role: '' });

//   const [filterStatus, setFilterStatus] = useState('all');
//   const [search, setSearch] = useState('');

//   const [selectedIssue, setSelectedIssue] = useState(null);
//   const [updatingId, setUpdatingId] = useState(null);

//   const fetchDepartmentIssues = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       const res = await axios.get('http://localhost:8000/issues', { withCredentials: true });
//       setIssues(res.data.data || []);
//     } catch (err) {
//       if (err.response?.status === 403) {
//         setError(err.response?.data?.detail || 'Account deactivated or unauthorized scope.');
//       } else if (err.response?.status === 401) {
//         router.push('/admin/login');
//       } else {
//         setError('Failed to load department issues.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const role = localStorage.getItem('role');
//     if (role !== 'sub_admin' && role !== 'admin') {
//       router.push('/admin/login');
//       return;
//     }

//     setAdminInfo({
//       name:       localStorage.getItem('user_name')  || 'Sub Admin',
//       department: localStorage.getItem('department') || 'Department',
//       district:   localStorage.getItem('district')   || '',
//       area:       localStorage.getItem('area')       || '',
//       role:       role,
//     });

//     fetchDepartmentIssues();
//   }, [router]);

//   const handleLogout = async () => {
//     try {
//       await axios.post('http://localhost:8000/auth/logout', {}, { withCredentials: true });
//     } catch (err) {
//       console.error(err);
//     } finally {
//       localStorage.clear();
//       router.push('/admin/login');
//     }
//   };

//   const handleUpdateStatus = async (issueId, newStatus) => {
//     setUpdatingId(issueId);
//     try {
//       const formData = new FormData();
//       formData.append('status', newStatus);
//       await axios.patch(`http://localhost:8000/issues/${issueId}/status`, formData, { withCredentials: true });
//       fetchDepartmentIssues();
//       if (selectedIssue && selectedIssue._id === issueId) {
//         setSelectedIssue(prev => ({ ...prev, status: newStatus }));
//       }
//     } catch (err) {
//       alert(err.response?.data?.detail || 'Failed to update issue status');
//     } finally {
//       setUpdatingId(null);
//     }
//   };

//   const handleDeleteIssue = async (issueId) => {
//     if (!confirm('Are you sure you want to soft delete this issue?')) return;
//     try {
//       await axios.delete(`http://localhost:8000/issues/${issueId}`, { withCredentials: true });
//       if (selectedIssue?._id === issueId) setSelectedIssue(null);
//       fetchDepartmentIssues();
//     } catch (err) {
//       alert(err.response?.data?.detail || 'Failed to delete issue');
//     }
//   };

//   const filteredIssues = issues.filter(i => {
//     const matchesStatus = filterStatus === 'all' || i.status === filterStatus;
//     const matchesSearch = i.title?.toLowerCase().includes(search.toLowerCase()) ||
//                           i.description?.toLowerCase().includes(search.toLowerCase()) ||
//                           i.problem_type?.toLowerCase().includes(search.toLowerCase());
//     return matchesStatus && matchesSearch;
//   });

//   const counts = {
//     all:         issues.length,
//     pending:     issues.filter(i => i.status === 'pending').length,
//     in_progress: issues.filter(i => i.status === 'in_progress').length,
//     resolved:    issues.filter(i => i.status === 'resolved').length,
//     high:        issues.filter(i => i.priority === 'high').length,
//   };

//   return (
//     <div className="w-full min-h-screen bg-gray-100 text-gray-900 font-['Inter',sans-serif] py-6 px-4">
//       <div className="w-full max-w-[1200px] mx-auto bg-gray-50 rounded-3xl shadow-xl overflow-hidden">

//         {/* Header */}
//         <header className="w-full bg-white border-b border-gray-200">
//           <div className="flex flex-wrap justify-between items-center gap-4 px-8 py-5">
//             <div className="flex items-center gap-3">
//               <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-lg">
//                 M
//               </div>
//               <span className="font-bold text-lg text-gray-900 tracking-tight">Mahol<span className="text-emerald-600">AI</span></span>
//               <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full tracking-wide">
//                 {(adminInfo.department || 'DEPARTMENT').toUpperCase()} ADMIN
//               </span>
//             </div>

//             <div className="flex items-center gap-3">
//               <span className="text-gray-500 text-sm hidden sm:block">
//                 📍 {adminInfo.area || 'Area'}, {adminInfo.district || 'District'}
//               </span>
//               <div className="flex items-center gap-2 bg-gray-100 pl-1.5 pr-3 py-1 rounded-full">
//                 <div className="w-6 h-6 rounded-full bg-gray-700 text-white flex items-center justify-center text-xs">
//                   {adminInfo.name?.charAt(0) || 'A'}
//                 </div>
//                 <span className="text-xs font-medium text-gray-700">{adminInfo.name}</span>
//               </div>
//               <button
//                 onClick={handleLogout}
//                 className="flex items-center gap-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer border-0"
//               >
//                 Logout →
//               </button>
//             </div>
//           </div>
//         </header>

//         {/* Main Content */}
//         <main className="px-8 py-8">

//           <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Department Overview</h1>
//           <p className="text-gray-500 text-sm mt-1">
//             Showing exclusively <strong>{adminInfo.department}</strong> issues within <strong>{adminInfo.area}, {adminInfo.district}</strong>.
//           </p>

//           {error && (
//             <div className="bg-red-50 border border-red-200 p-4 rounded-xl mt-6 text-red-700 text-sm font-medium">
//               ⚠️ {error}
//             </div>
//           )}

//           {/* Colored Stat Cards with wave decoration */}
//           <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
//             <button
//               onClick={() => setFilterStatus('all')}
//               className={`text-left p-5 rounded-2xl bg-gray-50 border transition-all ${filterStatus === 'all' ? 'border-gray-400 ring-1 ring-gray-300' : 'border-gray-200 hover:border-gray-300'}`}
//             >
//               <div className="flex justify-between items-center">
//                 <span className="text-[11px] font-bold text-gray-500 tracking-wide">TOTAL ISSUES</span>
//                 <span className="text-lg">📁</span>
//               </div>
//               <span className="text-3xl font-extrabold text-gray-900 block mt-1">{counts.all}</span>
//               <Wave colorClass="text-gray-300" />
//             </button>

//             <button
//               onClick={() => setFilterStatus('pending')}
//               className={`text-left p-5 rounded-2xl bg-amber-50 border transition-all ${filterStatus === 'pending' ? 'border-amber-400 ring-1 ring-amber-300' : 'border-amber-100 hover:border-amber-300'}`}
//             >
//               <div className="flex justify-between items-center">
//                 <span className="text-[11px] font-bold text-amber-600 tracking-wide">PENDING</span>
//                 <span className="text-lg">⏰</span>
//               </div>
//               <span className="text-3xl font-extrabold text-amber-600 block mt-1">{counts.pending}</span>
//               <Wave colorClass="text-amber-300" />
//             </button>

//             <button
//               onClick={() => setFilterStatus('in_progress')}
//               className={`text-left p-5 rounded-2xl bg-blue-50 border transition-all ${filterStatus === 'in_progress' ? 'border-blue-400 ring-1 ring-blue-300' : 'border-blue-100 hover:border-blue-300'}`}
//             >
//               <div className="flex justify-between items-center">
//                 <span className="text-[11px] font-bold text-blue-600 tracking-wide">IN PROGRESS</span>
//                 <span className="text-lg">⚙️</span>
//               </div>
//               <span className="text-3xl font-extrabold text-blue-600 block mt-1">{counts.in_progress}</span>
//               <Wave colorClass="text-blue-300" />
//             </button>

//             <button
//               onClick={() => setFilterStatus('resolved')}
//               className={`text-left p-5 rounded-2xl bg-emerald-50 border transition-all ${filterStatus === 'resolved' ? 'border-emerald-400 ring-1 ring-emerald-300' : 'border-emerald-100 hover:border-emerald-300'}`}
//             >
//               <div className="flex justify-between items-center">
//                 <span className="text-[11px] font-bold text-emerald-600 tracking-wide">RESOLVED</span>
//                 <span className="text-lg">✅</span>
//               </div>
//               <span className="text-3xl font-extrabold text-emerald-600 block mt-1">{counts.resolved}</span>
//               <Wave colorClass="text-emerald-300" />
//             </button>
//           </div>

//           {/* Filter bar */}
//           <div className="bg-white border border-gray-200 rounded-2xl p-5 mt-6 shadow-sm">
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="text-[11px] font-bold text-gray-400 tracking-wide block mb-1.5">SEARCH</label>
//                 <input
//                   type="text"
//                   placeholder="Title, description..."
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
//                 />
//               </div>
//               <div>
//                 <label className="text-[11px] font-bold text-gray-400 tracking-wide block mb-1.5">STATUS</label>
//                 <select
//                   value={filterStatus}
//                   onChange={(e) => setFilterStatus(e.target.value)}
//                   className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-emerald-400"
//                 >
//                   <option value="all">All Statuses</option>
//                   <option value="pending">Pending</option>
//                   <option value="in_progress">In Progress</option>
//                   <option value="resolved">Resolved</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           {/* Issues List */}
//           <div className="mt-6 mb-3 flex items-center gap-2">
//             <span>📋</span>
//             <h2 className="text-lg font-bold text-gray-900">Department Issues ({filteredIssues.length})</h2>
//           </div>
//           <p className="text-gray-500 text-xs -mt-2 mb-3">Showing issues matching active filters.</p>

//           {loading ? (
//             <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center text-gray-500 shadow-sm">
//               Loading department issues...
//             </div>
//           ) : filteredIssues.length === 0 ? (
//             <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center shadow-sm">
//               <span className="text-4xl block mb-3">🌿</span>
//               <p className="text-gray-700 font-semibold">No issues found in this category.</p>
//               <p className="text-gray-400 text-xs mt-1">Issues submitted in {adminInfo.area} ({adminInfo.department}) will appear here automatically.</p>
//             </div>
//           ) : (
//             <div className="bg-white border border-gray-200 rounded-2xl shadow-sm divide-y divide-gray-100 overflow-hidden">
//               {filteredIssues.map((issue) => {
//                 const th = STATUS_THEME[issue.status] || STATUS_THEME.pending;
//                 const pr = PRIORITY_THEME[issue.priority] || PRIORITY_THEME.medium;
//                 return (
//                   <div
//                     key={issue._id}
//                     className="p-5 hover:bg-gray-50 transition-colors flex flex-wrap justify-between items-center gap-4"
//                   >
//                     <div className="space-y-1.5 flex-1 min-w-[280px]">
//                       <div className="flex flex-wrap items-center gap-2">
//                         <h3 className="text-base font-bold text-gray-900">{issue.title}</h3>
//                         {issue.priority && (
//                           <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase border ${pr}`}>
//                             {issue.priority}
//                           </span>
//                         )}
//                       </div>
//                       <p className="text-xs text-gray-400">
//                         📍 {issue.location_area}, {issue.location_district} &nbsp;|&nbsp; 🏷️ <span className="font-semibold text-gray-500">{issue.category}</span>{issue.problem_type ? ` (${issue.problem_type})` : ''}
//                       </p>
//                     </div>

//                     <div className="flex items-center gap-2">
//                       <span className={`px-3 py-1.5 text-xs font-bold rounded-full border ${th.bg} ${th.text} ${th.border}`}>
//                         {th.label}
//                       </span>
//                       <select
//                         value={issue.status}
//                         disabled={updatingId === issue._id}
//                         onChange={(e) => handleUpdateStatus(issue._id, e.target.value)}
//                         className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:outline-none focus:border-emerald-400"
//                       >
//                         <option value="pending">pending</option>
//                         <option value="in_progress">in_progress</option>
//                         <option value="resolved">resolved</option>
//                       </select>
//                       <button
//                         onClick={() => setSelectedIssue(issue)}
//                         className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
//                       >
//                         👁️ View Details
//                       </button>
//                       <button
//                         onClick={() => handleDeleteIssue(issue._id)}
//                         className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
//                       >
//                         🗑️ Delete
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}

//         </main>
//       </div>

//       {/* ISSUE DETAILS MODAL */}
//       {selectedIssue && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="bg-white border border-gray-200 rounded-2xl max-w-2xl w-full p-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
//             <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
//               <div>
//                 <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
//                   {selectedIssue.category} — {selectedIssue.problem_type}
//                 </span>
//                 <h2 className="text-xl font-bold text-gray-900 mt-1">{selectedIssue.title}</h2>
//               </div>
//               <button
//                 onClick={() => setSelectedIssue(null)}
//                 className="text-gray-400 hover:text-gray-700 text-2xl font-bold px-2 bg-transparent border-0 cursor-pointer"
//               >
//                 ×
//               </button>
//             </div>

//             <div className="overflow-y-auto space-y-4 pr-2 flex-1 text-sm">
//               <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
//                 <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Issue Description</p>
//                 <p className="text-gray-800 leading-relaxed">{selectedIssue.description}</p>
//               </div>

//               {selectedIssue.summary && (
//                 <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
//                   <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">🤖 AI Analysis & Priority Summary</p>
//                   <p className="text-emerald-900">{selectedIssue.summary}</p>
//                   <div className="mt-2 text-xs text-emerald-700">
//                     Assigned Urgency: <strong className="uppercase">{selectedIssue.priority || 'medium'}</strong>
//                   </div>
//                 </div>
//               )}

//               <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
//                 <div>
//                   <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Reporter Name</p>
//                   <p className="text-gray-900 font-medium">{selectedIssue.reporter_name || 'Anonymous Citizen'}</p>
//                 </div>
//                 <div>
//                   <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Reporter CNIC</p>
//                   <p className="text-gray-900 font-mono">{selectedIssue.reporter_cnic || 'N/A'}</p>
//                 </div>
//                 <div>
//                   <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Location</p>
//                   <p className="text-gray-900">{selectedIssue.location_area}, {selectedIssue.location_district}</p>
//                 </div>
//                 <div>
//                   <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Current Status</p>
//                   <span className="font-semibold capitalize text-emerald-700">{selectedIssue.status}</span>
//                 </div>
//               </div>

//               {selectedIssue.photo_url && (
//                 <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
//                   <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Uploaded Photo Evidence</p>
//                   <img
//                     src={`http://localhost:8000/${selectedIssue.photo_url}`}
//                     alt="Evidence"
//                     className="max-h-60 rounded-lg border border-gray-200 object-cover w-full"
//                   />
//                 </div>
//               )}
//             </div>

//             <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between items-center">
//               <div className="flex gap-2">
//                 {['pending', 'in_progress', 'resolved'].map((st) => (
//                   <button
//                     key={st}
//                     onClick={() => handleUpdateStatus(selectedIssue._id, st)}
//                     className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all border cursor-pointer ${
//                       selectedIssue.status === st
//                         ? 'bg-emerald-600 text-white border-emerald-600'
//                         : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
//                     }`}
//                   >
//                     {st.replace('_', ' ')}
//                   </button>
//                 ))}
//               </div>
//               <button
//                 onClick={() => setSelectedIssue(null)}
//                 className="px-4 py-2 bg-white text-gray-600 border border-gray-200 rounded-lg text-xs font-semibold hover:bg-gray-50 cursor-pointer"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }
// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import axios from 'axios';

// const STATUS_THEME = {
//   pending:     { label: 'Pending',     bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30', badge: '🟡' },
//   in_progress: { label: 'In Progress', bg: 'bg-blue-500/10',   text: 'text-blue-400',   border: 'border-blue-500/30',   badge: '🔄' },
//   resolved:    { label: 'Resolved',    bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', badge: '✅' },
// };

// export default function SubAdminDashboard() {
//   const router = useRouter();
//   const [issues, setIssues] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [adminInfo, setAdminInfo] = useState({ name: '', department: '', district: '', area: '', role: '' });
  
//   // Filter state
//   const [filterStatus, setFilterStatus] = useState('all');
//   const [search, setSearch] = useState('');
  
//   // Modal state
//   const [selectedIssue, setSelectedIssue] = useState(null);
//   const [updatingId, setUpdatingId] = useState(null);

//   const fetchDepartmentIssues = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       const res = await axios.get('http://localhost:8000/issues', { withCredentials: true });
//       setIssues(res.data.data || []);
//     } catch (err) {
//       if (err.response?.status === 403) {
//         setError(err.response?.data?.detail || 'Account deactivated or unauthorized scope.');
//       } else if (err.response?.status === 401) {
//         router.push('/admin/login');
//       } else {
//         setError('Failed to load department issues.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const role = localStorage.getItem('role');
//     if (role !== 'sub_admin' && role !== 'admin') {
//       router.push('/admin/login');
//       return;
//     }

//     setAdminInfo({
//       name:       localStorage.getItem('user_name')  || 'Sub Admin',
//       department: localStorage.getItem('department') || 'Department',
//       district:   localStorage.getItem('district')   || '',
//       area:       localStorage.getItem('area')       || '',
//       role:       role,
//     });

//     fetchDepartmentIssues();
//   }, [router]);

//   const handleLogout = async () => {
//     try {
//       await axios.post('http://localhost:8000/auth/logout', {}, { withCredentials: true });
//     } catch (err) {
//       console.error(err);
//     } finally {
//       localStorage.clear();
//       router.push('/admin/login');
//     }
//   };

//   const handleUpdateStatus = async (issueId, newStatus) => {
//     setUpdatingId(issueId);
//     try {
//       const formData = new FormData();
//       formData.append('status', newStatus);
//       await axios.patch(`http://localhost:8000/issues/${issueId}/status`, formData, { withCredentials: true });
//       fetchDepartmentIssues();
//       if (selectedIssue && selectedIssue._id === issueId) {
//         setSelectedIssue(prev => ({ ...prev, status: newStatus }));
//       }
//     } catch (err) {
//       alert(err.response?.data?.detail || 'Failed to update issue status');
//     } finally {
//       setUpdatingId(null);
//     }
//   };

//   const handleDeleteIssue = async (issueId) => {
//     if (!confirm('Are you sure you want to soft delete this issue?')) return;
//     try {
//       await axios.delete(`http://localhost:8000/issues/${issueId}`, { withCredentials: true });
//       if (selectedIssue?._id === issueId) setSelectedIssue(null);
//       fetchDepartmentIssues();
//     } catch (err) {
//       alert(err.response?.data?.detail || 'Failed to delete issue');
//     }
//   };

//   // Filtered issues
//   const filteredIssues = issues.filter(i => {
//     const matchesStatus = filterStatus === 'all' || i.status === filterStatus;
//     const matchesSearch = i.title?.toLowerCase().includes(search.toLowerCase()) ||
//                           i.description?.toLowerCase().includes(search.toLowerCase()) ||
//                           i.problem_type?.toLowerCase().includes(search.toLowerCase());
//     return matchesStatus && matchesSearch;
//   });

//   const counts = {
//     all:         issues.length,
//     pending:     issues.filter(i => i.status === 'pending').length,
//     in_progress: issues.filter(i => i.status === 'in_progress').length,
//     resolved:    issues.filter(i => i.status === 'resolved').length,
//     high:        issues.filter(i => i.priority === 'high').length,
//   };

//   return (
//     <div className="min-h-screen bg-emerald-950 text-white font-['Inter',sans-serif]">
      
//       {/* Pakistan Flag Emerald Header */}
//       <header className="bg-emerald-900/90 border-b border-emerald-500/30 sticky top-0 z-40 backdrop-blur-md px-6 py-4">
//         <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
          
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-xl bg-white text-emerald-950 flex items-center justify-center font-extrabold text-xl shadow-lg">
//               🇵🇰
//             </div>
//             <div>
//               <div className="flex items-center gap-2">
//                 <span className="font-extrabold text-xl text-white tracking-tight">Mahol<span className="text-emerald-400">AI</span></span>
//                 <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-400/30">
//                   {adminInfo.department} Admin
//                 </span>
//               </div>
//               <p className="text-emerald-300/80 text-xs mt-0.5">
//                 Assigned Scope: <strong>{adminInfo.district || 'District'}</strong> → <strong>{adminInfo.area || 'Area'}</strong>
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-4">
//             <div className="text-right hidden sm:block">
//               <p className="text-sm font-semibold text-white">{adminInfo.name}</p>
//               <p className="text-xs text-emerald-300/70">Department Administrator</p>
//             </div>
//             <button
//               onClick={handleLogout}
//               className="px-4 py-2 bg-emerald-800/60 hover:bg-red-900/60 text-emerald-200 hover:text-red-200 border border-emerald-500/30 hover:border-red-500/40 rounded-xl text-xs font-bold transition-all"
//             >
//               Logout →
//             </button>
//           </div>

//         </div>
//       </header>

//       {/* Main Content Area */}
//       <main className="max-w-7xl mx-auto px-6 py-8">
        
//         {/* Banner Section */}
//         <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-900 border border-emerald-500/30 rounded-3xl p-6 mb-8 shadow-xl relative overflow-hidden">
//           <div className="relative z-10 flex flex-wrap justify-between items-center gap-4">
//             <div>
//               <span className="px-3 py-1 bg-emerald-400/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-400/30 uppercase tracking-wider">
//                 🏛️ {adminInfo.department} Department Scope
//               </span>
//               <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
//                 {adminInfo.area} — {adminInfo.district} Overview
//               </h1>
//               <p className="text-emerald-200/80 text-xs sm:text-sm mt-1 max-w-2xl">
//                 Showing exclusively <strong>{adminInfo.department}</strong> issues within your assigned <strong>{adminInfo.area} ({adminInfo.district})</strong> jurisdiction. Backend authorization automatically enforces scope protection.
//               </p>
//             </div>

//             <div className="bg-emerald-950/60 backdrop-blur border border-emerald-500/30 rounded-2xl px-5 py-3 text-center">
//               <span className="text-xs text-emerald-300 font-bold uppercase tracking-wider block">High Urgency</span>
//               <span className="text-2xl font-black text-red-400">{counts.high}</span>
//             </div>
//           </div>
//         </div>

//         {/* Error Alert */}
//         {error && (
//           <div className="bg-red-950/80 border-l-4 border-red-500 p-5 rounded-2xl mb-8 text-red-200 text-sm font-medium">
//             ⚠️ {error}
//           </div>
//         )}

//         {/* Department Stats Cards */}
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
//           {[
//             { key: 'all',         label: 'Total Scope Issues', count: counts.all,         color: 'text-white',       bg: 'from-emerald-900/80 to-emerald-950/80', icon: '📋' },
//             { key: 'pending',     label: 'Pending Action',     count: counts.pending,     color: 'text-yellow-400',  bg: 'from-yellow-950/30 to-emerald-950/80',  icon: '⏳' },
//             { key: 'in_progress', label: 'In Progress',        count: counts.in_progress, color: 'text-blue-400',    bg: 'from-blue-950/30 to-emerald-950/80',    icon: '🔄' },
//             { key: 'resolved',    label: 'Resolved',           count: counts.resolved,    color: 'text-emerald-400', bg: 'from-emerald-900/40 to-emerald-950/80', icon: '✅' },
//           ].map((stat) => (
//             <button
//               key={stat.key}
//               onClick={() => setFilterStatus(stat.key)}
//               className={`p-5 rounded-2xl border text-left transition-all cursor-pointer bg-gradient-to-b ${stat.bg} ${
//                 filterStatus === stat.key
//                   ? 'border-emerald-400 ring-2 ring-emerald-400/30 shadow-lg'
//                   : 'border-emerald-500/20 hover:border-emerald-500/40'
//               }`}
//             >
//               <div className="flex justify-between items-center mb-2">
//                 <span className="text-xl">{stat.icon}</span>
//                 <span className={`text-2xl font-black ${stat.color}`}>{stat.count}</span>
//               </div>
//               <span className="text-xs font-semibold text-emerald-200/80 block">{stat.label}</span>
//             </button>
//           ))}
//         </div>

//         {/* Filter Controls & Search */}
//         <div className="bg-emerald-900/40 border border-emerald-500/20 rounded-2xl p-4 mb-6 flex flex-wrap justify-between items-center gap-4">
          
//           <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
//             {['all', 'pending', 'in_progress', 'resolved'].map((st) => (
//               <button
//                 key={st}
//                 onClick={() => setFilterStatus(st)}
//                 className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all border ${
//                   filterStatus === st
//                     ? 'bg-emerald-500 text-emerald-950 border-emerald-400 shadow-md'
//                     : 'bg-emerald-950/60 text-emerald-200 border-emerald-500/20 hover:border-emerald-500/40'
//                 }`}
//               >
//                 {st.replace('_', ' ')} ({st === 'all' ? counts.all : counts[st]})
//               </button>
//             ))}
//           </div>

//           <div className="w-full sm:w-64">
//             <input
//               type="text"
//               placeholder="Search title, description..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full px-3.5 py-2 bg-emerald-950/80 border border-emerald-500/30 rounded-xl text-xs text-white placeholder-emerald-400/50 focus:outline-none focus:border-emerald-400"
//             />
//           </div>

//         </div>

//         {/* Issues List */}
//         {loading ? (
//           <div className="bg-emerald-900/30 border border-emerald-500/20 rounded-3xl p-12 text-center text-emerald-300">
//             Loading department issues...
//           </div>
//         ) : filteredIssues.length === 0 ? (
//           <div className="bg-emerald-900/30 border border-emerald-500/20 rounded-3xl p-12 text-center">
//             <span className="text-4xl block mb-3">🌿</span>
//             <p className="text-emerald-200 font-semibold">No issues found in this category.</p>
//             <p className="text-emerald-400/60 text-xs mt-1">Issues submitted by citizens in {adminInfo.area} ({adminInfo.department}) will appear here automatically.</p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {filteredIssues.map((issue) => {
//               const th = STATUS_THEME[issue.status] || STATUS_THEME.pending;
//               return (
//                 <div
//                   key={issue._id}
//                   className="bg-emerald-900/40 hover:bg-emerald-900/60 border border-emerald-500/20 hover:border-emerald-400/40 rounded-2xl p-5 transition-all shadow-md flex flex-wrap justify-between items-center gap-4"
//                 >
//                   <div className="space-y-2 flex-1 min-w-[280px]">
//                     <div className="flex flex-wrap items-center gap-2">
//                       <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-400/30">
//                         {issue.category}
//                       </span>
//                       {issue.problem_type && (
//                         <span className="px-2.5 py-0.5 bg-emerald-950/80 text-emerald-200/80 text-xs font-medium rounded-full border border-emerald-500/20">
//                           {issue.problem_type}
//                         </span>
//                       )}
//                       <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${th.bg} ${th.text} ${th.border}`}>
//                         {th.badge} {th.label}
//                       </span>
//                       {issue.priority && (
//                         <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
//                           issue.priority === 'high' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-emerald-950 text-emerald-300'
//                         }`}>
//                           Priority: {issue.priority}
//                         </span>
//                       )}
//                     </div>

//                     <h3 className="text-lg font-bold text-white tracking-tight">{issue.title}</h3>

//                     <p className="text-xs text-emerald-200/70 line-clamp-2">
//                       {issue.summary || issue.description}
//                     </p>

//                     <div className="flex flex-wrap gap-4 text-xs text-emerald-300/80 pt-1">
//                       <span>📍 <strong>{issue.location_area}</strong>, {issue.location_district}</span>
//                       <span>👤 Reporter: <strong>{issue.reporter_name || issue.created_by}</strong></span>
//                       {issue.created_at && <span>📅 {new Date(issue.created_at).toLocaleDateString()}</span>}
//                     </div>
//                   </div>

//                   {/* Actions */}
//                   <div className="flex items-center gap-2">
//                     <select
//                       value={issue.status}
//                       disabled={updatingId === issue._id}
//                       onChange={(e) => handleUpdateStatus(issue._id, e.target.value)}
//                       className="px-3 py-1.5 bg-emerald-950 border border-emerald-500/40 rounded-xl text-xs font-bold text-emerald-200 focus:outline-none"
//                     >
//                       <option value="pending">pending</option>
//                       <option value="in_progress">in_progress</option>
//                       <option value="resolved">resolved</option>
//                     </select>

//                     <button
//                       onClick={() => setSelectedIssue(issue)}
//                       className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 rounded-xl text-xs font-bold transition-all"
//                     >
//                       View Details
//                     </button>

//                     <button
//                       onClick={() => handleDeleteIssue(issue._id)}
//                       className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-500/30 rounded-xl text-xs font-medium transition-all"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//       </main>

//       {/* ISSUE DETAILS MODAL */}
//       {selectedIssue && (
//         <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="bg-emerald-900 border border-emerald-500/40 rounded-3xl max-w-2xl w-full p-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
//             <div className="flex justify-between items-center border-b border-emerald-500/30 pb-4 mb-4">
//               <div>
//                 <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-400/30">
//                   {selectedIssue.category} — {selectedIssue.problem_type}
//                 </span>
//                 <h2 className="text-xl font-bold text-white mt-1">{selectedIssue.title}</h2>
//               </div>
//               <button
//                 onClick={() => setSelectedIssue(null)}
//                 className="text-emerald-300 hover:text-white text-2xl font-bold px-2"
//               >
//                 ×
//               </button>
//             </div>

//             <div className="overflow-y-auto space-y-4 pr-2 flex-1 text-xs sm:text-sm">
//               <div className="bg-emerald-950/80 p-4 rounded-2xl border border-emerald-500/20">
//                 <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">Issue Description</p>
//                 <p className="text-emerald-100 leading-relaxed">{selectedIssue.description}</p>
//               </div>

//               {selectedIssue.summary && (
//                 <div className="bg-emerald-950/80 p-4 rounded-2xl border border-emerald-500/20">
//                   <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">🤖 AI Analysis & Priority Summary</p>
//                   <p className="text-emerald-200">{selectedIssue.summary}</p>
//                   <div className="mt-2 text-xs text-emerald-300">
//                     Assigned Urgency: <strong className="uppercase">{selectedIssue.priority || 'medium'}</strong>
//                   </div>
//                 </div>
//               )}

//               <div className="grid grid-cols-2 gap-3 bg-emerald-950/80 p-4 rounded-2xl border border-emerald-500/20">
//                 <div>
//                   <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1">Reporter Name</p>
//                   <p className="text-white font-medium">{selectedIssue.reporter_name || 'Anonymous Citizen'}</p>
//                 </div>
//                 <div>
//                   <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1">Reporter CNIC</p>
//                   <p className="text-white font-mono">{selectedIssue.reporter_cnic || 'N/A'}</p>
//                 </div>
//                 <div>
//                   <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1">Location Jurisdiction</p>
//                   <p className="text-white">{selectedIssue.location_area}, {selectedIssue.location_district}</p>
//                 </div>
//                 <div>
//                   <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1">Current Status</p>
//                   <span className="font-bold capitalize text-emerald-300">{selectedIssue.status}</span>
//                 </div>
//               </div>

//               {selectedIssue.photo_url && (
//                 <div className="bg-emerald-950/80 p-4 rounded-2xl border border-emerald-500/20">
//                   <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">Uploaded Photo Evidence</p>
//                   <img
//                     src={`http://localhost:8000/${selectedIssue.photo_url}`}
//                     alt="Evidence"
//                     className="max-h-60 rounded-xl border border-emerald-500/30 object-cover w-full"
//                   />
//                 </div>
//               )}
//             </div>

//             <div className="border-t border-emerald-500/30 pt-4 mt-4 flex justify-between items-center">
//               <div className="flex gap-2">
//                 {['pending', 'in_progress', 'resolved'].map((st) => (
//                   <button
//                     key={st}
//                     onClick={() => handleUpdateStatus(selectedIssue._id, st)}
//                     className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all border ${
//                       selectedIssue.status === st
//                         ? 'bg-emerald-500 text-emerald-950 border-emerald-400'
//                         : 'bg-emerald-950 text-emerald-200 border-emerald-500/30 hover:border-emerald-500/50'
//                     }`}
//                   >
//                     {st.replace('_', ' ')}
//                   </button>
//                 ))}
//               </div>
//               <button
//                 onClick={() => setSelectedIssue(null)}
//                 className="px-4 py-2 bg-emerald-950 text-emerald-200 border border-emerald-500/30 rounded-xl text-xs font-bold hover:bg-emerald-950/80"
//               >
//                 Close
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
import { useRouter } from 'next/navigation';
import axios from 'axios';

const STATUS_THEME = {
  PENDING:     { label: 'Pending',     bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200' },
  IN_PROGRESS: { label: 'In Progress', bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200' },
  RESOLVED:    { label: 'Resolved',    bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  REJECTED:    { label: 'Rejected',    bg: 'bg-red-50',      text: 'text-red-700',     border: 'border-red-200' },
};

const PRIORITY_THEME = {
  high:   'bg-red-50 text-red-700 border-red-200',
  medium: 'bg-gray-100 text-gray-600 border-gray-200',
  low:    'bg-gray-50 text-gray-500 border-gray-200',
};
const NEXT_STATUS_OPTIONS = {
  PENDING: ['PENDING', 'IN_PROGRESS', 'REJECTED'],
  IN_PROGRESS: ['IN_PROGRESS', 'RESOLVED', 'REJECTED'],
  RESOLVED: ['RESOLVED'],
  REJECTED: ['REJECTED'],
};

// Decorative wavy underline used inside each stat card
function Wave({ colorClass }) {
  return (
    <svg viewBox="0 0 120 20" className={`w-full h-4 mt-2 ${colorClass}`} preserveAspectRatio="none">
      <path
        d="M0 10 Q 15 0, 30 10 T 60 10 T 90 10 T 120 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function SubAdminDashboard() {
  const router = useRouter();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminInfo, setAdminInfo] = useState({ name: '', department: '', district: '', area: '', role: '' });

  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');

  const [selectedIssue, setSelectedIssue] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchDepartmentIssues = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get('http://localhost:8000/issues', { withCredentials: true });
      setIssues(res.data.data || []);
    } catch (err) {
      if (err.response?.status === 403) {
        setError(err.response?.data?.detail || 'Account deactivated or unauthorized scope.');
      } else if (err.response?.status === 401) {
        router.push('/admin/login');
      } else {
        setError('Failed to load department issues.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'sub_admin' && role !== 'admin') {
      router.push('/admin/login');
      return;
    }

    setAdminInfo({
      name:       localStorage.getItem('user_name')  || 'Sub Admin',
      department: localStorage.getItem('department') || 'Department',
      district:   localStorage.getItem('district')   || '',
      area:       localStorage.getItem('area')       || '',
      role:       role,
    });

    fetchDepartmentIssues();
  }, [router]);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8000/auth/logout', {}, { withCredentials: true });
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.clear();
      router.push('/admin/login');
    }
  };

  const handleUpdateStatus = async (issueId, newStatus) => {
    setUpdatingId(issueId);
    try {
      const formData = new FormData();
      formData.append('status', newStatus);
      await axios.patch(`http://localhost:8000/issues/${issueId}/status`, formData, { withCredentials: true });
      fetchDepartmentIssues();
      if (selectedIssue && selectedIssue._id === issueId) {
        setSelectedIssue(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to update issue status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteIssue = async (issueId) => {
    if (!confirm('Are you sure you want to soft delete this issue?')) return;
    try {
      await axios.delete(`http://localhost:8000/issues/${issueId}`, { withCredentials: true });
      if (selectedIssue?._id === issueId) setSelectedIssue(null);
      fetchDepartmentIssues();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to delete issue');
    }
  };

  const filteredIssues = issues.filter(i => {
    const matchesStatus = filterStatus === 'all' || i.status === filterStatus;
    const matchesSearch = i.title?.toLowerCase().includes(search.toLowerCase()) ||
                          i.description?.toLowerCase().includes(search.toLowerCase()) ||
                          i.problem_type?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const counts = {
    all:         issues.length,
    pending:     issues.filter(i => i.status === 'PENDING').length,
    in_progress: issues.filter(i => i.status === 'IN_PROGRESS').length,
    resolved:    issues.filter(i => i.status === 'RESOLVED').length,
    high:        issues.filter(i => i.priority === 'high').length,
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 text-gray-900 font-['Inter',sans-serif] py-6 px-4">
      <div className="w-full max-w-[1200px] mx-auto bg-gray-50 rounded-3xl shadow-xl overflow-hidden">

        {/* Header */}
        <header className="w-full bg-white border-b border-gray-200">
          <div className="flex flex-wrap justify-between items-center gap-4 px-8 py-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-lg">
                M
              </div>
              <span className="font-bold text-lg text-gray-900 tracking-tight">Mahol<span className="text-emerald-600">AI</span></span>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full tracking-wide">
                {(adminInfo.department || 'DEPARTMENT').toUpperCase()} ADMIN
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-gray-500 text-sm hidden sm:block">
                📍 {adminInfo.area || 'Area'}, {adminInfo.district || 'District'}
              </span>
              <div className="flex items-center gap-2 bg-gray-100 pl-1.5 pr-3 py-1 rounded-full">
                <div className="w-6 h-6 rounded-full bg-gray-700 text-white flex items-center justify-center text-xs">
                  {adminInfo.name?.charAt(0) || 'A'}
                </div>
                <span className="text-xs font-medium text-gray-700">{adminInfo.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer border-0"
              >
                Logout →
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-8 py-8">

          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Department Overview</h1>
          <p className="text-gray-500 text-sm mt-1">
            Showing exclusively <strong>{adminInfo.department}</strong> issues within <strong>{adminInfo.area}, {adminInfo.district}</strong>.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl mt-6 text-red-700 text-sm font-medium">
              ⚠️ {error}
            </div>
          )}

          {/* Colored Stat Cards with wave decoration */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <button
              onClick={() => setFilterStatus('all')}
              className={`text-left p-5 rounded-2xl bg-gray-50 border transition-all ${filterStatus === 'all' ? 'border-gray-400 ring-1 ring-gray-300' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-gray-500 tracking-wide">TOTAL ISSUES</span>
                <span className="text-lg">📁</span>
              </div>
              <span className="text-3xl font-extrabold text-gray-900 block mt-1">{counts.all}</span>
              <Wave colorClass="text-gray-300" />
            </button>

            <button
              onClick={() => setFilterStatus('PENDING')}
              className={`text-left p-5 rounded-2xl bg-amber-50 border transition-all ${filterStatus === 'PENDING' ? 'border-amber-400 ring-1 ring-amber-300' : 'border-amber-100 hover:border-amber-300'}`}
            >
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-amber-600 tracking-wide">PENDING</span>
                <span className="text-lg">⏰</span>
              </div>
              <span className="text-3xl font-extrabold text-amber-600 block mt-1">{counts.pending}</span>
              <Wave colorClass="text-amber-300" />
            </button>

            <button
              onClick={() => setFilterStatus('IN_PROGRESS')}
              className={`text-left p-5 rounded-2xl bg-blue-50 border transition-all ${filterStatus === 'IN_PROGRESS' ? 'border-blue-400 ring-1 ring-blue-300' : 'border-blue-100 hover:border-blue-300'}`}
            >
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-blue-600 tracking-wide">IN PROGRESS</span>
                <span className="text-lg">⚙️</span>
              </div>
              <span className="text-3xl font-extrabold text-blue-600 block mt-1">{counts.in_progress}</span>
              <Wave colorClass="text-blue-300" />
            </button>

            <button
              onClick={() => setFilterStatus('RESOLVED')}
              className={`text-left p-5 rounded-2xl bg-emerald-50 border transition-all ${filterStatus === 'RESOLVED' ? 'border-emerald-400 ring-1 ring-emerald-300' : 'border-emerald-100 hover:border-emerald-300'}`}
            >
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-emerald-600 tracking-wide">RESOLVED</span>
                <span className="text-lg">✅</span>
              </div>
              <span className="text-3xl font-extrabold text-emerald-600 block mt-1">{counts.resolved}</span>
              <Wave colorClass="text-emerald-300" />
            </button>
          </div>

          {/* Filter bar */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 mt-6 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-gray-400 tracking-wide block mb-1.5">SEARCH</label>
                <input
                  type="text"
                  placeholder="Title, description..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-gray-400 tracking-wide block mb-1.5">STATUS</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-emerald-400"
                >
                  <option value="all">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* Issues List */}
          <div className="mt-6 mb-3 flex items-center gap-2">
            <span>📋</span>
            <h2 className="text-lg font-bold text-gray-900">Department Issues ({filteredIssues.length})</h2>
          </div>
          <p className="text-gray-500 text-xs -mt-2 mb-3">Showing issues matching active filters.</p>

          {loading ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center text-gray-500 shadow-sm">
              Loading department issues...
            </div>
          ) : filteredIssues.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center shadow-sm">
              <span className="text-4xl block mb-3">🌿</span>
              <p className="text-gray-700 font-semibold">No issues found in this category.</p>
              <p className="text-gray-400 text-xs mt-1">Issues submitted in {adminInfo.area} ({adminInfo.department}) will appear here automatically.</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm divide-y divide-gray-100 overflow-hidden">
              {filteredIssues.map((issue) => {
                const th = STATUS_THEME[issue.status] || STATUS_THEME.PENDING;
                const pr = PRIORITY_THEME[issue.priority] || PRIORITY_THEME.medium;
                return (
                  <div
                    key={issue._id}
                    className="p-5 hover:bg-gray-50 transition-colors flex flex-wrap justify-between items-center gap-4"
                  >
                    <div className="space-y-1.5 flex-1 min-w-[280px]">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-gray-900">{issue.title}</h3>
                        {issue.priority && (
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase border ${pr}`}>
                            {issue.priority}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">
                        📍 {issue.location_area}, {issue.location_district} &nbsp;|&nbsp; 🏷️ <span className="font-semibold text-gray-500">{issue.category}</span>{issue.problem_type ? ` (${issue.problem_type})` : ''}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1.5 text-xs font-bold rounded-full border ${th.bg} ${th.text} ${th.border}`}>
                        {th.label}
                      </span>
                    <select
  value={issue.status}
  disabled={updatingId === issue._id}
  onChange={(e) => handleUpdateStatus(issue._id, e.target.value)}
  className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:outline-none focus:border-emerald-400"
>
  {(NEXT_STATUS_OPTIONS[issue.status] || ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED']).map((st) => (
    <option key={st} value={st}>{st.replace('_', ' ')}</option>
  ))}
</select>
                      <button
                        onClick={() => setSelectedIssue(issue)}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                      >
                        👁️ View Details
                      </button>
                      <button
                        onClick={() => handleDeleteIssue(issue._id)}
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </main>
      </div>

      {/* ISSUE DETAILS MODAL */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-2xl w-full p-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
              <div>
                <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                  {selectedIssue.category} — {selectedIssue.problem_type}
                </span>
                <h2 className="text-xl font-bold text-gray-900 mt-1">{selectedIssue.title}</h2>
              </div>
              <button
                onClick={() => setSelectedIssue(null)}
                className="text-gray-400 hover:text-gray-700 text-2xl font-bold px-2 bg-transparent border-0 cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 pr-2 flex-1 text-sm">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Issue Description</p>
                <p className="text-gray-800 leading-relaxed">{selectedIssue.description}</p>
              </div>

              {selectedIssue.summary && (
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">🤖 AI Analysis & Priority Summary</p>
                  <p className="text-emerald-900">{selectedIssue.summary}</p>
                  <div className="mt-2 text-xs text-emerald-700">
                    Assigned Urgency: <strong className="uppercase">{selectedIssue.priority || 'medium'}</strong>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Reporter Name</p>
                  <p className="text-gray-900 font-medium">{selectedIssue.reporter_name || 'Anonymous Citizen'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Reporter CNIC</p>
                  <p className="text-gray-900 font-mono">{selectedIssue.reporter_cnic || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Location</p>
                  <p className="text-gray-900">{selectedIssue.location_area}, {selectedIssue.location_district}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Current Status</p>
                  <span className="font-semibold capitalize text-emerald-700">{selectedIssue.status}</span>
                </div>
              </div>

              {selectedIssue.photo_url && (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Uploaded Photo Evidence</p>
                  <img
                    src={`http://localhost:8000/${selectedIssue.photo_url}`}
                    alt="Evidence"
                    className="max-h-60 rounded-lg border border-gray-200 object-cover w-full"
                  />
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between items-center">
              <div className="flex gap-2">
                {['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(selectedIssue._id, st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all border cursor-pointer ${
                      selectedIssue.status === st
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setSelectedIssue(null)}
                className="px-4 py-2 bg-white text-gray-600 border border-gray-200 rounded-lg text-xs font-semibold hover:bg-gray-50 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}