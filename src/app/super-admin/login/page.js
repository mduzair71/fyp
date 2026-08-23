'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { persistAuth } from '@/lib/api';

export default function SuperAdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ cnic: '', password: '' });
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
      const response = await fetch('http://localhost:8000/auth/login/super-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        persistAuth(result);
        router.push('/super-admin/dashboard');
      } else {
        setError(result.detail || 'Login failed.');
      }
    } catch {
      setError('Connection error. Please ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <div className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <span className="font-extrabold text-xl">Mahal<span className="text-blue-400">AI</span></span>
        <Link href="/admin/login" className="text-slate-300 text-sm no-underline">Sub Admin portal →</Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full bg-slate-900 border border-slate-700 rounded-3xl p-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-2">Super Admin</p>
          <h1 className="text-2xl font-bold mb-1">System Control Login</h1>
          <p className="text-slate-400 text-sm mb-6">Dedicated portal. Citizen and Sub Admin accounts cannot enter here.</p>
          {error && <div className="mb-4 bg-red-950/80 border-l-4 border-red-500 p-3 text-red-200 text-xs">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="cnic" value={formData.cnic} onChange={handleChange} required placeholder="CNIC" className="w-full px-4 py-3 bg-slate-950 border border-slate-600 rounded-xl text-sm text-white" />
            <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Password" className="w-full px-4 py-3 bg-slate-950 border border-slate-600 rounded-xl text-sm text-white" />
            <button disabled={loading} className="w-full py-3 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white border-0">
              {loading ? 'Authenticating…' : 'Enter Super Admin Dashboard'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
