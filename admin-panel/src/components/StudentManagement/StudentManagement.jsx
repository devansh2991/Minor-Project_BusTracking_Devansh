import React, { useState, useEffect } from "react";
import "./StudentManagement.css";

const StudentManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUserId, setNewUserId] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [newUserAddress, setNewUserAddress] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:3000/getusers");
      const data = await res.json();
      if (res.ok) {
        setUsers(data.data || data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const addUser = async () => {
    if (!newUserId) return alert("Enter Roll No");
    if (!newUserName) return alert("Enter user name");
    if (!newUserAddress) return alert("Enter user address");
    try {
      const res = await fetch("http://localhost:3000/adduser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rollNo: newUserId,
          name: newUserName,
          address: newUserAddress,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, data.data]);
        setNewUserId("");
        setNewUserName("");
        setNewUserAddress("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUser = async (id) => {
    try {
      await fetch(`http://localhost:3000/deleteuser/${id}`, {
        method: "GET",
      });
      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="student-management">
      <h2>Student Management</h2>
      <div className="add-student">
        <input
          type="text"
          placeholder="Search student"
          onChange={(e) => {
            const query = e.target.value.toLowerCase();
            fetchUsers().then(() => {
              setUsers((prev) =>
                prev.filter((user) => user.rollNo.toLowerCase().includes(query))
              );
            });
          }}
          style={{ outline: "none" }}
        />
      </div>

      <div className="add-student">
        <input 
          type="text" 
          placeholder="Enter Roll No"
          value={newUserId}
          onChange={(e) => setNewUserId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Student Name"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Student Address"
          value={newUserAddress}
          onChange={(e) => setNewUserAddress(e.target.value)}
        />
        <button onClick={addUser}>Add User</button>
      </div>

      <ul className="student-list">
        {[...users]
          .sort((a, b) => a.rollNo.localeCompare(b.rollNo))
          .map((user) => (
          <li key={user._id}>
              <span>{user.rollNo} - {user.name}</span>
              <span className="address">({user.address})</span>
              <div className="student-actions">
                <button onClick={() => deleteUser(user._id)}>Delete</button>
              </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentManagement;