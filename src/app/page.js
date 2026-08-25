
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

function getLocationStr(issue) {
  if (!issue) return '—';
  if (typeof issue.location === 'string') return issue.location;
  if (issue.location && typeof issue.location === 'object') {
    const loc = issue.location;
    return [loc.area, loc.district].filter(Boolean).join(', ') || '—';
  }
  return issue.location_area ? `${issue.location_area}, ${issue.location_district || ''}` : '—';
}

// Level 1 Upper-Case Canonical Status Matching
const STATUS_LABEL = {
  PENDING: 'Under Review',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  REJECTED: 'Rejected',
  // Fallbacks for legacy lowercase responses
  pending: 'Under Review',
  in_progress: 'In Progress',
  resolved: 'Resolved',
};

const STATUS_COLOR = {
  PENDING: 'text-amber-600 bg-amber-50',
  IN_PROGRESS: 'text-blue-600 bg-blue-50',
  RESOLVED: 'text-emerald-600 bg-emerald-50',
  REJECTED: 'text-rose-600 bg-rose-50',
  pending: 'text-amber-600 bg-amber-50',
  in_progress: 'text-blue-600 bg-blue-50',
  resolved: 'text-emerald-600 bg-emerald-50',
};

export default function Home() {
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, inProgress: 0, citizens: 0 });
  const [recentIssues, setRecentIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/issues')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        const issues = data.data || data || [];
        
        const uniqueUsers = new Set(issues.map((i) => i.userId || i.user_id || i.reportedBy)).size;

        setStats({
          total: issues.length,
          pending: issues.filter((i) => String(i.status).toUpperCase() === 'PENDING').length,
          inProgress: issues.filter((i) => String(i.status).toUpperCase() === 'IN_PROGRESS').length,
          resolved: issues.filter((i) => String(i.status).toUpperCase() === 'RESOLVED').length,
          citizens: uniqueUsers > 0 ? uniqueUsers : 0,
        });
        setRecentIssues(issues.slice(0, 3));
      })
      .catch((err) => console.error('Failed to fetch issues:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] text-slate-800 pb-16 md:pb-10">

      {/* HERO SECTION */}
      <section className="w-full bg-gradient-to-b from-blue-50/70 via-blue-50/20 to-transparent py-10 lg:py-14 px-4 sm:px-8 lg:px-12">
        <div className="w-full max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <span className="inline-flex items-center gap-1.5 text-blue-600 bg-blue-100/80 px-3.5 py-1 rounded-full text-xs font-bold">
              💙 Civic Issue Reporting Platform
            </span>

            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Report. Track. <br />
              <span className="text-blue-600">Improve Your Community.</span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base max-w-xl leading-relaxed">
              MahalAI helps you report civic issues in your locality, track resolution status, and build better neighborhoods together.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <Link
                href="/report"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md shadow-blue-500/20 no-underline transition-all"
              >
                + Report an Issue
              </Link>
              <Link
                href="/issues"
                className="bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm px-6 py-3 rounded-xl border border-slate-200/80 no-underline shadow-sm transition-all"
              >
                Explore Issues
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 relative flex justify-end">
            <div className="w-full h-64 sm:h-80 lg:h-96 rounded-3xl overflow-hidden border border-slate-200/60 shadow-md relative bg-blue-100">
              <img 
                src="/hero.jpeg" 
                alt="Civic Issue Management Illustration" 
                className="w-full h-full object-cover"
               
              />
            </div>
          </div>

        </div>
      </section>

      {/* STAT CARDS SECTION */}
      <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 space-y-8 -mt-6 relative z-10">

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-blue-500/20 shrink-0">📍</div>
            <div>
              <p className="text-[11px] text-slate-400 font-semibold uppercase">Active Region</p>
              <p className="text-base font-bold text-slate-900">Swabi & KPK</p>
              <p className="text-[11px] text-slate-400">Public Coverage</p>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-purple-500/20 shrink-0">📊</div>
            <div>
              <p className="text-2xl font-black text-slate-900">{stats.total}</p>
              <p className="text-xs font-bold text-blue-600">Total Reported</p>
              <p className="text-[10px] text-slate-400">Civic Issues</p>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-emerald-500/20 shrink-0">✓</div>
            <div>
              <p className="text-2xl font-black text-slate-900">{stats.resolved}</p>
              <p className="text-xs font-bold text-slate-700">Resolved Issues</p>
              <p className="text-[10px] text-slate-400">Completed Tickets</p>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-amber-500/20 shrink-0">👥</div>
            <div>
              <p className="text-2xl font-black text-slate-900">{stats.citizens}</p>
              <p className="text-xs font-bold text-slate-700">Active Citizens</p>
              <p className="text-[10px] text-slate-400">Registered Reporters</p>
            </div>
          </div>

        </section>

        {/* RECENT ISSUES SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-12 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">📍 Recent Community Reports</h2>
              <Link href="/issues" className="text-xs font-bold text-blue-600 hover:underline no-underline">View All Issues</Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recentIssues.length > 0 ? (
                recentIssues.map((issue) => (
                  <Link 
                    key={issue._id || issue.id} 
                    href={`/issues/${issue._id || issue.id}`} 
                    className="no-underline bg-white border border-slate-200 rounded-2xl p-3 shadow-sm hover:border-blue-400 transition-all flex flex-col justify-between"
                  >                    <div className="space-y-2">
                      <div className="w-full h-32 rounded-xl overflow-hidden bg-slate-100">
                        <img 
                          src={issue.image || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=400"} 
                          alt={issue.title}
                          className="w-full h-full object-cover" 
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=400";
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md">
                          {issue.category || 'General'}
                        </span>
                        {issue.report_count > 1 && (
                          <span className="text-[10px] font-bold bg-orange-50 text-orange-600 px-2 py-0.5 rounded-md">
                            👥 {issue.report_count} reported
                          </span>
                        )}
                      </div>
                      <h3 className="text-xs font-bold text-slate-800 line-clamp-1">{issue.title}</h3>
                      <p className="text-[10px] text-slate-400">📍 {getLocationStr(issue)}</p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center text-[10px]">
                      <span className={`font-semibold px-2 py-0.5 rounded ${STATUS_COLOR[issue.status] || 'bg-slate-100 text-slate-600'}`}>
                        {STATUS_LABEL[issue.status] || issue.status}
                      </span>
                      <span className="text-slate-400 font-medium">
                        {issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-3 bg-white border border-slate-200/80 rounded-2xl p-8 text-center text-slate-500">
                  {loading ? 'Loading recent issues...' : 'No public reports available right now.'}
                </div>
              )}
            </div>
          </div>

        </section>

        {/* LOWER INFORMATION SECTION */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">📈 Track Your Submissions</h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Log in as a citizen to track your submitted reports, verify department progress, and view administrative updates.
              </p>
            </div>
            <Link 
              href="/user/reports" 
              className="text-center text-xs font-bold text-blue-600 no-underline bg-blue-50 py-2.5 rounded-xl hover:bg-blue-100 transition-all"
            >
              View My Reports →
            </Link>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">⚙️ How MahalAI Works</h3>
            <ol className="space-y-3 text-xs text-slate-600 list-decimal pl-4">
              <li><strong className="text-slate-800">Submit Report:</strong> Citizen provides issue details, location, and photo.</li>
              <li><strong className="text-slate-800">Department Scope Assignment:</strong> Issue is automatically routed to authorized area & category sub-admins.</li>
              <li><strong className="text-slate-800">Status Updates:</strong> Sub-admins review, update status (`IN_PROGRESS`, `RESOLVED`), and append remarks.</li>
              <li><strong className="text-slate-800">Citizen Tracking:</strong> Reporter monitors real-time changes from their dashboard.</li>
            </ol>
          </div>

        </section>

      </div>

      {/* FOOTER */}
      <footer className="w-full bg-white border-t border-slate-200 mt-16 py-8">
        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-md shadow-blue-500/20">M</div>
            <span className="font-bold text-slate-900 text-base">MahalAI</span>
          </div>
          <p>© 2026 FixMyCity Core Platform. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}