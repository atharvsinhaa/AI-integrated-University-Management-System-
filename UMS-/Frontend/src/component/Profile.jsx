import React, { useContext, useEffect, useState } from "react";
import ProfileContext from "../context/ProfileContext";

const Profile = () => {
  const { ProfileDetails, fetchProfile, updateProfile, loading, error } = useContext(ProfileContext);
  const [updatedData, setUpdatedData] = useState({}); //state for fullname updation
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // eslint-disable-next-line no-unused-vars
  const handleInputChange = (e) => {
    setUpdatedData({ ...updatedData, [e.target.name]: e.target.value });
  };
  // function to update fullname

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setSelectedImage(URL.createObjectURL(file)); // Preview Image
    }
  };

  const handleSubmit = () => {
    updateProfile(updatedData, selectedFile);
  };

  return (
    <div style={styles.profileContainer}>
      <div style={styles.detailsContainer}>
        <h2 style={styles.name}>{ProfileDetails?.fullName || "Loading..."}</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <p><strong>Email:</strong> {ProfileDetails?.email || "Loading..."}</p>
        <p><strong>Role:</strong> {ProfileDetails?.username?.role || "Loading..."}</p>
        <p><strong>Department:</strong> {ProfileDetails?.department || "Loading..."}</p>
        <p><strong>Gender:</strong> {ProfileDetails?.gender || "Loading..."}</p>
        <p><strong>Account Created:</strong> {new Date(ProfileDetails?.createdAt).toLocaleDateString() || "Loading..."}</p>
        {/* Frontend to update fullName */}
        {/* <input
          type="text"
          name="fullName"
          placeholder="Update Full Name"
          onChange={handleInputChange}
          style={styles.inputField}
        /> */}  
      </div>

      <div style={styles.imageContainer}>
        <input type="file" accept="image/*" onChange={handleFileChange} style={styles.fileInput} />
        <img
          src={selectedImage || ProfileDetails?.avatar}
          alt="Profile"
          style={styles.profileImage}
        />
        <button onClick={handleSubmit} disabled={loading} style={styles.updateButton}>
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </div>
    </div>
  );
};

const styles = {
  profileContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 200px",
    gap: "20px",
    padding: "20px",
    alignItems: "center",
    maxWidth: "600px",
    margin: "20px auto",
    border: "1px solid #ddd",
    borderRadius: "10px",
    boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
  },
  detailsContainer: {
    textAlign: "left",
  },
  name: {
    marginBottom: "10px",
    fontSize: "24px",
    fontWeight: "bold",
  },
  imageContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  fileInput: {
    marginBottom: "10px",
    cursor: "pointer",
  },
  profileImage: {
    width: "150px",
    height: "150px",
    objectFit: "cover",
    borderRadius: "10px",
    border: "2px solid #ccc",
  },
  inputField: {
    marginBottom: "10px",
    padding: "8px",
    width: "100%",
    boxSizing: "border-box",
  },
  updateButton: {
    padding: "10px 20px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Profile;
