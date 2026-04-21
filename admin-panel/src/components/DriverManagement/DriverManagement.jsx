import React, { useState, useEffect } from "react";
import "./DriverManagement.css";

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([]);
  const [newDriverName, setNewDriverName] = useState("");
  const [driverNumber, setDriverNumber] = useState("");
  const [available, setAvailable] = useState(false);

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

  useEffect(() => {
    fetchDrivers();
  }, []);

  const addDriver = async () => {
    if (!newDriverName) return alert("Enter driver name");
    if (!driverNumber) return alert("Enter driver number");

    try {
      const res = await fetch("http://localhost:3000/adddriver", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newDriverName, mobile: driverNumber }),
      });

      const data = await res.json();
      if (res.ok) {
        setDrivers((prev) => [...prev, data.data]);
        setNewDriverName("");
        setDriverNumber("");
      }
    } catch (err) {
      console.error(err);
    }
  };

    const removeDriver = async (_id) => {
    try {
      await fetch(`http://localhost:3000/deletedriver/${_id}`, {
        method: "GET",
      });
      setDrivers((prev) => prev.filter((driver) => driver._id !== _id));
    } catch (err) {
      console.error(err);
    }
  };


  const toggleAvailability = (id) => {
    setAvailable((prev) => !prev);
    fetch(`http://localhost:3000/updatedriver/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ available: !available }),
    });
    setDrivers((prev) => prev.map((driver) => driver._id === id ? { ...driver, available: !available } : driver));
  };

  return (
    <div className="driver-management">
      <h2>Driver Management</h2>
      <div className="add-driver">
        <input
          type="text"
          placeholder="Search by driver name"
          onChange={(e) => {
            const query = e.target.value.toLowerCase();
            fetchDrivers().then(() => {
              setDrivers((prev) =>
                prev.filter((driver) => driver.name.toLowerCase().includes(query))
              );
            });
          }}
          style={{ outline: "none" }}
        />
      </div>

      <div className="add-driver">
        <input
          type="text"
          placeholder="Enter driver name"
          value={newDriverName}
          onChange={(e) => setNewDriverName(e.target.value)}
        />
        <input 
          type="text" 
          placeholder="Enter driver number"
          value={driverNumber}
          onChange={(e) => setDriverNumber(e.target.value)}
        />
        <button onClick={addDriver}>Add Driver</button>
      </div>

      <div className="driver-list-header">
        <span style={{ fontWeight: "bold", marginRight: "20px" }}>Driver Details</span>
        <span style={{ fontWeight: "bold", marginRight: "20px", marginLeft: "90px" }}>Availability</span>
        <span style={{ fontWeight: "bold" }}>Actions</span>
      </div>

      <ul className="driver-list">
        {[...drivers]
        .sort((a,b) => a.name.localeCompare(b.name))
        .map((driver) => (
          <li key={driver._id}>
            <span>{driver.name} - {driver.mobile}</span>
            <button onClick={() => toggleAvailability(driver._id)}
            style={{ backgroundColor: driver.available ? "#e46e00" : "green", color: "white" }}>
              {driver.available ? "Mark Unavailable" : "Mark Available"}
            </button>
            <button onClick={() => removeDriver(driver._id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default DriverManagement;