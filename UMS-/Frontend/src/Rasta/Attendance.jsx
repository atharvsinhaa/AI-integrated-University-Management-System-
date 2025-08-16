import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Container, Table } from 'react-bootstrap';

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    // Fetch the CSV file from public directory
    fetch('../attendance.csv')
      .then((response) => response.text()) // Get the CSV file as text
      .then((csvData) => {
        // Parse the CSV data using PapaParse
        Papa.parse(csvData, {
          complete: (result) => {
            const parsedData = result.data.map((row) => ({
              name: row.Name,
              date: row.Date,
              time: row.Time,
            }));
            setAttendanceData(parsedData); // Set parsed data into state
          },
          header: true, // Use header row for mapping
          skipEmptyLines: true, // Skip empty lines
        });
      })
      .catch((error) => {
        console.error('Error loading the CSV file:', error);
      });
  });

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4 fw-bold">📅 Attendance Records</h2>
      <Table bordered hover responsive className="text-center shadow-sm">
        <thead>
          <tr className="bg-primary text-dark">
            <th>Name</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {attendanceData.length > 0 ? (
            attendanceData.map((entry, index) => (
              <tr key={index}>
                <td>{entry.name}</td>
                <td>{entry.date}</td>
                <td>{entry.time}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No data available</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default Attendance;
