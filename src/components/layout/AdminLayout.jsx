import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "./AdminLayout.css";

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-container">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <div className="content-area">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
