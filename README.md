# Smart Bus Management and Tracking System

This is a MERN stack project for managing and tracking buses in a school/college environment. It helps in handling drivers, buses, and students who are enrolled in the bus facility.

The system also shows the live location of buses on a map using Leaflet.

## Features

* Add and manage drivers, buses, and students
* Assign buses to drivers
* Toggle availability of drivers and buses
* Track live bus location on map
* Admin panel to control everything

## Tech Stack

* Frontend: React (Admin Panel)
* Backend: Node.js and Express
* Database: MongoDB
* Map: Leaflet

## Project Structure

* backend → contains server code
* admin-panel → React frontend

## How to Run

First install dependencies in both folders:

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd admin-panel
npm install
```

Run the project:

Start backend:

```bash
cd backend
node app.js
```

Start frontend:

```bash
cd admin-panel
npm start
```

## Map Integration

Leaflet is used to show the live location of buses. It helps in tracking the current position in real time (still improving this part).

## Status

The project is still in progress and being refined. Some features are working, and some are being improved.

## Author

Devansh Kushwah
