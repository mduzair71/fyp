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
    department: 'Water',
    district: 'Nowshera',
    area: 'Jehangira',
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
        department: 'Water',
        district: 'Nowshera',
        area: 'Jehangira',
        status: 'active'
      });
      fetchSubAdmins();
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || 'Failed to create Sub Admin');
    }
  };

  const openEditModal = (admin) => {
    setSelectedAdmin(admin);
    setEditForm({
      name: admin.name || '',
      email: admin.email || '',
      password: '',
      department: admin.department || 'Water',
      district: admin.district || 'Nowshera',
      area: admin.area || 'Jehangira',
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
    <div className="min-h-screen bg-[#0f172a] text-slate-900 font-['Inter',sans-serif] p-4 sm:p-8">
      
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden min-h-[90vh]">
        {/* Header */}
        <nav className="border-b border-gray-200 px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded bg-[#16a34a] text-white flex items-center justify-center font-bold text-lg">
              M
            </div>
            <div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">Mahol<span className="text-[#16a34a]">AI</span></span>
              <span className="ml-4 px-2 py-1 bg-purple-100 text-purple-700 text-[10px] font-bold rounded uppercase tracking-wider">
                SUPER ADMIN
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/super-admin/dashboard" className="text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors no-underline">
              ← Global Overview
            </Link>
            <button
              onClick={fetchAuditLogs}
              className="px-3 py-1.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded text-xs font-semibold transition-colors"
            >
              📋 Audit Trail
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-bold shadow transition-colors"
            >
              + Create Sub Admin
            </button>
          </div>
        </nav>

        <div className="px-8 py-8">
          
          <div className="flex justify-between items-end mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sub Admin Management</h1>
              <p className="text-gray-500 text-sm mt-1">Issue, reassign, and deactivate department-level administrators.</p>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 border border-gray-200 px-4 py-2 rounded">
              Total Sub Admins: <strong className="text-gray-900">{subAdmins.length}</strong> | Active: <strong className="text-green-600">{subAdmins.filter(a => a.status === 'active').length}</strong>
            </div>
          </div>

          {/* Alerts */}
          {successMsg && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded text-green-800 text-sm font-medium flex justify-between items-center">
              <span>✅ {successMsg}</span>
              <button onClick={() => setSuccessMsg('')} className="text-green-800 font-bold">×</button>
            </div>
          )}
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-800 text-sm font-medium flex justify-between items-center">
              <span>⚠️ {errorMsg}</span>
              <button onClick={() => setErrorMsg('')} className="text-red-800 font-bold">×</button>
            </div>
          )}

          {/* Filter Controls */}
          <div className="border border-gray-200 rounded-lg p-5 mb-6 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50/50">
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2">Search</label>
              <input
                type="text"
                placeholder="Name, Email, CNIC..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2">Department</label>
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="ALL">All Departments</option>
                {departmentList.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2">District</label>
              <select
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="ALL">All Districts</option>
                {DISTRICTS.map(dist => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="ALL">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Sub Admins Table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading Sub Admin registry...</div>
            ) : filteredAdmins.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No Sub Admin accounts match the filter criteria.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-700">
                  <thead className="bg-gray-50 text-gray-500 text-[10px] font-bold uppercase border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3.5">Administrator</th>
                      <th className="px-6 py-3.5">Assigned Department</th>
                      <th className="px-6 py-3.5">Jurisdiction Scope</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredAdmins.map((admin) => (
                      <tr key={admin._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900">{admin.name}</div>
                          <div className="text-xs text-gray-500">{admin.email} | CNIC: <span className="font-mono text-gray-600">{admin.cnic}</span></div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded uppercase tracking-wider border border-blue-100">
                            {admin.department || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-800">{admin.district || 'All Districts'}</div>
                          <div className="text-xs text-gray-500">{admin.area || 'All Areas'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase border ${
                            admin.status === 'active'
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-red-50 text-red-700 border-red-200'
                          }`}>
                            ● {admin.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => openEditModal(admin)}
                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-semibold transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => toggleStatus(admin)}
                            className={`px-3 py-1.5 rounded text-xs font-semibold border transition-colors ${
                              admin.status === 'active'
                                ? 'bg-red-50 text-red-600 hover:bg-red-100 border-red-200'
                                : 'bg-green-50 text-green-700 hover:bg-green-100 border-green-200'
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
        </div>
      </div>

      {/* CREATE SUB ADMIN MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
              <h3 className="text-lg font-bold text-gray-900">Create Sub Admin Account</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">×</button>
            </div>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                    placeholder="Ali Khan"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">CNIC</label>
                  <input
                    type="text"
                    required
                    value={createForm.cnic}
                    onChange={(e) => setCreateForm({ ...createForm, cnic: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 font-mono"
                    placeholder="12345-1234567-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                    placeholder="ali@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={createForm.password}
                    onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <p className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider">Scope Jurisdiction</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Department</label>
                    <select
                      value={createForm.department}
                      onChange={(e) => setCreateForm({ ...createForm, department: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                    >
                      {departmentList.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">District</label>
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
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                      >
                        {DISTRICTS.map(dist => (
                          <option key={dist} value={dist}>{dist}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Area / Tehsil</label>
                      <select
                        value={createForm.area}
                        onChange={(e) => setCreateForm({ ...createForm, area: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                      >
                        {getAreas(createForm.district).map(a => (
                          <option key={a} value={a}>{a}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-bold shadow"
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
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
              <h3 className="text-lg font-bold text-gray-900">Reassign Scope: {selectedAdmin.name}</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">×</button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Reset Password (Optional)</label>
                <input
                  type="password"
                  placeholder="Leave blank to retain current password"
                  value={editForm.password}
                  onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <p className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider">Reassign Scope Jurisdiction</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Department</label>
                    <select
                      value={editForm.department}
                      onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                    >
                      {departmentList.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">District</label>
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
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                      >
                        {DISTRICTS.map(dist => (
                          <option key={dist} value={dist}>{dist}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Area / Tehsil</label>
                      <select
                        value={editForm.area}
                        onChange={(e) => setEditForm({ ...editForm, area: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                      >
                        {getAreas(editForm.district).map(a => (
                          <option key={a} value={a}>{a}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Status</label>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-bold shadow"
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
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full p-6 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">System Audit Trail</h3>
                <p className="text-xs text-gray-500">Immutable logs of administrative operations.</p>
              </div>
              <button onClick={() => setShowAuditLogs(false)} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">×</button>
            </div>
            <div className="overflow-y-auto flex-1 border border-gray-200 rounded">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold border-b border-gray-200 sticky top-0">
                  <tr>
                    <th className="px-4 py-3">Timestamp</th>
                    <th className="px-4 py-3">Admin ID</th>
                    <th className="px-4 py-3">Action</th>
                    <th className="px-4 py-3">Target</th>
                    <th className="px-4 py-3">Audit Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {auditLogs.map((log) => (
                    <tr key={log._id} className="hover:bg-gray-50">
                      <td className="px-4 py-2.5 whitespace-nowrap text-gray-500">{log.timestamp}</td>
                      <td className="px-4 py-2.5 font-mono text-gray-600">{log.performed_by}</td>
                      <td className="px-4 py-2.5">
                        <span className="px-2 py-1 bg-gray-100 border border-gray-200 text-gray-700 font-bold rounded text-[10px]">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 font-mono text-gray-800">{log.target_type}: {log.target_id}</td>
                      <td className="px-4 py-2.5">
                        {log.new_val && <div className="text-blue-600 font-mono text-[10px]">NEW: {JSON.stringify(log.new_val)}</div>}
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
