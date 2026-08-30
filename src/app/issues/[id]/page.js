


'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

function getImageUrl(photoUrl) {
  if (!photoUrl) return null;
  if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
    return photoUrl;
  }
  const cleanPath = photoUrl.replace(/^\/+/, '');
  return `http://localhost:8000/${cleanPath}`;
}

function getLocationStr(issue) {
  if (!issue?.location) return issue?.location_area ? `${issue.location_area}, ${issue.location_district || ''}` : 'Location details not available';
  if (typeof issue.location === 'string') return issue.location;
  const loc = issue.location;
  return [loc.area, loc.district].filter(Boolean).join(', ') || 'Location details not available';
}

const STATUS_STEPS = [
  { id: 'PENDING', label: 'Pending', icon: '⏳' },
  { id: 'IN_PROGRESS', label: 'In Progress', icon: '🚀' },
  { id: 'RESOLVED', label: 'Resolved', icon: '✅' },
];

export default function SingleIssueDetails() {
  const params = useParams();
  const router = useRouter();
  const issueId = params?.id;

  const [mounted, setMounted] = useState(false);
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [supporting, setSupporting] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Hydration sync
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!issueId || !mounted) return;

    fetch(`http://localhost:8000/issues/${issueId}`, { credentials: 'include' })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || `Failed to fetch issue (${res.status})`);
        return data;
      })
      .then((data) => {
        setIssue(data.data || data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [issueId, mounted]);

  const handleSupport = async () => {
    if (!issue) return;
    setSupporting(true);
    try {
      const res = await fetch(`http://localhost:8000/issues/${issue._id || issueId}/support`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to update support status');

      const delta = data.supported ? 1 : -1;
      setIssue((prev) => ({
        ...prev,
        supported: data.supported,
        support_count: Math.max(0, (prev?.support_count || 0) + delta),
      }));
    } catch (err) {
      alert(err.message);
    } finally {
      setSupporting(false);
    }
  };

  const statusConfig = {
    PENDING: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', label: 'Pending', icon: '⚡' },
    IN_PROGRESS: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', label: 'In Progress', icon: '🚀' },
    RESOLVED: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', label: 'Resolved', icon: '✅' },
    REJECTED: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20', label: 'Rejected', icon: '❌' },
  };

  const getNormalizedStatus = (status) => {
    if (!status) return 'PENDING';
    const upper = status.toUpperCase();
    return statusConfig[upper] ? upper : 'PENDING';
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
        <div className="w-12 h-12 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin" />
        <p className="mt-4 font-semibold text-sm tracking-wide text-slate-300">Loading Issue Details...</p>
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center max-w-md shadow-2xl">
          <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center mx-auto mb-4 text-xl">⚠️</div>
          <h3 className="text-white font-bold text-lg mb-2">Issue Not Found</h3>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">{error || 'Could not load details for this issue.'}</p>
          <button
            onClick={() => router.back()}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-xl transition-all"
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  const currentStatus = getNormalizedStatus(issue.status);
  const statusInfo = statusConfig[currentStatus];
  const photoPath = getImageUrl(issue.photo_url || issue.image || issue.photo);
  const activeStepIdx = STATUS_STEPS.findIndex((s) => s.id === currentStatus);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased pb-20">
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 px-3.5 py-2 rounded-xl transition-all border border-slate-700/50"
          >
            ← Back
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold tracking-widest text-blue-400 uppercase bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">
              {issue.category || 'General'}
            </span>
            <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}>
              {statusInfo.icon} {statusInfo.label}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-8 space-y-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1">
                Reported on {issue.createdAt ? new Date(issue.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                {issue.title}
              </h1>
            </div>

            <button
              onClick={handleSupport}
              disabled={supporting}
              className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg self-start md:self-auto shrink-0 ${
                issue.supported
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20 hover:shadow-blue-600/30'
              } active:scale-95 disabled:opacity-50`}
            >
              <span>{issue.supported ? '✅ Supported' : "🙋 I'm Affected"}</span>
              <span className="bg-black/20 px-2 py-0.5 rounded-md text-xs font-mono">
                {issue.support_count || 0}
              </span>
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-slate-500 text-base">📍</span>
              <span className="font-medium">{getLocationStr(issue)}</span>
            </div>
            {issue.reporter_name && (
              <div className="flex items-center gap-2 text-slate-300 sm:justify-end">
                <span className="text-slate-500 text-base">👤</span>
                <span>Reported by: <strong className="text-white">{issue.reporter_name}</strong></span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Resolution Status Tracker</p>
          
          <div className="relative flex items-center justify-between max-w-2xl mx-auto">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2 z-0" />
            <div
              className="absolute top-1/2 left-0 h-1 bg-blue-500 -translate-y-1/2 z-0 transition-all duration-500"
              style={{
                width: currentStatus === 'REJECTED' ? '0%' : `${(activeStepIdx / (STATUS_STEPS.length - 1)) * 100}%`,
              }}
            />

            {STATUS_STEPS.map((step, idx) => {
              const isCompleted = currentStatus !== 'REJECTED' && idx <= activeStepIdx;
              const isCurrent = currentStatus === step.id;

              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      isCompleted
                        ? 'bg-blue-600 text-white ring-4 ring-slate-950 shadow-md shadow-blue-500/20'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}
                  >
                    {step.icon}
                  </div>
                  <span className={`text-xs font-semibold mt-2 ${isCurrent ? 'text-blue-400' : 'text-slate-400'}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">Issue Description</h3>
            <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">
              {issue.description || issue.summary || 'No detailed description provided for this report.'}
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">Attached Photo</h3>

            {photoPath && !imgError ? (
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex-1 flex items-center justify-center group relative min-h-[220px]">
                <img
                  src={photoPath}
                  alt={issue.title}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover max-h-80 transition-transform duration-300 group-hover:scale-105"
                />
                <a
                  href={photoPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-3 right-3 bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  🔍 View Full
                </a>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/40 min-h-[200px] flex flex-col items-center justify-center text-slate-500 text-xs p-6 text-center">
                <span className="text-2xl mb-2">🖼️</span>
                <span>{imgError ? 'Failed to load photo attachment' : 'No photo attached to this issue'}</span>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}