import { Routes, Route, useParams } from "react-router-dom";
import SignIn from "../pages/SignIn"
import SignUp from "../pages/SignUp"
import ProtectedRoutes from "../components/ProtectedRoute";
import AddCollection from "../pages/AddCollection";
import ViewCollection from "../pages/ViewCollections";
import DisplayCollection from "../pages/DisplayCollection";
import ManageSeries from "../pages/ManageSeries";
import AddItem from "../pages/AddItem";
import ConfigGeneral from "../pages/ConfigGeneral";
import Layout from "./Layout";
import Dashboard from "./Dashboard";
import EditItem from "../pages/EditItem";
import ManageCollections from "../pages/ManageCollections";
import EditCollection from "../pages/EditCollection";

export const Router = () => {
    let { colId } = useParams();

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
                <Route path="/collections/edit"
                    element={
                        <ProtectedRoutes>
                            <EditCollection />
                        </ProtectedRoutes>}>
                </Route>
                <Route path="/collections"
                    element={
                        <ProtectedRoutes>
                            <ViewCollection />
                        </ProtectedRoutes>}>
                </Route>
                <Route path="/collections/manage"
                    element={
                        <ProtectedRoutes>
                            <ManageCollections />
                        </ProtectedRoutes>}>
                </Route>
                <Route path="/config/general"
                    element={
                        <ProtectedRoutes>
                            <ConfigGeneral />
                        </ProtectedRoutes>}>
                </Route>
                <Route path="/collections/:colId"
                    element={
                        <ProtectedRoutes>
                            <DisplayCollection />
                        </ProtectedRoutes>}>
                </Route>
                <Route path="/collections/manage-series"
                    element={
                        <ProtectedRoutes>
                            <ManageSeries />
                        </ProtectedRoutes>}>
                </Route>
                <Route path="/collections/add-item"
                    element={
                        <ProtectedRoutes>
                            <AddItem />
                        </ProtectedRoutes>}>
                </Route>
                <Route path="/collections/edit-item"
                    element={
                        <ProtectedRoutes>
                            <EditItem />
                        </ProtectedRoutes>}>
                </Route>
            </Route>

            {/** Public Routes */}
            < Route path="/login" element={< SignIn />} />
            < Route path="/signup" element={< SignUp />} />
        </Routes >
    );
};
