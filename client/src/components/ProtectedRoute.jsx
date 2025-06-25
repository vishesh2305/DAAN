// client/src/components/ProtectedRoute.jsx

import React from 'react';
import { useUser } from '../contexts/UserProvider';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const {isAuthenticated, loading} = useUser();
    // const { currentUser, loading } = useUser();


    // ✅ If we are still checking the session, don't render anything yet
    // The UserProvider is already showing a full-page loader, so this can just return null.
    if (loading) {
        return null; 
    }

    // After loading, if there's a user, show the requested page. Otherwise, redirect to /auth.

    return isAuthenticated ? <Outlet /> : <Navigate to="/auth" />;

};

export default ProtectedRoute;