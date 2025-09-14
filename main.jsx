import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import App from "./stores";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Stores from "./pages/Storelist";
import Admin from "./pages/Admin";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        {/* Redirect root → /stores */}
        <Route index element={<Navigate to="/stores" replace />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="stores" element={<Stores />} />
        <Route path="admin" element={<Admin />} />
        <Route path="owner" element={<Owner />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
