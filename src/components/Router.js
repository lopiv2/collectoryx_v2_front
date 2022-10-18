import { Routes, Route, useParams } from "react-router-dom";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import ProtectedRoutes from "../components/ProtectedRoute";
import AddCollection from "../pages/AddCollection";
import ViewCollection from "../pages/ViewCollections";
import DisplayCollection from "../pages/DisplayCollection";
import ManageSeries from "../pages/ManageSeries";
import ManageFeeds from "../pages/ManageFeeds";
import AddItem from "../pages/AddItem";
import ConfigGeneral from "../pages/ConfigGeneral";
import ConfigInterface from "../pages/ConfigInterface";
import Layout from "./Layout";
import Dashboard from "./Dashboard";
import EditItem from "../pages/EditItem";
import ManageImages from "../pages/ManageImages";
import KeyGeneration from "../pages/KeyGeneration";
import BuyLicense from "../pages/BuyLicense";
import ViewFeeds from "../pages/ViewFeeds";
import ImportCollectionFile from "../pages/ImportCollectionFile";
import ImportScrapper from "../pages/ImportScrapper";
import CalendarScheduler from "../pages/CalendarScheduler";
import Profile from "../pages/Profile";

export const Router = (props) => {
  let { colId } = useParams();

  return (
    <Routes>
      {/** Protected Routes */}
      <Route
        exact
        path="/"
        element={
          <ProtectedRoutes>
            <Layout />
          </ProtectedRoutes>
        }
      >
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <Dashboard></Dashboard>
            </ProtectedRoutes>
          }
        ></Route>
        <Route
          path="/profile"
          element={
            <ProtectedRoutes>
              <Profile />
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
        <Route
          path="/collections/import-file"
          element={
            <ProtectedRoutes>
              <ImportCollectionFile />
            </ProtectedRoutes>
          }
        ></Route>
        <Route
          path="/collections/import-scrapper"
          element={
            <ProtectedRoutes>
              <ImportScrapper />
            </ProtectedRoutes>
          }
        ></Route>
        <Route
          path="/collections"
          element={
            <ProtectedRoutes>
              <ViewCollection />
            </ProtectedRoutes>
          }
        ></Route>
        <Route
          path="/collections/manage"
          element={
            <ProtectedRoutes>
              <ManageImages />
            </ProtectedRoutes>
          }
        ></Route>
        <Route
          path="/config/general"
          element={
            <ProtectedRoutes>
              <ConfigGeneral />
            </ProtectedRoutes>
          }
        ></Route>
        <Route
          path="/config/interface"
          element={
            <ProtectedRoutes>
              <ConfigInterface />
            </ProtectedRoutes>
          }
        ></Route>
        <Route
          path="/collections/:colId"
          element={
            <ProtectedRoutes>
              <DisplayCollection />
            </ProtectedRoutes>
          }
        ></Route>
        <Route
          path="/collections/manage-series"
          element={
            <ProtectedRoutes>
              <ManageSeries />
            </ProtectedRoutes>
          }
        ></Route>
        <Route
          path="/collections/add-item"
          element={
            <ProtectedRoutes>
              <AddItem />
            </ProtectedRoutes>
          }
        ></Route>
        <Route
          path="/collections/edit-item"
          element={
            <ProtectedRoutes>
              <EditItem />
            </ProtectedRoutes>
          }
        ></Route>
        <Route
          path="/feeds/:feedId"
          element={
            <ProtectedRoutes>
              <ViewFeeds />
            </ProtectedRoutes>
          }
        ></Route>
        <Route
          path="/feeds/manage"
          element={
            <ProtectedRoutes>
              <ManageFeeds />
            </ProtectedRoutes>
          }
        ></Route>
        <Route
          path="/market/license"
          element={
            <ProtectedRoutes>
              <BuyLicense />
            </ProtectedRoutes>
          }
        ></Route>
        <Route
          path="/calendar"
          element={
            <ProtectedRoutes>
              <CalendarScheduler />
            </ProtectedRoutes>
          }
        ></Route>
        <Route
          path="/admin/keygen"
          element={
            <ProtectedRoutes>
              <KeyGeneration />
            </ProtectedRoutes>
          }
        ></Route>
      </Route>

      {/** Public Routes */}
      <Route path="/login" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
};
