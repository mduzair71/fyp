

// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';

// const DISTRICT_TEHSILS = {
//   Nowshera: ['Jehangira', 'Nowshera Cantonment', 'Pabbi'],
//   Peshawar: ['Peshawar City', 'Hayatabad', 'Sadar', 'Mathra', 'Shah Alam'],
//   Swabi: ['Swabi', 'Topi', 'Lahor', 'Razzar'],
//   Mardan: ['Mardan', 'Takht Bhai', 'Katlang'],
//   Islamabad: ['Zone I', 'Zone II', 'Zone III', 'Zone IV', 'Zone V']
// };

// export default function SignupPage() {
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     cnic: '',
//     password: '',
//     date_of_birth: '',
//     address: '',
//     district: 'Nowshera',
//     area: 'Jehangira'
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleCnicChange = (e) => {
//     const value = e.target.value.replace(/\D/g, '').slice(0, 13);
//     setFormData({ ...formData, cnic: value });
//   };

//   const handlePhoneChange = (e) => {
//     const value = e.target.value.replace(/\D/g, '').slice(0, 11);
//     setFormData({ ...formData, phone: value });
//   };

//   const handleDistrictChange = (e) => {
//     const selectedDistrict = e.target.value;
//     const defaultArea = DISTRICT_TEHSILS[selectedDistrict]?.[0] || '';
//     setFormData({
//       ...formData,
//       district: selectedDistrict,
//       area: defaultArea
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     if (formData.cnic.length !== 13) {
//       setError('CNIC must be exactly 13 digits.');
//       setLoading(false);
//       return;
//     }

//     if (formData.phone && formData.phone.length !== 11) {
//       setError('Phone number must be exactly 11 digits.');
//       setLoading(false);
//       return;
//     }

//     if (formData.password.length < 6) {
//       setError('Password must be at least 6 characters long.');
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch('http://localhost:8000/auth/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData)
//       });

//       const result = await response.json();

//       if (response.ok) {
//         setSuccess(true);
//         setTimeout(() => router.push('/login'), 1500);
//       } else {
//         if (Array.isArray(result.detail)) {
//           setError(result.detail[0]?.msg || 'Validation Error');
//         } else {
//           setError(result.detail || 'Registration failed');
//         }
//       }
//     } catch (err) {
//       setError('Cannot connect to server. Please ensure backend is running.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div 
//       className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col justify-between p-4 sm:p-8"
//       style={{
//         // Public folder se picture load karne ke liye yahan apne image ka path dein (e.g. /my-bg.png)
//         backgroundImage: `linear-gradient(to right, rgba(240, 253, 244, 0.5), rgba(220, 252, 231, 0.3)), url('/hero.jpeg')`
//       }}
//     >
//       {/* Container Layout */}
//       <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto py-6">
        
//         {/* LEFT SIDE: Heading & Branding */}
//         <div className="lg:col-span-6 space-y-6 text-slate-800 pr-0 lg:pr-6">
          
//           <div className="space-y-3">
//             <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-none">
//               Make Your <br />
//               <span className="text-emerald-600">Community Better</span>
//             </h1>
//             <p className="text-base sm:text-lg text-slate-600 max-w-lg font-medium leading-relaxed">
//               Report civic problems. Let AI analyze them. Track their resolution in real-time.
//             </p>
//           </div>

//           {/* Feature Badges */}
//           <div className="grid grid-cols-3 gap-3 pt-2 max-w-md">
//             <div className="bg-white/70 backdrop-blur-sm border border-emerald-100 p-3 rounded-2xl flex flex-col items-center text-center shadow-sm">
//               <span className="text-2xl mb-1">⚙️</span>
//               <span className="text-xs font-bold text-slate-800">AI-Powered Analysis</span>
//             </div>
//             <div className="bg-white/70 backdrop-blur-sm border border-emerald-100 p-3 rounded-2xl flex flex-col items-center text-center shadow-sm">
//               <span className="text-2xl mb-1">📍</span>
//               <span className="text-xs font-bold text-slate-800">Location Intelligence</span>
//             </div>
//             <div className="bg-white/70 backdrop-blur-sm border border-emerald-100 p-3 rounded-2xl flex flex-col items-center text-center shadow-sm">
//               <span className="text-2xl mb-1">👥</span>
//               <span className="text-xs font-bold text-slate-800">Community Driven</span>
//             </div>
//           </div>

//           {/* Banner Card */}
//           <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-white p-4 sm:p-5 rounded-2xl shadow-lg flex items-center gap-4 max-w-md">
//             <div className="text-3xl bg-white/20 p-2.5 rounded-xl">🤝</div>
//             <div>
//               <h3 className="font-bold text-sm">Join a smarter city</h3>
//               <p className="text-xs text-emerald-100 mt-0.5">
//                 Together for a cleaner, safer, and better tomorrow.
//               </p>
//             </div>
//           </div>

//         </div>

//         {/* RIGHT SIDE: Signup Form Card */}
//         <div className="lg:col-span-6 flex justify-center lg:justify-end">
//           <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 px-6 py-7 sm:px-8 sm:py-8 relative">

//             {/* Header Icon & Brand Title */}
//             <div className="flex flex-col items-center mb-5">
//               <div className="w-14 h-14 rounded-full bg-emerald-50 border-2 border-emerald-500/20 flex items-center justify-center text-2xl shadow-sm mb-1.5">
//                 🌱
//               </div>
//               <span className="font-extrabold text-xl text-slate-900 tracking-tight">
//                 Mahol<span className="text-emerald-600">AI</span>
//               </span>
//               <h2 className="text-lg font-bold text-slate-800 mt-1">Create Your Account</h2>
//               <p className="text-[11px] text-slate-400 font-medium text-center">
//                 Join Mahol AI and become part of a smarter, more responsive community.
//               </p>
//             </div>

//             {error && (
//               <div className="bg-red-50 border-l-4 border-red-500 px-3 py-2 mb-4 rounded-xl">
//                 <p className="text-red-600 text-xs font-medium">{error}</p>
//               </div>
//             )}
//             {success && (
//               <div className="bg-emerald-50 border-l-4 border-emerald-500 px-3 py-2 mb-4 rounded-xl">
//                 <p className="text-emerald-700 text-xs font-medium">Account created! Redirecting to login...</p>
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-3">

//               {/* Row 1: Full Name & Email */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                 <div className="relative">
//                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">👤</span>
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     required
//                     placeholder="Full Name"
//                     className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
//                   />
//                 </div>
//                 <div className="relative">
//                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">✉️</span>
//                   <input
//                     type="email"
//                     name="email"
//                     autoComplete="off"
//                     value={formData.email}
//                     onChange={handleChange}
//                     required
//                     placeholder="Email Address"
//                     className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
//                   />
//                 </div>
//               </div>

//               {/* CNIC */}
//               <div className="relative">
//                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🪪</span>
//                 <input
//                   type="text"
//                   name="cnic"
//                   value={formData.cnic}
//                   onChange={handleCnicChange}
//                   required
//                   maxLength={13}
//                   placeholder="CNIC (13 digits)"
//                   className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
//                 />
//               </div>

//               {/* Phone Number */}
//               <div className="relative">
//                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">📞</span>
//                 <input
//                   type="text"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handlePhoneChange}
//                   required
//                   maxLength={11}
//                   placeholder="Phone Number (11 digits)"
//                   className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
//                 />
//               </div>

//               {/* Password */}
//               <div className="relative">
//                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔒</span>
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   name="password"
//                   autoComplete="new-password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   required
//                   minLength={6}
//                   placeholder="Password"
//                   className="w-full pl-8 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs bg-transparent border-0 cursor-pointer"
//                 >
//                   {showPassword ? '🙈' : '👁️'}
//                 </button>
//               </div>

//               {/* District & Tehsil / Area */}
//               <div className="grid grid-cols-2 gap-3">
//                 <div className="relative">
//                   <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">📍</span>
//                   <select
//                     name="district"
//                     value={formData.district}
//                     onChange={handleDistrictChange}
//                     className="w-full pl-7 pr-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
//                   >
//                     {Object.keys(DISTRICT_TEHSILS).map((dist) => (
//                       <option key={dist} value={dist}>
//                         {dist}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="relative">
//                   <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🏛️</span>
//                   <select
//                     name="area"
//                     value={formData.area}
//                     onChange={handleChange}
//                     className="w-full pl-7 pr-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
//                   >
//                     {DISTRICT_TEHSILS[formData.district]?.map((areaName) => (
//                       <option key={areaName} value={areaName}>
//                         {areaName}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               {/* Date of Birth & Address */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                 <div className="relative">
//                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">📅</span>
//                   <input
//                     type="date"
//                     name="date_of_birth"
//                     value={formData.date_of_birth}
//                     onChange={handleChange}
//                     className="w-full pl-8 pr-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
//                   />
//                 </div>
//                 <div className="relative">
//                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🏠</span>
//                   <input
//                     type="text"
//                     name="address"
//                     value={formData.address}
//                     onChange={handleChange}
//                     placeholder="Residential Address"
//                     className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
//                   />
//                 </div>
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className={`w-full py-3 rounded-full text-xs font-bold tracking-wider transition-all border-0 mt-3 ${
//                   loading
//                     ? 'bg-emerald-300 text-white cursor-not-allowed'
//                     : 'bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer shadow-md shadow-emerald-700/20 active:scale-[0.99]'
//                 }`}
//               >
//                 {loading ? 'Creating Account...' : 'Sign Up'}
//               </button>

//             </form>

//             <p className="text-center text-slate-500 text-xs mt-4">
//               Already have an account?{' '}
//               <Link href="/login" className="text-emerald-700 font-bold no-underline hover:underline">
//                 Log In
//               </Link>
//             </p>

//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const DISTRICT_TEHSILS = {
  Nowshera: ['Jehangira', 'Nowshera Cantonment', 'Pabbi'],
  Peshawar: ['Peshawar City', 'Hayatabad', 'Sadar', 'Mathra', 'Shah Alam'],
  Swabi: ['Swabi', 'Topi', 'Lahor', 'Razzar'],
  Mardan: ['Mardan', 'Takht Bhai', 'Katlang'],
  Islamabad: ['Zone I', 'Zone II', 'Zone III', 'Zone IV', 'Zone V']
};

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cnic: '',
    password: '',
    date_of_birth: '',
    address: '',
    district: 'Nowshera',
    area: 'Jehangira'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Dynamic API Base URL detection
  const getBackendUrl = () => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      return `http://${hostname}:8000`;
    }
    return 'http://localhost:8000';
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCnicChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 13);
    setFormData({ ...formData, cnic: value });
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 11);
    setFormData({ ...formData, phone: value });
  };

  const handleDistrictChange = (e) => {
    const selectedDistrict = e.target.value;
    const defaultArea = DISTRICT_TEHSILS[selectedDistrict]?.[0] || '';
    setFormData({
      ...formData,
      district: selectedDistrict,
      area: defaultArea
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.cnic.length !== 13) {
      setError('CNIC must be exactly 13 digits.');
      setLoading(false);
      return;
    }

    if (formData.phone && formData.phone.length !== 11) {
      setError('Phone number must be exactly 11 digits.');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${getBackendUrl()}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/login'), 1500);
      } else {
        if (Array.isArray(result.detail)) {
          setError(result.detail[0]?.msg || 'Validation Error');
        } else {
          setError(result.detail || 'Registration failed');
        }
      }
    } catch (err) {
      setError('Cannot connect to server. Please ensure backend is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col justify-between p-4 sm:p-8 font-sans antialiased"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.45), rgba(6, 78, 59, 0.3)), url('/hero.jpeg')`
      }}
    >
      {/* Container Layout */}
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto py-6">
        
        {/* LEFT SIDE: Heading & Branding */}
        <div className="lg:col-span-6 space-y-6 pr-0 lg:pr-6">
          
          <div className="space-y-4 bg-slate-900/50 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/20 shadow-xl">
            <span className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 font-bold text-xs px-3.5 py-1.5 rounded-full border border-emerald-400/30">
              🌱 FixMyCity Official Portal
            </span>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-md">
              Make Your <br />
              <span className="text-emerald-400 underline decoration-emerald-500/50 underline-offset-8">
                Community Better
              </span>
            </h1>
            
            <p className="text-base sm:text-lg text-slate-100 max-w-lg font-medium leading-relaxed drop-shadow">
              Report civic problems. Let AI analyze them. Track their resolution in real-time.
            </p>
          </div>

          {/* Feature Badges */}
          <div className="grid grid-cols-3 gap-3 pt-1 max-w-md">
            <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 p-3.5 rounded-2xl flex flex-col items-center text-center shadow-md">
              <span className="text-2xl mb-1">⚙️</span>
              <span className="text-xs font-bold text-slate-900">AI-Powered Analysis</span>
            </div>
            <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 p-3.5 rounded-2xl flex flex-col items-center text-center shadow-md">
              <span className="text-2xl mb-1">📍</span>
              <span className="text-xs font-bold text-slate-900">Location Intelligence</span>
            </div>
            <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 p-3.5 rounded-2xl flex flex-col items-center text-center shadow-md">
              <span className="text-2xl mb-1">👥</span>
              <span className="text-xs font-bold text-slate-900">Community Driven</span>
            </div>
          </div>

          {/* Banner Card */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-4 sm:p-5 rounded-2xl shadow-xl border border-emerald-400/30 flex items-center gap-4 max-w-md">
            <div className="text-3xl bg-white/20 p-2.5 rounded-xl shrink-0">🤝</div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Join a smarter city</h3>
              <p className="text-xs text-emerald-100 font-medium mt-0.5">
                Together for a cleaner, safer, and better tomorrow.
              </p>
            </div>
          </div>

        </div>

        {/* RIGHT SIDE: Signup Form Card */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/80 px-6 py-7 sm:px-8 sm:py-8 relative">

            {/* Header Icon & Brand Title */}
            <div className="flex flex-col items-center mb-5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border-2 border-emerald-500/20 flex items-center justify-center text-2xl shadow-sm mb-2">
                🏙️
              </div>
              
              <span className="font-black text-2xl text-slate-900 tracking-tight">
                FixMy<span className="text-emerald-600">City</span>
              </span>
              
              <h2 className="text-base font-extrabold text-slate-800 mt-1">Create Your Account</h2>
              <p className="text-xs text-slate-500 font-semibold text-center mt-0.5">
                Join FixMyCity and become part of a responsive community.
              </p>
            </div>

            {error && (
              <div className="bg-rose-50 border-l-4 border-rose-500 px-3.5 py-2.5 mb-4 rounded-xl">
                <p className="text-rose-700 text-xs font-bold">{error}</p>
              </div>
            )}
            {success && (
              <div className="bg-emerald-50 border-l-4 border-emerald-500 px-3.5 py-2.5 mb-4 rounded-xl">
                <p className="text-emerald-800 text-xs font-bold">Account created! Redirecting to login...</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">

              {/* Row 1: Full Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Full Name</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">👤</span>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter Your Full Name"
                      className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Email Address</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">✉️</span>
                    <input
                      type="email"
                      name="email"
                      autoComplete="off"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="email@gmail.com"
                      className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* CNIC */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">CNIC (13 Digits)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">🪪</span>
                  <input
                    type="text"
                    name="cnic"
                    value={formData.cnic}
                    onChange={handleCnicChange}
                    required
                    maxLength={13}
                    placeholder="CNIC(13)"
                    className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Mobile Number (11 Digits)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">📞</span>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    required
                    maxLength={11}
                    placeholder="Mobile No"
                    className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    placeholder="Minimum 6 characters"
                    className="w-full pl-8 pr-8 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 text-xs bg-transparent border-0 cursor-pointer"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* District & Area */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">District</label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">📍</span>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleDistrictChange}
                      className="w-full pl-7 pr-2 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-none transition-all"
                    >
                      {Object.keys(DISTRICT_TEHSILS).map((dist) => (
                        <option key={dist} value={dist}>
                          {dist}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Tehsil / Area</label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">🏛️</span>
                    <select
                      name="area"
                      value={formData.area}
                      onChange={handleChange}
                      className="w-full pl-7 pr-2 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-none transition-all"
                    >
                      {DISTRICT_TEHSILS[formData.district]?.map((areaName) => (
                        <option key={areaName} value={areaName}>
                          {areaName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Date of Birth & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Date of Birth</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">📅</span>
                    <input
                      type="date"
                      name="date_of_birth"
                      value={formData.date_of_birth}
                      onChange={handleChange}
                      className="w-full pl-8 pr-2 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Address</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">🏠</span>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Street, Mohallah"
                      className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 rounded-xl text-xs font-extrabold tracking-wider uppercase transition-all border-0 mt-3 ${
                  loading
                    ? 'bg-emerald-300 text-white cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-lg shadow-emerald-600/20 active:scale-[0.99]'
                }`}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>

            </form>

            <p className="text-center text-slate-600 text-xs font-medium mt-4">
              Already have an account?{' '}
              <Link href="/login" className="text-emerald-700 font-extrabold no-underline hover:underline">
                Log In
              </Link>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}