
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/categories';
import { DISTRICTS, getAreas } from '@/lib/areas';

// ── Icons Components ───────────────────────────────────────────────
const IconCheck = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" {...p}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconTag = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.5 12.5L12 21l-9-9V4a1 1 0 011-1h8l8.5 8.5a2 2 0 010 3z" />
    <circle cx="7.5" cy="7.5" r="1.2" />
  </svg>
);
const IconDoc = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 2h9l5 5v15H6z" />
    <path strokeLinecap="round" d="M15 2v5h5M9 13h6M9 17h6" />
  </svg>
);
const IconPin = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-6.4 7-11.5A7 7 0 105 9.5C5 14.6 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.3" />
  </svg>
);
const IconUploadCloud = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 18a4.5 4.5 0 01-.6-8.96A6 6 0 0118 8.5a4 4 0 01-.5 7.98" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12v7M9 15l3-3 3 3" />
  </svg>
);
const IconCalendar = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
    <rect x="3.5" y="5" width="17" height="16" rx="2" />
    <path strokeLinecap="round" d="M8 3v4M16 3v4M3.5 10h17" />
  </svg>
);
const IconClock = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
    <circle cx="12" cy="12" r="9" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3.5 2" />
  </svg>
);
const IconShieldCheck = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v6c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
  </svg>
);
const IconSend = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4z" />
  </svg>
);
const IconMap = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
    <line x1="8" y1="2" x2="8" y2="18" />
    <line x1="16" y1="6" x2="16" y2="22" />
  </svg>
);

