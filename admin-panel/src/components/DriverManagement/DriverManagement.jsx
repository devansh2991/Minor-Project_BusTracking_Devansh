import React, { useState } from "react";
import "./DriverManagement.css";

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([
    { id: 1, name: "Arjun Gurjar", bus: "MP07L0667", available: true },
    { id: 2, name: "Rajkumar", bus: "MP07K0668", available: true },
    { id: 3, name: "Girraj Yadav", bus: "MP07ZW0628", available: false },
  ]);

  const [newDriverName, setNewDriverName] = useState("");
  const [assignedBus, setAssignedBus] = useState("");

  const addDriver = () => {
    if (newDriverName.trim() === "" || assignedBus.trim() === "") return;
    const newDriver = {
      id: Date.now(),
      name: newDriverName,
      bus: assignedBus,
      available: true,
    };
    setDrivers([...drivers, newDriver]);
    setNewDriverName("");
    setAssignedBus("");
  };

  const toggleAvailability = (id) => {
    setDrivers(
      drivers.map((driver) =>
        driver.id === id ? { ...driver, available: !driver.available } : driver
      )
    );
  };

  const removeDriver = (id) => {
    setDrivers(drivers.filter((driver) => driver.id !== id));
  };

  return (
    <div className="driver-management">
      <h2>Driver Management</h2>

      <div className="add-driver">
        <input
          type="text"
          placeholder="Enter driver name"
          value={newDriverName}
          onChange={(e) => setNewDriverName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Assign bus"
          value={assignedBus}
          onChange={(e) => setAssignedBus(e.target.value)}
        />
        <button onClick={addDriver}>Add Driver</button>
      </div>

      <ul className="driver-list">
        {drivers.map((driver) => (
          <li key={driver.id} className={!driver.available ? "unavailable" : ""}>
            <span>
              {driver.name} — {driver.bus}
            </span>
            <button onClick={() => toggleAvailability(driver.id)}>
              {driver.available ? "Mark Unavailable" : "Mark Available"}
            </button>
            <button onClick={() => removeDriver(driver.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DriverManagement;