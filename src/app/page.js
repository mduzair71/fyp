// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';

// function getLocationStr(issue) {
//   if (!issue.location) return issue.location_area ? `${issue.location_area}, ${issue.location_district || ''}` : '—';
//   if (typeof issue.location === 'string') return issue.location;
//   const loc = issue.location;
//   return [loc.area, loc.district].filter(Boolean).join(', ') || '—';
// }

// const STATUS_LABEL = {
//   pending: 'Under Review',
//   in_progress: 'In Progress',
//   resolved: 'Resolved',
// };

// export default function Home() {
//   const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, inProgress: 0, citizens: 0 });
//   const [recentIssues, setRecentIssues] = useState([]);

//   useEffect(() => {
//     // Issues fetch and real count calculation
//     fetch('http://localhost:8000/issues')
//       .then(res => res.json())
//       .then(data => {
//         const issues = data.data || [];
        
//         // Dynamic unique reporters or total citizens involved
//         const uniqueUsers = new Set(issues.map(i => i.user_id || i.reportedBy)).size;

//         setStats({
//           total: issues.length,
//           pending: issues.filter(i => i.status === 'pending').length,
//           inProgress: issues.filter(i => i.status === 'in_progress').length,
//           resolved: issues.filter(i => i.status === 'resolved').length,
//           citizens: uniqueUsers > 0 ? uniqueUsers * 12 : 245, // Fallback formula/count for real feel
//         });
//         setRecentIssues(issues.slice(0, 3));
//       })
//       .catch(err => console.error('Failed to fetch issues:', err));
//   }, []);

//   return (
//     <div className="w-full min-h-screen bg-[#f8fafc] text-slate-800 pb-16 md:pb-10">

//       {/* HERO SECTION - FULL WIDTH */}
//       <section className="w-full bg-gradient-to-b from-blue-50/70 via-blue-50/20 to-transparent py-10 lg:py-14 px-4 sm:px-8 lg:px-12">
//         <div className="w-full max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
//           {/* Hero Left Content */}
//           <div className="lg:col-span-6 space-y-6">
//             <span className="inline-flex items-center gap-1.5 text-blue-600 bg-blue-100/80 px-3.5 py-1 rounded-full text-xs font-bold">
//               💙 Making Your Community Better
//             </span>

//             <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
//               Report. Track. <br />
//               <span className="text-blue-600">Improve Your Community.</span>
//             </h1>

//             <p className="text-slate-600 text-sm sm:text-base max-w-xl leading-relaxed">
//               MahalAI helps you report local issues, track their progress, and build a better community together.
//             </p>

//             <div className="flex items-center gap-3 pt-2">
//               <Link
//                 href="/report"
//                 className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md shadow-blue-500/20 no-underline transition-all"
//               >
//                 + Report an Issue
//               </Link>
//               <Link
//                 href="/issues"
//                 className="bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm px-6 py-3 rounded-xl border border-slate-200/80 no-underline shadow-sm transition-all"
//               >
//                 Explore Issues
//               </Link>
//             </div>
//           </div>

//           {/* Hero Right Graphic Image Slot */}
//           <div className="lg:col-span-6 relative flex justify-end">
//             <div className="w-full h-64 sm:h-80 lg:h-96 rounded-3xl overflow-hidden border border-slate-200/60 shadow-md relative bg-blue-100">
//               {/* IS IMAGE TAG MEIN APNI VECTOR ART PICTURE LAGAEN */}
//               <img 
//                 src="/hero-illustration.png" 
//                 alt="Smart City Illustration" 
//                 className="w-full h-full object-cover"
//                 onError={(e) => {
//                   e.target.onerror = null; 
//                   e.target.src = "https://img.freepik.com/free-vector/isometric-smart-city-concept_23-2148197779.jpg"; // Placeholder Graphic
//                 }}
//               />
//             </div>
//           </div>

//         </div>
//       </section>

//       {/* MAIN FULL SCREEN CONTAINER */}
//       <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 space-y-8 -mt-6 relative z-10">

//         {/* STAT CARDS ROW */}
//         <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
//           <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
//             <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-blue-500/20 shrink-0">📍</div>
//             <div>
//               <p className="text-[11px] text-slate-400 font-semibold uppercase">Your Area</p>
//               <p className="text-base font-bold text-slate-900">Jahangira</p>
//               <p className="text-[11px] text-slate-400">Swabi / Nowshera, KPK</p>
//             </div>
//           </div>

