import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./App.css";

import Login from "./component/Login.jsx";
import Sidebar from "./component/Sidebar.jsx";
import MainContent from "./component/MainContent.jsx";
import MyCalendar from "./component/MyCalendar.jsx";
import UserPage from "./component/UserPage.jsx";

import ProfileState from "./context/profileState.jsx";
import UserRoleProvider from "./context/UserRoleState.jsx";
import ProjectState from './context/ProjectState.jsx'; // Check for correct path
import UserState from './context/UserState.jsx'; // Check for correct path
import ProjectMarksState from "./context/ProjectMarksState.jsx";
import { LeaveProvider } from "./context/LeaveContext";

import Profile from "./smallComp/Profile.jsx";
import Register from "./component/Register";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // Store user details
  const location = useLocation(); // Get the current location

  // Check if the user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/users/me", {
          withCredentials: true, // Send cookies with the request
        });
        if (response.status === 200) {
          setIsLoggedIn(true);
          setUser(response.data.user); // Store user details
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8000/api/v1/users/logout", {}, {
        withCredentials: true,
      });
      setIsLoggedIn(false);
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <UserRoleProvider>
      <UserState>
        <ProjectState>
        <ProjectMarksState>
          <ProfileState>
            <LeaveProvider>
            {/* <Router> */}
              <Routes>
                {/* Default route: Show UserPage first */}
                <Route
                  path="/"
                  element={isLoggedIn ? <Navigate to="/dashboard" /> : <UserPage />}
                />
                <Route path="/register" element={<Register/>} />

                {/* Login route */}
                <Route
                  path="/login"
                  element={
                    !isLoggedIn ? (
                      <Login onLogin={() => setIsLoggedIn(true)} />
                    ) : (
                      <Navigate to="/dashboard" />
                    )
                  }
                />

                {/* Dashboard route */}
                <Route
                  path="/dashboard/*"
                  element={
                    isLoggedIn ? (
                      <div className="dashboard">
                        <Sidebar onLogout={handleLogout} />
                        <div className="content-container">
                          <Profile user={user} className="small-profile" />
                          <MainContent onLogout={handleLogout} className="main-content" />
                        </div>
                        {/* Conditionally render MyCalendar only on /dashboard */}
                        {location.pathname === "/dashboard" && (
                          <MyCalendar className="calendar" />
                        )}
                      </div>
                    ) : (
                      <Navigate to="/userPage" /> // Redirect to login if not logged in
                    )
                  }
                />

                {/* Catch-all route for other pages */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            {/* </Router> */}
            </LeaveProvider>
          </ProfileState>
        </ProjectMarksState>
        </ProjectState>
      </UserState>
    </UserRoleProvider>
  );
}

export default App;
