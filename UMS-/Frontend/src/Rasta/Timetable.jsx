import React from "react";
import { Container, Table } from "react-bootstrap";

const Timetable = () => {
  const timeSlots = ["08:30 - 10:00", "10:05 - 11:35", "11:40 - 13:10", "Lunch", "13:15 - 14:45", "14:50 - 16:20"];
  const data = [
    ["A11", "B11-MAT3002", "C11-CSE2006", "Lunch", "A21-CSE3003", "A14"],
    ["D11", "E11-CSE3006", "F11-CSD3009", "Lunch", "D21", "E14"],
    ["A12", "B12-MAT3002", "C12", "Lunch", "A22-CSE3003", "B14-CSD3009"],
    ["D12", "E12-CSE3006", "F12-CSD3009", "Lunch", "D22", "F14-CSE0002"],
    ["A13", "B13", "C13-CSE2006", "Lunch", "A23-CSE3003", "C14-CSE3006"],
    ["D13", "E13", "F13", "Lunch", "D23", "D14"],
  ];

  const highlightColor = "bg-info"; // Color for highlighting cells

  // Function to randomly pick 1 to 3 cells in each row (except last row)
  const getRandomCells = () => {
    const randomCount = Math.floor(Math.random() * 3) + 1; // Random number between 1 and 3
    const cellsToHighlight = new Set();

    // Ensure we pick cells from the first 4 columns only (index 0 to 3)
    while (cellsToHighlight.size < randomCount) {
      const randomIndex = Math.floor(Math.random() * 4); // Random index between 0 and 3
      cellsToHighlight.add(randomIndex);
    }

    return [...cellsToHighlight]; // Return as an array
  };

  return (
    <Container className="my-5">
      <h2 className="mb-1 fw-bold">📅 My Timetable</h2>
      <Table bordered hover responsive className="text-center shadow-sm">
        <thead>
          <tr className="bg-primary text-white">
            {timeSlots.map((slot, i) => (
              <th key={i} className="p-3">{slot}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => {
            // Skip coloring for the last row (Sunday)
            if (i === 5) {
              return (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} className={`p-3 ${cell === "Lunch" ? "bg-warning fw-bold" : ""}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              );
            }

            // For all other rows, randomly highlight up to 3 cells
            const highlightedCells = getRandomCells(); // Get random cells to highlight
            return (
              <tr key={i} className={i % 2 === 0 ? "table-light" : ""}>
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className={`p-3 ${highlightedCells.includes(j) && cell !== "Lunch" ? highlightColor : ""} ${cell === "Lunch" ? "bg-warning fw-bold" : ""}`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
};

export default Timetable;
