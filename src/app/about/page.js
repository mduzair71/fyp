import React from 'react';

export default function AboutPage() {
  const steps = [
    {
      step: "01",
      title: "Citizen Submits a Report",
      description: "Citizens log local issues by providing text descriptions, photo evidence, and precise GPS location tags.",
    },
    {
      step: "02",
      title: "Email & Identity Verification",
      description: "To prevent spam and ensure authentic reporting, citizens verify their email before reports are processed.",
    },
    {
      step: "03",
      title: "AI Analysis & Routing",
      description: "AI classifies the issue, calculates priority scores based on urgency, and routes it to the designated department.",
    },
    {
      step: "04",
      title: "Duplicate & Cluster Detection",
      description: "Nearby duplicate reports are automatically flagged and grouped into clusters to avoid redundant work.",
    },
    {
      step: "05",
      title: "Sub-Admin Assignment & Action",
      description: "Regional Sub-Admins review issues assigned specifically to their area and category for swift resolution.",
    },
    {
      step: "06",
      title: "Resolution & Community Confirmation",
      description: "After resolution evidence is uploaded by authorities, citizens confirm whether the issue has been fixed.",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-800 flex flex-col justify-between">
      {/* Top Banner / Hero */}
      <header className="w-full bg-white border-b border-slate-200 py-12 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-emerald-700 uppercase bg-emerald-100 rounded-full border border-emerald-200">
            Civic Intelligence Platform
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900">
            How <span className="text-emerald-600">FixMyCity</span> Works
          </h1>
          <p className="text-slate-600 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            Report. Verify. Prioritize. Resolve. Turning citizen feedback into structured, actionable intelligence with smart classification, duplicate detection, and community verification.
          </p>
        </div>
      </header>

      {/* Main Content - Full Width Grid Layout */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((item) => (
            <div
              key={item.step}
              className="flex flex-col justify-between p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-500 transition-all duration-200 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500 text-white font-bold text-base shadow-sm group-hover:scale-105 transition-transform">
                    {item.step}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                    Step {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Full-width Footer Banner */}
      <footer className="w-full bg-white border-t border-slate-200 py-6 px-6 md:px-12 text-center">
        <p className="text-slate-600 text-sm max-w-4xl mx-auto">
          <strong className="text-emerald-600 font-semibold">FixMyCity</strong> bridges the gap between citizens and local authorities to create cleaner, safer, and better-managed communities.
        </p>
      </footer>
    </div>
  );
}