
// 'use client';

// import { useState, useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';

// export default function VerifyResolutionPage() {
//   const { id } = useParams();
//   const router = useRouter();

//   const [issueData, setIssueData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [feedback, setFeedback] = useState('');
//   const [citizenPhoto, setCitizenPhoto] = useState(null);
//   const [submitting, setSubmitting] = useState(false);
//   const [errorMsg, setErrorMsg] = useState('');

//   // Helper function: Dynamically select backend base URL (Port 8000)
//   const getBackendUrl = () => {
//     if (typeof window !== 'undefined') {
//       const hostname = window.location.hostname;
//       return `http://${hostname}:8000`;
//     }
//     return 'http://localhost:8000';
//   };

//   useEffect(() => {
//     if (!id) return;

//     const backendUrl = getBackendUrl();

//     fetch(`${backendUrl}/issues/${id}`, { 
//       method: 'GET',
//       credentials: 'include' 
//     })
//       .then((res) => {
//         if (res.status === 401) {
//           router.push(`/login?redirect=/issues/${id}/verify`);
//           return null;
//         }
//         if (!res.ok) throw new Error('Failed to fetch issue details');
//         return res.json();
//       })
//       .then((data) => {
//         if (data) {
//           setIssueData(data);
//           setLoading(false);
//         }
//       })
//       .catch((err) => {
//         console.error(err);
//         setErrorMsg('Issue details loading failed or issue not found.');
//         setLoading(false);
//       });
//   }, [id, router]);

// const adminNote = issueData?.status_history
//   ?.slice()
//   .reverse()
//   .find((h) => h.status === 'RESOLUTION_SUBMITTED')?.note;

//   const handleVerification = async (isFixed) => {
//     setSubmitting(true);
//     setErrorMsg('');

//     const formData = new FormData();
//     formData.append('resolved', isFixed ? 'true' : 'false');
//     if (feedback) formData.append('feedback', feedback);
//     if (citizenPhoto) {
//       formData.append('file', citizenPhoto);
//     }

//     try {
//       const backendUrl = getBackendUrl();

//       const res = await fetch(`${backendUrl}/issues/${id}/verify`, {
//         method: 'POST',
//         credentials: 'include',
//         body: formData,
//       });

//       if (res.status === 401) {
//         // Handle unauthenticated case during form submission
//         setErrorMsg('Not authenticated. Please log in first.');
//         router.push(`/login?redirect=/issues/${id}/verify`);
//         return;
//       }

//       if (!res.ok) {
//         const errData = await res.json().catch(() => ({}));
//         throw new Error(errData.detail || 'Verification submission failed');
//       }

//       alert(isFixed ? 'Thank you! Issue marked as RESOLVED.' : 'Issue reopened, department will review again.');
//       router.push(`/issues/${id}`);
//     } catch (err) {
//       console.error(err);
//       setErrorMsg(err.message || 'Failed to update status. Please try again.');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-[60vh] px-4">
//         <p className="text-gray-500 font-medium text-sm sm:text-base">Loading verification details...</p>
//       </div>
//     );
//   }

//   if (errorMsg && !issueData) {
//     return (
//       <div className="flex justify-center items-center min-h-[60vh] px-4">
//         <p className="text-red-500 font-medium text-sm sm:text-base text-center">{errorMsg}</p>
//       </div>
//     );
//   }

//   if (issueData && issueData.status !== 'RESOLUTION_SUBMITTED') {
//     return (
//       <div className="flex justify-center items-center min-h-[60vh] px-4">
//         <p className="text-slate-600 font-medium text-sm sm:text-base text-center">
//           This issue is not currently awaiting verification.
//           <br />
//           Current status: <span className="font-bold">{issueData.status}</span>
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-2xl mx-auto my-4 sm:my-10 p-4 sm:p-6 bg-white rounded-2xl shadow-lg border border-slate-100">
//       <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mb-1">Verify Issue Resolution</h1>
//       <p className="text-xs sm:text-sm text-slate-500 mb-6">
//         Issue ID: <span className="font-mono text-slate-700">{id}</span>
//       </p>

//       {/* Admin Uploaded Evidence Section */}
//       <div className="mb-6 p-3 sm:p-4 bg-slate-50 border border-slate-200 rounded-xl">
//         <h2 className="text-xs sm:text-sm font-semibold text-slate-700 mb-2">Admin Resolution Evidence</h2>
//         {issueData?.resolution_photo_url ? (
//           <img
//             src={`${getBackendUrl()}/${issueData.resolution_photo_url.replace(/^\//, '')}`}
//             alt="Resolution Evidence"
//             className="w-full h-48 sm:h-64 object-cover rounded-lg border border-slate-300 mb-3"
//           />
//         ) : (
//           <div className="w-full h-36 sm:h-40 bg-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-xs sm:text-sm mb-3">
//             No image evidence provided
//           </div>
//         )}
//         {adminNote && (
//           <p className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
//             <strong className="text-slate-800">Admin Note:</strong> {adminNote}
//           </p>
//         )}
//       </div>

