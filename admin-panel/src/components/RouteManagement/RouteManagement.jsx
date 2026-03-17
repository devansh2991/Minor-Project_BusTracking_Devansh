import React, { useState } from "react";
import "./RouteManagement.css";

const RouteManagement = () => {
  const [routes, setRoutes] = useState([
    {
      id: 1,
      name: "Route A",
      stops: ["Stop 1", "Stop 2", "Stop 3"],
    },
    {
      id: 2,
      name: "Route B",
      stops: ["Stop 4", "Stop 5", "Stop 6"],
    },
  ]);

  const [newRouteName, setNewRouteName] = useState("");
  const [newStop, setNewStop] = useState("");
  const [selectedRoute, setSelectedRoute] = useState(null);

  // Add new route
  const addRoute = () => {
    if (newRouteName.trim() === "") return;
    const newRoute = {
      id: Date.now(),
      name: newRouteName,
      stops: [],
    };
    setRoutes([...routes, newRoute]);
    setNewRouteName("");
  };

  // Add stop to selected route
  const addStop = () => {
    if (!selectedRoute || newStop.trim() === "") return;
    setRoutes(
      routes.map((route) =>
        route.id === selectedRoute
          ? { ...route, stops: [...route.stops, newStop] }
          : route
      )
    );
    setNewStop("");
  };

  // Remove stop
  const removeStop = (routeId, stopIndex) => {
    setRoutes(
      routes.map((route) =>
        route.id === routeId
          ? {
              ...route,
              stops: route.stops.filter((_, index) => index !== stopIndex),
            }
          : route
      )
    );
  };

  // Remove route
  const removeRoute = (id) => {
    setRoutes(routes.filter((route) => route.id !== id));
  };

  return (
    <div className="route-management">
      <h2>Route Management</h2>

      {/* Add Route */}
      <div className="add-route">
        <input
          type="text"
          placeholder="Enter route name"
          value={newRouteName}
          onChange={(e) => setNewRouteName(e.target.value)}
        />
        <button onClick={addRoute}>Add Route</button>
      </div>

      {/* Add Stop */}
      <div className="add-stop">
        <select
          value={selectedRoute || ""}
          onChange={(e) => setSelectedRoute(Number(e.target.value))}
        >
          <option value="">Select Route</option>
          {routes.map((route) => (
            <option key={route.id} value={route.id}>
              {route.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Enter stop name"
          value={newStop}
          onChange={(e) => setNewStop(e.target.value)}
        />
        <button onClick={addStop}>Add Stop</button>
      </div>

      {/* Route List */}
      <ul className="route-list">
        {routes.map((route) => (
          <li key={route.id}>
            <div className="route-header">
              <span>{route.name}</span>
              <button onClick={() => removeRoute(route.id)}>Remove Route</button>
            </div>
            <ul className="stop-list">
              {route.stops.map((stop, index) => (
                <li key={index}>
                  {stop}
                  <button onClick={() => removeStop(route.id, index)}>
                    Remove Stop
                  </button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RouteManagement;