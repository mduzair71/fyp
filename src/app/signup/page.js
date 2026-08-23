

// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';

// export default function SignupPage() {
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     cnic: '',
//     password: '',
//     date_of_birth: '',
//     address: ''
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

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
//         setError(result.detail || 'Registration failed');
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
//           <span className="font-extrabold text-sm tracking-wide text-gray-900">MAHOL<span className="text-emerald-600">AI</span></span>
//           <span className="text-[10px] text-gray-400 tracking-wide">Civic Reporting Platform</span>
//         </div>

//         <h1 className="text-xl font-bold text-gray-900 text-center mb-5">Create Account</h1>

//         {error && (
//           <div className="bg-red-50 border-l-4 border-red-400 px-3 py-2 mb-4 rounded-lg">
//             <p className="text-red-600 text-xs font-medium">{error}</p>
//           </div>
//         )}
//         {success && (
//           <div className="bg-emerald-50 border-l-4 border-emerald-400 px-3 py-2 mb-4 rounded-lg">
//             <p className="text-emerald-700 text-xs font-medium">Account created! Redirecting to login...</p>
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-3">

//           <div className="relative">
//             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">👤</span>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//               placeholder="Full Name"
//               className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 focus:outline-none transition-all"
//             />
//           </div>

//           <div className="relative">
//             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">✉️</span>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               placeholder="Email"
//               className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 focus:outline-none transition-all"
//             />
//           </div>

//           <div className="relative">
//             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">📞</span>
//             <input
//               type="text"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               placeholder="Phone Number"
//               className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 focus:outline-none transition-all"
//             />
//           </div>

//           <div className="relative">
//             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🪪</span>
//             <input
//               type="text"
//               name="cnic"
//               value={formData.cnic}
//               onChange={handleChange}
//               required
//               placeholder="CNIC (Username) — 12345-1234567-1"
//               className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 focus:outline-none transition-all"
//             />
//           </div>

//           <div className="relative">
//             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔒</span>
//             <input
//               type={showPassword ? 'text' : 'password'}
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               placeholder="Password (min 6 characters)"
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

//           <div className="relative">
//             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">📅</span>
//             <input
//               type="date"
//               name="date_of_birth"
//               value={formData.date_of_birth}
//               onChange={handleChange}
//               className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 focus:outline-none transition-all"
//             />
//           </div>

//           <div className="relative">
//             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">📍</span>
//             <input
//               type="text"
//               name="address"
//               value={formData.address}
//               onChange={handleChange}
//               placeholder="House #, Street, City"
//               className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 focus:outline-none transition-all"
//             />
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
//             {loading ? 'Creating...' : 'Sign Up'}
//           </button>

//         </form>

//         <p className="text-center text-gray-500 text-xs mt-4">
//           Already have an account?{' '}
//           <Link href="/login" className="text-emerald-700 font-semibold no-underline hover:underline">
//             Log In
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

    try {
      const response = await fetch('http://localhost:8000/auth/register', {
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
      setError('Cannot connect to server. Please ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-emerald-950 via-green-950 to-emerald-900 px-4 py-10">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl px-7 py-8">

        {/* Logo */}
        <div className="flex flex-col items-center mb-5">
          <div className="w-16 h-16 rounded-full border-2 border-emerald-500 flex items-center justify-center text-3xl mb-2">
            🌿
          </div>
          <span className="font-extrabold text-sm tracking-wide text-gray-900">MAHOL<span className="text-emerald-600">AI</span></span>
          <span className="text-[10px] text-gray-400 tracking-wide">Civic Reporting Platform</span>
        </div>

        <h1 className="text-xl font-bold text-gray-900 text-center mb-5">Create Account</h1>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 px-3 py-2 mb-4 rounded-lg">
            <p className="text-red-600 text-xs font-medium">{error}</p>
          </div>
        )}
        {success && (
          <div className="bg-emerald-50 border-l-4 border-emerald-400 px-3 py-2 mb-4 rounded-lg">
            <p className="text-emerald-700 text-xs font-medium">Account created! Redirecting to login...</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">👤</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Full Name"
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 focus:outline-none transition-all"
            />
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">✉️</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Email"
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 focus:outline-none transition-all"
            />
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">📞</span>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 focus:outline-none transition-all"
            />
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🪪</span>
            <input
              type="text"
              name="cnic"
              value={formData.cnic}
              onChange={handleChange}
              required
              placeholder="CNIC (Username) — 12345-1234567-1"
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 focus:outline-none transition-all"
            />
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔒</span>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Password (min 6 characters)"
              className="w-full pl-9 pr-9 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 focus:outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm bg-transparent border-0 cursor-pointer"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 mb-1">District</label>
              <select
                name="district"
                value={formData.district}
                onChange={handleDistrictChange}
                className="w-full px-2 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:border-emerald-500 focus:outline-none"
              >
                {Object.keys(DISTRICT_TEHSILS).map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-gray-500 mb-1">Tehsil / Area</label>
              <select
                name="area"
                value={formData.area}
                onChange={handleChange}
                className="w-full px-2 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:border-emerald-500 focus:outline-none"
              >
                {DISTRICT_TEHSILS[formData.district]?.map((areaName) => (
                  <option key={areaName} value={areaName}>
                    {areaName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">📅</span>
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 focus:outline-none transition-all"
            />
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">📍</span>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="House #, Street, City"
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 focus:outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-sm font-bold tracking-wide uppercase transition-all border-0 mt-2 ${
              loading
                ? 'bg-emerald-300 text-white cursor-not-allowed'
                : 'bg-emerald-800 hover:bg-emerald-900 text-white cursor-pointer shadow-md'
            }`}
          >
            {loading ? 'Creating...' : 'Sign Up'}
          </button>

        </form>

        <p className="text-center text-gray-500 text-xs mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-emerald-700 font-semibold no-underline hover:underline">
            Log In
          </Link>
        </p>

        <div className="text-center mt-2">
          <Link href="/" className="text-emerald-700 text-xs font-medium no-underline hover:underline">
            🏠 Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}