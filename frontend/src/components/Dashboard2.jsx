import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [totalWorkingDays, setTotalWorkingDays] = useState(0);

  useEffect(() => {
    // Fetch attendance records from backend
    const fetchAttendanceRecords = async () => {
      try {
        const response = await fetch('/api/attendance/records');
        const data = await response.json();
        
        setAttendanceRecords(data.records);
        setTotalWorkingDays(data.totalWorkingDays);
      } catch (error) {
        console.error("Error fetching attendance records", error);
      }
    };

    fetchAttendanceRecords();
  }, []);

  return (
    <div>
      <h2>Attendance Dashboard</h2>
      <div>
        <h3>Total Working Days: {totalWorkingDays}</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Check-in Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.map((record, index) => (
              <tr key={index}>
                <td>{new Date(record.timestamp).toLocaleDateString()}</td>
                <td>{new Date(record.timestamp).toLocaleTimeString()}</td>
                <td>{record.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
