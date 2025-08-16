import { useState, useCallback } from "react";
import axios from "axios";
import ProfileContext from "./ProfileContext";

const ProfileState = (props) => {
  const host = "http://localhost:8000";
  const [ProfileDetails, setProfileDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // For error feedback

  // Fetch Profile
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${host}/api/v1/profile/getProfileDetails`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setProfileDetails(response.data.data); // Assuming profile details are in `data`
      console.log("Profile fetched:", response.data.data);
    } catch (error) {
      console.error(
        "Error fetching profile details:",
        error.response?.data || error.message
      );
      setError("Failed to fetch profile details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [host]);

  // Update Profile
  const updateProfile = async (updatedData, avatarFile) => {
    const formData = new FormData();

    // Append all fields to FormData
    Object.keys(updatedData).forEach((key) => {
      if (updatedData[key]) formData.append(key, updatedData[key]);
    });

    // If there's an avatar, append it as well
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    try {
      setLoading(true);
      const response = await axios.put(
        `${host}/api/v1/profile/updateProfileDetails`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setProfileDetails(response.data.data); // Update the profile state with the new profile data
        console.log("Profile updated successfully");
        alert("Profile updated successfully!"); // Success feedback
      }
    } catch (error) {
      console.error(
        "Error updating profile:",
        error.response?.data || error.message
      );
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        ProfileDetails,
        fetchProfile,
        updateProfile,
        loading,
        error, // Expose error state
      }}
    >
      {props.children}
    </ProfileContext.Provider>
  );
};

export default ProfileState;
