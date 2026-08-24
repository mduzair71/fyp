'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    cnic: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
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
        // Strictly block admins from logging in through public portal
        if (result.role === 'super_admin' || result.role === 'sub_admin' || result.role === 'admin') {
          setError('Access Denied — Departmental Administrators must use the Admin Portal.');
          setLoading(false);
          return;
        }

        // Store session for citizen
        localStorage.setItem('user_id', result.user_id);
        localStorage.setItem('name', result.name);
        localStorage.setItem('user_name', result.name);
        localStorage.setItem('role', result.role);
        if (result.area) localStorage.setItem('area', result.area);
        if (result.district) localStorage.setItem('district', result.district);

        window.location.href = '/';
      } else {
        setError(result.detail || 'Login failed');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-emerald-950 via-green-950 to-emerald-900 px-4 py-10">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl px-7 py-8">

        {/* Logo */}
        <div className="flex flex-col items-center mb-5">
          <div className="w-16 h-16 rounded-full border-2 border-emerald-500 flex items-center justify-center text-3xl mb-2">
            🌿
          </div>
          <span className="font-extrabold text-sm tracking-wide text-gray-900">MAHOL<span className="text-emerald-600">AI</span></span>
          <span className="text-[10px] text-gray-400 tracking-wide">Civic Reporting Platform</span>
        </div>

        <h1 className="text-xl font-bold text-gray-900 text-center mb-1">Citizen Login</h1>
        <p className="text-gray-500 text-xs text-center mb-5">Login with your CNIC to continue.</p>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 px-3 py-2 mb-4 rounded-lg">
            <p className="text-red-600 text-xs font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">

          {/* CNIC / Username */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🪪</span>
            <input
              type="text"
              name="cnic"
              autoComplete="off"
              value={formData.cnic}
              onChange={handleChange}
              required
              placeholder="CNIC (13 digits)"
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 focus:outline-none transition-all"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔒</span>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              autoComplete="off"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Password"
              className="w-full pl-9 pr-9 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 focus:outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm bg-transparent border-0 cursor-pointer"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-sm font-bold tracking-wide uppercase transition-all border-0 mt-2 ${
              loading
                ? 'bg-emerald-300 text-white cursor-not-allowed'
                : 'bg-emerald-800 hover:bg-emerald-900 text-white cursor-pointer shadow-md'
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

        </form>

        <p className="text-center text-gray-500 text-xs mt-4">
          No account?{' '}
          <Link href="/signup" className="text-emerald-700 font-semibold no-underline hover:underline">
            Create Account
          </Link>
        </p>

        <div className="text-center mt-2">
          <Link href="/" className="text-emerald-700 text-xs font-medium no-underline hover:underline">
            🏠 Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}