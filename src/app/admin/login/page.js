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
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
const getBackendUrl = () => {
  if (typeof window !== 'undefined') {
    return `http://${window.location.hostname}:8000`;
  }
  return 'http://localhost:8000';
};
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // const response = await fetch('http://localhost:8000/auth/login', {
        // const response = await fetch('http://10.248.141.146:8000/auth/login', {
    const response = await fetch(`${getBackendUrl()}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify(formData)
});
      const result = await response.json();

      if (response.ok) {
        const role = result.role;

        // Strictly block normal public citizens
        if (role !== 'sub_admin' && role !== 'admin' && role !== 'super_admin') {
          setError('Access Denied — Public users cannot login here.');
          setLoading(false);
          return;
        }

        // Store session data
        localStorage.setItem('user_id', result.user_id);
        localStorage.setItem('name', result.name);
        localStorage.setItem('user_name', result.name);
        localStorage.setItem('role', role);
        if (result.department) localStorage.setItem('department', result.department);
        if (result.district)   localStorage.setItem('district', result.district);
        if (result.area)       localStorage.setItem('area', result.area);

        // Redirect based on role
        if (role === 'super_admin') {
          router.push('/super-admin/dashboard');
        } else {
          router.push('/admin/dashboard');
        }
      } else {
        setError(result.detail || 'Login failed. Invalid CNIC or password.');
      }
    } catch (err) {
      setError('Cannot connect to server. Please ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#047857] flex items-center justify-center p-4 sm:p-8 lg:p-12 font-sans selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* Main Glass/Unified Container */}
      <div className="w-full max-w-6xl bg-emerald-900/40 backdrop-blur-md border border-emerald-500/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        
        {/* Left Side: Instructions & Portal Overview */}
        <div className="w-full lg:w-1/2 p-8 sm:p-10 lg:p-12 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-emerald-600/30">
          <div className="max-w-xl space-y-8">
            
            {/* Header Section */}
            <div className="border-b border-emerald-600/40 pb-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shadow-inner">
                  🌱
                </div>
                <span className="text-white text-xs font-bold tracking-widest uppercase">
                  Civic Administration
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                FixMy<span className="text-emerald-300">City</span> Admin Portal
              </h1>
              <p className="text-emerald-100/80 text-xs sm:text-sm font-medium mt-1">
                Overview & Official Administrative Guidelines
              </p>
            </div>

            {/* 1. Super Admin Role */}
            <div className="space-y-2.5">
              <h2 className="text-base sm:text-lg font-bold text-emerald-200 flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-emerald-800/80 text-emerald-300 text-xs flex items-center justify-center font-bold border border-emerald-600/50">1</span>
                Super Admin Role
              </h2>
              <ul className="space-y-2 text-xs sm:text-sm text-emerald-100/90 pl-8 leading-relaxed list-disc">
                <li>
                  <strong className="text-white font-semibold">Account Management:</strong> Create, update, and disable Sub-Admin accounts.
                </li>
                <li>
                  <strong className="text-white font-semibold">Department Assignment:</strong> Assign Sub-Admins to specific departments (e.g., TMA, Education, Infrastructure).
                </li>
                <li>
                  <strong className="text-white font-semibold">Performance Tracking:</strong> Check resolution rates and performance metrics for each department.
                </li>
                <li>
                  <strong className="text-white font-semibold">System Analytics:</strong> Access comprehensive, AI-driven city-wide data and reports.
                </li>
              </ul>
            </div>

            {/* 2. Sub-Admin Role */}
            <div className="space-y-2.5 pt-2">
              <h2 className="text-base sm:text-lg font-bold text-emerald-200 flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-emerald-800/80 text-emerald-300 text-xs flex items-center justify-center font-bold border border-emerald-600/50">2</span>
                Sub-Admin Role (Departmental Admin)
              </h2>
              <ul className="space-y-2 text-xs sm:text-sm text-emerald-100/90 pl-8 leading-relaxed list-disc">
                <li>
                  <strong className="text-white font-semibold">Department Focus:</strong> Access and manage concerns specific to your assigned department.
                </li>
                <li>
                  <strong className="text-white font-semibold">Report Resolution:</strong> Address and resolve civic problems reported by citizens in real-time.
                </li>
                <li>
                  <strong className="text-white font-semibold">Progress Reporting:</strong> Update resolution status and generate departmental reports.
                </li>
                <li>
                  <strong className="text-white font-semibold">AI Insight:</strong> Use local AI analysis to prioritize and handle local issues.
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Right Side: Clean White Floating Login Card */}
        <div className="w-full lg:w-1/2 p-6 sm:p-10 lg:p-12 flex items-center justify-center bg-emerald-950/20">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 sm:p-10 flex flex-col items-center">
            
            {/* Logo Icon Badge */}
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-3 shadow-inner">
              <span className="text-2xl text-emerald-700">🏛️</span>
            </div>

            {/* Branding */}
            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none text-center">
              FixMy<span className="text-emerald-600">City</span>
            </h2>
            <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-1.5 mb-6">
              Departmental Portal
            </span>

            <h3 className="text-base font-bold text-slate-800 tracking-tight">Admin Portal Login</h3>
            <p className="text-xs text-slate-500 mb-6 font-medium">Authorized personnel login only.</p>

            {/* Error Display */}
            {error && (
              <div className="w-full bg-red-50 border-l-4 border-red-500 p-3 mb-5 rounded-r-xl">
                <p className="text-red-700 text-xs font-semibold leading-snug">{error}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="w-full space-y-4">
              
              {/* Username Input */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  CNIC / Official Username
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 text-sm">
                    🪪
                  </span>
                  <input
                    type="text"
                    name="cnic"
                    autoComplete="off"
                    required
                    value={formData.cnic}
                    onChange={handleChange}
                    placeholder="e.g. 17301-1234567-1 or admin"
                    className="w-full pl-10 pr-4 py-3 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all font-medium placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 text-sm">
                    🔒
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    autoComplete="off"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-3 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all font-medium placeholder-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 text-sm bg-transparent border-none cursor-pointer transition-colors"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 rounded-xl text-xs sm:text-sm font-extrabold tracking-wider uppercase shadow-md transition-all duration-200 border-none mt-2 ${
                  loading
                    ? 'bg-emerald-300 text-white cursor-not-allowed'
                    : 'bg-[#064e3b] hover:bg-[#043e2e] text-white cursor-pointer active:scale-[0.99] hover:shadow-lg'
                }`}
              >
                {loading ? 'Authenticating...' : 'LOGIN TO DASHBOARD'}
              </button>
            </form>

            {/* Footnote Warning */}
            <p className="text-[11px] text-slate-500 text-center mt-6 leading-relaxed font-normal">
              Sub-Admin and Super Admin accounts are strictly issued by the central authority. Already logged in elsewhere? <span className="text-slate-700 font-semibold underline cursor-pointer">[Logout]</span>.
            </p>

            {/* Portal Switch Link */}
            <div className="mt-6 pt-4 border-t border-slate-100 w-full flex justify-center">
              <Link
                href="/login"
                className="text-xs font-bold text-slate-600 hover:text-emerald-700 no-underline flex items-center gap-1.5 transition-colors"
              >
                <span>←</span> Switch to Citizen Portal
              </Link>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
