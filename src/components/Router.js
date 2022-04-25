import {
    Routes,
    Route,
    Navigate
} from "react-router-dom";
import SignInSide from "../components/SignInSide";
import Dashboard from "../components/Dashboard";
import ProtectedRoutes from "../components/ProtectedRoute";


export const Router = () => {

    return (
        <Routes>
            {/** Protected Routes */}
            {/**{console.log(AuthService.isLogged())}*/}
            <Route path="/" element={<ProtectedRoutes />}>
                <Route path="/" element={<Navigate replace to="dashboard" />} />
                <Route path="dashboard" element={<Dashboard />} />
            </Route>

            {/** Public Routes */}
            <Route path="/login" element={<SignInSide />} />
        </Routes>
    );
};