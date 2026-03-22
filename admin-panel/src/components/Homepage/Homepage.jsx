import React, { useEffect, useState } from "react";
import "./Homepage.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { io } from "socket.io-client";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const socket = io("http://localhost:3000");

const AdminHomePage = () => {
  const [markers, setMarkers] = useState({});
  const [buses, setBuses] = useState([]);
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

  useEffect(() => {
    socket.on("receiveLocation", (data) => {
      setMarkers((prev) => ({
        ...prev,
        [data.id]: [data.latitude, data.longitude],
      }));
    });

    socket.on("userDisconnected", (id) => {
      setMarkers((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    });

    return () => {
      socket.off("receiveLocation");
      socket.off("userDisconnected");
    };
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
          <div className="card"><h3>Active Routes</h3><p>12</p></div>
          <div className="card"><h3>Drivers</h3><p>{drivers.length}</p></div>
          <div className="card"><h3>Students</h3><p>{users.length}</p></div>
        </section>

        <section className="map-section">
          <h2>Live Bus Tracking</h2>

          <MapContainer
            center={[26.2183, 78.1828]}
            zoom={13}
            style={{ height: "400px", width: "100%" }}
          >
            <TileLayer
              attribution="© Minor Project"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {Object.entries(markers).map(([id, position]) => (
              <Marker key={id} position={position}>
                <Popup>Bus ID: {id}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </section>

      </main>
    </div>
  );
};

export default AdminHomePage;