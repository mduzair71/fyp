'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CitizenDashboard() {
  const router = useRouter();
  const [issues, setIssues] = useState([]);
  const [nearby, setNearby] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    const role = localStorage.getItem('role');
    if (!userId) {
      router.push('/login');
      return;
    }
    if (role === 'super_admin') {
      router.push('/super-admin/dashboard');
      return;
    }
    if (role === 'sub_admin') {
      router.push('/admin/dashboard');
      return;
    }
    setName(localStorage.getItem('name') || 'Citizen');
    fetch(`http://localhost:8000/issues/user/${userId}`, { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => setIssues(d.data || []));
    fetch('http://localhost:8000/issues', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => setNearby((d.data || []).slice(0, 5)));
  }, [router]);

  const pending = issues.filter((i) => ['pending', 'under_review', 'assigned'].includes(i.status)).length;
  const progress = issues.filter((i) => ['in_progress', 'resolution_submitted', 'community_verification'].includes(i.status)).length;
  const resolved = issues.filter((i) => i.status === 'resolved').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-black">My Reports</h1>
        <p className="text-slate-500 text-sm mb-6">Welcome back, {name}. Track, support, and verify civic issues.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            ['Total', issues.length],
            ['Pending', pending],
            ['In Progress', progress],
            ['Resolved', resolved],
          ].map(([label, value]) => (
            <div key={label} className="bg-white border border-slate-200 rounded-2xl p-4">
              <p className="text-2xl font-black">{value}</p>
              <p className="text-xs font-semibold text-slate-500">{label}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-3 mb-8">
          <Link href="/report" className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold no-underline">+ Report Issue</Link>
          <Link href="/map" className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold no-underline text-slate-800">Open Map</Link>
        </div>
        <h2 className="font-bold mb-3">Recent reports</h2>
        <div className="space-y-2 mb-8">
          {issues.slice(0, 6).map((issue) => (
            <Link key={issue._id} href={`/issues/${issue._id}`} className="block bg-white border border-slate-200 rounded-xl px-4 py-3 no-underline text-slate-800">
              <div className="flex justify-between gap-3">
                <span className="font-semibold text-sm">{issue.title}</span>
                <span className="text-xs text-slate-500">{issue.status}</span>
              </div>
              <p className="text-xs text-slate-400">{issue.category} · {issue.location_area}</p>
            </Link>
          ))}
          {issues.length === 0 && <p className="text-sm text-slate-500">You have not reported an issue yet.</p>}
        </div>
        <h2 className="font-bold mb-3">Nearby civic issues</h2>
        <div className="space-y-2">
          {nearby.map((issue) => (
            <Link key={issue._id} href={`/issues/${issue._id}`} className="block bg-white border border-slate-200 rounded-xl px-4 py-3 no-underline text-slate-800 text-sm">
              {issue.title} <span className="text-slate-400">· {issue.location_area}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