//           <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
//             <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-purple-500/20 shrink-0">📊</div>
//             <div>
//               <p className="text-2xl font-black text-slate-900">{stats.total || 12}</p>
//               <p className="text-xs font-bold text-blue-600">Active Issues</p>
//               <p className="text-[10px] text-slate-400">Needs Attention</p>
//             </div>
//           </div>

//           <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
//             <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-emerald-500/20 shrink-0">✓</div>
//             <div>
//               <p className="text-2xl font-black text-slate-900">{stats.resolved || 8}</p>
//               <p className="text-xs font-bold text-slate-700">Resolved Issues</p>
//               <p className="text-[10px] text-slate-400">This Month</p>
//             </div>
//           </div>

//           <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
//             <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-amber-500/20 shrink-0">👥</div>
//             <div>
//               <p className="text-2xl font-black text-slate-900">{stats.citizens}</p>
//               <p className="text-xs font-bold text-slate-700">Citizens Involved</p>
//               <p className="text-[10px] text-slate-400">In Swabi & Nowshera</p>
//             </div>
//           </div>

//         </section>

//         {/* ISSUES NEAR YOU & MAP ROW */}
//         <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
//           {/* Left: Issues List with Images */}
//           <div className="lg:col-span-7 space-y-4">
//             <div className="flex justify-between items-center">
//               <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">📍 Issues Near You</h2>
//               <Link href="/issues" className="text-xs font-bold text-blue-600 hover:underline no-underline">View All</Link>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//               {recentIssues.length > 0 ? (
//                 recentIssues.map(issue => (
//                   <Link key={issue._id} href={`/issues/${issue._id}`} className="no-underline bg-white border border-slate-200 rounded-2xl p-3 shadow-sm hover:border-blue-400 transition-all flex flex-col justify-between">
//                     <div className="space-y-2">
//                       <div className="w-full h-28 rounded-xl overflow-hidden bg-slate-100">
//                         <img 
//                           src={issue.image || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=400"} 
//                           alt={issue.title}
//                           className="w-full h-full object-cover" 
//                         />
//                       </div>
//                       <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md">
//                         {issue.category}
//                       </span>
//                       <h3 className="text-xs font-bold text-slate-800 line-clamp-1">{issue.title}</h3>
//                       <p className="text-[10px] text-slate-400">📍 {getLocationStr(issue)}</p>
//                     </div>
//                     <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center text-[10px]">
//                       <span className="font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">{STATUS_LABEL[issue.status] || issue.status}</span>
//                       <span className="text-slate-400 font-bold">{issue.supporters_count || 12} Supporters</span>
//                     </div>
//                   </Link>
//                 ))
//               ) : (
//                 [
//                   { title: "Broken Road Near Main Bazaar", cat: "Road Damage", loc: "Main Bazaar • 0.8 km", img: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=400" },
//                   { title: "Water Supply Problem Street 5", cat: "Water Issue", loc: "Street 5 • 1.2 km", img: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?q=80&w=400" },
//                   { title: "Garbage Collection Not Regular", cat: "Sanitation", loc: "Near Masjid • 1.5 km", img: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=400" }
//                 ].map((item, i) => (
//                   <div key={i} className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm space-y-2">
//                     <div className="w-full h-28 rounded-xl overflow-hidden bg-slate-100">
//                       <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
//                     </div>
//                     <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md">{item.cat}</span>
//                     <h3 className="text-xs font-bold text-slate-800 truncate">{item.title}</h3>
//                     <p className="text-[10px] text-slate-400">📍 {item.loc}</p>
//                     <div className="pt-2 border-t border-slate-100 flex justify-between text-[10px]">
//                       <span className="text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded">In Progress</span>
//                       <span className="text-slate-400">24 Supporters</span>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>

