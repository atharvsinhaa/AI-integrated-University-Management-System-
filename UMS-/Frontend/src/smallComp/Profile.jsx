import React, { useContext, useEffect } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import ProfileContext from "../context/ProfileContext";
import defaultProfile from "../assets/profile.jpeg"; // Default profile image
// import '../styles/MainContent.css';

const Profile = () => {
  const context = useContext(ProfileContext);
  const { ProfileDetails, fetchProfile } = context;

  // Fetch profile details when the component mounts
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <div className="content">
    <Container className="py-3 mx-3 my-3 h-25" style={{ width: "100%" }}>
      <Row className="align-items-center"> {/* Align items vertically in center */}
        <Col xs="auto"> {/* Auto width for image */}
          <Image
            src={ProfileDetails?.avatar || defaultProfile}
            roundedCircle
            width={60} // Adjusted for better spacing
            height={60}
            style={{ objectFit: "cover" }} // Ensures proper cropping
          />
        </Col>
        <Col> {/* Text area */}
          <p style={{ margin: 0, fontWeight: "bold", fontSize: "15px" }}>
            {ProfileDetails?.fullName || "Loading..."}
          </p>
          <p style={{ margin: 0, fontSize: "12px", color: "#6c757d" }}> {/* Slightly gray text for username */}
            {ProfileDetails?.username?.username?.toUpperCase() || "Loading..."}
          {/* {console.log(
  `ProfileDetails:\n${JSON.stringify(ProfileDetails, null, 2)}\n\n` +
  `ProfileDetails.username:\n${JSON.stringify(ProfileDetails?.username, null, 2)}\n\n` +
  `ProfileDetails.username.username:\n${ProfileDetails?.username?.username}`)} */}
          </p>
        </Col>
      </Row>
    </Container>
    </div>
  );
};

export default Profile;
