
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Dynamic API Base URL detection (Localhost vs IP Address)
const getBackendUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    return `http://${hostname}:8000`;
  }
  return 'http://localhost:8000';
};

// Safe Helper for Location String
function getLocationStr(issue) {
  if (!issue) return '—';
  if (issue.location && typeof issue.location === 'object') {
    const loc = issue.location;
    return [loc.area, loc.district].filter(Boolean).join(', ') || '—';
  }
  return issue.location_area ? `${issue.location_area}, ${issue.location_district || ''}` : '—';
}

// Safe Helper for Landmark / Additional Details
function getLandmarkStr(issue) {
  if (!issue) return 'Not specified';
  return issue.additional_info || issue.landmark || 'Not specified';
}

// Safe Helper for Image URL
function getImageUrl(issue) {
  if (!issue) return "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=600";
  
  let imgPath = issue.photo_url || issue.imageUrl || issue.image_url || issue.image || issue.photo;

  if (Array.isArray(issue.images) && issue.images.length > 0) {
    imgPath = issue.images[0];
  }

  if (!imgPath) {
    return "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=600";
  }

  if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) {
    return imgPath;
  }

  const cleanPath = imgPath.replace(/\\/g, '/');
  const finalPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
  return `${getBackendUrl()}${finalPath}`;
}

// UPDATED & ENHANCED: Reported By Count Calculation
function getReporterCount(issue) {
  if (!issue) return 1;

  // 1. Array check for registered user IDs / Objects
  if (Array.isArray(issue.reported_by) && issue.reported_by.length > 0) {
    return issue.reported_by.length;
  }
  if (Array.isArray(issue.reporters) && issue.reporters.length > 0) {
    return issue.reporters.length;
  }
  if (Array.isArray(issue.users) && issue.users.length > 0) {
    return issue.users.length;
  }

  // 2. Numeric field checks from Backend Schema
  const numericCount = 
    issue.report_count ?? 
    issue.reports_count ?? 
    issue.upvotes ?? 
    issue.upvote_count ?? 
    issue.total_reports;

  if (typeof numericCount === 'number' && numericCount > 0) {
    return numericCount;
  }

  return 1;
}

const STATUS_LABEL = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  REJECTED: 'Rejected',
  pending: 'Pending',
  in_progress: 'In Progress',
  resolved: 'Resolved',
};

const STATUS_COLOR = {
  PENDING: 'text-amber-700 bg-amber-50 border-amber-200',
  IN_PROGRESS: 'text-blue-700 bg-blue-50 border-blue-200',
  RESOLVED: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  REJECTED: 'text-rose-700 bg-rose-50 border-rose-200',
  pending: 'text-amber-700 bg-amber-50 border-amber-200',
  in_progress: 'text-blue-700 bg-blue-50 border-blue-200',
  resolved: 'text-emerald-700 bg-emerald-50 border-emerald-200',
};

