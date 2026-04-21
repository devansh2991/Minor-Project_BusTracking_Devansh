import React, { useState, useEffect } from "react";
import "./RouteManagement.css";

const RouteManagement = () => {
  const [routes, setRoutes] = useState([]);
  const [newRouteName, setNewRouteName] = useState("");
  const [newStops, setNewStops] = useState("");

  const fetchRoutes = async () => {
    try {
      const res = await fetch("http://localhost:3000/getroutes");
      const data = await res.json();
      if (res.ok) {
        setRoutes(
          (data.data ?? data).map((r) => ({
            ...r,
            stops: r.stops ?? [],
          }))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const addRoute = async () => {
    if (!newRouteName) return alert("Enter route name");
    const res = await fetch("http://localhost:3000/addroute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ routeName: newRouteName }),
    });
    const routeData = await res.json();
    setRoutes((prev) => [
      ...prev,
      { ...routeData, stops: routeData.stops ?? [] },
    ]);
    setNewRouteName("");
  };

  const addStop = async (routeId, stopName) => {
    if (!routeId) return alert("Enter stop name");

    try {
      const res = await fetch(`http://localhost:3000/addstop/${routeId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: stopName }),
      });

      const stopData = await res.json();

      setRoutes((prev) =>
        prev.map((route) =>
          route._id === routeId
            ? {
              ...route,
              stops: [...route.stops, stopData.data],
            }
            : route
        )
      );

      setNewStops((prev) => ({ ...prev, [routeId]: "" }));
      
    } catch (err) {
      console.error(err);
    }
  };

const removeStop = async (routeId, index) => {
  try {
    await fetch(
      `http://localhost:8000/deletestop/${routeId}/${index}`,
      { method: "DELETE" }
    );

    setRoutes((prev) =>
      prev.map((route) =>
        route._id === routeId
          ? {
              ...route,
              stops: route.stops.filter((_, i) => i !== index),
            }
          : route
      )
    );
  } catch (err) {
    console.error(err);
  }
};

  const removeRoute = async (id) => {
    await fetch(`http://localhost:3000/deleteroute/${id}`, {
      method: "GET",
    });
    setRoutes((prev) => prev.filter((route) => route._id !== id));
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

      <ul className="route-list">
        {routes.map((route) => (
          <li key={route._id}>
            <div className="route-header">
              <span>{route.routeName}</span>
              <div className="left-sec">
              
              <button onClick={() => removeRoute(route._id)}>
                Remove Route
              </button>

              </div>
            </div>

            <ul className="stop-list">
              {route.stops.map((stop, index) => (
                <li key={index}>
                  {stop}
                  <button onClick={() => removeStop(route._id, index)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div className="add-stop">
              <input
                type="text"
                placeholder="Enter stop name"
                value={newStops[route._id] || ""}
                onChange={(e) =>
                  setNewStops((prev) => ({
                    ...prev,
                    [route._id]: e.target.value,
                  }))
                }
              />
              <button onClick={() => addStop(route._id, newStops[route._id])}>
                Add Stop
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RouteManagement;