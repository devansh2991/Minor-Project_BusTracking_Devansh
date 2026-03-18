import React, { useState } from "react";
import "./RouteManagement.css";

const RouteManagement = () => {
  const [routes, setRoutes] = useState([
    {
      id: 1,
      name: "Anand Nagar",
      stops: ["Bahodapur", "Anand Nagar", "Sagartal Chauraha"],
    },
    {
      id: 2,
      name: "Koteshwar",
      stops: ["S.P. Ashram", "Urvai Gate", "Koteshwar Chauraha"],
    },
  ]);

  const [newRouteName, setNewRouteName] = useState("");
  const [newStop, setNewStop] = useState("");
  const [selectedRoute, setSelectedRoute] = useState(null);

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

  const removeRoute = (id) => {
    setRoutes(routes.filter((route) => route.id !== id));
  };

  return (
    <div className="route-management">
      <h2>Route Management</h2>

      <div className="add-route">
        <input
          type="text"
          placeholder="Enter route name"
          value={newRouteName}
          onChange={(e) => setNewRouteName(e.target.value)}
        />
        <button onClick={addRoute}>Add Route</button>
      </div>

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