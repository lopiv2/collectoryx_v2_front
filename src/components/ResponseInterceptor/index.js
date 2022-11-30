import { useEffect, useRef } from 'react';
import axios from 'axios';
import AuthService from '../../app/api/auth.api';
import { useNavigate } from "react-router-dom";

export function ResponseInterceptor() {
    const interceptorId = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        interceptorId.current = axios.interceptors.response.use(
            undefined,
            error => {
                // todo: handle error
                switch (error.response.status) {
                    case 404:
                        break;
                    case 401:
                        AuthService.logout();
                        navigate("/login");
                        break;
                }
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptorId.current);
        };
    }, []);

    return null;
}