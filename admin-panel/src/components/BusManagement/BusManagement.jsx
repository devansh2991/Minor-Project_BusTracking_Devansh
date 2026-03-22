import React, { useState, useEffect } from "react";
import "./BusManagement.css";

const BusManagement = () => {
  const [buses, setBuses] = useState([]);
  const [newBusName, setNewBusName] = useState("");

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

  useEffect(() => {
    fetchBuses();
  }, []);

  const addBus = async () => {
    if (!newBusName) return alert("Enter bus name");

    try {
      const res = await fetch("http://localhost:3000/addbus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ busnumber: newBusName }),
      });

      const data = await res.json();

      if (res.ok) {
        setBuses((prev) => [...prev, data.data]);
        setNewBusName("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteBus = async (_id) => {
    try {
      await fetch(`http://localhost:3000/deletebus/${_id}`, {
        method: "GET",
      });
      setBuses((prev) => prev.filter((bus) => bus._id !== _id));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleAvailability = (id) => {
    setBuses(
      buses.map((bus) =>
        bus._id === id ? { ...bus, available: !bus.available } : bus
      )
    );
  };

  return (
    <div className="bus-management">
      <h2>Bus Management</h2>

      <div className="add-bus">
        <input
          type="text"
          placeholder="Enter Bus Name"
          value={newBusName}
          onChange={(e) => setNewBusName(e.target.value)}
        />
        <button onClick={addBus}>Add Bus</button>
      </div>

      <ul className="bus-list">
        {buses.map((bus) => (
          <li key={bus._id}>
            <span>{bus.busnumber}</span>

            <button onClick={() => toggleAvailability(bus._id)}
              style = {{ backgroundColor: bus.available ? "green" : "red" }}>
              {bus.available ? "Mark Available" : "Mark Unavailable"}
            </button>

            <button onClick={() => deleteBus(bus._id)} refresh="true">
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BusManagement;