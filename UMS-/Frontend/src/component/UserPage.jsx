import useUserRole from "../context/useUserRole"; // Custom hook to access user role context
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FaUserGraduate, FaChalkboardTeacher, FaUsers, FaNetworkWired, FaUserShield } from "react-icons/fa";
// import '../styles/UserPage.css';

const UserPage = () => {
  const { setRole } = useUserRole();
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    setRole(role);
    navigate("/login");
  };

  return (
    <Container className="user-contain d-flex flex-column justify-content-center align-items-center vh-100">
      {/* <div className="Page"> */}
      <h1 className="text-primary fw-bold mb-3">UMS - Select Your Role</h1>
      <p className="text-muted text-center w-75">
        A digital platform for students, faculty, parents, and alumni to access academic and administrative services.
      </p>

      {/* Horizontal row with flex-wrap for responsiveness */}
      <Row className="d-flex flex-row flex-wrap justify-content-center mt-4">
        {[
          { role: "student", icon: <FaUserGraduate />, text: "Student", color: "primary" },
          { role: "faculty", icon: <FaChalkboardTeacher />, text: "Faculty", color: "warning" },
          { role: "admin", icon: <FaUserShield />, text: "Admin", color: "danger", isAdmin: true },
          { role: "parent", icon: <FaUsers />, text: "Parent", color: "success" },
          { role: "alumni", icon: <FaNetworkWired />, text: "Alumni", color: "info" },
        ].map(({ role, icon, text, color, isAdmin }) => (
          <Col key={role} md="auto" className="mb-3">
            <Card className={`border-${color} shadow-lg text-center ${isAdmin ? "bg-danger text-white" : ""}`} style={{ width: "12rem" }}>
              <Card.Body>
                <div className={`display-4 mb-2 ${isAdmin ? "text-white" : `text-${color}`}`}>{icon}</div>
                <Card.Title className={`fw-bold ${isAdmin ? "text-white" : `text-${color}`}`}>{text}</Card.Title>
                <Button variant={isAdmin ? "light" : color} className="mt-2 w-100 fw-bold" onClick={() => handleRoleSelection(role)}>
                  Login
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <footer className="mt-4 text-muted">&copy; 2025 University Management System</footer>
      {/* </div> */}
    </Container>
  );
};

export default UserPage;
