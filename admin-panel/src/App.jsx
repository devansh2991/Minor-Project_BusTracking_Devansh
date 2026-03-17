import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminHomePage from "./components/Homepage/Homepage";
import BusManagement from "./components/BusManagement/BusManagement";
import Sidebar from "./components/Sidebar/Sidebar";
import RouteManagement from "./components/RouteManagement/RouteManagement";
import DriverManagement from "./components/DriverManagement/DriverManagement";
import StudentManagement from "./components/StudentManagement/StudentManagement";
import Reports from "./components/Reports/Reports";

function App() {
  return (
    <Router>
      <div className="admin-container">
        {/* Sidebar stays outside Routes so it’s always visible */}
        <Sidebar />

        {/* Main content changes based on route */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<AdminHomePage />} />
            <Route path="/bus-management" element={<BusManagement />} />
            <Route path="/routes" element={<RouteManagement />} />
            <Route path="/drivers" element={<DriverManagement />} />
            <Route path="/students" element={<StudentManagement />} />
            <Route path="/reports" element={<Reports />} />
            {/* <Route path="/settings" element={<SettingsPage />} /> */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;