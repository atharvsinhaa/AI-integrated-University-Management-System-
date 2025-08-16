import { useState } from "react";
import { useLeave } from "../context/LeaveContext";//
import { useNavigate } from "react-router-dom";
// {"conversationId":"71c4173c-10b5-4ec5-8ecf-030e8bc34cfd","source":"instruct"}

const LeaveRequestForm = () => {
  const { requestLeave } = useLeave();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    type: "Sick Leave", // Default leave type
    fromDate: "",
    toDate: "",
    reason: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await requestLeave(formData);
    navigate("/my-leaves"); // Redirect to 'My Leaves' after request
  };

  return (
    <div className="container mt-4">
      <h2>Request Leave</h2>
      <form onSubmit={handleSubmit} className="border p-4 rounded">
        {/* Leave Type */}
        <div className="mb-3">
          <label className="form-label">Leave Type</label>
          <select
            className="form-select"
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="Sick Leave">Sick Leave</option>
            <option value="Casual Leave">Casual Leave</option>
            <option value="Emergency Leave">Emergency Leave</option>
          </select>
        </div>

        {/* From Date */}
        <div className="mb-3">
          <label className="form-label">From Date</label>
          <input
            type="date"
            className="form-control"
            name="fromDate"
            value={formData.fromDate}
            onChange={handleChange}
            required
          />
        </div>

        {/* To Date */}
        <div className="mb-3">
          <label className="form-label">To Date</label>
          <input
            type="date"
            className="form-control"
            name="toDate"
            value={formData.toDate}
            onChange={handleChange}
            required
          />
        </div>

        {/* Reason */}
        <div className="mb-3">
          <label className="form-label">Reason</label>
          <textarea
            className="form-control"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary">Submit Request</button>
      </form>
    </div>
  );
};

export default LeaveRequestForm;