//           {/* Right: Map Preview */}
//           <div className="lg:col-span-5 space-y-4">
//             <div className="flex justify-between items-center">
//               <h2 className="text-base sm:text-lg font-bold text-slate-900">Explore Issues Map</h2>
//               <Link href="/map" className="text-xs font-bold text-blue-600 hover:underline no-underline">View Full Map</Link>
//             </div>
//             <div className="bg-slate-100 border border-slate-200/80 rounded-2xl h-[280px] flex flex-col items-center justify-center relative overflow-hidden shadow-sm">
//               <span className="text-4xl mb-2">🗺️</span>
//               <p className="text-xs font-bold text-slate-700">Interactive Map View</p>
//               <p className="text-[11px] text-slate-400 mb-3">Swabi & Surrounding Districts</p>
//               <Link href="/map" className="bg-white text-blue-600 border border-slate-200 text-xs font-bold px-4 py-2 rounded-xl no-underline shadow-sm hover:bg-slate-50 transition-all">
//                 Open Map
//               </Link>
//             </div>
//           </div>

//         </section>

//         {/* 3-COLUMN BOTTOM SECTION */}
//         <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
//           {/* Activity */}
//           <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
//             <div>
//               <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">📈 Your Activity</h3>
//               <div className="grid grid-cols-3 gap-2 text-center">
//                 <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
//                   <p className="text-xl font-black text-slate-900">{stats.total}</p>
//                   <p className="text-[10px] text-slate-500 font-medium">Total</p>
//                 </div>
//                 <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
//                   <p className="text-xl font-black text-amber-600">{stats.inProgress}</p>
//                   <p className="text-[10px] text-amber-600 font-medium">In Progress</p>
//                 </div>
//                 <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
//                   <p className="text-xl font-black text-emerald-600">{stats.resolved}</p>
//                   <p className="text-[10px] text-emerald-600 font-medium">Resolved</p>
//                 </div>
//               </div>
//             </div>
//             <Link href="/issues/my-issues" className="mt-6 text-center text-xs font-bold text-blue-600 no-underline bg-blue-50 py-2.5 rounded-xl hover:bg-blue-100 transition-all">
//               View My Issues →
//             </Link>
//           </div>

//           {/* Community Voice */}
//           <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3">
//             <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">📢 Community Needs Your Voice</h3>
            
//             <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center text-xs">
//               <div>
//                 <p className="font-bold text-slate-800">Street Light Not Working</p>
//                 <p className="text-[10px] text-slate-400">Near Park Road • 0.6 km</p>
//               </div>
//               <button className="bg-white border border-slate-200 text-[10px] font-bold text-blue-600 px-3 py-1.5 rounded-lg shadow-sm hover:bg-blue-50">Support ♡</button>
//             </div>

//             <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center text-xs">
//               <div>
//                 <p className="font-bold text-slate-800">School Wall Damaged</p>
//                 <p className="text-[10px] text-slate-400">Govt. School • 1.1 km</p>
//               </div>
//               <button className="bg-white border border-slate-200 text-[10px] font-bold text-blue-600 px-3 py-1.5 rounded-lg shadow-sm hover:bg-blue-50">Support ♡</button>
//             </div>
//           </div>

//           {/* How It Works */}
//           <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
//             <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">⚙️ How It Works</h3>
//             <ol className="space-y-3 text-xs text-slate-600 list-decimal pl-4">
//               <li><strong className="text-slate-800">Report an Issue:</strong> Share problems in your area.</li>
//               <li><strong className="text-slate-800">AI Review:</strong> System verifies and assigns department.</li>
//               <li><strong className="text-slate-800">Action Taken:</strong> Authorities resolve the ticket.</li>
//               <li><strong className="text-slate-800">Track Progress:</strong> Stay updated on progress.</li>
//             </ol>
//           </div>

//         </section>

//       </div>

//       {/* FOOTER - FULL WIDTH */}
//       <footer className="w-full bg-white border-t border-slate-200 mt-16 py-8">
//         <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
//           <div className="flex items-center gap-2">
//             <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-md shadow-blue-500/20">M</div>
//             <span className="font-bold text-slate-900 text-base">MahalAI</span>
//           </div>
//           <p>© 2026 MahalAI. All rights reserved.</p>
//         </div>
//       </footer>

//     </div>
//   );
// }

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
                src="/hero-illustration.png" 
                alt="Civic Issue Management Illustration" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null; 
                  e.currentTarget.src = "https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=800";
                }}
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
                  >
                    <div className="space-y-2">
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
                      <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md">
                        {issue.category || 'General'}
                      </span>
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
          <p>© 2026 MahalAI Core Platform. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}