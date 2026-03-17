import React, { useState } from "react";
import "./DriverManagement.css";

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([
    { id: 1, name: "John Doe", bus: "Bus-101", available: true },
    { id: 2, name: "Jane Smith", bus: "Bus-205", available: true },
    { id: 3, name: "Raj Kumar", bus: "Bus-309", available: false },
  ]);

  const [newDriverName, setNewDriverName] = useState("");
  const [assignedBus, setAssignedBus] = useState("");

  // Add new driver
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

  // Toggle availability
  const toggleAvailability = (id) => {
    setDrivers(
      drivers.map((driver) =>
        driver.id === id ? { ...driver, available: !driver.available } : driver
      )
    );
  };

  // Remove driver
  const removeDriver = (id) => {
    setDrivers(drivers.filter((driver) => driver.id !== id));
  };

  return (
    <div className="driver-management">
      <h2>Driver Management</h2>

      {/* Add Driver */}
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

      {/* Driver List */}
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