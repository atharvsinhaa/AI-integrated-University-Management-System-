import React from "react";
// import "../styles/Sidebar.css";
import Vit_logo from "../assets/Vit_logo.png";
import { Link } from "react-router-dom";
import useUserRole from "../context/useUserRole";

function Sidebar({ onLogout }) {

  const {role} = useUserRole();

  let buttons = [];

  if (role === "faculty") {
     buttons = [
      { label: "Home", path: "/dashboard" },
      { label: "Attendance", path: "/dashboard/attendance" },
      { label: "Leave", path: "/dashboard/leave" },
      // { label: "Grades", path: "/dashboard/grades" },
      { label: "Profile", path: "/dashboard/profile" },
      // { label: "Timetable", path: "/dashboard/timetable" },
      // { label: "Courses", path: "/dashboard/courses" },
      { label: "Project", path: "/dashboard/project" },
    ];
  }else{

   buttons = [
    { label: "Home", path: "/dashboard" },
    { label: "Attendance", path: "/dashboard/attendance" },
    { label: "Leave", path: "/dashboard/leave" },
    // { label: "Grades", path: "/dashboard/grades" },
    { label: "Profile", path: "/dashboard/profile" },
    { label: "Timetable", path: "/dashboard/timetable" },
    { label: "Courses", path: "/dashboard/courses" },
    { label: "Project", path: "/dashboard/project" },
  ];}

  return (
    // <div className="sidebar">
    <div className="flex-shrink-0 border position-sticky p-3">
      {/* <div className="bg-light border-end position-fixed vh-100 p-3" style={{ width: "250px" }}> */}
      <div
        className="d-flex flex-column align-items-center"
        style={{ height: "94.14", width: "13rem" }}
      >
        <div>
          <img
            src={Vit_logo}
            alt="Vit logo"
            style={{ maxHeight: "8rem", marginTop: "1.5rem", marginBottom:"-1rem" }}
          />
        </div>
        <div className="mt-5 w-100 px-3">
          {buttons.map((btn, idx) => (
            <Link
              key={idx}
              to={btn.path}
              className="btn btn-outline-light w-100 mb-3 text-black text-decoration-none"
            >
              {btn.label}
            </Link>
          ))}
          <button
            className="btn btn-danger w-100 mt-3"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
    // </div>
  );
}

export default Sidebar;
