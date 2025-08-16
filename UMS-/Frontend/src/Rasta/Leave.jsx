import { useState, useEffect } from "react";
import { useLeave } from "../context/LeaveContext";
import useUserRole from "../context/useUserRole";
import { Modal, Button, Form, Spinner, Badge } from "react-bootstrap";
import { toast } from "react-toastify";

const Leave = () => {
  const { role } = useUserRole();
  const {
    requestLeave,
    leaves = [],
    loading,
    fetchMyLeaves,
    fetchPendingLeaves,
    approveLeave,
    rejectLeave,
    deleteLeave, // 🔹 Added delete function
  } = useLeave();

  const [formData, setFormData] = useState({
    type: "sick",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  // eslint-disable-next-line no-unused-vars
  const [selectedLeave, setSelectedLeave] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [showModal, setShowModal] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [actionType, setActionType] = useState(""); // "approve" or "reject"
  const [showLeaveModal, setShowLeaveModal] = useState(false); // Modal for leave requests

  useEffect(() => {
    if (role === "student") fetchMyLeaves();
    if (role === "faculty") fetchPendingLeaves();
  }, [role]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await requestLeave(formData);
      toast.success("Leave request sent successfully!");
      fetchMyLeaves();
  // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Failed to submit leave request.");
    }
  };
  // eslint-disable-next-line no-unused-vars
  const handleAction = async () => {
    if (!selectedLeave) return;
    try {
      if (actionType === "approve") {
        await approveLeave(selectedLeave._id);
        toast.success("Leave request approved!");
      } else {
        await rejectLeave(selectedLeave._id);
        toast.error("Leave request rejected!");
      }
      fetchPendingLeaves();
  // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Failed to process request!");
    }
    setShowModal(false);
  };

  const handleDelete = async (leaveId) => {
    try {
      await deleteLeave(leaveId);
      toast.success("Leave request deleted successfully!");
      fetchMyLeaves(); // Refresh leave list
  // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Failed to delete leave request.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>{role === "faculty" ? "Leave Requests (Faculty Panel)" : "Request Leave"}</h2>

      {/* Faculty Panel: Show Pending Leave Requests */}
      {role === "faculty" && (
        <>
          <h3>Pending Leave Requests</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Type</th>
                <th>From</th>
                <th>To</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaves.length === 0 ? (
                <tr><td colSpan="7">No pending requests.</td></tr>
              ) : (
                leaves.map((leave) => (
                  <tr key={leave._id}>
                    <td>{leave.student?.fullName || "Unknown"}</td>
                    <td>{leave.type}</td>
                    <td>{new Date(leave.fromDate).toLocaleDateString()}</td>
                    <td>{new Date(leave.toDate).toLocaleDateString()}</td>
                    <td>{leave.reason}</td>
                    <td>
                      {leave.status === "approved" ? (
                        <span className="badge bg-success">Approved</span>
                      ) : leave.status === "rejected" ? (
                        <span className="badge bg-danger">Rejected</span>
                      ) : (
                        <span className="badge bg-warning">Pending</span>
                      )}
                    </td>
                    <td>
                      <button className="btn btn-success btn-sm" onClick={() => approveLeave(leave._id)}>Approve</button>
                      <button className="btn btn-danger btn-sm ms-2" onClick={() => rejectLeave(leave._id)}>Reject</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}

      {/* Student Panel: Leave Request Form */}
      {role === "student" && (
        <Form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm">
          <Form.Group className="mb-3">
            <Form.Label>Leave Type</Form.Label>
            <Form.Select name="type" value={formData.type} onChange={handleChange}>
              <option value="sick">Sick Leave</option>
              <option value="casual">Casual Leave</option>
              <option value="emergency">Emergency Leave</option>
              <option value="academic">Academic Leave</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>From Date</Form.Label>
            <Form.Control type="date" name="fromDate" value={formData.fromDate} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>To Date</Form.Label>
            <Form.Control type="date" name="toDate" value={formData.toDate} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Reason</Form.Label>
            <Form.Control as="textarea" name="reason" value={formData.reason} onChange={handleChange} required />
          </Form.Group>

          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Submit Request"}
          </Button>

          <Button variant="info" className="ms-2" onClick={() => setShowLeaveModal(true)}>
            View My Leave Requests
          </Button>
        </Form>
      )}

      {/* My Leave Requests Modal (with delete button) */}
      <Modal show={showLeaveModal} onHide={() => setShowLeaveModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>My Leave Requests</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
          {loading ? (
            <p>Loading...</p>
          ) : leaves.length === 0 ? (
            <p>No leave requests found.</p>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave._id}>
                    <td>{leave.type}</td>
                    <td>{new Date(leave.fromDate).toLocaleDateString()}</td>
                    <td>{new Date(leave.toDate).toLocaleDateString()}</td>
                    <td>{leave.reason}</td>
                    <td>
                      <Badge bg={leave.status === "approved" ? "success" : leave.status === "rejected" ? "danger" : "warning"}>
                        {leave.status}
                      </Badge>
                    </td>
                    <td>
                      
                        <Button variant="danger" size="sm" onClick={() => handleDelete(leave._id)}>Delete</Button>
                      
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Leave;
