
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { 
  FolderIcon, 
  ClockIcon, 
  Cog6ToothIcon, 
  CheckCircleIcon, 
  MagnifyingGlassIcon, 
  TrashIcon, 
  EyeIcon,
  ArrowRightOnRectangleIcon,
  MapPinIcon,
  XMarkIcon,
  UserIcon,
  IdentificationIcon,
  SparklesIcon,
  CalendarDaysIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';

const STATUS_THEME = {
  PENDING: { label: 'PENDING', bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' },
  IN_PROGRESS: { label: 'IN PROGRESS', bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
  RESOLUTION_SUBMITTED: { label: 'AWAITING VERIFICATION', bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
  RESOLVED: { label: 'RESOLVED', bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300' },
  REOPENED: { label: 'REOPENED', bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
  REJECTED: { label: 'REJECTED', bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
};

const PRIORITY_THEME = {
  high: 'bg-red-100 text-red-700 border-red-300',
  medium: 'bg-slate-100 text-slate-700 border-slate-300',
  low: 'bg-slate-50 text-slate-500 border-slate-200',
};

const NEXT_STATUS_OPTIONS = {
  PENDING: ['PENDING', 'IN_PROGRESS', 'REJECTED'],
  IN_PROGRESS: ['IN_PROGRESS', 'REJECTED'], // RESOLVED ab yahan nahi -- evidence upload se hoga
  RESOLUTION_SUBMITTED: ['RESOLUTION_SUBMITTED'], // citizen ke faisle ka wait, admin kuch nahi kar sakta
  RESOLVED: ['RESOLVED'],
  REOPENED: ['REOPENED'], // admin ko wapas IN_PROGRESS le jane ka alag button milega
  REJECTED: ['REJECTED'],
};
function StatWave({ strokeColor }) {
  return (
    <svg viewBox="0 0 120 20" className="w-full h-5 mt-3 opacity-80" preserveAspectRatio="none">
      <path
        d="M0 10 Q 15 0, 30 10 T 60 10 T 90 10 T 120 10"
        fill="none"
        stroke={strokeColor}
        strokeWidth="3"
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
const [evidenceModalIssue, setEvidenceModalIssue] = useState(null);
const [evidenceFile, setEvidenceFile] = useState(null);
const [evidenceNote, setEvidenceNote] = useState('');
const [uploadingEvidence, setUploadingEvidence] = useState(false);
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
      name: localStorage.getItem('user_name') || 'Admin User',
      department: localStorage.getItem('department') || 'Department',
      district: localStorage.getItem('district') || 'District',
      area: localStorage.getItem('area') || 'Area',
      role: role,
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
                          i.landmark?.toLowerCase().includes(search.toLowerCase()) ||
                          i.problem_type?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const counts = {
    all: issues.length,
    pending: issues.filter(i => i.status === 'PENDING').length,
    in_progress: issues.filter(i => i.status === 'IN_PROGRESS').length,
    resolved: issues.filter(i => i.status === 'RESOLVED').length,
  };

  // Date and Time Formatting Utility Function
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? dateString : date.toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };
const handleUploadEvidence = async () => {
  if (!evidenceFile) {
    alert('Please attach a photo as evidence before submitting.');
    return;
  }
  setUploadingEvidence(true);
  try {
    const formData = new FormData();
    formData.append('file', evidenceFile);
    if (evidenceNote) formData.append('note', evidenceNote);

    await axios.post(
      `http://localhost:8000/issues/${evidenceModalIssue._id}/resolution-evidence`,
      formData,
      { withCredentials: true }
    );

    setEvidenceModalIssue(null);
    setEvidenceFile(null);
    setEvidenceNote('');
    if (selectedIssue && selectedIssue._id === evidenceModalIssue._id) {
      setSelectedIssue(prev => ({ ...prev, status: 'RESOLUTION_SUBMITTED' }));
    }
    fetchDepartmentIssues();
  } catch (err) {
    alert(err.response?.data?.detail || 'Failed to submit resolution evidence');
  } finally {
    setUploadingEvidence(false);
  }
};

const handleReactivateIssue = async (issueId) => {
  // REOPENED se wapas IN_PROGRESS -- yeh normal status endpoint se allowed hai
  await handleUpdateStatus(issueId, 'IN_PROGRESS');
};
  return (
   <div className="w-screen min-h-screen bg-[#F3F4F6] text-slate-800 font-sans p-4 sm:p-6 lg:p-8 m-0 overflow-x-hidden">
      <div className="w-full max-w-none mx-auto space-y-6">
        {/* 1. TOP HEADER NAVIGATION */}
        <header className="w-full bg-[#1E293B] text-white rounded-2xl px-6 py-4 shadow-lg flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#059669] text-white flex items-center justify-center font-black text-xl shadow-md">
              M
            </div>
            <span className="font-bold text-xl tracking-wide">Mahol<span className="text-[#10B981]">Ai</span></span>
            <span className="ml-2 px-3 py-1 bg-[#334155] text-gray-200 text-xs font-bold rounded-lg tracking-wider uppercase">
              {adminInfo.department} ADMIN
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-[#334155]/60 px-3.5 py-1.5 rounded-xl border border-slate-700">
              <div className="w-8 h-8 rounded-full bg-slate-400 border border-slate-300 overflow-hidden flex items-center justify-center text-slate-900 font-bold text-sm">
                {adminInfo.name?.charAt(0) || 'A'}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold leading-tight text-white">{adminInfo.name}</span>
                <span className="text-[10px] text-slate-300 flex items-center gap-0.5 mt-0.5">
                  <MapPinIcon className="w-3 h-3 text-slate-400" /> {adminInfo.area || 'N/A'}, {adminInfo.district || 'N/A'}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-4 py-2 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer border-0"
            >
              Logout <ArrowRightOnRectangleIcon className="w-4 h-4 text-slate-700" />
            </button>
          </div>
        </header>

        {/* 2. OVERVIEW & STATS CARDS */}
        <section className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Department Overview</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Showing exclusively <strong>{adminInfo.department}</strong> issues within <strong>{adminInfo.area}, {adminInfo.district}</strong>.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-2xl text-red-700 text-sm font-semibold">
              ⚠️ {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div 
              onClick={() => setFilterStatus('all')}
              className={`p-5 rounded-2xl bg-white border transition-all cursor-pointer shadow-sm ${filterStatus === 'all' ? 'border-slate-400 ring-2 ring-slate-300' : 'border-gray-200 hover:shadow-md'}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase block">TOTAL ISSUES</span>
                  <span className="text-4xl font-black text-slate-900 block mt-1">{counts.all}</span>
                </div>
                <div className="p-3 bg-slate-100 rounded-2xl text-slate-600">
                  <FolderIcon className="w-7 h-7" />
                </div>
              </div>
              <StatWave strokeColor="#94A3B8" />
            </div>

            <div 
              onClick={() => setFilterStatus('PENDING')}
              className={`p-5 rounded-2xl bg-amber-50/60 border transition-all cursor-pointer shadow-sm ${filterStatus === 'PENDING' ? 'border-amber-400 ring-2 ring-amber-300' : 'border-amber-100 hover:shadow-md'}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[11px] font-bold text-amber-600 tracking-wider uppercase block">PENDING</span>
                  <span className="text-4xl font-black text-amber-600 block mt-1">{counts.pending}</span>
                </div>
                <div className="p-3 bg-amber-100/80 rounded-2xl text-amber-700">
                  <ClockIcon className="w-7 h-7" />
                </div>
              </div>
              <StatWave strokeColor="#F59E0B" />
            </div>

            <div 
              onClick={() => setFilterStatus('IN_PROGRESS')}
              className={`p-5 rounded-2xl bg-blue-50/60 border transition-all cursor-pointer shadow-sm ${filterStatus === 'IN_PROGRESS' ? 'border-blue-400 ring-2 ring-blue-300' : 'border-blue-100 hover:shadow-md'}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[11px] font-bold text-blue-600 tracking-wider uppercase block">IN PROGRESS</span>
                  <span className="text-4xl font-black text-blue-600 block mt-1">{counts.in_progress}</span>
                </div>
                <div className="p-3 bg-blue-100/80 rounded-2xl text-blue-700">
                  <Cog6ToothIcon className="w-7 h-7" />
                </div>
              </div>
              <StatWave strokeColor="#3B82F6" />
            </div>

            <div 
              onClick={() => setFilterStatus('RESOLVED')}
              className={`p-5 rounded-2xl bg-emerald-50/60 border transition-all cursor-pointer shadow-sm ${filterStatus === 'RESOLVED' ? 'border-emerald-400 ring-2 ring-emerald-300' : 'border-emerald-100 hover:shadow-md'}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[11px] font-bold text-emerald-600 tracking-wider uppercase block">RESOLVED</span>
                  <span className="text-4xl font-black text-emerald-600 block mt-1">{counts.resolved}</span>
                </div>
                <div className="p-3 bg-emerald-100/80 rounded-2xl text-emerald-700">
                  <CheckCircleIcon className="w-7 h-7" />
                </div>
              </div>
              <StatWave strokeColor="#10B981" />
            </div>
          </div>
        </section>

        {/* 3. FILTER BAR */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-400 tracking-wider block mb-1 uppercase">SEARCH</label>
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Title, landmark, description..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 tracking-wider block mb-1 uppercase">STATUS</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
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

        {/* 4. ISSUES LIST AREA */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📋</span>
            <h2 className="text-lg font-bold text-slate-900">Department Issues ({filteredIssues.length})</h2>
          </div>

          {loading ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center text-slate-500 shadow-sm font-medium">
              Loading department issues...
            </div>
          ) : filteredIssues.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center shadow-sm">
              <span className="text-4xl block mb-3">🌿</span>
              <p className="text-slate-700 font-bold">No issues found in this category.</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm divide-y divide-gray-100 overflow-hidden">
              {filteredIssues.map((issue) => {
                const th = STATUS_THEME[issue.status] || STATUS_THEME.PENDING;
                const pr = PRIORITY_THEME[issue.priority] || PRIORITY_THEME.medium;
                return (
                  <div
                    key={issue._id}
                    className="p-5 hover:bg-slate-50/80 transition-colors flex flex-wrap justify-between items-center gap-4"
                  >
                    <div className="space-y-1.5 flex-1 min-w-[280px]">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">{issue.title}</h3>
                        {issue.priority && (
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase border ${pr}`}>
                            {issue.priority}
                          </span>
                        )}
                        {/* 👇 Yeh count badge yahan add karein */}
  {issue.report_count > 1 && (
    <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full border border-slate-200">
      +{issue.report_count} reports
    </span>
  )}
                      </div>

                      {/* Display Location, Landmark & Created Time in List view */}
                      <p className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
                        <span className="flex items-center gap-1 font-medium text-slate-700">
                          <MapPinIcon className="w-3.5 h-3.5 text-slate-400" />
                          {issue.location_area}, {issue.location_district}
                        </span>
                        {issue.landmark && (
                          <span className="bg-slate-100 px-2 py-0.5 rounded-md text-[11px] text-slate-600 font-medium border border-slate-200">
                            📍 {issue.landmark}
                          </span>
                        )}
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <ClockIcon className="w-3.5 h-3.5" />
                          {formatDateTime(issue.created_at || issue.createdAt)}
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                      <span className={`px-3 py-1.5 text-xs font-bold rounded-full border ${th.bg} ${th.text} ${th.border}`}>
                        {th.label}
                      </span>

                      {/* <select
                        value={issue.status}
                        disabled={updatingId === issue._id}
                        onChange={(e) => handleUpdateStatus(issue._id, e.target.value)}
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-emerald-500 shadow-sm cursor-pointer"
                      >
                        {(NEXT_STATUS_OPTIONS[issue.status] || ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED']).map((st) => (
                          <option key={st} value={st}>{st.replace('_', ' ')}</option>
                        ))}
                      </select> */}
                      {issue.status === 'RESOLUTION_SUBMITTED' ? (
  <span className="px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-xl text-xs font-semibold">
    Awaiting citizen verification
  </span>
) : (
  <select
    value={issue.status}
    disabled={updatingId === issue._id}
    onChange={(e) => handleUpdateStatus(issue._id, e.target.value)}
    className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-emerald-500 shadow-sm cursor-pointer"
  >
    {(NEXT_STATUS_OPTIONS[issue.status] || ['PENDING', 'IN_PROGRESS', 'REJECTED']).map((st) => (
      <option key={st} value={st}>{st.replace('_', ' ')}</option>
    ))}
  </select>
)}

{issue.status === 'IN_PROGRESS' && (
  <button
    onClick={() => setEvidenceModalIssue(issue)}
    className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
  >
    <CheckCircleIcon className="w-4 h-4" /> Upload Evidence
  </button>
)}

{issue.status === 'REOPENED' && (
  <button
    onClick={() => handleReactivateIssue(issue._id)}
    className="flex items-center gap-1 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
  >
    <Cog6ToothIcon className="w-4 h-4" /> Resume Work
  </button>
)}

                      <button
                        onClick={() => setSelectedIssue(issue)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <EyeIcon className="w-4 h-4" /> View
                      </button>

                      <button
                        onClick={() => handleDeleteIssue(issue._id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <TrashIcon className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </div>

      {/* 5. ISSUE DETAILS MODAL (WITH LANDMARK, DATE & TIME ADDED) */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-4">
              <div>
                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wider">
                  {selectedIssue.category} — {selectedIssue.problem_type}
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-2">{selectedIssue.title}</h2>
              </div>
              <button
                onClick={() => setSelectedIssue(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors border-0 cursor-pointer"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 pr-1 flex-1 text-sm">
              
              {/* DATE, TIME & LANDMARK OVERVIEW GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                    <CalendarDaysIcon className="w-3.5 h-3.5 text-emerald-600" /> Date & Time Reported
                  </p>
                  <p className="text-slate-900 font-bold">
                    {formatDateTime(selectedIssue.created_at || selectedIssue.createdAt)}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                    <BuildingStorefrontIcon className="w-3.5 h-3.5 text-emerald-600" /> Nearest Landmark
                  </p>
                  <p className="text-slate-900 font-bold">
                    {selectedIssue.landmark || 'No specific landmark provided'}
                  </p>
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Issue Description</p>
                <p className="text-slate-800 leading-relaxed font-normal">{selectedIssue.description}</p>
              </div>

              {/* AI SUMMARY */}
              {selectedIssue.summary && (
                <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-1 flex items-center gap-1">
                    <SparklesIcon className="w-4 h-4" /> AI Analysis & Priority Summary
                  </p>
                  <p className="text-emerald-950 font-medium">{selectedIssue.summary}</p>
                  <div className="mt-2 text-xs text-emerald-800 font-bold">
                    Assigned Urgency: <span className="uppercase tracking-wider">{selectedIssue.priority || 'medium'}</span>
                  </div>
                </div>
              )}

              {/* REPORTER & LOCATION METADATA */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5 flex items-center gap-1">
                    <UserIcon className="w-3.5 h-3.5" /> Reporter Name
                  </p>
                  <p className="text-slate-900 font-semibold">{selectedIssue.reporter_name || 'Anonymous Citizen'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5 flex items-center gap-1">
                    <IdentificationIcon className="w-3.5 h-3.5" /> Reporter CNIC
                  </p>
                  <p className="text-slate-900 font-mono font-medium">{selectedIssue.reporter_cnic || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5 flex items-center gap-1">
                    <MapPinIcon className="w-3.5 h-3.5" /> Area / Location
                  </p>
                  <p className="text-slate-900 font-medium">{selectedIssue.location_area}, {selectedIssue.location_district}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Current Status</p>
                  <span className="font-bold capitalize text-emerald-700">{selectedIssue.status}</span>
                </div>
              </div>

              {/* EVIDENCE PHOTO */}
              {selectedIssue.photo_url && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Uploaded Photo Evidence</p>
                  <img
                    src={`http://localhost:8000/${selectedIssue.photo_url}`}
                    alt="Evidence"
                    className="max-h-60 rounded-xl border border-slate-200 object-cover w-full shadow-sm"
                  />
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 pt-4 mt-4 flex flex-wrap justify-between items-center gap-3">
            <div className="flex gap-1.5 flex-wrap">
  {['PENDING', 'IN_PROGRESS', 'REJECTED'].map((st) => (
    <button
      key={st}
      onClick={() => handleUpdateStatus(selectedIssue._id, st)}
      disabled={selectedIssue.status === 'RESOLUTION_SUBMITTED'}
      className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all border cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
        selectedIssue.status === st
          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
      }`}
    >
      {st.replace('_', ' ')}
    </button>
  ))}

  {selectedIssue.status === 'IN_PROGRESS' && (
    <button
      onClick={() => setEvidenceModalIssue(selectedIssue)}
      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-600 text-white border border-purple-600 shadow-sm cursor-pointer"
    >
      Upload Resolution Evidence
    </button>
  )}

  {selectedIssue.status === 'RESOLUTION_SUBMITTED' && (
    <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
      Awaiting citizen verification
    </span>
  )}

  {selectedIssue.status === 'REOPENED' && (
    <button
      onClick={() => handleReactivateIssue(selectedIssue._id)}
      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-orange-600 text-white border border-orange-600 shadow-sm cursor-pointer"
    >
      Resume Work (IN_PROGRESS)
    </button>
  )}
</div>
              <button
                onClick={() => setSelectedIssue(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer border-0"
              >
                Close
              </button>
            </div>
          </div>
        </div>
        
      )}
{/* 6. UPLOAD RESOLUTION EVIDENCE MODAL */}
{evidenceModalIssue && (
  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
    <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-black text-slate-900">Upload Resolution Evidence</h2>
          <p className="text-xs text-slate-500 mt-1">{evidenceModalIssue.title}</p>
        </div>
        <button
          onClick={() => { setEvidenceModalIssue(null); setEvidenceFile(null); setEvidenceNote(''); }}
          className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer border-0"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 mb-4">
        ⚠️ Uploading evidence will NOT mark the issue as resolved directly. The citizen must review and confirm before it's marked RESOLVED.
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-[11px] font-bold text-slate-400 tracking-wider block mb-1 uppercase">Photo Evidence (required)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setEvidenceFile(e.target.files[0])}
            className="w-full text-sm text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:text-emerald-700 file:text-xs file:font-semibold"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-400 tracking-wider block mb-1 uppercase">Note (optional)</label>
          <textarea
            value={evidenceNote}
            onChange={(e) => setEvidenceNote(e.target.value)}
            placeholder="Describe what was fixed..."
            rows={3}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all resize-none"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-5">
        <button
          onClick={() => { setEvidenceModalIssue(null); setEvidenceFile(null); setEvidenceNote(''); }}
          className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-bold cursor-pointer border-0"
        >
          Cancel
        </button>
        <button
          onClick={handleUploadEvidence}
          disabled={uploadingEvidence}
          className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-xl text-xs font-bold cursor-pointer border-0 disabled:opacity-50"
        >
          {uploadingEvidence ? 'Submitting...' : 'Submit for Verification'}
        </button>
      </div>
    </div>
  </div>
)}
    </div>
    
  );
}