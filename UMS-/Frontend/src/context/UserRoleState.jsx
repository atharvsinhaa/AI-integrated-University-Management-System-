import React, { useState, useEffect } from "react";
import UserRoleContext from "./UserRoleContext";

const UserRoleState = ({ children }) => {
  const [role, setRole] = useState(localStorage.getItem("userRole") || ""); // Load role from storage

  useEffect(() => {
    localStorage.setItem("userRole", role); // Persist role after setting it
  }, [role]);

  return (
    <UserRoleContext.Provider value={{ role, setRole }}>
      {children}
    </UserRoleContext.Provider>
  );
};

export default UserRoleState;
