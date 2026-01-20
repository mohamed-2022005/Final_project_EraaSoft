import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const location = useLocation();
    
    // بنجيب التوكن بكل المسميات المحتملة اللي انت استخدمتها في الكود بتاعك
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');

    if (!token) {
        // بنحفظ المكان اللي كان عايز يروحه عشان نرجعه ليه بعد اللوجن (اختياري)
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default PrivateRoute;