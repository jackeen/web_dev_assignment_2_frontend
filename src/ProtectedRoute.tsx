import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext.tsx';
import ROUTES from "./routes.ts";
import Roles from "./Roles.ts";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: Roles[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles}) => {

    const { isAuthenticated, role } = useAuth();

    // Redirect login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to={ROUTES.LOGIN} />;
    }

    // Check roles if provided
    if (!allowedRoles.includes(role)) {
        return <Navigate to={ROUTES.NOT_AUTHORIZED} />;
    }

    // Render the children if authenticated and authorized
    return children;
};

export default ProtectedRoute;
