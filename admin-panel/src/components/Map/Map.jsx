import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useLoadScript } from "@react-google-maps/api";
import { divIcon } from "leaflet";
import { io } from "socket.io-client";
import "leaflet/dist/leaflet.css";
import "./Map.css";

const GOOGLE_API_KEY = "AIzaSyAPucUWJfNPjxOXIoYJUgEMPrkl1LIWf78";
const libraries = ["places"];
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

const driverMarkerIcon = divIcon({
  className: "driver-marker-icon",
  html: '<span class="driver-marker-dot"></span>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const MapPage = ({ embedded = false }) => {
  const [stops, setStops] = useState([]);
  const [position, setPosition] = useState([26.2183, 78.1828]);
  const [addMode, setAddMode] = useState(false);
  const [liveDrivers, setLiveDrivers] = useState({});
  const searchInputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const manualViewRef = useRef(false);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_API_KEY,
    libraries,
  });

  useEffect(() => {
    if (!isLoaded || !searchInputRef.current || autocompleteRef.current || !window.google?.maps?.places) {
      return;
    }

    autocompleteRef.current = new window.google.maps.places.Autocomplete(searchInputRef.current);
    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current.getPlace();
      if (!place?.geometry) return;

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      manualViewRef.current = true;
      setPosition([lat, lng]);
      setStops((prev) => [...prev, { lat, lng }]);
    });
  }, [isLoaded]);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
    });

    socket.on("receiveLocation", (data) => {
      const { id, latitude, longitude } = data;

      if (typeof latitude !== "number" || typeof longitude !== "number") {
        return;
      }

      setLiveDrivers((prev) => ({
        ...prev,
        [id]: {
          id,
          lat: latitude,
          lng: longitude,
          updatedAt: Date.now(),
        },
      }));

      if (!manualViewRef.current) {
        setPosition([latitude, longitude]);
      }
    });

    socket.on("userDisconnected", (id) => {
      setLiveDrivers((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  function LocationMarker() {
    useMapEvents({
      click(e) {
        if (!addMode) return;

        manualViewRef.current = true;

        const newStop = {
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        };

        setStops((prev) => [...prev, newStop]);
        setAddMode(false);
      },
    });
    return null;
  }

  const MapUpdater = () => {
    const map = useMap();

    useEffect(() => {
      map.setView(position, 15);
    }, [map, position]);

    return null;
  };

  if (!isLoaded) return <div>Loading...</div>;

  const liveDriverList = Object.values(liveDrivers);

  return (
    <div className={`map-container ${embedded ? "map-embedded" : ""}`}>
      
      <div className="search-box">
        <input
          type="text"
          placeholder="Search place"
          ref={searchInputRef}
        />

        <button onClick={() => setAddMode(true)}>
          {addMode ? "Click on Map..." : "Add Stop"}
        </button>

        <span className="driver-count">Live drivers: {liveDriverList.length}</span>
      </div>

      <MapContainer
        center={position}
        zoom={13}
        style={{ height: embedded ? "420px" : "100vh", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />

        <MapUpdater />
        <LocationMarker />

        {stops.map((stop, index) => (
          <Marker key={index} position={[stop.lat, stop.lng]}>
            <Popup>
              Stop {index + 1} <br />
              {stop.lat.toFixed(4)}, {stop.lng.toFixed(4)}
            </Popup>
          </Marker>
        ))}

        {liveDriverList.map((driver) => (
          <Marker key={driver.id} position={[driver.lat, driver.lng]} icon={driverMarkerIcon}>
            <Popup>
              <strong>Driver location</strong>
              <br />
              {driver.id}
              <br />
              {driver.lat.toFixed(5)}, {driver.lng.toFixed(5)}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapPage;