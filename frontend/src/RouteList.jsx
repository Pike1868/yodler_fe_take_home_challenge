import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./components/SignUp";
import { useUserContext } from "./context/user";
import HomePage from "./components/HomePage"
import SignIn from "./components/SignIn";
import AdminPage from "./components/AdminPage";

/**RouteList Component
 * Defines all routes for app
 *
 */

export default function RouteList() {
  const { user } = useUserContext();

  return (
    <Routes>
      {user ? (
        <>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/admin" element={user && user.isAdmin ? <AdminPage /> : <Navigate to="/" />} />
        </>
      ):(
        <>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/*" element={<Navigate to="/signup" />} />
      </>
      )}
    </Routes>
  );
}
