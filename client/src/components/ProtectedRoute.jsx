// client/src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../contexts/UserProvider';

const ProtectedRoute = () => {
    // ✅ Get both currentUser and the new loading state from the context
    const { currentUser, loading } = useUser();

    // ✅ If we are still checking the session, don't render anything yet
    // The UserProvider is already showing a full-page loader, so this can just return null.
    if (loading) {
        return null; 
    }

    // After loading, if there's a user, show the requested page. Otherwise, redirect to /auth.
    return currentUser ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;