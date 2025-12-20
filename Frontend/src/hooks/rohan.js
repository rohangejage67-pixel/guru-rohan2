// import { useState, useEffect, useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from '../api/axios';

// const Dashboard = () => {
//   const { user, setUser } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [courses, setCourses] = useState([]);
//   const [hasEnrolledCourses, setHasEnrolledCourses] = useState(false);
//   const [commissionStats, setCommissionStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Log user data on mount
//   console.log('🔍 [Dashboard.jsx] User data on mount:', {
//     user,
//     hasFirstName: !!user?.firstName,
//     hasEmail: !!user?.email,
//     hasAffiliateId: !!user?.affiliateId,
//     timestamp: new Date().toISOString(),
//   });

//   // Redirect check
//   useEffect(() => {
//     if (!user && !loading) {
//       console.log('🚫 [Dashboard.jsx] No user, redirecting to login', { timestamp: new Date().toISOString() });
//       navigate('/auth/login');
//       return;
//     }
//   }, [user, loading, navigate]);

//   const fetchData = async () => {
//     console.time('fetchData');
//     console.log('🚀 [Dashboard.jsx] Starting fetchData', { timestamp: new Date().toISOString() });
//     setLoading(true);
//     setError(null);
//     try {
//       // Fetch user data if not available
//       let userData = user;
//       if (!user?.firstName || !user?.email || !user?.affiliateId) {
//         console.log('🔄 [Dashboard.jsx] Fetching user data from /auth/me', { timestamp: new Date().toISOString() });
//         const userRes = await axios.get('/auth/me');
//         userData = userRes.data.user;
//         setUser(userData);
//         console.log('✅ [Dashboard.jsx] /auth/me response:', { user: userData, timestamp: new Date().toISOString() });
//         localStorage.setItem('user', JSON.stringify(userData));
//       }

//       const [courseRes, commissionRes] = await Promise.all([
//         axios.get('/user/enrolled-courses'),
//         axios.get('/referral/metrics'),
//       ]);
//       console.log('✅ [Dashboard.jsx] API responses:', {
//         enrolledCourses: courseRes.data,
//         commissionMetrics: commissionRes.data,
//         timestamp: new Date().toISOString(),
//       });

//       const enrolledCourses = courseRes.data.enrolledCourses || [];  // 👈 Ye line add karo
//       setCourses(enrolledCourses);

//       // 👈 NEW CHECK: Agar no courses, redirect to home
//       if (enrolledCourses.length === 0) {
//         console.log('🚫 [Dashboard.jsx] No enrolled courses, redirecting to home', { timestamp: new Date().toISOString() });
//         setHasEnrolledCourses(false);
//         navigate('/');  // Home page pe redirect
//         return;  // Function exit kar do
//       }

//       setHasEnrolledCourses(true);

//       // Set commission stats
//       if (commissionRes.data && commissionRes.data.success) {
//         setCommissionStats(commissionRes.data);
//       } else {
//         setError('Commission data unavailable');
//         setCommissionStats({});
//       }
//     } catch (err) {
//       console.error('❌ [Dashboard.jsx] fetchData error:', {
//         message: err.message,
//         response: err.response?.data,
//         timestamp: new Date().toISOString(),
//       });
//       setError('Failed to load data. Redirecting to home...');
//       setHasEnrolledCourses(false); 
//       navigate('/'); 
//     } finally {
//       setLoading(false);
//       console.timeEnd('fetchData');
//     }
//   };


//   useEffect(() => {
//     console.log('🔄 [Dashboard.jsx] useEffect triggered', { timestamp: new Date().toISOString() });
//     if (user) {  
//       fetchData();
//     }
//   }, [user]);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     navigate('/auth/login');
//   };


//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-screen bg-[#f5f7fb] text-[#212529]">
//         <span className="text-[#4361ee] text-xl font-semibold animate-pulse">Loading Dashboard...</span>
//       </div>
//     );

//   if (!hasEnrolledCourses) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-[#f5f7fb] text-[#212529]">
//         <div className="text-center bg-white rounded-[15px] p-[25px] shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
//           <h2 className="text-2xl font-bold text-[#212529] mb-4">No Courses Enrolled!</h2>
//           <p className="text-[#6c757d] mb-6">Purchase a course to access the dashboard.</p>
//           <Link
//             to="/"
//             className="px-6 py-3 rounded-[15px] font-semibold bg-gradient-to-r from-[#4361ee] to-[#3a0ca3] text-white shadow-md hover:shadow-xl hover:-translate-y-[5px] transition-all"
//           >
//             Go to Home & Buy Courses
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#f5f7fb] text-[#212529] py-12 px-4 md:px-12">
//       <div className="max-w-7xl mx-auto bg-white/80 rounded-[15px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] p-10 border border-[#e0e0e0]">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-[#f0f0f0] pb-6">
//           <div>
//             <h1 className="text-5xl font-extrabold bg-gradient-to-r from-[#4361ee] to-[#7209b7] text-transparent bg-clip-text">
//               Dashboard
//             </h1>
//             <p className="text-lg text-[#6c757d] mt-3">
//               Welcome back,{" "}
//               {user?.firstName
//                 ? user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1).toLowerCase()
//                 : user?.name || "User"}
//               !
//             </p>
//           </div>
//           <div className="flex gap-4 mt-6 md:mt-0">
//             <button
//               onClick={fetchData}
//               className="px-6 py-3 rounded-[15px] font-semibold bg-gradient-to-r from-[#4cc9f0] to-[#4361ee] text-white shadow-md hover:shadow-xl hover:-translate-y-[5px] transition-all"
//             >
//               🔄 Refresh
//             </button>
//             <button
//               onClick={handleLogout}
//               className="px-6 py-3 rounded-[15px] font-semibold bg-gradient-to-r from-[#f72585] to-[#7209b7] text-white shadow-md hover:shadow-xl hover:-translate-y-[5px] transition-all"
//             >
//               🚪 Log Out
//             </button>


