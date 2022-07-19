import React from 'react';

import { Navigate } from 'react-router-dom'
import AuthService from "../app/api/auth.api";


const ProtectedRoutes = (props) => {
    return AuthService.isLogged() && AuthService.checkTokenExpired() ? props.children : <Navigate to="/login" />
}

export default ProtectedRoutes;