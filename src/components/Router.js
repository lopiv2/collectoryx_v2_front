import { Routes, Route } from "react-router-dom";
import SignIn from "../components/SignIn"
import SignUp from "../components/SignUp"
import ProtectedRoutes from "../components/ProtectedRoute";
import AddCollection from "../pages/AddCollection";
import ViewCollection from "../pages/ViewCollections";
import DisplayCollection from "../pages/DisplayCollection";
import ConfigGeneral from "../pages/ConfigGeneral";
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
                <Route path="/collections/view"
                    element={
                        <ProtectedRoutes>
                            <ViewCollection />
                        </ProtectedRoutes>}>
                </Route>
                <Route path="/config/general"
                    element={
                        <ProtectedRoutes>
                            <ConfigGeneral />
                        </ProtectedRoutes>}>
                </Route>
                <Route path="/collections/display-collection"
                    element={
                        <ProtectedRoutes>
                            <DisplayCollection />
                        </ProtectedRoutes>}>
                </Route>
            </Route>

            {/** Public Routes */}
            < Route path="/login" element={< SignIn />} />
            < Route path="/signup" element={< SignUp />} />
        </Routes >
    );
};
