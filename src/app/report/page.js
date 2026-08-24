
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/categories';
import { DISTRICTS, getAreas } from '@/lib/areas';

// ── Inline icons ───────────────────────────────────────────────
const IconTag = (p) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.5 12.5L12 21l-9-9V4a1 1 0 011-1h8l8.5 8.5a2 2 0 010 3z" />
    <circle cx="7.5" cy="7.5" r="1.2" />
  </svg>
);
const IconDoc = (p) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 2h9l5 5v15H6z" />
    <path strokeLinecap="round" d="M15 2v5h5M9 13h6M9 17h6" />
  </svg>
);
const IconPin = (p) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-6.4 7-11.5A7 7 0 105 9.5C5 14.6 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.3" />
  </svg>
);
const IconCamera = (p) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h3l2-2.5h6L17 8h3a1 1 0 011 1v9a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1z" />
    <circle cx="12" cy="13" r="3.3" />
  </svg>
);
const IconUploadCloud = (p) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 18a4.5 4.5 0 01-.6-8.96A6 6 0 0118 8.5a4 4 0 01-.5 7.98" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12v7M9 15l3-3 3 3" />
  </svg>
);
const IconCalendar = (p) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3.5" y="5" width="17" height="16" rx="2" />
    <path strokeLinecap="round" d="M8 3v4M16 3v4M3.5 10h17" />
  </svg>
);
const IconClock = (p) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="9" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3.5 2" />
  </svg>
);
const IconShield = (p) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v6c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6z" />
  </svg>
);
const IconShieldCheck = (p) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v6c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
  </svg>
);
const IconSend = (p) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4z" />
  </svg>
);
const IconEdit = (p) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" />
  </svg>
);
const IconNav = (p) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 11l18-8-8 18-2-8z" />
  </svg>
);

