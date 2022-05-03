import AddCollection from "../pages/AddCollection";
import {
    Routes,
    Route,
} from "react-router-dom";

export const RouterPages = () => {
    return (
        <Routes>
            <Route path="/collections/add" element={<AddCollection />} />
        </Routes>
    );
};