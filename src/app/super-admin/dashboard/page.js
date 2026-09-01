
'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

// Dynamic API base URL from env or fallback to local backend
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Exact Database Categories Object
export const CATEGORIES = {
  Education: {
    icon: '📚',
    types: ['Teacher', 'School Building', 'Furniture', 'Facilities'],
  },
  TMA: {
    icon: '🏛️',
    types: [
      'Road Damage',
      'Broken Bridge',
      'Streetlight',
      'Drainage',
      'Garbage',
      'Street Cleaning',
      'Encroachment',
      'Sewerage',
      'Water Supply',
      'Municipal Roads',
      'Public Toilets',
      'Parks & Green Areas',
      'Municipal Building',
    ],
  },
  Water: {
    icon: '💧',
    types: ['No Water', 'Dirty Water', 'Water Leakage', 'Pipeline Issue'],
  },
  Electricity: {
    icon: '⚡',
    types: ['Load Shedding', 'Broken Pole', 'Wire Issue', 'Transformer'],
  },
  Healthcare: {
    icon: '🏥',
    types: ['Hospital Issue', 'Medicine Shortage', 'Staff Behavior', 'Equipment'],
  },
  Transport: {
    icon: '🚌',
    types: ['Bus Service', 'Traffic Signal', 'Road Safety', 'Public Transport'],
  },
  Environment: {
    icon: '🌳',
    types: ['Garbage Collection', 'Pollution', 'Deforestation', 'Sewage'],
  },
  Infrastructure: {
    icon: '🏗️',
    types: ['Road Damage', 'Broken Bridge', 'Streetlight', 'Drainage'],
  },
  Other: {
    icon: '📋',
    types: ['General Complaint'],
  },
};

const DEFAULT_DISTRICTS = ['Nowshera','Mardan', 'Swabi'];

const DEFAULT_AREAS = {
  'Nowshera': ['Jehangira', 'Akora Khattak', 'Nowshera Cantt', 'Pabbi', 'Rasalpur'],
  // 'Peshawar': ['University Town', 'Hayatabad', 'Saddar', 'Gulberg', 'City'],
  'Mardan': ['City', 'Takht Bhai', 'Katlang'],
  'Swabi': ['Lahor', 'Chota Lahor', 'Topi', 'Zaida', 'Razar'],
  // 'Kohat': ['Cantt', 'City', 'Lachi'],
  // 'Abbottabad': ['Cantt', 'Supply', 'Mandian']
};

// Helper: Safely parse location string
function getLocationStr(issue) {
  if (!issue) return 'N/A';
  if (issue.location && typeof issue.location === 'object') {
    const loc = issue.location;
    return [loc.area, loc.district].filter(Boolean).join(', ') || 'N/A';
  }
  return issue.location_area ? `${issue.location_area}, ${issue.location_district || ''}` : 'N/A';
}

