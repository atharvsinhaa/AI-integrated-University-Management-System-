import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
// import '../styles/Calendar.css';

const MyCalendar = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div className="flex-grow-1 border">
    <div className="container p-4">
      <div className="row justify-content-end bg-light-subtle bg-gradient border border-light">
        <div className="col-lg-11 col-md-11 col-sm-12">
          <div className="text-center text-dark w-100">
            <div className="d-flex  align-items-center mb-1">
              <p className="text-dark fs-4 mb-0">Schedule</p>
            </div>
            <p className="mb-2" style={{ marginRight: "10rem" }}>
              {date.toDateString()}
            </p>
            <Calendar
              className="calendar-container text-black border border-primary"
              onChange={setDate}
              value={date}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default MyCalendar;
