import React from "react";

import { Navigate } from "react-router-dom";
import AuthService from "../app/api/auth.api";
import { toast } from 'react-toastify';
import { FormattedMessage } from "react-intl";

const ProtectedRoutes = (props) => {
  const user = localStorage.getItem("user");
  const userData = JSON.parse(user);
  //Si no hay token generado porque se ha borrado, se manda a login a generar uno nuevo
  if (userData.token === undefined) {
    toast.error(
      <FormattedMessage id="app.signin.token_expired"></FormattedMessage>,
      { theme: "colored" }
    );
    return <Navigate to="/login" />;
  } else {
    return AuthService.isLogged() && AuthService.checkTokenExpired() ? (
      props.children
    ) : (
      <Navigate to="/login" />
    );
  }
};

export default ProtectedRoutes;
