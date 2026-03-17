import React, { useState } from "react";
import "./BusManagement.css";

const BusManagement = () => {
  const [buses, setBuses] = useState([
    { id: 1, name: "Bus-101", available: true },
    { id: 2, name: "Bus-205", available: true },
    { id: 3, name: "Bus-309", available: true },
  ]);

  const [newBusName, setNewBusName] = useState("");

  // Add new bus
  const addBus = () => {
    if (newBusName.trim() === "") return;
    const newBus = {
      id: Date.now(),
      name: newBusName,
      available: true,
    };
    setBuses([...buses, newBus]);
    setNewBusName("");
  };

  // Mark bus as unavailable
  const markUnavailable = (id) => {
    setBuses(
      buses.map((bus) =>
        bus.id === id ? { ...bus, available: false } : bus
      )
    );
  };

  // Remove bus completely
  const removeBus = (id) => {
    setBuses(buses.filter((bus) => bus.id !== id));
  };

  return (
    <div className="bus-management">
      <h2>Bus Management</h2>

      {/* Add Bus */}
      <div className="add-bus">
        <input
          type="text"
          placeholder="Enter bus name"
          value={newBusName}
          onChange={(e) => setNewBusName(e.target.value)}
        />
        <button onClick={addBus}>Add Bus</button>
      </div>

      {/* Bus List */}
      <ul className="bus-list">
        {buses.map((bus) => (
          <li key={bus.id} className={!bus.available ? "unavailable" : ""}>
            <span>{bus.name}</span>
            {bus.available ? (
              <button onClick={() => markUnavailable(bus.id)}>
                Mark Unavailable
              </button>
            ) : (
              <span style={{ color: "red", marginLeft: "10px" }}>
                Unavailable
              </span>
            )}
            <button onClick={() => removeBus(bus.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BusManagement;