//           </div>
//         </div>


//         {/* Error */}
//         {error && (
//           <div className="bg-[#f72585]/10 text-[#f72585] p-4 rounded-[15px] mb-10 border border-[#f72585]/20 shadow-sm">
//             {error}
//           </div>
//         )}

//         {/* User Info + Courses */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">

//           {/* Courses */}
//           <div className="bg-white rounded-[15px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] p-8 border border-[#e0e0e0] transition-all hover:-translate-y-[5px] hover:shadow-[0_10px_20px_rgba(0,0,0,0.1)]">
//             <h2 className="text-2xl font-bold text-[#212529] mb-6">📚 Enrolled Courses</h2>
//             <Link
//               to="/my-courses"
//               className="block w-full text-center px-6 py-4 rounded-[15px] font-semibold text-white bg-gradient-to-r from-[#ff9e00] to-[#ff6b00] shadow-md hover:shadow-xl hover:-translate-y-[5px] transition-all"
//             >
//               Go to My Courses
//             </Link>
//           </div>
//     </div>



//         <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
//           {/* Header */}
//           <div className="flex items-center gap-3 mb-8">
//             <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
//               <span className="text-2xl">🔗</span>
//             </div>
//             <div>
//               <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//                 Referral & Commission Tools
//               </h2>
//               <p className="text-gray-600 mt-1">Manage your affiliate business and track earnings</p>
//             </div>
//           </div>

//           {/* Quick Actions Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {/* Profile Card */}
//             <Link
//               to="/profile"
//               className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
//             >
//               <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//               <div className="relative z-10">
//                 <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl shadow-lg mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
//                   👤
//                 </div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">Profile</h3>
//                 <p className="text-gray-600 text-sm text-center leading-relaxed">
//                   Manage your account information and preferences
//                 </p>
//               </div>
//             </Link>

//             {/* Affiliate Account Card */}
//             <Link
//               to="/dashboard/affiliate-account"
//               className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
//             >
//               <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//               <div className="relative z-10">
//                 <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-2xl shadow-lg mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
//                   ⚙️
//                 </div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">Affiliate Account</h3>
//                 <p className="text-gray-600 text-sm text-center leading-relaxed">
//                   Manage affiliate settings & preferences
//                 </p>
//               </div>
//             </Link>

//             {/* View Downline Card */}
//             <Link
//               to="/dashboard/referral-downline"
//               className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
//             >
//               <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//               <div className="relative z-10">
//                 <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-2xl shadow-lg mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
//                   👥
//                 </div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">View Downline</h3>
//                 <p className="text-gray-600 text-sm text-center leading-relaxed">
//                   Track your referral network and performance
//                 </p>
//               </div>
//             </Link>

//             {/* Request Payout Card */}
//             <Link
//               to="/dashboard/payout-settings"
//               className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
//             >
//               <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//               <div className="relative z-10">
//                 <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-2xl shadow-lg mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
//                   💰
//                 </div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">Request Payout</h3>
//                 <p className="text-gray-600 text-sm text-center leading-relaxed">
//                   Withdraw your earnings securely
//                 </p>
//               </div>
//             </Link>

//             {/* Leaderboard Card */}
//             <Link
//               to="/dashboard/leaderboard"
//               className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
//             >
//               <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-rose-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//               <div className="relative z-10">
//                 <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white text-2xl shadow-lg mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
//                   🏆
//                 </div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">Leaderboard</h3>
//                 <p className="text-gray-600 text-sm text-center leading-relaxed">
//                   Check rankings & performance metrics
//                 </p>
//               </div>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>

//   );
// };

// // Reusable button style
// const DashboardLink = ({ to, children, gradient }) => (
//   <Link
//     to={to}
//     className={`px-6 py-4 text-center rounded-[15px] font-semibold text-white bg-gradient-to-r ${gradient} shadow-md hover:shadow-xl hover:-translate-y-[5px] transition-all`}
//   >
//     {children}
//   </Link>
// );

// export default Dashboard; 