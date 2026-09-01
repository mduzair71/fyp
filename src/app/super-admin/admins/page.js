
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { CATEGORIES } from '@/lib/categories';
import { DISTRICTS, getAreas } from '@/lib/areas';

export default function SubAdminManagementPage() {
  const router = useRouter();
  const [subAdmins, setSubAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [districtFilter, setDistrictFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals & Drawers state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAuditLogs, setShowAuditLogs] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  // Form states
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    password: '',
    cnic: '',
    department: '',
    district: '',
    area: '',
    status: 'active'
  });

  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    district: '',
    area: '',
    status: 'active'
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchSubAdmins = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:8000/auth/sub-admins', { withCredentials: true });
      setSubAdmins(res.data.data || []);
    } catch (err) {
      if (err.response?.status === 403 || err.response?.status === 401) {
        router.push('/login');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const res = await axios.get('http://localhost:8000/auth/audit-logs', { withCredentials: true });
      setAuditLogs(res.data.data || []);
      setShowAuditLogs(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'super_admin') {
      router.push('/login');
      return;
    }
    fetchSubAdmins();
  }, [router]);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await axios.post('http://localhost:8000/auth/create-sub-admin', createForm, { withCredentials: true });
      setSuccessMsg('Sub Admin created successfully!');
      setShowCreateModal(false);
      setCreateForm({
        name: '',
        email: '',
        password: '',
        cnic: '',
        department: '',
        district: '',
        area: '',
        status: 'active'
      });
      fetchSubAdmins();
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || 'Failed to create Sub Admin');
    }
  };

  const openEditModal = (admin) => {
    setSelectedAdmin(admin);
    const initialDistrict = admin.district || 'Nowshera';
    const availableAreas = getAreas(initialDistrict);
    setEditForm({
      name: admin.name || '',
      email: admin.email || '',
      password: '',
      department: admin.department || 'Water',
      district: initialDistrict,
      area: admin.area || availableAreas[0] || '',
      status: admin.status || 'active'
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAdmin) return;
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await axios.patch(`http://localhost:8000/auth/sub-admins/${selectedAdmin._id}`, editForm, { withCredentials: true });
      setSuccessMsg('Sub Admin updated successfully!');
      setShowEditModal(false);
      fetchSubAdmins();
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || 'Failed to update Sub Admin');
    }
  };

  const toggleStatus = async (admin) => {
    const newStatus = admin.status === 'active' ? 'inactive' : 'active';
    try {
      await axios.patch(`http://localhost:8000/auth/sub-admins/${admin._id}`, { status: newStatus }, { withCredentials: true });
      fetchSubAdmins();
    } catch (err) {
      console.error(err);
    }
  };

  const departmentList = Object.keys(CATEGORIES);

  const filteredAdmins = subAdmins.filter(admin => {
    const matchesSearch =
      admin.name?.toLowerCase().includes(search.toLowerCase()) ||
      admin.email?.toLowerCase().includes(search.toLowerCase()) ||
      admin.cnic?.includes(search);
    const matchesDept = deptFilter === 'ALL' || admin.department === deptFilter;
    const matchesDistrict = districtFilter === 'ALL' || admin.district === districtFilter;
    const matchesStatus = statusFilter === 'ALL' || admin.status === statusFilter;
    return matchesSearch && matchesDept && matchesDistrict && matchesStatus;
  });

  return (
    <div className="min-h-screen w-full bg-[#f4fbf7] text-slate-800 font-['Inter',sans-serif] flex flex-col">
      
      {/* Full-Width Top Header */}
      <nav className="w-full bg-white/90 backdrop-blur-md border-b border-emerald-100 px-6 sm:px-10 py-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-emerald-200">
            🌱
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-2xl text-slate-900 tracking-tight">FixMy <span className="text-emerald-600">City</span></span>
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold rounded-full uppercase tracking-wider">
                Super Admin
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/super-admin/dashboard" className="text-slate-600 hover:text-emerald-700 text-sm font-semibold transition-colors no-underline mr-2 flex items-center gap-1">
            ← Global Overview
          </Link>
          <button
            onClick={fetchAuditLogs}
            className="px-4 py-2 border border-slate-200 bg-white hover:bg-emerald-50 text-slate-700 rounded-full text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            📋 Audit Trail
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-sm font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-95"
          >
            + Create Sub Admin
          </button>
        </div>
      </nav>

      {/* Full-Width Main Section */}
      <main className="w-full flex-1 px-6 sm:px-10 py-8 max-w-[1600px] mx-auto">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Sub Admin Management</h1>
            <p className="text-slate-500 text-sm mt-1">Issue, reassign, and deactivate department-level administrators.</p>
          </div>
          <div className="text-xs text-slate-600 bg-white border border-emerald-100 px-5 py-3 rounded-2xl shadow-sm flex items-center gap-4">
            <span>Total Sub Admins: <strong className="text-slate-900 text-sm">{subAdmins.length}</strong></span>
            <span className="w-px h-4 bg-slate-200"></span>
            <span>Active: <strong className="text-emerald-600 text-sm">{subAdmins.filter(a => a.status === 'active').length}</strong></span>
          </div>
        </div>

        {/* Alerts */}
        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm font-semibold flex justify-between items-center shadow-sm">
            <span className="flex items-center gap-2">✅ {successMsg}</span>
            <button onClick={() => setSuccessMsg('')} className="text-emerald-800 hover:text-emerald-950 font-bold text-lg leading-none">×</button>
          </div>
        )}
        {errorMsg && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm font-semibold flex justify-between items-center shadow-sm">
            <span className="flex items-center gap-2">⚠️ {errorMsg}</span>
            <button onClick={() => setErrorMsg('')} className="text-rose-800 hover:text-rose-950 font-bold text-lg leading-none">×</button>
          </div>
        )}

        {/* Filter Controls Card */}
        <div className="bg-white border border-emerald-100 rounded-2xl p-5 mb-6 shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Search</label>
            <input
              type="text"
              placeholder="Name, Email, CNIC..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 bg-slate-50/50 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Department</label>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 bg-slate-50/50 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all"
            >
              <option value="ALL">All Departments</option>
              {departmentList.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">District</label>
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 bg-slate-50/50 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all"
            >
              <option value="ALL">All Districts</option>
              {DISTRICTS.map(dist => (
                <option key={dist} value={dist}>{dist}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 bg-slate-50/50 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all"
            >
              <option value="ALL">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Sub Admins Table */}
        <div className="bg-white border border-emerald-100 rounded-2xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-12 text-center text-slate-500 font-medium">Loading Sub Admin registry...</div>
          ) : filteredAdmins.length === 0 ? (
            <div className="p-12 text-center text-slate-500 font-medium">No Sub Admin accounts match the filter criteria.</div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-sm text-slate-700 border-collapse">
                <thead className="bg-emerald-50/60 text-slate-500 text-[11px] font-bold uppercase border-b border-emerald-100 tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Administrator</th>
                    <th className="px-6 py-4">Assigned Department</th>
                    <th className="px-6 py-4">Jurisdiction Scope</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAdmins.map((admin) => (
                    <tr key={admin._id} className="hover:bg-emerald-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 text-base">{admin.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{admin.email} <span className="text-slate-300">|</span> CNIC: <span className="font-mono text-slate-700">{admin.cnic}</span></div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold rounded-full uppercase tracking-wider">
                          {admin.department || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800">{admin.district || 'All Districts'}</div>
                        <div className="text-xs text-slate-500">{admin.area || 'All Areas'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                          admin.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          ● {admin.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(admin)}
                          className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-all active:scale-95"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => toggleStatus(admin)}
                          className={`px-4 py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-95 ${
                            admin.status === 'active'
                              ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200'
                          }`}
                        >
                          {admin.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* CREATE SUB ADMIN MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-7 shadow-2xl border border-emerald-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-5">
              <h3 className="text-xl font-bold text-slate-900">Create Sub Admin Account</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl font-bold leading-none">×</button>
            </div>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="Enter Your Name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">CNIC</label>
                  <input
                    type="text"
                    required
                    value={createForm.cnic}
                    onChange={(e) => setCreateForm({ ...createForm, cnic: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-mono"
                    placeholder="CNIC(13)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="email.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
                  <input
                    type="password"
                    required
                    value={createForm.password}
                    onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="Password"
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 mt-4">
                <p className="text-xs font-bold text-emerald-700 mb-3 uppercase tracking-wider">Scope Jurisdiction</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Department</label>
                    <select
                      value={createForm.department}
                      onChange={(e) => setCreateForm({ ...createForm, department: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    >
                      {departmentList.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">District</label>
                      <select
                        value={createForm.district}
                        onChange={(e) => {
                          const dist = e.target.value;
                          const areas = getAreas(dist);
                          setCreateForm({
                            ...createForm,
                            district: dist,
                            area: areas[0] || ''
                          });
                        }}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      >
                        {DISTRICTS.map(dist => (
                          <option key={dist} value={dist}>{dist}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Tehsil / Area</label>
                      <select
                        value={createForm.area}
                        onChange={(e) => setCreateForm({ ...createForm, area: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      >
                        {getAreas(createForm.district).map(a => (
                          <option key={a} value={a}>{a}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-5 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 border border-slate-200 rounded-full text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-sm font-bold shadow-md shadow-emerald-600/20"
                >
                  Create Sub Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT SUB ADMIN MODAL */}
      {showEditModal && selectedAdmin && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-7 shadow-2xl border border-emerald-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-5">
              <h3 className="text-xl font-bold text-slate-900">Reassign Scope: <span className="text-emerald-600">{selectedAdmin.name}</span></h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl font-bold leading-none">×</button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    placeholder="Ali Khan"
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={editForm.email}
                    placeholder="ali@example.com"
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Reset Password (Optional)</label>
                <input
                  type="password"
                  placeholder="Leave blank to retain current password"
                  value={editForm.password}
                  onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 placeholder-slate-400"
                />
              </div>

              <div className="border-t border-slate-100 pt-4 mt-4">
                <p className="text-xs font-bold text-emerald-700 mb-3 uppercase tracking-wider">Reassign Scope Jurisdiction</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Department</label>
                    <select
                      value={editForm.department}
                      onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    >
                      {departmentList.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">District</label>
                      <select
                        value={editForm.district}
                        onChange={(e) => {
                          const dist = e.target.value;
                          const areas = getAreas(dist);
                          setEditForm({
                            ...editForm,
                            district: dist,
                            area: areas[0] || ''
                          });
                        }}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      >
                        {DISTRICTS.map(dist => (
                          <option key={dist} value={dist}>{dist}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Tehsil / Area</label>
                      <select
                        value={editForm.area}
                        onChange={(e) => setEditForm({ ...editForm, area: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      >
                        {getAreas(editForm.district).map(a => (
                          <option key={a} value={a}>{a}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Status</label>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-5 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-5 py-2.5 border border-slate-200 rounded-full text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-sm font-bold shadow-md shadow-emerald-600/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AUDIT LOGS MODAL */}
      {showAuditLogs && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-7 shadow-2xl border border-emerald-100 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-5">
              <div>
                <h3 className="text-xl font-bold text-slate-900">System Audit Trail</h3>
                <p className="text-xs text-slate-500 mt-0.5">Immutable logs of administrative operations.</p>
              </div>
              <button onClick={() => setShowAuditLogs(false)} className="text-slate-400 hover:text-slate-600 text-2xl font-bold leading-none">×</button>
            </div>
            <div className="overflow-y-auto flex-1 border border-slate-200 rounded-2xl bg-slate-50/50">
              <table className="w-full text-left text-xs text-slate-700 border-collapse">
                <thead className="bg-emerald-50/80 text-slate-600 uppercase text-[10px] font-bold border-b border-emerald-100 sticky top-0 backdrop-blur">
                  <tr>
                    <th className="px-4 py-3">Timestamp</th>
                    <th className="px-4 py-3">Admin ID</th>
                    <th className="px-4 py-3">Action</th>
                    <th className="px-4 py-3">Target</th>
                    <th className="px-4 py-3">Audit Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditLogs.map((log) => (
                    <tr key={log._id} className="hover:bg-emerald-50/30">
                      <td className="px-4 py-3 whitespace-nowrap text-slate-500">{log.timestamp}</td>
                      <td className="px-4 py-3 font-mono text-slate-700">{log.performed_by}</td>
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-1 bg-white border border-slate-200 text-emerald-700 font-mono font-bold rounded-full text-[10px]">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-800">{log.target_type}: {log.target_id}</td>
                      <td className="px-4 py-3">
                        {log.new_val && <div className="text-emerald-700 font-mono text-[10px]">NEW: {JSON.stringify(log.new_val)}</div>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}