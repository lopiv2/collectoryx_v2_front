import React from 'react';

import { Navigate, Route } from 'react-router-dom'
import AuthService from "../app/api/auth.api";


const ProtectedRoutes = (props) => {
    return AuthService.isLogged() ? props.children : <Navigate to="/login" />
}

export default ProtectedRoutes;