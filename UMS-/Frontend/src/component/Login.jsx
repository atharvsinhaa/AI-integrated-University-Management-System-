import React, { useState } from "react";
import { Link } from "react-router-dom";
import useUserRole from "../context/useUserRole";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import "../styles/Login.css";

const Login = ({ onLogin }) => {
  const [cred, setCred] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const { role } = useUserRole(); 

  const handleChange = (e) => {
    setCred({ ...cred, [e.target.name] : e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/login",
        {
          username: cred.username,
          password: cred.password,
        },
        { withCredentials: true }
      );

      if (response.data.data.user.role !== role) {
        setAlert({ type: "danger", message: "Invalid credentials" });
        return;
      }

      setAlert({ type: "success", message: "Login successful! Redirecting..." });
      setTimeout(onLogin, 500);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Invalid credentials. Please try again.";
      setAlert({ type: "danger", message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form">
    <div className="login-container">
      <Card className="login-card shadow-lg">
        <Card.Body>
          <h2 className="text-center mb-4">Login</h2>
          {alert && <Alert variant={alert.type}>{alert.message}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                placeholder="Enter username"
                value={cred.username}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter password"
                value={cred.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span> Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </Form>

          <div className="text-center mt-3">
            <span>Not registered? </span>
            <Link to="/register" className="text-primary fw-bold">
              Sign up here
            </Link>
          </div>
        </Card.Body>
      </Card>
    </div></div>
  );
};

export default Login;
