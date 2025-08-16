import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import '../styles/Register.css'

const Register = () => {
  const navigate = useNavigate();
  const { signupUser, loading } = useContext(UserContext);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    role: "student",
    avatar: null,
  });

  const [localError, setLocalError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, avatar: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    const result = await signupUser(formData);
    if (result.success) {
      navigate("/dashboard");
    } else {
      console.log("message:", result.message, formData);
      setLocalError(result.message);
    }
  };

  return (
    <div className="user-container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ width: "500px" }}>
        <h2 className="text-center mb-4">Sign Up</h2>

        {localError && <div className="alert alert-danger">{localError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="fullName"
              className="form-control"
              placeholder=""
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="X@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              name="username"
              className="form-control"
              placeholder="Username/Registration No"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Profile Picture</label>
            <input type="file" name="avatar" className="form-control" onChange={handleFileChange} />
          </div>

          <div className="mb-3">
            <label className="form-label">Role</label>
            <select name="role" className="form-select" value={formData.role} onChange={handleChange}>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Admin</option>
              <option value="parent">Parent</option>
              <option value="alumni">Alumni</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span> Signing up...
              </>
            ) : (
              <>Sign Up</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
