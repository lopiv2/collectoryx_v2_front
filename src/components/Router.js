import { Routes, Route, Navigate } from "react-router-dom";
import SignInSide from "../components/SignInSide";

import ProtectedRoutes from "../components/ProtectedRoute";
import AddCollection from "../pages/AddCollection";
import Layout from "./Layout";

export const Router = () => {
    return (
        <Routes>
            {/** Protected Routes */}
            <Route exact path="/"
                element={
                    <ProtectedRoutes>
                        <Layout />
                    </ProtectedRoutes>
                }
            >
                <Route path="/collections/add"
                    element={
                        <ProtectedRoutes>
                            <AddCollection />
                        </ProtectedRoutes>}>
                </Route>
            </Route>

            {/** Public Routes */}
            < Route path="/login" element={< SignInSide />} />
        </Routes >
    );
};
