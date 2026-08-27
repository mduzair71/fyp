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

//   useEffect(() => {
//     if (!id) return;

//     fetch(`http://localhost:8000/issues/${id}`)
//       .then((res) => {
//         if (!res.ok) throw new Error('Failed to fetch issue details');
//         return res.json();
//       })
//       .then((data) => {
//         setIssueData(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error(err);
//         setErrorMsg('Issue details loading failed or issue not found.');
//         setLoading(false);
//       });
//   }, [id]);

//   const handleVerification = async (isFixed) => {
//     setSubmitting(true);
//     setErrorMsg('');

//     const newStatus = isFixed ? 'RESOLVED' : 'REOPENED';
//     const formData = new FormData();
//     formData.append('status', newStatus);
//     formData.append('feedback', feedback);
//     if (citizenPhoto) {
//       formData.append('citizen_evidence', citizenPhoto);
//     }

//     try {
//       const res = await fetch(`http://localhost:8000/issues/${id}/verify`, {
//         method: 'POST',
//         body: formData,
//       });

//       if (!res.ok) {
//         throw new Error('Verification submission failed');
//       }

//       alert(isFixed ? 'Thank you! Issue marked as RESOLVED.' : 'Issue status updated to REOPENED.');
//       router.push(`/issues/${id}`);
//     } catch (err) {
//       console.error(err);
//       setErrorMsg('Failed to update status. Please try again.');
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

//   return (
//     <div className="max-w-2xl mx-auto my-4 sm:my-10 p-4 sm:p-6 bg-white rounded-2xl shadow-lg border border-slate-100">
//       <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mb-1">Verify Issue Resolution</h1>
//       <p className="text-xs sm:text-sm text-slate-500 mb-6">
//         Issue ID: <span className="font-mono text-slate-700">{id}</span>
//       </p>

//       {/* Admin Uploaded Evidence Section */}
//       <div className="mb-6 p-3 sm:p-4 bg-slate-50 border border-slate-200 rounded-xl">
//         <h2 className="text-xs sm:text-sm font-semibold text-slate-700 mb-2">Admin Resolution Evidence</h2>
//         {issueData?.resolution_evidence_url ? (
//           <img
//             src={issueData.resolution_evidence_url}
//             alt="Resolution Evidence"
//             className="w-full h-48 sm:h-64 object-cover rounded-lg border border-slate-300 mb-3"
//           />
//         ) : (
//           <div className="w-full h-36 sm:h-40 bg-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-xs sm:text-sm mb-3">
//             No image evidence provided
//           </div>
//         )}
//         {issueData?.admin_note && (
//           <p className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
//             <strong className="text-slate-800">Admin Note:</strong> {issueData.admin_note}
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
//           {submitting ? 'Submitting...' : 'Yes, it\'s fixed'}
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

//  useEffect(() => {
//   if (!id) return;

//   fetch(`http://10.248.141.146:8000/issues/${id}`, { credentials: 'include' })
//     .then((res) => {
//       if (res.status === 401) {
//         router.push(`/login?redirect=/issues/${id}/verify`);
//         return null;
//       }
//       if (!res.ok) throw new Error('Failed to fetch issue details');
//       return res.json();
//     })
//     .then((data) => {
//       if (data) {
//         setIssueData(data);
//         setLoading(false);
//       }
//     })
//     .catch((err) => {
//       console.error(err);
//       setErrorMsg('Issue details loading failed or issue not found.');
//       setLoading(false);
//     });
// }, [id, router]);
//   // Admin's note is inside status_history, not a top-level field
//   const adminNote = issueData?.status_history
//     ?.slice()
//     .reverse()
//     .find((h) => h.status === 'RESOLUTION_SUBMITTED')?.note;

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
//       const res = await fetch(`http://10.248.141.146:8000/issues/${id}/verify`, {
//         method: 'POST',
//         credentials: 'include',
//         body: formData,
//       });

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
//             src={`http://10.248.141.146:8000/${issueData.resolution_photo_url}`}
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
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
        // Handle unauthenticated case during form submission
        setErrorMsg('Not authenticated. Please log in first.');
        router.push(`/login?redirect=/issues/${id}/verify`);
        return;
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'Verification submission failed');
      }

      alert(isFixed ? 'Thank you! Issue marked as RESOLVED.' : 'Issue reopened, department will review again.');
      router.push(`/issues/${id}`);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to update status. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] px-4">
        <p className="text-gray-500 font-medium text-sm sm:text-base">Loading verification details...</p>
      </div>
    );
  }

  if (errorMsg && !issueData) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] px-4">
        <p className="text-red-500 font-medium text-sm sm:text-base text-center">{errorMsg}</p>
      </div>
    );
  }

  if (issueData && issueData.status !== 'RESOLUTION_SUBMITTED') {
    return (
      <div className="flex justify-center items-center min-h-[60vh] px-4">
        <p className="text-slate-600 font-medium text-sm sm:text-base text-center">
          This issue is not currently awaiting verification.
          <br />
          Current status: <span className="font-bold">{issueData.status}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto my-4 sm:my-10 p-4 sm:p-6 bg-white rounded-2xl shadow-lg border border-slate-100">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mb-1">Verify Issue Resolution</h1>
      <p className="text-xs sm:text-sm text-slate-500 mb-6">
        Issue ID: <span className="font-mono text-slate-700">{id}</span>
      </p>

      {/* Admin Uploaded Evidence Section */}
      <div className="mb-6 p-3 sm:p-4 bg-slate-50 border border-slate-200 rounded-xl">
        <h2 className="text-xs sm:text-sm font-semibold text-slate-700 mb-2">Admin Resolution Evidence</h2>
        {issueData?.resolution_photo_url ? (
          <img
            src={`${getBackendUrl()}/${issueData.resolution_photo_url.replace(/^\//, '')}`}
            alt="Resolution Evidence"
            className="w-full h-48 sm:h-64 object-cover rounded-lg border border-slate-300 mb-3"
          />
        ) : (
          <div className="w-full h-36 sm:h-40 bg-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-xs sm:text-sm mb-3">
            No image evidence provided
          </div>
        )}
        {adminNote && (
          <p className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
            <strong className="text-slate-800">Admin Note:</strong> {adminNote}
          </p>
        )}
      </div>

      {/* Optional Feedback Input */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Your Feedback (Optional)
        </label>
        <textarea
          rows={3}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Write details about whether the issue was fixed properly or not..."
          className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
      </div>

      {/* Mobile-Friendly Camera/Photo Upload */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Attach Photo (Optional - capture from camera or gallery)
        </label>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => setCitizenPhoto(e.target.files[0])}
          className="block w-full text-xs text-slate-500 file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
        />
      </div>

      {errorMsg && <p className="text-xs text-red-500 mb-4 text-center">{errorMsg}</p>}

      {/* Touch-Friendly Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button
          type="button"
          disabled={submitting}
          onClick={() => handleVerification(true)}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold py-3.5 sm:py-3 rounded-xl transition shadow-md disabled:opacity-50 active:scale-[0.98]"
        >
          {submitting ? 'Submitting...' : "Yes, it's fixed"}
        </button>
        <button
          type="button"
          disabled={submitting}
          onClick={() => handleVerification(false)}
          className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold py-3.5 sm:py-3 rounded-xl transition shadow-md disabled:opacity-50 active:scale-[0.98]"
        >
          {submitting ? 'Submitting...' : 'No, still broken'}
        </button>
      </div>
    </div>
  );
}