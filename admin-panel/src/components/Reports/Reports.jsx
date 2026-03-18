import React, { useState } from "react";
import "./Reports.css";

const Reports = () => {
  const [reports, setReports] = useState([
    {
      id: 1,
      studentName: "Aarav Sharma",
      busId: "Bus-101",
      issue: "Bus arrived late today",
      status: "Pending",
      reportedAt: "10:45 AM",
    },
    {
      id: 2,
      studentName: "Priya Verma",
      busId: "Bus-205",
      issue: "Driver skipped my stop",
      status: "Resolved",
      reportedAt: "10:50 AM",
    },
  ]);

  const [newStudentName, setNewStudentName] = useState("");
  const [newBusId, setNewBusId] = useState("");
  const [newIssue, setNewIssue] = useState("");

  const addReport = () => {
    if (!newStudentName || !newBusId || !newIssue) return;
    const newReport = {
      id: Date.now(),
      studentName: newStudentName,
      busId: newBusId,
      issue: newIssue,
      status: "Pending",
      reportedAt: new Date().toLocaleTimeString(),
    };
    setReports([...reports, newReport]);
    setNewStudentName("");
    setNewBusId("");
    setNewIssue("");
  };

  const toggleStatus = (id) => {
    setReports(
      reports.map((report) =>
        report.id === id
          ? {
              ...report,
              status: report.status === "Pending" ? "Resolved" : "Pending",
            }
          : report
      )
    );
  };

  const removeReport = (id) => {
    setReports(reports.filter((report) => report.id !== id));
  };

  return (
    <div className="reports">
      <h2>Student Concerns & Bus Reports</h2>
      <table>
        <thead>
          <tr>
            <th>Student</th>
            <th>Bus ID</th>
            <th>Issue</th>
            <th>Status</th>
            <th>Reported At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id}>
              <td>{report.studentName}</td>
              <td>{report.busId}</td>
              <td>{report.issue}</td>
              <td
                style={{
                  color: report.status === "Resolved" ? "green" : "red",
                  fontWeight: "bold",
                }}
              >
                {report.status}
              </td>
              <td>{report.reportedAt}</td>
              <td>
                <button onClick={() => toggleStatus(report.id)}>
                  {report.status === "Pending" ? "Mark Resolved" : "Reopen"}
                </button>
                <button onClick={() => removeReport(report.id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Reports;