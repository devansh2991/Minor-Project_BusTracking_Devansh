const socket = io();

if(navigator.geolocation){
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit('locationUpdate', 
            { 
                latitude: latitude, 
                longitude: longitude
            });
    },
    (error) => {
        console.error('Error getting location:', error);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }
    );
}

const map = L.map('map').setView([26.2183, 78.1828], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; Minor Project'
}).addTo(map);

const markers = {};

socket.on('receiveLocation', (data) => {
    const { id, latitude, longitude } = data;
    map.setView([latitude, longitude]);
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    }   else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

socket.on('userDisconnected', (data) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});