// src/components/ProtectedRoute.tsx - Updated
import { Navigate } from 'react-router-dom';
import DynamicNavbar from './DynamicNavbar'; // 🔥 Use the new dynamic navbar

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    if (!isAuthenticated) {
        return <Navigate to="/sign-in" replace />;
    }

    return (
        <>
            <DynamicNavbar />
            {children}
        </>
    );
};

export default ProtectedRoute;
