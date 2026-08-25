// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';

// export default function LoginPage() {
//   const [formData, setFormData] = useState({
//     cnic: '',
//     password: ''
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const response = await fetch('http://localhost:8000/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify(formData)
//       });

//       const result = await response.json();

//       if (response.ok) {
//         // Strictly block admins from logging in through public portal
//         if (result.role === 'super_admin' || result.role === 'sub_admin' || result.role === 'admin') {
//           setError('Access Denied — Departmental Administrators must use the Admin Portal.');
//           setLoading(false);
//           return;
//         }

//         // Store session for citizen
//         localStorage.setItem('user_id', result.user_id);
//         localStorage.setItem('name', result.name);
//         localStorage.setItem('user_name', result.name);
//         localStorage.setItem('role', result.role);
//         if (result.area) localStorage.setItem('area', result.area);
//         if (result.district) localStorage.setItem('district', result.district);

//         window.location.href = '/';
//       } else {
//         setError(result.detail || 'Login failed');
//       }
//     } catch (err) {
//       setError('Something went wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-emerald-950 via-green-950 to-emerald-900 px-4 py-10">
//       <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl px-7 py-8">

//         {/* Logo */}
//         <div className="flex flex-col items-center mb-5">
//           <div className="w-16 h-16 rounded-full border-2 border-emerald-500 flex items-center justify-center text-3xl mb-2">
//             🌿
//           </div>
//           <span className="font-extrabold text-sm tracking-wide text-gray-900">FixMy<span className="text-emerald-600">City</span></span>
//           <span className="text-[10px] text-gray-400 tracking-wide">Civic Reporting Platform</span>
//         </div>

//         <h1 className="text-xl font-bold text-gray-900 text-center mb-1">Citizen Login</h1>
//         <p className="text-gray-500 text-xs text-center mb-5">Login with your CNIC to continue.</p>

//         {error && (
//           <div className="bg-red-50 border-l-4 border-red-400 px-3 py-2 mb-4 rounded-lg">
//             <p className="text-red-600 text-xs font-medium">{error}</p>
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-3">

//           {/* CNIC / Username */}
//           <div className="relative">
//             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🪪</span>
//             <input
//               type="text"
//               name="cnic"
//               autoComplete="off"
//               value={formData.cnic}
//               onChange={handleChange}
//               required
//               placeholder="CNIC (13 digits)"
//               className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 focus:outline-none transition-all"
//             />
//           </div>

//           {/* Password */}
//           <div className="relative">
//             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔒</span>
//             <input
//               type={showPassword ? 'text' : 'password'}
//               name="password"
//               autoComplete="off"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               placeholder="Password"
//               className="w-full pl-9 pr-9 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 focus:outline-none transition-all"
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm bg-transparent border-0 cursor-pointer"
//             >
//               {showPassword ? '🙈' : '👁️'}
//             </button>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-3 rounded-lg text-sm font-bold tracking-wide uppercase transition-all border-0 mt-2 ${
//               loading
//                 ? 'bg-emerald-300 text-white cursor-not-allowed'
//                 : 'bg-emerald-800 hover:bg-emerald-900 text-white cursor-pointer shadow-md'
//             }`}
//           >
//             {loading ? 'Logging in...' : 'Login'}
//           </button>

//         </form>

//         <p className="text-center text-gray-500 text-xs mt-4">
//           No account?{' '}
//           <Link href="/signup" className="text-emerald-700 font-semibold no-underline hover:underline">
//             Create Account
//           </Link>
//         </p>

//         <div className="text-center mt-2">
//           <Link href="/" className="text-emerald-700 text-xs font-medium no-underline hover:underline">
//             🏠 Back to Home
//           </Link>
//         </div>

//       </div>
//     </div>
//   );
// }

'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    cnic: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        // Strictly block admins from logging in through public portal
        if (result.role === 'super_admin' || result.role === 'sub_admin' || result.role === 'admin') {
          setError('Access Denied — Departmental Administrators must use the Admin Portal.');
          setLoading(false);
          return;
        }

        // Store session for citizen
        localStorage.setItem('user_id', result.user_id);
        localStorage.setItem('name', result.name);
        localStorage.setItem('user_name', result.name);
        localStorage.setItem('role', result.role);
        if (result.area) localStorage.setItem('area', result.area);
        if (result.district) localStorage.setItem('district', result.district);

        window.location.href = '/';
      } else {
        setError(result.detail || 'Login failed');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col justify-between p-4 sm:p-8"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(240, 253, 244, 0.5), rgba(220, 252, 231, 0.3)), url('/hero.jpeg')`
      }}
    >
      {/* Container Layout */}
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto py-6">
        
        {/* LEFT SIDE: Heading & Branding */}
        <div className="lg:col-span-6 space-y-6 text-slate-800 pr-0 lg:pr-6">
          
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-none">
              Make Your <br />
              <span className="text-emerald-600">Community Better</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-lg font-medium leading-relaxed">
              Report civic problems. Let AI analyze them. Track their resolution in real-time.
            </p>
          </div>

          {/* Feature Badges */}
          <div className="grid grid-cols-3 gap-3 pt-2 max-w-md">
            <div className="bg-white/70 backdrop-blur-sm border border-emerald-100 p-3 rounded-2xl flex flex-col items-center text-center shadow-sm">
              <span className="text-2xl mb-1">⚙️</span>
              <span className="text-xs font-bold text-slate-800">AI-Powered Analysis</span>
            </div>
            <div className="bg-white/70 backdrop-blur-sm border border-emerald-100 p-3 rounded-2xl flex flex-col items-center text-center shadow-sm">
              <span className="text-2xl mb-1">📍</span>
              <span className="text-xs font-bold text-slate-800">Location Intelligence</span>
            </div>
            <div className="bg-white/70 backdrop-blur-sm border border-emerald-100 p-3 rounded-2xl flex flex-col items-center text-center shadow-sm">
              <span className="text-2xl mb-1">👥</span>
              <span className="text-xs font-bold text-slate-800">Community Driven</span>
            </div>
          </div>

          {/* Banner Card */}
          <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-white p-4 sm:p-5 rounded-2xl shadow-lg flex items-center gap-4 max-w-md">
            <div className="text-3xl bg-white/20 p-2.5 rounded-xl">🤝</div>
            <div>
              <h3 className="font-bold text-sm">Join a smarter city</h3>
              <p className="text-xs text-emerald-100 mt-0.5">
                Together for a cleaner, safer, and better tomorrow.
              </p>
            </div>
          </div>

        </div>

        {/* RIGHT SIDE: Login Form Card */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 px-6 py-8 sm:px-8 sm:py-9 relative">

            {/* Header Icon & Brand Title */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-14 h-14 rounded-full bg-emerald-50 border-2 border-emerald-500/20 flex items-center justify-center text-2xl shadow-sm mb-2">
                🌱
              </div>
              <span className="font-extrabold text-xl text-slate-900 tracking-tight">
                Mahol<span className="text-emerald-600">AI</span>
              </span>
              <h2 className="text-lg font-bold text-slate-800 mt-1">Citizen Login</h2>
              <p className="text-xs text-slate-400 font-medium text-center">
                Login with your CNIC to continue.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 px-3 py-2 mb-5 rounded-xl">
                <p className="text-red-600 text-xs font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* CNIC */}
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🪪</span>
                <input
                  type="text"
                  name="cnic"
                  autoComplete="off"
                  value={formData.cnic}
                  onChange={handleChange}
                  required
                  placeholder="CNIC (13 digits)"
                  className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="off"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Password"
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm bg-transparent border-0 cursor-pointer"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all border-0 mt-2 ${
                  loading
                    ? 'bg-emerald-300 text-white cursor-not-allowed'
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer shadow-md shadow-emerald-700/20 active:scale-[0.99]'
                }`}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>

            </form>

            <p className="text-center text-slate-500 text-xs mt-6">
              No account?{' '}
              <Link href="/signup" className="text-emerald-700 font-bold no-underline hover:underline">
                Create Account
              </Link>
            </p>

            <div className="text-center mt-3">
              <Link href="/" className="text-slate-400 hover:text-emerald-700 text-xs font-medium no-underline transition-colors">
                ← Back to Home
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}