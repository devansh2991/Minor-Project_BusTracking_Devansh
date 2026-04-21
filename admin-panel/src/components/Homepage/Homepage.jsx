import React, { useEffect, useState } from "react";
import "./Homepage.css";
import MapPage from "../Map/Map";

const AdminHomePage = () => {
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const res = await fetch("http://localhost:3000/getbuses");
        const data = await res.json();
        if (res.ok) {
          setBuses(data.data || data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchBuses();
  }, []);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await fetch("http://localhost:3000/getroutes");
        const data = await res.json();
        if (res.ok) {
          setRoutes(data.data || data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchRoutes();
  }, []);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const res = await fetch("http://localhost:3000/getdrivers");
        const data = await res.json();
        if (res.ok) {
          setDrivers(data.data || data);
        }
      } catch (err) {
        console.error(err);
      } 
    };

    fetchDrivers();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:3000/getusers");
        const data = await res.json();
        if (res.ok) {
          setUsers(data.data || data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="admin-container">
      <main className="main-content">
        
        <header className="header">
          <h1>Admin Dashboard</h1>
          <div className="profile">
            <select name="Profile" id="profile-select">
              <option value="">Setting</option>
              <option value="">Logout</option>
            </select>
          </div>
        </header>

        <section className="dashboard-cards">
          <div className="card"><h3>Total Buses</h3><p>{buses.length}</p></div>
          <div className="card"><h3>Active Routes</h3><p>{routes.length}</p></div>
          <div className="card"><h3>Drivers</h3><p>{drivers.length}</p></div>
          <div className="card"><h3>Students</h3><p>{users.length}</p></div>
        </section>

        <section className="map-section">
          <h2>Live Driver Tracking</h2>
          <MapPage embedded />
        </section>

      </main>
    </div>
  );
};

export default AdminHomePage;