// Sidebar.js
import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h2>Smart Bus Admin</h2>
      <ul>
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/bus-management">Bus Management</Link></li>
        <li><Link to="/routes">Routes</Link></li>
        <li><Link to="/drivers">Drivers</Link></li>
        <li><Link to="/students">Students</Link></li>
        <li><Link to="/reports">Reports</Link></li>
      </ul>
    </aside>
  );
};

export default Sidebar;