import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2 } from 'lucide-react';



const ProtectedRoute = () => {
  // Auth checks are temporarily disabled.
  return <Outlet />;
};

export default ProtectedRoute;