//       {/* Optional Feedback Input */}
//       <div className="mb-4">
//         <label className="block text-xs font-semibold text-slate-700 mb-1">
//           Your Feedback (Optional)
//         </label>
//         <textarea
//           rows={3}
//           value={feedback}
//           onChange={(e) => setFeedback(e.target.value)}
//           placeholder="Write details about whether the issue was fixed properly or not..."
//           className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
//         />
//       </div>

//       {/* Mobile-Friendly Camera/Photo Upload */}
//       <div className="mb-6">
//         <label className="block text-xs font-semibold text-slate-700 mb-1">
//           Attach Photo (Optional - capture from camera or gallery)
//         </label>
//         <input
//           type="file"
//           accept="image/*"
//           capture="environment"
//           onChange={(e) => setCitizenPhoto(e.target.files[0])}
//           className="block w-full text-xs text-slate-500 file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
//         />
//       </div>

//       {errorMsg && <p className="text-xs text-red-500 mb-4 text-center">{errorMsg}</p>}

//       {/* Touch-Friendly Action Buttons */}
//       <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
//         <button
//           type="button"
//           disabled={submitting}
//           onClick={() => handleVerification(true)}
//           className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold py-3.5 sm:py-3 rounded-xl transition shadow-md disabled:opacity-50 active:scale-[0.98]"
//         >
//           {submitting ? 'Submitting...' : "Yes, it's fixed"}
//         </button>
//         <button
//           type="button"
//           disabled={submitting}
//           onClick={() => handleVerification(false)}
//           className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold py-3.5 sm:py-3 rounded-xl transition shadow-md disabled:opacity-50 active:scale-[0.98]"
//         >
//           {submitting ? 'Submitting...' : 'No, still broken'}
//         </button>
//       </div>
//     </div>
//   );
// }