// Helper: Resolve image URLs
function getImageUrl(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_BASE}/${path.replace(/^\/+/, '')}`;
}

// Sparkline graph component inside stat cards
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

// Issue Details Modal
function IssueDetailsModal({ issue, onClose }) {
  if (!issue) return null;

  const isResolved = issue.status === 'RESOLVED';
  const isAwaitingVerification = issue.status === 'RESOLUTION_SUBMITTED';
  const isReopened = issue.status === 'REOPENED';
  const issueId = issue._id || issue.id || 'N/A';
  const catIcon = CATEGORIES[issue.category]?.icon || '📋';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl animate-pop-in border border-emerald-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{issue.title || 'Untitled Issue'}</h2>
            <p className="text-xs text-gray-400 mt-0.5">Issue ID: {issueId}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors text-lg cursor-pointer"
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
            <span className="px-2.5 py-1 text-[10px] font-bold rounded uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <span>{catIcon}</span> {issue.category || 'General'}
            </span>
            <span className="px-2.5 py-1 text-[10px] font-bold rounded uppercase tracking-wider bg-gray-100 text-gray-600">
              {issue.problem_type || 'N/A'}
            </span>
            <span
              className={`px-2.5 py-1 text-[10px] font-bold rounded uppercase tracking-wider ${
                isResolved
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : isAwaitingVerification
                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                  : isReopened
                  ? 'bg-orange-50 text-orange-700 border border-orange-200'
                  : 'bg-blue-50 text-blue-700 border border-blue-100'
              }`}
            >
              Status: {issue.status || 'PENDING'}
            </span>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase text-gray-400 mb-1">Issue Description</p>
            <p className="text-sm text-gray-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              {issue.description || 'No description provided.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <p className="text-[10px] font-bold uppercase text-gray-400 mb-1">Location</p>
              <p className="text-sm font-semibold text-gray-800">
                📍 {getLocationStr(issue)}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-gray-400 mb-1">Reported At</p>
              <p className="text-sm font-semibold text-gray-800">
                {issue.created_at ? new Date(issue.created_at).toLocaleString() : '—'}
              </p>
            </div>
          </div>

          {issue.photo_url && (
            <div>
              <p className="text-[10px] font-bold uppercase text-gray-400 mb-2">Photo Reported by Citizen</p>
              <img
                src={getImageUrl(issue.photo_url)}
                alt="Reported issue"
                className="w-full max-h-64 object-cover rounded-xl border border-gray-200 shadow-sm"
              />
            </div>
          )}

          <div>
            <p className="text-[10px] font-bold uppercase text-gray-400 mb-2">Department's Resolution Evidence</p>
            {issue.resolution_photo_url ? (
              <img
                src={getImageUrl(issue.resolution_photo_url)}
                alt="Resolution evidence"
                className="w-full max-h-64 object-cover rounded-xl border border-purple-200 shadow-sm"
              />
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-400 italic text-center">
                Department has not submitted resolution evidence yet.
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer"
          >
            Close View
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

  // Filters State
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [districtFilter, setDistrictFilter] = useState('ALL');
  const [areaFilter, setAreaFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [issuesRes, adminsRes] = await Promise.all([
        axios.get(`${API_BASE}/issues`, { withCredentials: true }),
        axios.get(`${API_BASE}/auth/sub-admins`, { withCredentials: true }),
      ]);

      const fetchedIssues = Array.isArray(issuesRes.data?.data)
        ? issuesRes.data.data
        : Array.isArray(issuesRes.data)
        ? issuesRes.data
        : [];
      
      const fetchedAdmins = Array.isArray(adminsRes.data?.data)
        ? adminsRes.data.data
        : Array.isArray(adminsRes.data)
        ? adminsRes.data
        : [];

      setIssues(fetchedIssues);
      setSubAdminsCount(fetchedAdmins.length);
      setActiveAdminsCount(fetchedAdmins.filter((a) => a.status === 'active').length);
    } catch (err) {
      if (err.response?.status === 403 || err.response?.status === 401) {
        router.push('/login');
      }
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'super_admin') {
      router.push('/login');
      return;
    }
    fetchData();
  }, [router, fetchData]);

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE}/auth/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.clear();
      router.push('/login');
    }
  };
  const categoryList = Object.keys(CATEGORIES);
  const availableAreas = districtFilter !== 'ALL' ? (DEFAULT_AREAS[districtFilter] || []) : [];

  // Active Filtered Issues
  const filteredIssues = issues.filter((i) => {
    const matchesSearch =
      (i.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (i.description || '').toLowerCase().includes(search.toLowerCase()) ||
      (i.problem_type || '').toLowerCase().includes(search.toLowerCase());

    const matchesDept =
      deptFilter === 'ALL' ||
      (i.category || '').trim().toLowerCase() === deptFilter.trim().toLowerCase();

    const districtVal = ((i.location && i.location.district) || i.location_district || '').trim().toLowerCase();
    const areaVal = ((i.location && i.location.area) || i.location_area || '').trim().toLowerCase();

    const matchesDistrict =
      districtFilter === 'ALL' || districtVal === districtFilter.trim().toLowerCase();

    const matchesArea =
      areaFilter === 'ALL' || areaVal === areaFilter.trim().toLowerCase();

    const matchesStatus = statusFilter === 'ALL' || i.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || i.priority === priorityFilter;

    return matchesSearch && matchesDept && matchesDistrict && matchesArea && matchesStatus && matchesPriority;
  });

  const statValues = {
    total: issues.length,
    pending: issues.filter((i) => i.status === 'PENDING').length,
    in_progress: issues.filter((i) => i.status === 'IN_PROGRESS').length,
    resolved: issues.filter((i) => i.status === 'RESOLVED').length,
    high_priority: issues.filter((i) => i.priority === 'high').length,
  };

  const getDeptPerformance = () => {
    const activePool = filteredIssues;
    const total = activePool.length;
    const pending = activePool.filter((i) => i.status === 'PENDING').length;
    const inProgress = activePool.filter((i) => i.status === 'IN_PROGRESS').length;
    const resolved = activePool.filter((i) => i.status === 'RESOLVED').length;
    const ratio = total > 0 ? Math.round((resolved / total) * 100) : 0;

    return { total, pending, inProgress, resolved, ratio };
  };

  const currentDeptStats = getDeptPerformance();

  // Dynamic Category Breakdown based on District & Area filter selection (e.g. Swabi -> Lahor)
  const getDepartmentBreakdown = () => {
    const scopedIssues = issues.filter((i) => {
      const districtVal = ((i.location && i.location.district) || i.location_district || '').trim().toLowerCase();
      const areaVal = ((i.location && i.location.area) || i.location_area || '').trim().toLowerCase();

      const matchesDistrict =
        districtFilter === 'ALL' || districtVal === districtFilter.trim().toLowerCase();

      const matchesArea =
        areaFilter === 'ALL' || areaVal === areaFilter.trim().toLowerCase();

      return matchesDistrict && matchesArea;
    });

    return categoryList
      .map((catKey) => {
        const catObj = CATEGORIES[catKey];
        const deptIssues = scopedIssues.filter(
          (i) => (i.category || '').trim().toLowerCase() === catKey.trim().toLowerCase()
        );
        const total = deptIssues.length;
        const pending = deptIssues.filter((i) => i.status === 'PENDING').length;
        const inProgress = deptIssues.filter((i) => i.status === 'IN_PROGRESS').length;
        const awaitingVerification = deptIssues.filter((i) => i.status === 'RESOLUTION_SUBMITTED').length;
        const resolved = deptIssues.filter((i) => i.status === 'RESOLVED').length;
        const reopened = deptIssues.filter((i) => i.status === 'REOPENED').length;
        const ratio = total > 0 ? Math.round((resolved / total) * 100) : 0;

        return {
          dept: catKey,
          icon: catObj.icon,
          types: catObj.types,
          total,
          pending,
          inProgress,
          awaitingVerification,
          resolved,
          reopened,
          ratio,
        };
      })
      .sort((a, b) => b.total - a.total);
  };

  const departmentBreakdown = getDepartmentBreakdown();

  return (
    <div className="min-h-screen w-full bg-[#f4fbf7] text-slate-800 font-sans flex flex-col">
      {/* Navbar */}
      <nav className="w-full bg-white/90 backdrop-blur-md border-b border-emerald-100 px-6 sm:px-10 py-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-emerald-200">
            🌱
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-2xl text-slate-900 tracking-tight">
                FixMy <span className="text-emerald-600">City</span>
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold rounded-full uppercase tracking-wider">
                Super Admin
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/super-admin/admins"
            className="px-4 py-2 border border-slate-200 bg-white hover:bg-emerald-50 text-slate-700 rounded-full text-xs font-bold transition-all shadow-sm flex items-center gap-2 no-underline"
          >
            ⚙️ Manage Sub Admins ({subAdminsCount})
          </Link>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
            >
              Logout <span>→</span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-emerald-100 py-2 animate-pop-in origin-top-right z-30">
                <div className="px-4 py-2 flex items-center gap-2 border-b border-slate-100">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">
                    SA
                  </div>
                  <span className="text-xs font-semibold text-slate-600">Super Admin</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors flex items-center justify-between cursor-pointer"
                >
                  Confirm Logout <span>→</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Section */}
      <main className="w-full flex-1 px-6 sm:px-10 py-8 max-w-[1600px] mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Global System Analytics</h1>
            <p className="text-slate-500 text-sm mt-1">Super Admin view across TMA, Electricity, Water, Education & Infrastructure.</p>
          </div>
          <div className="text-xs text-slate-600 bg-white border border-emerald-100 px-5 py-3 rounded-2xl shadow-sm flex items-center gap-4">
            <span>Total System Issues: <strong className="text-slate-900 text-sm">{statValues.total}</strong></span>
            <span className="w-px h-4 bg-slate-200"></span>
            <span>Sub Admins: <strong className="text-emerald-600 text-sm">{activeAdminsCount}/{subAdminsCount}</strong></span>
          </div>
        </div>

        {loading ? (
          <div className="p-16 text-center text-slate-500 flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
            <span className="font-semibold text-sm">Gathering live system metrics...</span>
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 mb-8">
              {STAT_DEFS.map((s, idx) => (
                <div
                  key={s.key}
                  className={`rounded-2xl p-5 shadow-sm ring-1 ${s.ring} ${s.bg} transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-default animate-fade-in-up`}
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <p className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${s.dark ? 'text-white/70' : s.text}`}>
                    {s.label}
                  </p>
                  <p className={`text-3xl font-extrabold ${s.dark ? 'text-white' : s.text}`}>
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

            {/* Filters */}
            <div className="bg-white border border-emerald-100 rounded-2xl p-5 mb-8 shadow-sm grid grid-cols-1 sm:grid-cols-6 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Search</label>
                <input
                  type="text"
                  placeholder="Title, description..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 bg-slate-50/50 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">District Scope</label>
                <select
                  value={districtFilter}
                  onChange={(e) => {
                    setDistrictFilter(e.target.value);
                    setAreaFilter('ALL');
                  }}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 bg-slate-50/50 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                >
                  <option value="ALL">All Districts</option>
                  {DEFAULT_DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Area Filter</label>
                <select
                  value={areaFilter}
                  onChange={(e) => setAreaFilter(e.target.value)}
                  disabled={districtFilter === 'ALL'}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 bg-slate-50/50 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all disabled:opacity-50"
                >
                  <option value="ALL">{districtFilter === 'ALL' ? 'Select District First' : 'All Areas'}</option>
                  {availableAreas.map((area) => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Category / Sector</label>
                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 bg-slate-50/50 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                >
                  <option value="ALL">All Categories</option>
                  {categoryList.map((catKey) => (
                    <option key={catKey} value={catKey}>
                      {CATEGORIES[catKey].icon} {catKey}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 bg-slate-50/50 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLUTION_SUBMITTED">Awaiting Verification</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="REOPENED">Reopened</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Priority Level</label>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 bg-slate-50/50 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                >
                  <option value="ALL">All Priorities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            {/* Active Scope Performance Banner */}
            <div className="bg-white border border-emerald-100 rounded-3xl p-6 mb-8 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📊</span>
                    <h2 className="text-xl font-extrabold text-slate-900">Filtered Performance Metrics</h2>
                  </div>
                  <p className="text-slate-500 text-xs mt-1">
                    District: <strong className="text-emerald-700">{districtFilter === 'ALL' ? 'All Districts' : districtFilter}</strong> 
                    {areaFilter !== 'ALL' && <> | Area: <strong className="text-emerald-700">{areaFilter}</strong></>}
                    | Category: <strong className="text-emerald-700">{deptFilter === 'ALL' ? 'All Categories' : deptFilter}</strong>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-5 text-center">
                  <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">Resolution Ratio</p>
                  <div className="text-4xl font-black text-emerald-600 my-1">{currentDeptStats.ratio}%</div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {currentDeptStats.resolved} of {currentDeptStats.total} filtered issues solved
                  </p>
                </div>

                <div className="md:col-span-3 space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-slate-700">Completion Level</span>
                      <span className="text-emerald-700">{currentDeptStats.ratio}% Completed</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${currentDeptStats.ratio}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3 text-center">
                    <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                      <div className="text-[10px] font-bold uppercase text-slate-400">Total</div>
                      <div className="text-base font-bold text-slate-900">{currentDeptStats.total}</div>
                    </div>
                    <div className="bg-amber-50 border border-amber-100 p-2.5 rounded-xl">
                      <div className="text-[10px] font-bold uppercase text-amber-600">Pending</div>
                      <div className="text-base font-bold text-amber-700">{currentDeptStats.pending}</div>
                    </div>
                    <div className="bg-blue-50 border border-blue-100 p-2.5 rounded-xl">
                      <div className="text-[10px] font-bold uppercase text-blue-600">In Progress</div>
                      <div className="text-base font-bold text-blue-700">{currentDeptStats.inProgress}</div>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl">
                      <div className="text-[10px] font-bold uppercase text-emerald-600">Resolved</div>
                      <div className="text-base font-bold text-emerald-700">{currentDeptStats.resolved}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Department / Category Breakdown Table (Specific to District & Area) */}
            <div className="bg-white border border-emerald-100 rounded-2xl p-6 mb-8 shadow-sm">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  🏛️ Sector / Category Breakdown Performance
                </h2>
                <p className="text-slate-500 text-xs mt-0.5">
                  Showing all category stats for <strong className="text-emerald-700">{districtFilter === 'ALL' ? 'All Districts' : districtFilter}</strong> {areaFilter !== 'ALL' && `➔ ${areaFilter}`}.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[10px] font-bold uppercase text-slate-400 border-b border-slate-100">
                      <th className="pb-2 pr-3">Category / Department</th>
                      <th className="pb-2 px-3 text-center">Total</th>
                      <th className="pb-2 px-3 text-center">Pending</th>
                      <th className="pb-2 px-3 text-center">In Progress</th>
                      <th className="pb-2 px-3 text-center">Awaiting Verify</th>
                      <th className="pb-2 px-3 text-center">Resolved</th>
                      <th className="pb-2 px-3 text-center">Reopened</th>
                      <th className="pb-2 pl-3">Resolution Ratio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departmentBreakdown.map((row) => (
                      <tr key={row.dept} className="border-b border-slate-50 hover:bg-emerald-50/30">
                        <td className="py-3 pr-3 font-bold text-slate-900">
                          <span className="mr-2 text-base">{row.icon}</span>
                          {row.dept}
                        </td>
                        <td className="py-3 px-3 text-center text-slate-700 font-semibold">{row.total}</td>
                        <td className="py-3 px-3 text-center text-amber-600 font-semibold">{row.pending}</td>
                        <td className="py-3 px-3 text-center text-blue-600 font-semibold">{row.inProgress}</td>
                        <td className="py-3 px-3 text-center text-purple-600 font-semibold">{row.awaitingVerification}</td>
                        <td className="py-3 px-3 text-center text-emerald-600 font-semibold">{row.resolved}</td>
                        <td className="py-3 px-3 text-center text-orange-600 font-semibold">{row.reopened}</td>
                        <td className="py-3 pl-3">
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-emerald-500 h-full rounded-full"
                                style={{ width: `${row.ratio}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold text-emerald-700">{row.ratio}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Read-Only System Issues List */}
            <div className="bg-white border border-emerald-100 rounded-2xl p-6 shadow-sm mb-10">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📋</span>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">System Issues Overview ({filteredIssues.length})</h2>
                    <p className="text-slate-500 text-xs mt-0.5">Showing system issues matching active scope.</p>
                  </div>
                </div>
                {(deptFilter !== 'ALL' || districtFilter !== 'ALL' || areaFilter !== 'ALL') && (
                  <button
                    onClick={() => {
                      setDeptFilter('ALL');
                      setDistrictFilter('ALL');
                      setAreaFilter('ALL');
                    }}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full transition-all cursor-pointer"
                  >
                    Reset All Filters ×
                  </button>
                )}
              </div>

              {filteredIssues.length === 0 ? (
                <div className="text-center py-10 text-slate-400 font-medium text-sm">
                  No issues match the selected filters.
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredIssues.map((issue, idx) => {
                    const icon = CATEGORIES[issue.category]?.icon || '📋';
                    return (
                      <div
                        key={issue._id || issue.id || idx}
                        className="flex flex-wrap justify-between items-center gap-4 p-4 border border-slate-100 rounded-xl hover:bg-emerald-50/30 transition-all animate-fade-in-up"
                        style={{ animationDelay: `${idx * 40}ms` }}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-900 text-base">{issue.title || 'Untitled Issue'}</h3>
                            <span
                              className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${
                                issue.priority === 'high'
                                  ? 'bg-rose-50 text-rose-600 border border-rose-100'
                                  : issue.priority === 'medium'
                                  ? 'bg-amber-50 text-amber-600 border border-amber-100'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {issue.priority || 'medium'}
                            </span>
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider bg-slate-100 text-slate-700">
                              {issue.status || 'PENDING'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            📍 <strong className="text-slate-700">{getLocationStr(issue)}</strong>
                            &nbsp;|&nbsp; {icon} <strong className="text-emerald-700">{issue.category || 'General'}</strong> ({issue.problem_type || 'N/A'})
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setSelectedIssue(issue)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            👁️ View Details
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Read-Only Modal View */}
      <IssueDetailsModal
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
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
      `}</style>
    </div>
  );
}