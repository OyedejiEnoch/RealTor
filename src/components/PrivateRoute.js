import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuthStatus } from "../hooks/useAuthStatus";
import Spinner from "./Spinner";

const PrivateRoute = () => {
  const { loggedIn, loading } = useAuthStatus();
  // const loggedIn = true;
  if (loading) {
    return <Spinner />;
  }
  // so when we cllick on any private route the loading initially is always set to true,
  // then it checks form the useAuthStatus if logged in is true if true it return the component
  return loggedIn ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default PrivateRoute;
