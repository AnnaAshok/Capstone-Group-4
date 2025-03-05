import React from 'react'
import { useNavigate, useLocation } from "react-router-dom";

const ProtectedRoute= ({ element }) => {
    const Navigate = useNavigate();
    const isAuthenticated = localStorage.getItem("userToken"); // Example check
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

export default ProtectedRoute