export default function ReportPage() {
  const router = useRouter();
  const [category, setCategory] = useState('');
  const [formData, setFormData] = useState({
    problem_type: '',
    title: '',
    description: '',
    location_district: '',
    location_area: '',
    location_latitude: '',
    location_longitude: '',
    location_landmark: '',
    additional_info: '',
    occurred_date: '',
    frequency: '',
    severity_level: '',
    is_anonymous: false,
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [duplicateInfo, setDuplicateInfo] = useState(null); 
  const [error, setError] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      router.push('/login');
    }
  }, [router]);

  const availableAreas = formData.location_district ? getAreas(formData.location_district) : [];
  const problemTypes = CATEGORIES[category]?.types || [];

  const selectCategory = (cat) => {
    setCategory(cat);
    setFormData((prev) => ({ ...prev, problem_type: '' }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'location_district') {
      setFormData((prev) => ({ ...prev, [name]: value, location_area: '' }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      setError('GPS not supported by your browser');
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          location_latitude: position.coords.latitude.toFixed(6),
          location_longitude: position.coords.longitude.toFixed(6),
        }));
        setGpsLoading(false);
      },
      () => {
        setError('Could not get your location. Please allow location access.');
        setGpsLoading(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.location_district || !formData.location_area) {
      setError('Please select District and Area.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess(false);

    const userId = localStorage.getItem('user_id');
    if (!userId) {
      router.push('/login');
      return;
    }

    try {
      const form = new FormData();
      form.append('category', category);
      form.append('problem_type', formData.problem_type);
      form.append('title', formData.title);
      form.append('description', formData.description);
      form.append('location_area', formData.location_area);
      form.append('location_district', formData.location_district);
      if (formData.location_latitude) form.append('location_latitude', formData.location_latitude);
      if (formData.location_longitude) form.append('location_longitude', formData.location_longitude);
      if (formData.location_landmark) form.append('location_landmark', formData.location_landmark);
      form.append('additional_info', formData.additional_info);
      if (formData.occurred_date) form.append('occurred_date', formData.occurred_date);
      if (formData.frequency) form.append('frequency', formData.frequency);
      if (formData.severity_level) form.append('severity_level', formData.severity_level);
      form.append('is_anonymous', formData.is_anonymous);
      form.append('created_by', userId);
      if (file) form.append('file', file);

      const res = await axios.post('http://localhost:8000/issues', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      setDuplicateInfo({
        isDuplicate: res.data.possible_duplicate,
        message: res.data.message,
        reportCount: res.data.data?.report_count,
      });
      setSuccess(true);

      setCategory('');
      setFormData({
        problem_type: '',
        title: '',
        description: '',
        location_district: '',
        location_area: '',
        location_latitude: '',
        location_longitude: '',
        location_landmark: '',
        additional_info: '',
        occurred_date: '',
        frequency: '',
        severity_level: '',
        is_anonymous: false,
      });
      setFile(null);
      setPreview(null);

      setTimeout(() => {
        window.location.href = '/issues';
      }, 2500);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error reporting issue');
    } finally {
      setLoading(false);
    }
  };

  const canSubmit =
    !loading && category && formData.problem_type && formData.title && formData.description && formData.location_area;

  if (success) {
    const isDup = duplicateInfo?.isDuplicate;
    return (
      <div className="min-h-screen w-full bg-[#0a1910] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-black/40 backdrop-blur-xl border-2 border-emerald-500 rounded-3xl shadow-[0_0_25px_rgba(16,185,129,0.3)] px-8 py-12">
          <div className={`w-16 h-16 mx-auto rounded-full border-2 flex items-center justify-center mb-5 ${
            isDup ? 'bg-amber-500/20 border-amber-400 text-amber-400' : 'bg-emerald-500/20 border-emerald-400 text-emerald-400'
          }`}>
            <IconShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {isDup ? 'Already Reported!' : 'Issue Reported!'}
          </h2>
          <p className="text-sm text-emerald-100/70 leading-relaxed">
            {isDup
              ? 'Yeh issue pehle se hi kisi aur ne report kiya hua hai. Aapki report usi ke saath add kar di gayi hai.'
              : "AI ne aapki report analyze kar li. Local admin ko notify kar diya gaya hai."}
          </p>
          {isDup && duplicateInfo?.reportCount && (
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-semibold">
              👥 {duplicateInfo.reportCount} people ne yeh issue report kiya hai
            </div>
          )}
          <p className="text-xs text-gray-400 mt-4 mb-6">Redirecting to issues page...</p>
          <Link
            href="/issues"
            className="inline-block px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm no-underline transition-colors shadow-[0_0_15px_rgba(16,185,129,0.4)]"
          >
            View All Issues
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center bg-fixed relative text-white font-['Inter',sans-serif] p-4 md:p-6 flex flex-col justify-between"
      style={{ backgroundImage: `linear-gradient(rgba(10, 25, 15, 0.85), rgba(10, 25, 15, 0.9)), url('/hero.jpeg')` }}
    >
      <div className="max-w-[1440px] mx-auto w-full flex-1 flex flex-col justify-stretch">

        {/* ── 3-COLUMN FULL-HEIGHT GRID WITH BOLD GREEN OUTLINES & GLASSMORPHISM ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch flex-1">

          {/* 👈 LEFT SIDEBAR */}
          <div className="lg:col-span-3 bg-white/5 backdrop-blur-xl border-2 border-emerald-500 rounded-3xl p-6 shadow-[0_0_20px_rgba(16,185,129,0.2)] flex flex-col justify-between overflow-hidden">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-extrabold mb-5 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Civic Issue Reporting
              </span>
              <h1 className="text-2.5xl font-black text-white leading-tight">
                Make <span className="text-emerald-400">Your City Better</span>, One Report at a Time!
              </h1>
              <p className="text-xs text-gray-300 mt-2.5 leading-relaxed">
                Your report helps authorities take action and build a cleaner, safer, and smarter city.
              </p>

              {/* Highlights List */}
              <div className="flex flex-col gap-3 mt-6">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-emerald-500/30 hover:border-emerald-400/60 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 text-xs font-bold shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.2)]">⚡</div>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-50">Quick & Easy</h4>
                    <p className="text-[11px] text-gray-400">Submit issues in minutes</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-emerald-500/30 hover:border-emerald-400/60 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/50 flex items-center justify-center text-blue-400 text-xs font-bold shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.2)]">🎯</div>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-50">AI-Powered Analysis</h4>
                    <p className="text-[11px] text-gray-400">Smart categorization & priority</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-emerald-500/30 hover:border-emerald-400/60 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/50 flex items-center justify-center text-teal-400 text-xs font-bold shrink-0 shadow-[0_0_10px_rgba(20,184,166,0.2)]">🕒</div>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-50">Real-time Tracking</h4>
                    <p className="text-[11px] text-gray-400">Track your issue progress</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-emerald-500/30 hover:border-emerald-400/60 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 text-xs font-bold shrink-0 shadow-[0_0_10px_rgba(245,158,11,0.2)]">👥</div>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-50">Community Driven</h4>
                    <p className="text-[11px] text-gray-400">Support and verify together</p>
                  </div>
                </div>
              </div>

              {/* Quote */}
              <div className="bg-emerald-900/30 border border-emerald-500/40 rounded-2xl p-4 mt-5 relative shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                <span className="text-3xl font-serif text-emerald-500/50 absolute top-1 left-2">“</span>
                <p className="text-xs text-emerald-50 font-semibold pl-4 pt-1">
                  A better city starts with an active citizen.
                </p>
                <p className="text-[10px] text-emerald-400 font-bold text-right mt-1">— FixMyCity</p>
              </div>
            </div>

            {/* Bottom Vector Art - Adapted for Dark/Green Theme */}
            <div className="mt-6 pt-4 border-t border-emerald-500/30 relative">
              <svg className="w-full h-28 rounded-b-2xl opacity-80" viewBox="0 0 400 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 160H400V130C360 125 320 135 280 130C240 125 200 135 160 130C120 125 80 135 40 130L0 135V160Z" fill="#059669" />
                <rect x="30" y="60" width="30" height="70" rx="3" fill="#10B981" opacity="0.4" />
                <rect x="70" y="40" width="45" height="90" rx="3" fill="#34D399" opacity="0.5" />
                <rect x="130" y="75" width="25" height="55" rx="3" fill="#6EE7B7" opacity="0.6" />
                <rect x="230" y="50" width="40" height="80" rx="3" fill="#10B981" opacity="0.5" />
                <rect x="280" y="30" width="50" height="100" rx="3" fill="#047857" opacity="0.5" />
                <path d="M0 145C100 135 200 155 400 140V160H0V145Z" fill="#10B981" />
                <circle cx="50" cy="120" r="14" fill="#064E3B" />
                <rect x="48" y="125" width="4" height="25" fill="#022C22" />
                <circle cx="360" cy="115" r="18" fill="#065F46" />
                <rect x="358" y="122" width="4" height="28" fill="#022C22" />
              </svg>
            </div>
          </div>

          {/* 🎯 CENTER FORM CONTAINER */}
          <div className="lg:col-span-6 bg-white/5 backdrop-blur-xl border-2 border-emerald-500 rounded-3xl p-6 sm:p-7 shadow-[0_0_20px_rgba(16,185,129,0.2)] flex flex-col justify-between">
            
            {/* Header Stepper */}
            <div className="flex items-center justify-between mb-6 border-b border-emerald-500/30 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.6)] text-xs font-bold flex items-center justify-center">1</span>
                <span className="text-xs font-bold text-white">Category</span>
              </div>
              <div className="h-[2px] w-8 bg-emerald-500/30"></div>
              <div className="flex items-center gap-2">
                <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-colors ${formData.title ? 'bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.6)]' : 'bg-white/10 text-gray-400 border border-white/20'}`}>2</span>
                <span className={`text-xs font-bold ${formData.title ? 'text-white' : 'text-gray-400'}`}>Details</span>
              </div>
              <div className="h-[2px] w-8 bg-emerald-500/30"></div>
              <div className="flex items-center gap-2">
                <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-colors ${formData.location_area ? 'bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.6)]' : 'bg-white/10 text-gray-400 border border-white/20'}`}>3</span>
                <span className={`text-xs font-bold ${formData.location_area ? 'text-white' : 'text-gray-400'}`}>Location</span>
              </div>
              <div className="h-[2px] w-8 bg-emerald-500/30"></div>
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-white/10 border border-white/20 text-gray-400 text-xs font-bold flex items-center justify-center">4</span>
                <span className="text-xs font-bold text-gray-400">Review</span>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-4 py-3 mb-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-xs font-medium">
                <span>⚠️</span> {error}
              </div>
            )}

            {/* Main Form Fields without Scroll */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              {/* 1. Category Section Dynamic Grid */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center text-xs font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)]">1</span>
                    <h3 className="font-bold text-white text-sm">Issue Category</h3>
                  </div>
                  <span className="text-[10px] bg-amber-500/20 border border-amber-500/50 text-amber-300 font-bold px-2.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.2)]">🔥 Trending</span>
                </div>
                <p className="text-xs text-gray-400 mb-3">Choose the category that best matches your issue</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {Object.entries(CATEGORIES).map(([name, info]) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => selectCategory(name)}
                      className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center ${
                        category === name
                          ? 'border-emerald-400 bg-emerald-500/20 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] scale-[1.02]'
                          : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-emerald-500/50 text-gray-300'
                      }`}
                    >
                      {category === name && (
                        <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-[0_0_5px_rgba(16,185,129,0.8)]">
                          <IconCheck className="w-2.5 h-2.5" />
                        </span>
                      )}
                      <span className="text-2xl mb-1 drop-shadow-md">{info.icon}</span>
                      <span className="text-xs font-bold">{name}</span>
                    </button>
                  ))}
                </div>

                {category && problemTypes.length > 0 && (
                  <div className="mt-3.5">
                    <label className="block text-[11px] font-bold text-emerald-200 mb-2">Select Problem Type</label>
                    <div className="flex flex-wrap gap-2">
                      {problemTypes.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({ ...formData, problem_type: type })}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            formData.problem_type === type
                              ? 'bg-emerald-600 border-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                              : 'bg-white/5 border-white/20 text-gray-300 hover:border-emerald-500/50 hover:bg-white/10'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Issue Details */}
              <div className="pt-4 border-t border-emerald-500/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center text-xs font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)]">2</span>
                    <h3 className="font-bold text-white text-sm">Issue Details</h3>
                  </div>
                  <span className="text-xs text-emerald-400 font-semibold cursor-pointer hover:text-emerald-300 transition-colors drop-shadow-[0_0_5px_rgba(16,185,129,0.4)]">💡 Need help writing?</span>
                </div>

                <div className="flex flex-col gap-3.5 mt-2">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-gray-300">Title <span className="text-emerald-400">*</span></label>
                      <span className="text-[10px] text-gray-400">{formData.title.length}/100</span>
                    </div>
                    <div className="flex items-center border border-white/20 rounded-xl bg-black/40 focus-within:border-emerald-400 focus-within:bg-black/60 focus-within:shadow-[0_0_10px_rgba(16,185,129,0.2)] transition-all">
                      <IconTag className="w-4 h-4 ml-3 text-emerald-500/70 shrink-0" />
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        maxLength={100}
                        placeholder="e.g., Broken street lights near Government College"
                        className="w-full bg-transparent px-3 py-2.5 text-xs outline-none text-white placeholder-gray-500"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-gray-300">Description <span className="text-emerald-400">*</span></label>
                      <span className="text-[10px] text-gray-400">{formData.description.length}/1000</span>
                    </div>
                    <div className="flex border border-white/20 rounded-xl bg-black/40 focus-within:border-emerald-400 focus-within:bg-black/60 focus-within:shadow-[0_0_10px_rgba(16,185,129,0.2)] transition-all">
                      <IconDoc className="w-4 h-4 ml-3 mt-2.5 text-emerald-500/70 shrink-0" />
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        maxLength={1000}
                        rows={3}
                        placeholder="Describe the issue in detail. Mention when it started, how often it happens and its impact on the community..."
                        className="w-full bg-transparent px-3 py-2.5 text-xs outline-none text-white placeholder-gray-500 resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Location Section */}
              <div className="pt-4 border-t border-emerald-500/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center text-xs font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)]">3</span>
                    <h3 className="font-bold text-white text-sm">Location</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleUseGPS}
                      disabled={gpsLoading}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors disabled:opacity-50 flex items-center gap-1 shadow-[0_0_10px_rgba(16,185,129,0.4)] border border-emerald-400"
                    >
                      📍 {gpsLoading ? 'Capturing...' : 'Use My Location'}
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-white border border-white/20 bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-1"
                    >
                      <IconMap className="w-3.5 h-3.5 text-emerald-400" /> Choose on Map
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                  <div className="md:col-span-7 flex flex-col gap-3">
                    <select
                      name="location_district"
                      value={formData.location_district}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2.5 border border-white/20 rounded-xl text-xs text-white outline-none cursor-pointer focus:border-emerald-400 bg-black/60 focus:shadow-[0_0_10px_rgba(16,185,129,0.2)] transition-all appearance-none"
                    >
                      <option value="" className="bg-gray-900 text-white">Select District *</option>
                      {DISTRICTS.map((d) => (
                        <option key={d} value={d} className="bg-gray-900 text-white">{d}</option>
                      ))}
                    </select>

                    <select
                      name="location_area"
                      value={formData.location_area}
                      onChange={handleChange}
                      required
                      disabled={!formData.location_district}
                      className="w-full px-3 py-2.5 border border-white/20 rounded-xl text-xs text-white outline-none cursor-pointer focus:border-emerald-400 bg-black/60 disabled:opacity-50 disabled:cursor-not-allowed focus:shadow-[0_0_10px_rgba(16,185,129,0.2)] transition-all appearance-none"
                    >
                      <option value="" className="bg-gray-900 text-white">Select Area / Town *</option>
                      {availableAreas.map((a) => (
                        <option key={a} value={a} className="bg-gray-900 text-white">{a}</option>
                      ))}
                    </select>

                    <div className="flex items-center border border-white/20 rounded-xl bg-black/40 focus-within:border-emerald-400 focus-within:bg-black/60 focus-within:shadow-[0_0_10px_rgba(16,185,129,0.2)] transition-all">
                      <IconPin className="w-4 h-4 ml-3 text-emerald-500/70 shrink-0" />
                      <input
                        type="text"
                        name="location_landmark"
                        value={formData.location_landmark}
                        onChange={handleChange}
                        placeholder="Landmark (Optional e.g., Near Main Market, GDC Lahor)"
                        className="w-full bg-transparent px-3 py-2.5 text-xs outline-none text-white placeholder-gray-500"
                      />
                    </div>
                  </div>

                  {/* Dynamic Location Map Box - Styled for dark mode */}
                  <div className="md:col-span-5 relative h-32 rounded-2xl overflow-hidden border border-emerald-500/30 bg-black/50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:12px_12px] opacity-20"></div>
                    <div className="absolute top-2 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)] border border-emerald-500/50 text-center">
                      Pin your exact location for accurate tracking
                    </div>
                    <div className="w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-[0_0_15px_rgba(16,185,129,0.8)] z-10 animate-bounce border-2 border-white/50">
                      📍
                    </div>
                  </div>
                </div>

                {formData.location_latitude && formData.location_longitude && (
                  <div className="mt-2 px-3 py-1.5 rounded-lg text-[11px] bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-medium shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                    ✅ GPS Coordinates: {formData.location_latitude}, {formData.location_longitude}
                  </div>
                )}
              </div>

              {/* 4. Evidence Uploader & Info Details */}
              <div className="pt-4 border-t border-emerald-500/30 grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-xs font-bold text-gray-200 mb-2">Upload Evidence (Optional)</label>
                  <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" id="file-upload" />
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-emerald-500/40 bg-emerald-500/5 rounded-2xl cursor-pointer hover:border-emerald-400 hover:bg-emerald-500/10 transition-all text-center px-4"
                  >
                    {!preview ? (
                      <>
                        <IconUploadCloud className="w-5 h-5 text-emerald-400 mb-1 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                        <span className="text-[11px] font-semibold text-gray-300">Drag & drop photos or videos here or click</span>
                        <span className="text-[9px] text-gray-500 mt-0.5">JPG, PNG, GIF, WebP (Max: 5MB each)</span>
                      </>
                    ) : (
                      <div className="relative h-full w-full flex items-center justify-center p-2">
                        <img src={preview} alt="Preview" className="max-h-full rounded-lg object-contain shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setFile(null);
                            setPreview(null);
                          }}
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 border-2 border-black text-white text-[12px] flex items-center justify-center shadow-[0_0_10px_rgba(239,68,68,0.5)] hover:bg-red-600 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </label>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="block text-xs font-bold text-gray-200">Additional Information</label>
                  
                  <div className="flex items-center border border-white/20 rounded-xl px-2.5 py-1.5 bg-black/40 focus-within:border-emerald-400 focus-within:shadow-[0_0_10px_rgba(16,185,129,0.2)] transition-all">
                    <IconCalendar className="w-3.5 h-3.5 text-emerald-500/70 mr-2 shrink-0" />
                    <input
                      type="date"
                      name="occurred_date"
                      value={formData.occurred_date}
                      onChange={handleChange}
                      className="w-full bg-transparent text-xs text-white outline-none cursor-pointer [color-scheme:dark]"
                    />
                  </div>

                  <div className="flex items-center border border-white/20 rounded-xl px-2.5 py-1.5 bg-black/40 focus-within:border-emerald-400 focus-within:shadow-[0_0_10px_rgba(16,185,129,0.2)] transition-all">
                    <IconClock className="w-3.5 h-3.5 text-emerald-500/70 mr-2 shrink-0" />
                    <select
                      name="frequency"
                      value={formData.frequency}
                      onChange={handleChange}
                      className="w-full bg-transparent text-xs text-white outline-none cursor-pointer appearance-none"
                    >
                      <option value="" className="bg-gray-900 text-white">How often does it happen?</option>
                      <option value="first_time" className="bg-gray-900">First time</option>
                      <option value="occasionally" className="bg-gray-900">Occasionally</option>
                      <option value="frequently" className="bg-gray-900">Frequently</option>
                      <option value="always" className="bg-gray-900">Always / Ongoing</option>
                    </select>
                  </div>

                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 mb-1">Severity Level</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {['low', 'medium', 'high'].map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setFormData({ ...formData, severity_level: lvl })}
                          className={`py-1 rounded-lg text-[10px] font-bold capitalize border transition-all ${
                            formData.severity_level === lvl
                              ? lvl === 'high'
                                ? 'bg-red-500 border-red-400 text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                                : lvl === 'medium'
                                ? 'bg-amber-500 border-amber-400 text-white shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                                : 'bg-emerald-500 border-emerald-400 text-white shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                              : 'bg-white/5 border-white/20 text-gray-400 hover:bg-white/10 hover:border-emerald-500/50'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Footer Action Controls */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-4 h-4 rounded border border-white/30 group-hover:border-emerald-400 transition-colors">
                    <input
                      type="checkbox"
                      name="is_anonymous"
                      checked={formData.is_anonymous}
                      onChange={handleChange}
                      className="absolute opacity-0 w-full h-full cursor-pointer"
                    />
                    {formData.is_anonymous && (
                      <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)]"></span>
                    )}
                  </div>
                  Report anonymously
                </label>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-emerald-500/30">
                <button
                  type="button"
                  onClick={() => router.push('/')}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-white border border-white/20 bg-white/5 hover:bg-white/10 transition-colors"
                >
                  Skip for Now
                </button>
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.4)] border border-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  <IconSend className="w-4 h-4" />
                  {loading ? 'Submitting & Analyzing...' : 'Continue to Review ->'}
                </button>
              </div>
            </form>
          </div>

          {/* 👉 RIGHT SIDEBAR */}
          <div className="lg:col-span-3 flex flex-col justify-between gap-4">
            
            <div className="bg-white/5 backdrop-blur-xl border-2 border-emerald-500 rounded-3xl p-5 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-1.5">
                <span className="drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">💡</span> Reporting Guidelines
              </h3>
              <ul className="flex flex-col gap-2.5 text-xs text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 shadow-[0_0_5px_rgba(16,185,129,0.3)]">✓</span>
                  <span><strong>Be specific and clear:</strong> Provide accurate details</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 shadow-[0_0_5px_rgba(16,185,129,0.3)]">✓</span>
                  <span><strong>Add location info:</strong> Helps faster resolution</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 shadow-[0_0_5px_rgba(16,185,129,0.3)]">✓</span>
                  <span><strong>Include photos:</strong> Visual evidence is very helpful</span>
                </li>
              </ul>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border-2 border-emerald-500 rounded-3xl p-5 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <h3 className="text-xs font-bold text-white mb-4">What happens next?</h3>
              <div className="flex flex-col gap-3.5 relative pl-4 border-l-2 border-emerald-500/30 ml-2">
                <div className="relative">
                  <span className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] border border-emerald-900"></span>
                  <h4 className="text-xs font-bold text-emerald-50">Issue submitted</h4>
                  <p className="text-[10px] text-gray-400">Instant confirmation</p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] border border-emerald-900"></span>
                  <h4 className="text-xs font-bold text-emerald-50">AI analysis & categorization</h4>
                  <p className="text-[10px] text-gray-400">Smart analysis within seconds</p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-emerald-600 shadow-[0_0_8px_rgba(5,150,105,0.8)] border border-emerald-900"></span>
                  <h4 className="text-xs font-bold text-emerald-50">Sent to relevant department</h4>
                  <p className="text-[10px] text-gray-400">Based on category & location</p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-emerald-700 shadow-[0_0_8px_rgba(4,120,87,0.8)] border border-emerald-900"></span>
                  <h4 className="text-xs font-bold text-emerald-50">Authority takes action</h4>
                  <p className="text-[10px] text-gray-400">Track progress in real-time</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border-2 border-emerald-500 rounded-3xl p-5 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <h3 className="text-[10px] font-extrabold text-emerald-400/80 uppercase tracking-wider mb-3">Together We've Reported</h3>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-2.5 bg-black/30 border border-white/10 rounded-2xl hover:border-emerald-500/50 transition-colors">
                  <div className="text-base font-black text-white drop-shadow-md">1,247+</div>
                  <div className="text-[10px] text-gray-400 font-semibold">Issues Reported</div>
                </div>
                <div className="p-2.5 bg-black/30 border border-white/10 rounded-2xl hover:border-emerald-500/50 transition-colors">
                  <div className="text-base font-black text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.4)]">876</div>
                  <div className="text-[10px] text-gray-400 font-semibold">Resolved</div>
                </div>
                <div className="p-2.5 bg-black/30 border border-white/10 rounded-2xl hover:border-emerald-500/50 transition-colors">
                  <div className="text-base font-black text-blue-400 drop-shadow-[0_0_5px_rgba(96,165,250,0.4)]">92%</div>
                  <div className="text-[10px] text-gray-400 font-semibold">Resolution Rate</div>
                </div>
                <div className="p-2.5 bg-black/30 border border-white/10 rounded-2xl hover:border-emerald-500/50 transition-colors">
                  <div className="text-base font-black text-purple-400 drop-shadow-[0_0_5px_rgba(192,132,252,0.4)]">15K+</div>
                  <div className="text-[10px] text-gray-400 font-semibold">Active Citizens</div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border-2 border-emerald-500 rounded-3xl p-4 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-emerald-400 text-base drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]">🎧</span>
                <h4 className="text-xs font-bold text-white">Need Help?</h4>
              </div>
              <p className="text-[10px] text-gray-400 mb-2.5">Facing any issue while reporting? Our support team is here to help.</p>
              <button type="button" className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-xl border border-emerald-500/50 transition-colors shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                Contact Support
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}