export default function Home() {
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, inProgress: 0, citizens: 0 });
  const [recentIssues, setRecentIssues] = useState([]);
  const [activeRegion, setActiveRegion] = useState('Community Scope');
  const [loading, setLoading] = useState(true);

  const [selectedIssue, setSelectedIssue] = useState(null);

  useEffect(() => {
    fetch(`${getBackendUrl()}/issues`)
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        const issues = data.data || data || [];
        
        // Count total unique reporters using new reporter resolution helper
        const allReporters = new Set();
        issues.forEach((item) => {
          if (Array.isArray(item.reported_by)) {
            item.reported_by.forEach((id) => allReporters.add(id));
          } else if (item.created_by) {
            allReporters.add(item.created_by);
          }
        });

        setStats({
          total: issues.length,
          pending: issues.filter((i) => String(i.status).toUpperCase() === 'PENDING').length,
          inProgress: issues.filter((i) => String(i.status).toUpperCase() === 'IN_PROGRESS').length,
          resolved: issues.filter((i) => String(i.status).toUpperCase() === 'RESOLVED').length,
          citizens: allReporters.size || issues.length,
        });

        setRecentIssues(issues.slice(0, 3));

        if (issues.length > 0) {
          const latestLoc = getLocationStr(issues[0]);
          if (latestLoc && latestLoc !== '—') {
            setActiveRegion(latestLoc);
          }
        }
      })
      .catch((err) => console.error('Failed to fetch issues:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] text-slate-800 pb-16 md:pb-10 font-sans">

      {/* HERO SECTION */}
      <section className="w-full bg-gradient-to-b from-emerald-50/60 via-blue-50/30 to-transparent py-12 lg:py-16 px-4 sm:px-8 lg:px-12">
        <div className="w-full max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <span className="inline-flex items-center gap-2 text-emerald-700 bg-emerald-100/80 px-4 py-1.5 rounded-full text-xs font-bold border border-emerald-200 shadow-sm">
              ✨ Smart Civic Engagement Platform
            </span>

            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Make Your <br />
              <span className="text-emerald-600 underline decoration-emerald-300 decoration-wavy decoration-2 underline-offset-8">Community Better.</span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base max-w-xl leading-relaxed">
              <strong>FixMyCity</strong> empowers citizens to report civic problems, track real-time resolution status, and collaborate with local authorities for cleaner, safer neighborhoods.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/report"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-600/20 no-underline transition-all transform hover:-translate-y-0.5"
              >
                + Report an Issue
              </Link>
              <Link
                href="/issues"
                className="bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl border border-slate-200/90 no-underline shadow-sm transition-all transform hover:-translate-y-0.5"
              >
                Explore Issues
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 relative flex justify-end">
            <div className="w-full h-72 sm:h-96 lg:h-[420px] rounded-3xl overflow-hidden border border-slate-200/80 shadow-2xl relative bg-slate-100 group">
              <img 
                src="/hero.jpeg" 
                alt="FixMyCity Civic Platform" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=800";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent flex items-end p-6">
                <p className="text-white text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-sm bg-black/30 px-4 py-2 rounded-xl border border-white/20">
                  📍 Report · Track · Resolve Civic Problems
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* STAT CARDS SECTION */}
      <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 space-y-10 -mt-8 relative z-10">

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-emerald-500/20 shrink-0">📍</div>
            <div className="overflow-hidden">
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Active Location</p>
              <p className="text-sm sm:text-base font-bold text-slate-900 truncate" title={activeRegion}>{activeRegion}</p>
              <p className="text-[11px] text-emerald-600 font-semibold">Live Public Area</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-blue-500/20 shrink-0">📊</div>
            <div>
              <p className="text-2xl font-black text-slate-900">{stats.total}</p>
              <p className="text-xs font-bold text-blue-600">Total Reported</p>
              <p className="text-[10px] text-slate-400 font-medium">Civic Issues</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-500 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-teal-500/20 shrink-0">✓</div>
            <div>
              <p className="text-2xl font-black text-slate-900">{stats.resolved}</p>
              <p className="text-xs font-bold text-teal-600">Resolved Issues</p>
              <p className="text-[10px] text-slate-400 font-medium">Completed Tickets</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-indigo-500/20 shrink-0">👥</div>
            <div>
              <p className="text-2xl font-black text-slate-900">{stats.citizens}</p>
              <p className="text-xs font-bold text-indigo-600">Active Citizens</p>
              <p className="text-[10px] text-slate-400 font-medium">Registered Reporters</p>
            </div>
          </div>
        </section>

        {/* RECENT ISSUES SECTION */}
        <section className="space-y-5">
          <div className="flex justify-between items-center">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              📍 Recent Community Reports
            </h2>
            <Link href="/issues" className="text-xs sm:text-sm font-bold text-emerald-600 hover:text-emerald-700 hover:underline no-underline">
              View All Issues →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentIssues.length > 0 ? (
              recentIssues.map((issue) => (
                <div 
                  key={issue._id || issue.id} 
                  onClick={() => setSelectedIssue(issue)}
                  className="cursor-pointer bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-500 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-full h-48 overflow-hidden bg-slate-100 relative">
                      <img 
                        src={getImageUrl(issue)} 
                        alt={issue.title || 'Civic issue photo'}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=600";
                        }}
                      />
                      <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold bg-white/95 text-slate-800 px-2.5 py-1 rounded-lg shadow-sm border border-slate-200">
                          {issue.category || 'General'}
                        </span>
                      </div>
                      <span className="absolute top-3 right-3 text-[10px] font-bold bg-slate-900/80 text-white px-2.5 py-1 rounded-lg shadow-sm backdrop-blur-sm">
                        👥 Reported by: {getReporterCount(issue)}
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
                        {issue.title}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 font-medium truncate">
                        <span>📍</span> {getLocationStr(issue)}
                      </p>
                    </div>
                  </div>

                  <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-100 flex justify-between items-center text-xs">
                    <span className={`font-semibold px-2.5 py-1 rounded-md text-[10px] border ${STATUS_COLOR[issue.status] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                      Status: {STATUS_LABEL[issue.status] || issue.status}
                    </span>
                    <span className="text-emerald-600 font-bold text-[11px]">
                      View Details →
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-white border border-slate-200/80 rounded-2xl p-10 text-center text-slate-500">
                {loading ? 'Loading recent issues...' : 'No public reports available right now.'}
              </div>
            )}
          </div>
        </section>

      </div>

      {/* POPUP MODAL */}
      {selectedIssue && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
            
            <div className="w-full h-60 bg-slate-100 relative shrink-0">
              <img 
                src={getImageUrl(selectedIssue)} 
                alt={selectedIssue.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=600";
                }}
              />
              <button 
                onClick={() => setSelectedIssue(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center text-lg font-bold transition-all shadow-md"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-slate-700">
              <div>
                <div className="flex justify-between items-start gap-3 mb-2">
                  <h2 className="text-xl font-black text-slate-900 leading-tight">
                    {selectedIssue.title}
                  </h2>
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold border shrink-0 ${STATUS_COLOR[selectedIssue.status] || 'bg-slate-100 text-slate-700'}`}>
                    Status: {STATUS_LABEL[selectedIssue.status] || selectedIssue.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 pb-3 border-b border-slate-100">
                  <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-md border border-emerald-200/60">
                    👥 Reported by: <strong>{getReporterCount(selectedIssue)} person(s)</strong>
                  </span>
                  <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md">
                    Category: {selectedIssue.category || 'General'}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Summary / Description</p>
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
                  {selectedIssue.description || selectedIssue.summary || 'No detailed description provided for this issue.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
                  <p className="text-[10px] font-bold uppercase text-emerald-800">📍 Location</p>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">{getLocationStr(selectedIssue)}</p>
                </div>
                <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-100">
                  <p className="text-[10px] font-bold uppercase text-blue-800">🏛️ Landmark / Info</p>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">{getLandmarkStr(selectedIssue)}</p>
                </div>
              </div>

            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setSelectedIssue(null)}
                className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all"
              >
                Close Summary
              </button>
            </div>

          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="w-full bg-white border-t border-slate-200 mt-16 py-8">
        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black flex items-center justify-center text-xs shadow-md shadow-emerald-600/20">F</div>
            <span className="font-bold text-slate-900 text-base tracking-tight">FixMyCity</span>
          </div>
          <p>© 2026 FixMyCity Core Platform. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}