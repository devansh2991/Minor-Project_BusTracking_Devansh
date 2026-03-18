import React, { useState } from "react";
import "./StudentManagement.css";

const StudentManagement = () => {
  const [students, setStudents] = useState([
    { id: 1, name: "Aarav Sharma", address: "Morena", feesPaid: true },
    { id: 2, name: "Priya Verma", address: "Anand Nagar", feesPaid: false },
    { id: 3, name: "Rohan Patel", address: "Phoolbagh", feesPaid: true },
  ]);

  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentAddress, setNewStudentAddress] = useState("");
  const [feesPaid, setFeesPaid] = useState(false);

  const addStudent = () => {
    if (newStudentName.trim() === "" || newStudentAddress.trim() === "") return;
    const newStudent = {
      id: Date.now(),
      name: newStudentName,
      address: newStudentAddress,
      feesPaid,
    };
    setStudents([...students, newStudent]);
    setNewStudentName("");
    setNewStudentAddress("");
    setFeesPaid(false);
  };

  const toggleFees = (id) => {
    setStudents(
      students.map((student) =>
        student.id === id ? { ...student, feesPaid: !student.feesPaid } : student
      )
    );
  };

  const removeStudent = (id) => {
    setStudents(students.filter((student) => student.id !== id));
  };

  return (
    <div className="student-management">
      <h2>Student Management</h2>

      <div className="add-student">
        <input
          type="text"
          placeholder="Enter student name"
          value={newStudentName}
          onChange={(e) => setNewStudentName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter student address"
          value={newStudentAddress}
          onChange={(e) => setNewStudentAddress(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={feesPaid}
            onChange={(e) => setFeesPaid(e.target.checked)}
          />
          Fees Paid
        </label>
        <button onClick={addStudent}>Add Student</button>
      </div>

      <ul className="student-list">
        {students.map((student) => (
          <li key={student.id} className={!student.feesPaid ? "fees-due" : ""}>
            <div className="student-info">
              <span>{student.name}</span>
              <span className="address">({student.address})</span>
            </div>
            <div className="student-actions">
              <button onClick={() => toggleFees(student.id)}>
                {student.feesPaid ? "Mark Fees Due" : "Mark Fees Paid"}
              </button>
              <button onClick={() => removeStudent(student.id)}>Remove</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentManagement;