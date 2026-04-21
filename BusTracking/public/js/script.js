const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("locationUpdate", { latitude, longitude });
    },
    (error) => {
      console.error("Error getting location:", error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
}


const buildingIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/619/619034.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -30],
});

const busIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/4550/4550719.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -30],
  name: "MP07CD1234",
});

const stopIcon = L.icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [32, 32],
});


const map = L.map("map").setView([26.2183, 78.1828], 12);

const googleStreets = L.tileLayer(
  "https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
  {
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
    attribution: '<a href="https://google.com" target="_blank">Google</a>',
  }
);
googleStreets.addTo(map);

const markers = {};

const uniStop = {
  name: "ITM University parking",
  lat: 26.136724,
  lng: 78.209814,
};

const stops = [
  { name: "Anand Nagar",     lat: 26.234932, lng: 78.154110 },
  { name: "Bahodapur",       lat: 26.224988, lng: 78.151571 },
  { name: "Sagartal",        lat: 26.241513, lng: 78.156418 },
  { name: "Purani Chhawani", lat: 26.268600, lng: 78.134479 },
  { name: "Jalalpur",        lat: 26.258091, lng: 78.161331 },
];

L.marker([uniStop.lat, uniStop.lng], { icon: buildingIcon })
  .addTo(map)
  .bindPopup(uniStop.name);

stops.forEach((stop) => {
  L.marker([stop.lat, stop.lng], { icon: stopIcon })
    .addTo(map)
    .bindPopup(stop.name);
});


socket.on("receiveLocation", (data) => {
  const { id, latitude, longitude } = data;

  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude], { icon: busIcon }).addTo(map);
  }
});

socket.on("userDisconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});