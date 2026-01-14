import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2 className="logo">CompliX</h2>

      <nav>
        <Link to="/Dashboard">Dashboard</Link>
        <Link to="/ca">Manage CA</Link>
        <Link to="/cases">Cases</Link>
        <Link to="/users">Users</Link>
        {/* <Link to="/settings">Add Services</Link>
        <Link to="/service">Manage services</Link>
        <Link to="/theme-settings">Change Theme</Link> */}


      </nav>
    </div>
  );
};

export default Sidebar;
