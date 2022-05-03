import React from 'react';

import { Navigate, Route } from 'react-router-dom'
import AuthService from "../app/api/auth.api";
import Dashboard from "../components/Dashboard";


const ProtectedRoutes = () => {
    return AuthService.isLogged() ? <Dashboard /> : <Navigate to="/login" />
}

export default ProtectedRoutes;