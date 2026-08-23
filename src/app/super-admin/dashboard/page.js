// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import axios from 'axios';
// import { CATEGORIES } from '@/lib/categories';
// import { DISTRICTS } from '@/lib/areas';

// export default function SuperAdminDashboard() {
//   const router = useRouter();
//   const [issues, setIssues] = useState([]);
//   const [subAdminsCount, setSubAdminsCount] = useState(0);
//   const [activeAdminsCount, setActiveAdminsCount] = useState(0);
//   const [loading, setLoading] = useState(true);

//   // Filters
//   const [search, setSearch] = useState('');
//   const [deptFilter, setDeptFilter] = useState('ALL');
//   const [districtFilter, setDistrictFilter] = useState('ALL');
//   const [statusFilter, setStatusFilter] = useState('ALL');
//   const [priorityFilter, setPriorityFilter] = useState('ALL');

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const [issuesRes, adminsRes] = await Promise.all([
//         axios.get('http://localhost:8000/issues', { withCredentials: true }),
//         axios.get('http://localhost:8000/auth/sub-admins', { withCredentials: true })
//       ]);

//       setIssues(issuesRes.data.data || []);
//       const admins = adminsRes.data.data || [];
//       setSubAdminsCount(admins.length);
//       setActiveAdminsCount(admins.filter(a => a.status === 'active').length);
//     } catch (err) {
//       if (err.response?.status === 403 || err.response?.status === 401) {
//         router.push('/login');
//       }
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const role = localStorage.getItem('role');
//     if (role !== 'super_admin') {
//       router.push('/login');
//       return;
//     }
//     fetchData();
//   }, [router]);

//   const handleLogout = async () => {
//     try {
//       await axios.post('http://localhost:8000/auth/logout', {}, { withCredentials: true });
//     } catch (error) {
//       console.error(error);
//     } finally {
//       localStorage.clear();
//       router.push('/login');
//     }
//   };

//   const handleStatusChange = async (issueId, newStatus) => {
//     try {
//       const formData = new FormData();
//       formData.append('status', newStatus);
//       await axios.patch(`http://localhost:8000/issues/${issueId}/status`, formData, { withCredentials: true });
//       fetchData();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleDeleteIssue = async (issueId) => {
//     if (!confirm('Are you sure you want to soft delete this issue?')) return;
//     try {
//       await axios.delete(`http://localhost:8000/issues/${issueId}`, { withCredentials: true });
//       fetchData();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const departmentList = Object.keys(CATEGORIES);

//   const filteredIssues = issues.filter(i => {
//     const matchesSearch = i.title?.toLowerCase().includes(search.toLowerCase()) ||
//                           i.description?.toLowerCase().includes(search.toLowerCase()) ||
//                           i.problem_type?.toLowerCase().includes(search.toLowerCase());
//     const matchesDept = deptFilter === 'ALL' || i.category === deptFilter;
//     const matchesDistrict = districtFilter === 'ALL' || i.location_district === districtFilter;
//     const matchesStatus = statusFilter === 'ALL' || i.status === statusFilter;
//     const matchesPriority = priorityFilter === 'ALL' || i.priority === priorityFilter;
//     return matchesSearch && matchesDept && matchesDistrict && matchesStatus && matchesPriority;
//   });

//   return (
//     <div className="min-h-screen bg-[#0f172a] text-slate-900 font-['Inter',sans-serif] p-4 sm:p-8">
      
//       <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden min-h-[90vh]">
//         {/* Header */}
//         <nav className="border-b border-gray-200 px-8 py-4 flex justify-between items-center">
//           <div className="flex items-center gap-4">
//             <div className="w-8 h-8 rounded bg-[#16a34a] text-white flex items-center justify-center font-bold text-lg">
//               M
//             </div>
//             <div>
//               <span className="font-bold text-xl text-gray-900 tracking-tight">Mahol<span className="text-[#16a34a]">AI</span></span>
//               <span className="ml-4 px-2 py-1 bg-purple-100 text-purple-700 text-[10px] font-bold rounded uppercase tracking-wider">
//                 SUPER ADMIN
//               </span>
//             </div>
//           </div>
          
//           <div className="flex items-center gap-6">
//             <Link href="/super-admin/admins" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors no-underline flex items-center gap-2">
//               <span className="text-gray-400">⚙️</span> Manage Sub Admins ({subAdminsCount})
//             </Link>
//             <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
//               Logout →
//             </button>
//           </div>
//         </nav>

//         <div className="px-8 py-8">
          
//           <div className="mb-8">
//             <h1 className="text-2xl font-bold text-gray-900">Global System Analytics</h1>
//             <p className="text-gray-500 text-sm mt-1">
//               Super Admin oversight across all departments and districts.
//             </p>
//           </div>

//           {loading ? (
//              <div className="p-12 text-center text-gray-500">
//                Loading global system data...
//              </div>
//           ) : (
//             <>
//               {/* Global Metrics Cards */}
//               <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 mb-8">
//                 <div className="border border-gray-200 rounded-lg p-5 shadow-sm">
//                   <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2">Total Issues</p>
//                   <p className="text-3xl font-bold text-gray-900">{issues.length}</p>
//                 </div>
//                 <div className="border border-gray-200 rounded-lg p-5 shadow-sm">
//                   <p className="text-orange-500 text-[10px] font-bold uppercase tracking-wider mb-2">Pending</p>
//                   <p className="text-3xl font-bold text-orange-500">{issues.filter(i => i.status === 'pending').length}</p>
//                 </div>
//                 <div className="border border-gray-200 rounded-lg p-5 shadow-sm">
//                   <p className="text-blue-600 text-[10px] font-bold uppercase tracking-wider mb-2">In Progress</p>
//                   <p className="text-3xl font-bold text-blue-600">{issues.filter(i => i.status === 'in_progress').length}</p>
//                 </div>
//                 <div className="border border-gray-200 rounded-lg p-5 shadow-sm">
//                   <p className="text-emerald-500 text-[10px] font-bold uppercase tracking-wider mb-2">Resolved</p>
//                   <p className="text-3xl font-bold text-emerald-500">{issues.filter(i => i.status === 'resolved').length}</p>
//                 </div>
//                 <div className="border border-gray-200 rounded-lg p-5 shadow-sm">
//                   <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider mb-2">High Priority</p>
//                   <p className="text-3xl font-bold text-red-500">{issues.filter(i => i.priority === 'high').length}</p>
//                 </div>
//                 <div className="border border-gray-200 rounded-lg p-5 shadow-sm">
//                   <p className="text-purple-600 text-[10px] font-bold uppercase tracking-wider mb-2">Sub Admins</p>
//                   <p className="text-3xl font-bold text-purple-600">{activeAdminsCount}<span className="text-sm text-purple-300 font-normal">/{subAdminsCount}</span></p>
//                 </div>
//               </div>

//               {/* Global Issue Filters */}
//               <div className="border border-gray-200 rounded-lg p-5 mb-8 shadow-sm grid grid-cols-2 sm:grid-cols-5 gap-4 bg-gray-50/50">
//                 <div>
//                   <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2">Search</label>
//                   <input
//                     type="text"
//                     placeholder="Title, description..."
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2">Department</label>
//                   <select
//                     value={deptFilter}
//                     onChange={(e) => setDeptFilter(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
//                   >
//                     <option value="ALL">All Departments</option>
//                     {departmentList.map(d => (
//                       <option key={d} value={d}>{d}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2">District</label>
//                   <select
//                     value={districtFilter}
//                     onChange={(e) => setDistrictFilter(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
//                   >
//                     <option value="ALL">All Districts</option>
//                     {DISTRICTS.map(dist => (
//                       <option key={dist} value={dist}>{dist}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2">Status</label>
//                   <select
//                     value={statusFilter}
//                     onChange={(e) => setStatusFilter(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
//                   >
//                     <option value="ALL">All Statuses</option>
//                     <option value="pending">Pending</option>
//                     <option value="in_progress">In Progress</option>
//                     <option value="resolved">Resolved</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2">Priority</label>
//                   <select
//                     value={priorityFilter}
//                     onChange={(e) => setPriorityFilter(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
//                   >
//                     <option value="ALL">All Priorities</option>
//                     <option value="high">High</option>
//                     <option value="medium">Medium</option>
//                     <option value="low">Low</option>
//                   </select>
//                 </div>
//               </div>

//               {/* Issues List */}
//               <div className="border border-gray-200 rounded-lg p-6 shadow-sm">
//                  <div className="mb-4">
//                    <h2 className="text-lg font-bold text-gray-900">System Issues ({filteredIssues.length})</h2>
//                    <p className="text-gray-500 text-xs mt-1">Showing issues matching active filters.</p>
//                  </div>
                 
//                  {filteredIssues.length === 0 ? (
//                    <p className="text-gray-500 text-sm py-4">No issues match the selected filters.</p>
//                  ) : (
//                    <div className="space-y-4">
//                      {filteredIssues.map(issue => (
//                        <div key={issue._id} className="flex flex-wrap justify-between items-center gap-4 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 -mx-6 px-6 transition-colors">
//                          <div className="space-y-1.5">
//                            <div className="flex items-center gap-2">
//                              <h3 className="font-bold text-gray-900 text-sm">{issue.title}</h3>
//                              <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${
//                                issue.priority === 'high' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-gray-100 text-gray-600'
//                              }`}>
//                                {issue.priority || 'medium'}
//                              </span>
//                            </div>
//                            <p className="text-xs text-gray-500">
//                              📍 <strong className="text-gray-700">{issue.location_area}</strong>, {issue.location_district} &nbsp;|&nbsp; 🏷️ <strong className="text-gray-700">{issue.category}</strong> ({issue.problem_type})
//                            </p>
//                          </div>
//                          <div className="flex items-center gap-3">
//                             <select
//                               value={issue.status}
//                               onChange={(e) => handleStatusChange(issue._id, e.target.value)}
//                               className="text-xs font-semibold px-3 py-1.5 rounded border border-gray-300 bg-white text-gray-700 focus:outline-none focus:border-blue-500"
//                             >
//                               <option value="pending">pending</option>
//                               <option value="in_progress">in_progress</option>
//                               <option value="resolved">resolved</option>
//                             </select>
//                             <Link href={`/issues/${issue._id}`} className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded text-xs font-semibold no-underline transition-colors">
//                               View Details
//                             </Link>
//                             <button
//                               onClick={() => handleDeleteIssue(issue._id)}
//                               className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded text-xs font-semibold transition-colors"
//                             >
//                               Delete
//                             </button>
//                          </div>
//                        </div>
//                      ))}
//                    </div>
//                  )}
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { CATEGORIES } from '@/lib/categories';
import { DISTRICTS } from '@/lib/areas';

// ---------------------------------------------------------------------------
// Small helper: an animated sparkline used inside each stat card.
// Purely decorative — draws a soft wavy line that "grows in" on mount.
// ---------------------------------------------------------------------------
function Sparkline({ color, seed = 1, delay = 0 }) {
  const points = Array.from({ length: 8 }, (_, i) => {
    const n = Math.sin(seed * (i + 1) * 1.7) * 0.5 + 0.5;
    return 6 + n * 18;
  });
  const width = 120;
  const step = width / (points.length - 1);
  const d = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${i * step} ${28 - p}`)
    .join(' ');

  return (
    <svg viewBox={`0 0 ${width} 28`} className="w-full h-7 mt-2 overflow-visible" preserveAspectRatio="none">
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="sparkline-path"
        style={{ animationDelay: `${delay}ms` }}
      />
    </svg>
  );
}

const STAT_DEFS = [
  { key: 'total', label: 'Total Issues', accent: '#64748b', bg: 'bg-white', ring: 'ring-slate-200', text: 'text-slate-900', seed: 3 },
  { key: 'pending', label: 'Pending', accent: '#f59e0b', bg: 'bg-amber-50', ring: 'ring-amber-100', text: 'text-amber-600', seed: 5.2 },
  { key: 'in_progress', label: 'In Progress', accent: '#eab308', bg: 'bg-[#0f2a52]', ring: 'ring-[#0f2a52]', text: 'text-white', dark: true, seed: 2.1 },
  { key: 'resolved', label: 'Resolved', accent: '#10b981', bg: 'bg-emerald-50', ring: 'ring-emerald-100', text: 'text-emerald-600', seed: 4.4 },
  { key: 'high_priority', label: 'High Priority', accent: '#ef4444', bg: 'bg-rose-50', ring: 'ring-rose-100', text: 'text-rose-600', seed: 1.3 },
  { key: 'sub_admins', label: 'Sub Admins', accent: '#a855f7', bg: 'bg-violet-50', ring: 'ring-violet-100', text: 'text-violet-600', seed: 6.6 },
];

// ---------------------------------------------------------------------------
// In-page issue details modal — replaces navigating to a separate route.
// ---------------------------------------------------------------------------
function IssueDetailsModal({ issue, onClose, onStatusChange, onDelete }) {
  if (!issue) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{issue.title}</h2>
            <p className="text-xs text-gray-400 mt-0.5">Issue ID: {issue._id}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors text-lg"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div className="flex flex-wrap gap-2">
            <span
              className={`px-2.5 py-1 text-[10px] font-bold rounded uppercase tracking-wider ${
                issue.priority === 'high'
                  ? 'bg-red-50 text-red-600 border border-red-100'
                  : issue.priority === 'medium'
                  ? 'bg-amber-50 text-amber-600 border border-amber-100'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {issue.priority || 'medium'} priority
            </span>
            <span className="px-2.5 py-1 text-[10px] font-bold rounded uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100">
              {issue.category}
            </span>
            <span className="px-2.5 py-1 text-[10px] font-bold rounded uppercase tracking-wider bg-gray-100 text-gray-600">
              {issue.problem_type}
            </span>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase text-gray-400 mb-1">Description</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              {issue.description || 'No description provided.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase text-gray-400 mb-1">Location</p>
              <p className="text-sm text-gray-700">
                📍 {issue.location_area}, {issue.location_district}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-gray-400 mb-1">Reported</p>
              <p className="text-sm text-gray-700">
                {issue.createdAt ? new Date(issue.createdAt).toLocaleString() : '—'}
              </p>
            </div>
          </div>

          {issue.image_url && (
            <div>
              <p className="text-[10px] font-bold uppercase text-gray-400 mb-2">Photo</p>
              <img
                src={issue.image_url}
                alt={issue.title}
                className="w-full max-h-64 object-cover rounded-lg border border-gray-100"
              />
            </div>
          )}

          <div>
            <p className="text-[10px] font-bold uppercase text-gray-400 mb-2">Status</p>
            <select
              value={issue.status}
              onChange={(e) => onStatusChange(issue._id, e.target.value)}
              className="w-full sm:w-auto text-sm font-semibold px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:border-[#16a34a] transition-colors"
            >
              <option value="pending">pending</option>
              <option value="in_progress">in_progress</option>
              <option value="resolved">resolved</option>
            </select>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-between">
          <button
            onClick={() => {
              onDelete(issue._id);
              onClose();
            }}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-sm font-semibold transition-colors"
          >
            Delete Issue
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SuperAdminDashboard() {
  const router = useRouter();
  const [issues, setIssues] = useState([]);
  const [subAdminsCount, setSubAdminsCount] = useState(0);
  const [activeAdminsCount, setActiveAdminsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const menuRef = useRef(null);

  // Filters
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [districtFilter, setDistrictFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [issuesRes, adminsRes] = await Promise.all([
        axios.get('http://localhost:8000/issues', { withCredentials: true }),
        axios.get('http://localhost:8000/auth/sub-admins', { withCredentials: true }),
      ]);

      setIssues(issuesRes.data.data || []);
      const admins = adminsRes.data.data || [];
      setSubAdminsCount(admins.length);
      setActiveAdminsCount(admins.filter((a) => a.status === 'active').length);
    } catch (err) {
      if (err.response?.status === 403 || err.response?.status === 401) {
        router.push('/login');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'super_admin') {
      router.push('/login');
      return;
    }
    fetchData();
  }, [router]);

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Keep the open modal's data in sync whenever `issues` refreshes
  useEffect(() => {
    if (!selectedIssue) return;
    const fresh = issues.find((i) => i._id === selectedIssue._id);
    if (fresh) setSelectedIssue(fresh);
  }, [issues]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8000/auth/logout', {}, { withCredentials: true });
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.clear();
      router.push('/login');
    }
  };

  const handleStatusChange = async (issueId, newStatus) => {
    try {
      const formData = new FormData();
      formData.append('status', newStatus);
      await axios.patch(`http://localhost:8000/issues/${issueId}/status`, formData, { withCredentials: true });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteIssue = async (issueId) => {
    if (!confirm('Are you sure you want to soft delete this issue?')) return;
    try {
      await axios.delete(`http://localhost:8000/issues/${issueId}`, { withCredentials: true });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const departmentList = Object.keys(CATEGORIES);

  const filteredIssues = issues.filter((i) => {
    const matchesSearch =
      i.title?.toLowerCase().includes(search.toLowerCase()) ||
      i.description?.toLowerCase().includes(search.toLowerCase()) ||
      i.problem_type?.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === 'ALL' || i.category === deptFilter;
    const matchesDistrict = districtFilter === 'ALL' || i.location_district === districtFilter;
    const matchesStatus = statusFilter === 'ALL' || i.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || i.priority === priorityFilter;
    return matchesSearch && matchesDept && matchesDistrict && matchesStatus && matchesPriority;
  });

  const statValues = {
    total: issues.length,
    pending: issues.filter((i) => i.status === 'pending').length,
    in_progress: issues.filter((i) => i.status === 'in_progress').length,
    resolved: issues.filter((i) => i.status === 'resolved').length,
    high_priority: issues.filter((i) => i.priority === 'high').length,
  };

  return (
    <div className="min-h-screen w-full bg-[#0f172a] text-slate-900 font-['Inter',sans-serif] relative">
      {/* Ambient background glow */}
      <div className="pointer-events-none fixed -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-40 -right-20 w-[480px] h-[480px] rounded-full bg-blue-500/10 blur-3xl" />

      <div className="w-full min-h-screen bg-white/95 relative flex flex-col">
        {/* Header */}
        <nav className="border-b border-gray-100 px-6 sm:px-10 py-4 flex justify-between items-center bg-white/80 backdrop-blur sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-[#16a34a] text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-emerald-500/30">
              M
            </div>
            <div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">
                Mahol<span className="text-[#16a34a]">AI</span>
              </span>
              <span className="ml-4 px-2 py-1 bg-purple-100 text-purple-700 text-[10px] font-bold rounded uppercase tracking-wider align-middle">
                Super Admin
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/super-admin/admins"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors no-underline flex items-center gap-2"
            >
              <span className="text-gray-400">⚙️</span> Manage Sub Admins ({subAdminsCount})
            </Link>

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors flex items-center gap-1"
              >
                Logout <span className={`transition-transform duration-200 ${menuOpen ? 'translate-x-0.5' : ''}`}>→</span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl ring-1 ring-black/5 py-2 animate-pop-in origin-top-right z-30">
                  <div className="px-4 py-2 flex items-center gap-2 border-b border-gray-100">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px]">🧑</div>
                    <span className="text-xs text-gray-500">Signed in as Admin</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    Logout <span>→</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>

        <div className="flex-1 px-6 sm:px-10 py-8 max-w-[1600px] w-full mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Global System Analytics</h1>
            <p className="text-gray-500 text-sm mt-1">Super Admin oversight across all departments and districts.</p>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-500 flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-gray-200 border-t-[#16a34a] rounded-full animate-spin" />
              Loading global system data...
            </div>
          ) : (
            <>
              {/* Global Metrics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 mb-8">
                {STAT_DEFS.map((s, idx) => (
                  <div
                    key={s.key}
                    className={`rounded-xl p-5 shadow-sm ring-1 ${s.ring} ${s.bg} transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-default animate-fade-in-up`}
                    style={{ animationDelay: `${idx * 60}ms` }}
                  >
                    <p className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${s.dark ? 'text-white/70' : s.text}`}>
                      {s.label}
                    </p>
                    <p className={`text-3xl font-bold ${s.dark ? 'text-white' : s.text}`}>
                      {s.key === 'sub_admins' ? (
                        <>
                          {activeAdminsCount}
                          <span className={`text-sm font-normal ${s.dark ? 'text-white/50' : 'opacity-40'}`}>/{subAdminsCount}</span>
                        </>
                      ) : (
                        statValues[s.key]
                      )}
                    </p>
                    <Sparkline color={s.accent} seed={s.seed} delay={idx * 80} />
                  </div>
                ))}
              </div>

              {/* Global Issue Filters */}
              <div className="border border-gray-200 rounded-xl p-5 mb-8 shadow-sm grid grid-cols-2 sm:grid-cols-5 gap-4 bg-gray-50/60">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2">Search</label>
                  <input
                    type="text"
                    placeholder="Title, description..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a]/40 bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2">Department</label>
                  <select
                    value={deptFilter}
                    onChange={(e) => setDeptFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a]/40 bg-white transition-colors"
                  >
                    <option value="ALL">All Departments</option>
                    {departmentList.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2">District</label>
                  <select
                    value={districtFilter}
                    onChange={(e) => setDistrictFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a]/40 bg-white transition-colors"
                  >
                    <option value="ALL">All Districts</option>
                    {DISTRICTS.map((dist) => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a]/40 bg-white transition-colors"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2">Priority</label>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a]/40 bg-white transition-colors"
                  >
                    <option value="ALL">All Priorities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              {/* Issues List */}
              <div className="border border-gray-200 rounded-xl p-6 shadow-sm mb-10">
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-lg">📋</span>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">System Issues ({filteredIssues.length})</h2>
                    <p className="text-gray-500 text-xs mt-0.5">Showing issues matching active filters.</p>
                  </div>
                </div>

                {filteredIssues.length === 0 ? (
                  <p className="text-gray-500 text-sm py-4">No issues match the selected filters.</p>
                ) : (
                  <div className="space-y-4">
                    {filteredIssues.map((issue, idx) => (
                      <div
                        key={issue._id}
                        className="flex flex-wrap justify-between items-center gap-4 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 -mx-6 px-6 rounded-lg transition-colors animate-fade-in-up"
                        style={{ animationDelay: `${idx * 40}ms` }}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-900 text-sm">{issue.title}</h3>
                            <span
                              className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${
                                issue.priority === 'high'
                                  ? 'bg-red-50 text-red-600 border border-red-100'
                                  : issue.priority === 'medium'
                                  ? 'bg-amber-50 text-amber-600 border border-amber-100'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {issue.priority || 'medium'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            📍 <strong className="text-gray-700">{issue.location_area}</strong>, {issue.location_district}
                            &nbsp;|&nbsp; 🏷️ <strong className="text-gray-700">{issue.category}</strong> ({issue.problem_type})
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <select
                            value={issue.status}
                            onChange={(e) => handleStatusChange(issue._id, e.target.value)}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:border-[#16a34a] transition-colors"
                          >
                            <option value="pending">pending</option>
                            <option value="in_progress">in_progress</option>
                            <option value="resolved">resolved</option>
                          </select>
                          <button
                            onClick={() => setSelectedIssue(issue)}
                            className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-lg text-xs font-semibold transition-colors"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleDeleteIssue(issue._id)}
                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-xs font-semibold transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <IssueDetailsModal
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
        onStatusChange={handleStatusChange}
        onDelete={handleDeleteIssue}
      />

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.45s ease both;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.15s ease both;
        }

        @keyframes popIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-4px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-pop-in {
          animation: popIn 0.18s ease both;
        }

        .sparkline-path {
          stroke-dasharray: 140;
          stroke-dashoffset: 140;
          animation: drawLine 1.1s ease forwards;
        }
        @keyframes drawLine {
          to {
            stroke-dashoffset: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in-up,
          .animate-pop-in,
          .animate-fade-in,
          .sparkline-path {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
