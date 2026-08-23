'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    cnic: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        const role = result.role;
        if (role !== 'sub_admin' && role !== 'admin') {
          setError('Access Denied — This portal is strictly for Departmental Sub Administrators.');
          setLoading(false);
          return;
        }

        localStorage.setItem('user_id', result.user_id);
        localStorage.setItem('name', result.name);
        localStorage.setItem('user_name', result.name);
        localStorage.setItem('role', role);
        if (result.department) localStorage.setItem('department', result.department);
        if (result.district)   localStorage.setItem('district', result.district);
        if (result.area)       localStorage.setItem('area', result.area);

        router.push('/admin/dashboard');
      } else {
        setError(result.detail || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Connection error. Please ensure backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-green-900 to-emerald-900 text-white flex flex-col justify-between font-['Inter',sans-serif]">

      {/* Top Header */}
      <div className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white text-emerald-900 flex items-center justify-center font-black text-xl shadow-lg">
            🇵🇰
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-white">Mahol<span className="text-emerald-400">AI</span></span>
            <p className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">Departmental Portal</p>
          </div>
        </div>
        <Link href="/" className="text-emerald-200 hover:text-white text-sm font-medium transition-colors no-underline flex items-center gap-1">
          ← Citizen Portal
        </Link>
      </div>

      {/* Login Form Container */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full bg-emerald-900/60 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-8 shadow-2xl shadow-emerald-950/80">

          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-emerald-800/80 border border-emerald-400/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner">
              🏛️
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Sub Admin Login</h1>
            <p className="text-emerald-200 text-sm mt-1">Access your assigned Department & Area dashboard</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-950/80 border-l-4 border-red-500 p-4 rounded-xl text-red-200 text-xs font-medium flex items-start gap-2 shadow-sm">
              <span className="text-base">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-emerald-200 mb-2">
                CNIC Number
              </label>
              <input
                type="text"
                name="cnic"
                value={formData.cnic}
                onChange={handleChange}
                required
                placeholder="12345-1234567-1"
                className="w-full px-4 py-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-sm text-white placeholder-emerald-400/60 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-emerald-200 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-sm text-white placeholder-emerald-400/60 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg border-0 ${
                loading
                  ? 'bg-emerald-800/50 text-emerald-400 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-emerald-950 cursor-pointer shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-[1px]'
              }`}
            >
              {loading ? 'Authenticating Department Scope...' : 'Login to Department Dashboard →'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-emerald-500/20 text-center">
            <p className="text-emerald-300/80 text-xs">
              Sub Admin accounts are issued exclusively by the Super Admin.
            </p>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="p-6 text-center text-emerald-400/60 text-xs">
        © 2026 MaholAI Civic System · Government Department Portal
      </div>

    </div>
  );
}