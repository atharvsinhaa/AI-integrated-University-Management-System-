import React from "react";
import { Routes, Route } from "react-router-dom";
import Attendance from "../Rasta/Attendance.jsx";
import Leave from "../Rasta/Leave.jsx";
import Grades from "../Rasta/Grades.jsx";
import Timetable from "../Rasta/Timetable.jsx";
import Courses from "../Rasta/Courses.jsx";
import Project from "../Rasta/Project.jsx";
import Home from "../Rasta/Home.jsx";
import Profile from "../component/Profile.jsx";
// import Register from "./Register.jsx";
// import ProfileState from "../context/profileState.jsx";
// import "../styles/MainContent.css";

function MainContent() {
  return (
    <div>
      {/* <ProfileState> */}
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="leave" element={<Leave />} />
          <Route path="grades" element={<Grades />} />
          <Route path="timetable" element={<Timetable />} />
          <Route path="courses" element={<Courses />} />
          <Route path="project" element={<Project />} />
          {/* <Route path="register" element={<Register/>} /> */}
        </Routes>
      {/* </ProfileState> */}
    </div>
  );
}

export default MainContent;
