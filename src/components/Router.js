import { Routes, Route, Navigate } from "react-router-dom";
import SignInSide from "../components/SignInSide";

import ProtectedRoutes from "../components/ProtectedRoute";
import AddCollection from "../pages/AddCollection";
import Layout from "./Layout";
import Dashboard from "./Dashboard";

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
                <Route path="/"
                    element={
                        <ProtectedRoutes>
                            <Dashboard></Dashboard>
                        </ProtectedRoutes>}>
                </Route>
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