'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function VerifyResolutionPage() {
  const { id } = useParams();
  const router = useRouter();

  const [issueData, setIssueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');
  const [citizenPhoto, setCitizenPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // New State: Track local submission status to keep user on this page
  const [submissionResult, setSubmissionResult] = useState(null);

  // Helper function: Dynamically select backend base URL (Port 8000)
  const getBackendUrl = () => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      return `http://${hostname}:8000`;
    }
    return 'http://localhost:8000';
  };

  useEffect(() => {
    if (!id) return;

    const backendUrl = getBackendUrl();

    fetch(`${backendUrl}/issues/${id}`, { 
      method: 'GET',
      credentials: 'include' 
    })
      .then((res) => {
        if (res.status === 401) {
          router.push(`/login?redirect=/issues/${id}/verify`);
          return null;
        }
        if (!res.ok) throw new Error('Failed to fetch issue details');
        return res.json();
      })
      .then((data) => {
        if (data) {
          setIssueData(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        setErrorMsg('Issue details loading failed or issue not found.');
        setLoading(false);
      });
  }, [id, router]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCitizenPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const adminNote = issueData?.status_history
    ?.slice()
    .reverse()
    .find((h) => h.status === 'RESOLUTION_SUBMITTED')?.note;

  const handleVerification = async (isFixed) => {
    setSubmitting(true);
    setErrorMsg('');

    const formData = new FormData();
    formData.append('resolved', isFixed ? 'true' : 'false');
    if (feedback) formData.append('feedback', feedback);
    if (citizenPhoto) {
      formData.append('file', citizenPhoto);
    }

    try {
      const backendUrl = getBackendUrl();

      const res = await fetch(`${backendUrl}/issues/${id}/verify`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (res.status === 401) {
        setErrorMsg('Session expired. Please log in first.');
        router.push(`/login?redirect=/issues/${id}/verify`);
        return;
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'Verification submission failed');
      }

      // Keep user on page and show success view
      setSubmissionResult({
        isFixed,
        submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to update status. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4fbf7] flex justify-center items-center px-4">
        <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm text-center max-w-sm w-full">
          <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-700 font-semibold text-sm">Loading verification details...</p>
          <p className="text-slate-400 text-xs mt-1">Mahol AI System</p>
        </div>
      </div>
    );
  }

  // 2. Error Loading Data State
  if (errorMsg && !issueData) {
    return (
      <div className="min-h-screen bg-[#f4fbf7] flex justify-center items-center px-4">
        <div className="bg-white p-6 rounded-2xl border border-rose-100 shadow-sm text-center max-w-sm w-full">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center text-xl mx-auto mb-3">
            ⚠️
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1">Notice</h3>
          <p className="text-rose-600 font-medium text-xs mb-4">{errorMsg}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // 3. No Pending Verification State (Status != RESOLUTION_SUBMITTED)
  if (issueData && issueData.status !== 'RESOLUTION_SUBMITTED' && !submissionResult) {
    return (
      <div className="min-h-screen bg-[#f4fbf7] flex justify-center items-center px-4 py-8">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-md text-center max-w-md w-full">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto mb-4">
            🔔
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">No Pending Verification</h2>
          <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
            There is currently no pending verification required for this complaint.
          </p>
          
          <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl mb-6 text-left">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-400 font-semibold uppercase text-[10px]">Issue ID</span>
              <span className="font-mono font-bold text-slate-700">{id}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-semibold uppercase text-[10px]">Current Status</span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-emerald-100 text-emerald-800">
                {issueData.status}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push(`/issues/${id}`)}
              className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition"
            >
              View Issue Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Submitted Success Screen (User stays on this page after clicking YES/NO)
  if (submissionResult) {
    return (
      <div className="min-h-screen bg-[#f4fbf7] flex justify-center items-center px-4 py-8">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-xl max-w-lg w-full text-center animate-fade-in">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 ${
              submissionResult.isFixed
                ? 'bg-emerald-100 text-emerald-600'
                : 'bg-rose-100 text-rose-600'
            }`}
          >
            {submissionResult.isFixed ? '✓' : '↺'}
          </div>

          <h2 className="text-xl font-extrabold text-slate-900 mb-1">
            {submissionResult.isFixed ? 'Resolution Confirmed!' : 'Feedback Received'}
          </h2>
          
          <p className="text-xs sm:text-sm text-slate-600 mb-6">
            {submissionResult.isFixed
              ? 'Thank you! You have confirmed that this issue has been resolved satisfactorily.'
              : 'Thank you for your response. The concerned department has been notified to re-evaluate this issue.'}
          </p>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-left space-y-2 mb-6 text-xs">
            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-400 font-medium">Status Updated To</span>
              <span className={`font-bold uppercase ${submissionResult.isFixed ? 'text-emerald-700' : 'text-rose-600'}`}>
                {submissionResult.isFixed ? 'RESOLVED' : 'REOPENED'}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-400 font-medium">Submitted At</span>
              <span className="font-semibold text-slate-700">{submissionResult.submittedAt}</span>
            </div>
            {feedback && (
              <div className="pt-1">
                <span className="text-slate-400 font-medium block mb-1">Your Note:</span>
                <p className="text-slate-700 italic bg-white p-2.5 rounded-lg border border-slate-200">
                  "{feedback}"
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => router.push(`/issues/${id}`)}
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              View Updated Issue Details
            </button>
            <button
              onClick={() => router.push('/')}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 5. Active Verification Form Page
  return (
    <div className="min-h-screen bg-[#f4fbf7] py-6 sm:py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl border border-emerald-100 p-5 sm:p-8">
        
        {/* Top Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                Action Required
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">Verify Issue Resolution</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Issue ID: <span className="font-mono text-slate-700 font-semibold">{id}</span>
            </p>
          </div>
          <span className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-extrabold rounded-full uppercase tracking-wider">
            Verification Pending
          </span>
        </div>

        {/* Admin Uploaded Evidence Section */}
        <div className="mb-6 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <span>📷</span> Department Resolution Evidence
            </h2>
            <span className="text-[10px] bg-white border border-slate-200 px-2.5 py-0.5 rounded-md text-slate-500 font-medium">
              Submitted by Official
            </span>
          </div>

          {issueData?.resolution_photo_url ? (
            <div className="relative rounded-xl overflow-hidden border border-slate-200 mb-3 bg-black/5">
              <img
                src={`${getBackendUrl()}/${issueData.resolution_photo_url.replace(/^\//, '')}`}
                alt="Resolution Evidence"
                className="w-full h-48 sm:h-64 object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-32 sm:h-40 bg-slate-200/60 rounded-xl flex flex-col items-center justify-center text-slate-400 text-xs mb-3 border border-dashed border-slate-300">
              <span className="text-2xl mb-1">🖼️</span>
              <span>No image evidence was attached by the department</span>
            </div>
          )}

          {adminNote && (
            <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-400 font-semibold uppercase text-[10px] block mb-0.5">Department Note</span>
              <p className="text-slate-800 font-medium">{adminNote}</p>
            </div>
          )}
        </div>

        {/* Citizen Verification Input Form */}
        <div className="space-y-5 mb-6">
          
          {/* Optional Feedback Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Your Feedback or Remarks <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us if the issue was fixed properly or if work is still remaining..."
              className="w-full border border-slate-200 rounded-2xl p-3.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 bg-slate-50/50 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
            />
          </div>

          {/* Mobile-Friendly Camera/Photo Upload with Live Preview */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Upload Verification Photo <span className="text-slate-400 font-normal">(Optional)</span>
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <label className="w-full sm:flex-1 flex items-center justify-center gap-2 border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50/80 text-emerald-800 p-4 rounded-2xl cursor-pointer transition text-xs font-bold text-center">
                <span>📸 Take Photo or Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>

              {photoPreview && (
                <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-emerald-500 flex-shrink-0">
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    onClick={() => {
                      setCitizenPhoto(null);
                      setPhotoPreview(null);
                    }}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold rounded-xl text-center">
            {errorMsg}
          </div>
        )}

        {/* Verification Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleVerification(true)}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold py-3.5 rounded-2xl transition shadow-md shadow-emerald-200 disabled:opacity-50 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            {submitting ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>✓ Yes, it's fixed properly</span>
            )}
          </button>

          <button
            type="button"
            disabled={submitting}
            onClick={() => handleVerification(false)}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold py-3.5 rounded-2xl transition shadow-md shadow-rose-200 disabled:opacity-50 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            {submitting ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>✕ No, still broken</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}