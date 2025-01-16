import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    adminOnly?: boolean;
}

export const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
    const { user } = useAuth();

    // Check only for authentication if not an admin-only route
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Additional check for admin-only routes
    if (adminOnly && user.role !== 'admin') {
        return <Navigate to="/colleges" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
