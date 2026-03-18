import React, { useState } from "react";
import "./BusManagement.css";

const BusManagement = () => {
  const [buses, setBuses] = useState([
    { id: 1, name: "MP07L0667", available: true },
    { id: 2, name: "MP07K0668", available: true },
    { id: 3, name: "MP07ZW0628", available: true },
  ]);

  const [newBusName, setNewBusName] = useState("");

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

  const toggleAvailability = (id) => {
    setBuses(
      buses.map((bus) =>
        bus.id === id ? { ...buses, available: !buses.available } : bus
      )
    );
  };

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
          placeholder="Enter Bus Number"
          value={newBusName}
          onChange={(e) => setNewBusName(e.target.value)}
        />
        <button onClick={addBus}>Add Bus</button>
      </div>

      <ul className="bus-list">
        {buses.map((bus) => (
          <li key={bus.id} className={!bus.available ? "unavailable" : ""}>
            <span>{bus.name}</span>
            <button onClick={() => toggleAvailability(bus.id)}>
              {bus.available ? "Mark Unavailable" : "Mark Available"}
            </button>
            <button onClick={() => removeBus(bus.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BusManagement;