import { useState, useCallback, useContext, useEffect } from "react";
import axios from "axios";
import UserContext from "./UserContext";
import UserRoleContext from "./UserRoleContext"; // Import role context

const UserState = (props) => {
  const host = "http://localhost:8000";
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setRole } = useContext(UserRoleContext); // Get setRole from context

  const fetchUserDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${host}/api/v1/users/me`, {
        withCredentials: true,
      });

      console.log("here it is: ", response.data.data);

      setUser(response.data.data);
      setRole(response.data.data.role); // ✅ Update role here
    } catch (error) {
      setError("Failed to fetch user details.");
    } finally {
      setLoading(false);
    }
  }, [setRole]);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  // ✅ New signup function inside context
  const signupUser = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const formDataObj = new FormData();
      for (let key in formData) {
        formDataObj.append(key, formData[key]);
      }

      const response = await axios.post(`${host}/api/v1/users/register`, formDataObj, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      setUser(response.data.data);
      setRole(response.data.data.role);
      return { success: true };
    } catch (err) {
      console.log("hi")
      setError(err.response?.data?.message || "Something went wrong!");
      console.log(err.response.data.message)
      return { success: false, message: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ user, fetchUserDetails, signupUser, loading, error }}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserState;
