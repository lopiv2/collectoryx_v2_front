import { Routes, Route, Navigate } from "react-router-dom";
import SignInSide from "../components/SignInSide";
import Dashboard from "../components/Dashboard";
import ProtectedRoutes from "../components/ProtectedRoute";
import AddCollection from "../pages/AddCollection";

export const Router = () => {
  return (
    <Routes>
      {/** Protected Routes */}
      {/**{console.log(AuthService.isLogged())}*/}
      <Route exact path="/" element={<Navigate to="/dashboard/*" />} />
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoutes>
            <Dashboard />
          </ProtectedRoutes>
        }
      ></Route>
      <Route
        path="/collections/add"
        element={
          <ProtectedRoutes>
            <AddCollection />
          </ProtectedRoutes>
        }
      ></Route>

      {/** Public Routes */}
      <Route path="/login" element={<SignInSide />} />
    </Routes>
  );
};
