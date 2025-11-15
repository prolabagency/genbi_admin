import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar.jsx";

export default function Layout() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
