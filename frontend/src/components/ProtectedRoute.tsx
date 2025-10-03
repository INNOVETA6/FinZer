import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    // Check authentication status from localStorage
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    // If not authenticated, redirect to landing page
    if (!isAuthenticated) {
        return <Navigate to="/sign-up" replace />;
    }

    // If authenticated, render the protected component
    return children;
};

export default ProtectedRoute;
