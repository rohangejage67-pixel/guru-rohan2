// src/components/ProtectedRoute.jsx
import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Path matches your setup

const ProtectedRoute = () => {
  const { isLoggedIn, loading } = useContext(AuthContext); // Added 'loading'
  // console.log('🛡️ ProtectedRoute: loading=', loading, 'isLoggedIn=', isLoggedIn);

  // Show a loader while auth is verifying (prevents flash redirects)
  if (loading) {
    return <div>Loading...</div>; // You can replace with a Spinner component or custom UI
  }

  // If not logged in after loading, redirect to login
  if (!isLoggedIn) {
    // console.log('🚫 Not logged in, redirecting to login');
    return <Navigate to="/auth/login" replace />;
    
  }

  // If authenticated, render the protected content (e.g., Dashboard)
  return <Outlet />;
};

export default ProtectedRoute;