function SectionNumber({ n }) {
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold shrink-0">
      {n}
    </span>
  );
}

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
    location_landmark: '', // NEW — see backend note below
    additional_info: '',
    occurred_date: '', // NEW — see backend note below
    frequency: '', // NEW — see backend note below
    severity_level: '', // NEW — see backend note below
    is_anonymous: false, // NEW — see backend note below
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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

      await axios.post('http://localhost:8000/issues', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
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
    return (
      <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white border border-gray-100 rounded-2xl shadow-sm px-8 py-12 animate-pop-in">
          <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-5 animate-check-in">
            <IconShieldCheck className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Issue Reported!</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            AI ne aapki report analyze kar li. Local admin ko notify kar diya gaya hai.
          </p>
          <p className="text-xs text-gray-400 mt-4 mb-6">Redirecting to issues page...</p>
          <Link
            href="/issues"
            className="inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm no-underline transition-colors"
          >
            View All Issues
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 text-gray-900 font-['Inter',sans-serif]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* ── HEADER BANNER ─────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/60 px-6 sm:px-8 py-7 mb-6">
          <div className="relative z-10 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <IconEdit className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Report an Issue</h1>
              <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                Help us make your community better.
                <br className="hidden sm:block" /> Report any problem you face and we&apos;ll take action.
              </p>
            </div>
          </div>

          {/* Decorative illustration */}
          <svg
            className="pointer-events-none hidden sm:block absolute right-4 bottom-0 h-28 opacity-90"
            viewBox="0 0 260 120"
            fill="none"
          >
            <rect x="150" y="30" width="24" height="90" fill="#c7d9f5" />
            <rect x="180" y="10" width="30" height="110" fill="#bcd0f2" />
            <rect x="215" y="45" width="22" height="75" fill="#c7d9f5" />
            <circle cx="60" cy="55" r="26" fill="#bfdbfe" />
            <path d="M40 65l24-10 40 8-4 10-38-6z" fill="#2563eb" />
            <rect x="20" y="60" width="16" height="8" rx="4" fill="#2563eb" />
            <circle cx="205" cy="55" r="18" fill="#93c5fd" opacity="0.6" />
            <path d="M197 55l6 6 12-13" stroke="#1e40af" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>

        {/* ── MAIN FORM CARD ────────────────────────────────── */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8">
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 mb-5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm animate-shake">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {/* 1. Category */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <SectionNumber n={1} />
                <h2 className="font-bold text-gray-900">Select Issue Category</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.entries(CATEGORIES).map(([name, info]) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => selectCategory(name)}
                    className={`flex flex-col items-center gap-2 px-3 py-5 rounded-xl border-2 transition-all ${
                      category === name
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl">{info.icon}</span>
                    <span className={`text-sm font-semibold ${category === name ? 'text-blue-700' : 'text-gray-700'}`}>
                      {name}
                    </span>
                  </button>
                ))}
              </div>

              {category && problemTypes.length > 0 && (
                <div className="mt-4 animate-fade-in-up">
                  <label className="block text-xs font-semibold text-gray-500 mb-2">Problem Type</label>
                  <div className="flex flex-wrap gap-2">
                    {problemTypes.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({ ...formData, problem_type: type })}
                        className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all ${
                          formData.problem_type === type
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
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
            <div>
              <div className="flex items-center gap-2 mb-4">
                <SectionNumber n={2} />
                <h2 className="font-bold text-gray-900">Issue Details</h2>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Title</label>
                  <div className="flex items-center border border-gray-200 rounded-lg focus-within:border-blue-500 transition-colors">
                    <IconTag className="w-4 h-4 ml-3 text-gray-400 shrink-0" />
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      placeholder="Write a short title for the issue"
                      className="w-full bg-transparent px-3 py-2.5 text-sm outline-none placeholder-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Description</label>
                  <div className="flex border border-gray-200 rounded-lg focus-within:border-blue-500 transition-colors">
                    <IconDoc className="w-4 h-4 ml-3 mt-2.5 text-gray-400 shrink-0" />
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={4}
                      placeholder="Provide a detailed description of the issue..."
                      className="w-full bg-transparent px-3 py-2.5 text-sm outline-none placeholder-gray-400 resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Location + Upload Photos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Location */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <IconPin className="w-4 h-4 text-blue-600" />
                  <h2 className="font-bold text-gray-900">Location</h2>
                </div>

                <div className="flex flex-col gap-3">
                  <select
                    name="location_district"
                    value={formData.location_district}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none cursor-pointer focus:border-blue-500 transition-colors bg-white"
                  >
                    <option value="">Select District</option>
                    {DISTRICTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>

                  <select
                    name="location_area"
                    value={formData.location_area}
                    onChange={handleChange}
                    required
                    disabled={!formData.location_district}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none cursor-pointer focus:border-blue-500 transition-colors bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Select Area / Town</option>
                    {availableAreas.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>

                  <div className="flex items-center border border-gray-200 rounded-lg focus-within:border-blue-500 transition-colors">
                    <IconPin className="w-4 h-4 ml-3 text-gray-400 shrink-0" />
                    <input
                      type="text"
                      name="location_landmark"
                      value={formData.location_landmark}
                      onChange={handleChange}
                      placeholder="Enter Specific Location / Landmark"
                      className="w-full bg-transparent px-3 py-2.5 text-sm outline-none placeholder-gray-400"
                    />
                  </div>

                  {/* GPS — kept as requested */}
                  <button
                    type="button"
                    onClick={handleUseGPS}
                    disabled={gpsLoading}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-blue-700 bg-blue-50 border border-dashed border-blue-300 hover:bg-blue-100 transition-colors disabled:opacity-60"
                  >
                    <IconNav className="w-4 h-4" />
                    {gpsLoading ? 'Getting location...' : 'Use My Current GPS Location'}
                  </button>

                  {formData.location_latitude && formData.location_longitude && (
                    <div className="px-3 py-2 rounded-lg text-xs bg-blue-50 border border-blue-100 animate-fade-in-up">
                      <span className="text-blue-700 font-semibold">✅ GPS Captured:</span>{' '}
                      <span className="text-gray-600">
                        {formData.location_latitude}, {formData.location_longitude}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Photos */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <IconCamera className="w-4 h-4 text-blue-600" />
                  <h2 className="font-bold text-gray-900">Upload Photos (Optional)</h2>
                </div>

                <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" id="file-upload" />
                <label
                  htmlFor="file-upload"
                  className="flex items-center justify-center min-h-[180px] px-6 py-5 border-2 border-dashed border-blue-200 bg-blue-50/40 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                >
                  {!preview ? (
                    <div className="text-center">
                      <IconUploadCloud className="w-8 h-8 mx-auto text-blue-500 mb-2" />
                      <p className="text-gray-700 text-sm font-medium m-0">Click to upload photos</p>
                      <p className="text-gray-400 text-xs mt-1 m-0">or drag and drop</p>
                      <p className="text-gray-400 text-xs m-0">JPG, PNG up to 5MB</p>
                    </div>
                  ) : (
                    <div className="relative">
                      <img src={preview} alt="Preview" className="max-h-32 rounded-lg" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setFile(null);
                          setPreview(null);
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="font-bold text-gray-900">Additional Information (Optional)</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">When did this happen?</label>
                  <div className="flex items-center border border-gray-200 rounded-lg focus-within:border-blue-500 transition-colors">
                    <IconCalendar className="w-4 h-4 ml-3 text-gray-400 shrink-0" />
                    <input
                      type="date"
                      name="occurred_date"
                      value={formData.occurred_date}
                      onChange={handleChange}
                      className="w-full bg-transparent px-3 py-2.5 text-sm outline-none text-gray-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">How often does it happen?</label>
                  <div className="flex items-center border border-gray-200 rounded-lg focus-within:border-blue-500 transition-colors">
                    <IconClock className="w-4 h-4 ml-3 text-gray-400 shrink-0" />
                    <select
                      name="frequency"
                      value={formData.frequency}
                      onChange={handleChange}
                      className="w-full bg-transparent px-3 py-2.5 text-sm outline-none text-gray-700 cursor-pointer"
                    >
                      <option value="">Select frequency</option>
                      <option value="first_time">First time</option>
                      <option value="occasionally">Occasionally</option>
                      <option value="frequently">Frequently</option>
                      <option value="always">Always / Ongoing</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Severity Level</label>
                  <div className="flex items-center border border-gray-200 rounded-lg focus-within:border-blue-500 transition-colors">
                    <IconShield className="w-4 h-4 ml-3 text-gray-400 shrink-0" />
                    <select
                      name="severity_level"
                      value={formData.severity_level}
                      onChange={handleChange}
                      className="w-full bg-transparent px-3 py-2.5 text-sm outline-none text-gray-700 cursor-pointer"
                    >
                      <option value="">Select level</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
              </div>

              <textarea
                name="additional_info"
                value={formData.additional_info}
                onChange={handleChange}
                rows={2}
                placeholder="Koi bhi additional information..."
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 resize-none transition-colors placeholder-gray-400 mb-3"
              />

              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_anonymous"
                  checked={formData.is_anonymous}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                I want to remain anonymous
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <IconSend className="w-4 h-4" />
              {loading ? 'Submitting & Analyzing...' : 'Submit Report'}
            </button>
          </form>
        </div>

        {/* Footer note */}
        <div className="flex items-center justify-center gap-2 text-center text-xs text-gray-500 mt-5">
          <IconShield className="w-4 h-4 text-gray-400 shrink-0" />
          Your report is important to us. We will review and take appropriate action. Thank you for helping to improve your community!
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.35s ease both; }

        @keyframes popIn {
          from { opacity: 0; transform: scale(0.95) translateY(-6px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-pop-in { animation: popIn 0.3s ease both; }

        @keyframes checkIn {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.08); opacity: 1; }
          100% { transform: scale(1); }
        }
        .animate-check-in { animation: checkIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both; }

        @keyframes shake {
          10%, 90% { transform: translateX(-1px); }
          20%, 80% { transform: translateX(2px); }
          30%, 50%, 70% { transform: translateX(-3px); }
          40%, 60% { transform: translateX(3px); }
        }
        .animate-shake { animation: shake 0.4s ease; }

        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in-up, .animate-pop-in, .animate-check-in, .animate-shake {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
