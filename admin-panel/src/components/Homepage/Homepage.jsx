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
            <span>Welcome, Admin</span>
          </div>
        </header>

        <section className="dashboard-cards">
          <div className="card"><h3>Total Buses</h3><p>25</p></div>
          <div className="card"><h3>Active Routes</h3><p>12</p></div>
          <div className="card"><h3>Drivers</h3><p>18</p></div>
          <div className="card"><h3>Students</h3><p>450</p></div>
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

        <section className="reports">
          <h2>Recent Reports</h2>
          <table>
            <thead>
              <tr>
                <th>Bus ID</th>
                <th>Route</th>
                <th>Status</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>BUS-101</td>
                <td>Route A</td>
                <td>On Time</td>
                <td>10:45 AM</td>
              </tr>
              <tr>
                <td>BUS-205</td>
                <td>Route B</td>
                <td>Delayed</td>
                <td>10:50 AM</td>
              </tr>
            </tbody>
          </table>
        </section>

      </main>
    </div>
  );
};

export default AdminHomePage;