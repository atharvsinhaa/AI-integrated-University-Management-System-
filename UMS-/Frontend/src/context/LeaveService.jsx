import axios from "axios";

const API_URL = "http://localhost:8000/api/v1/leave";

const LeaveService = {
  // Fetch user's leave requests
  getMyLeaves: async () => {
    const response = await axios.get(`${API_URL}/my-leaves`, { withCredentials: true });
    return response.data;
  },

  // Request leave
  requestLeave: async (leaveData) => {
    const response = await axios.post(`${API_URL}/request`, leaveData, { withCredentials: true });
    return response.data;
  },

  // Get all pending leave requests (for faculty)
  getPendingLeaves: async () => {
    const response = await axios.get(`${API_URL}/pending`, { withCredentials: true });
    return response.data;
  },

  // Approve a leave request
  approveLeave: async (leaveId) => {
    const response = await axios.put(`${API_URL}/${leaveId}/approve`, {}, { withCredentials: true });
    return response.data;
  },

  // Reject a leave request
  rejectLeave: async (leaveId) => {
    const response = await axios.put(`${API_URL}/${leaveId}/reject`, {}, { withCredentials: true });
    return response.data;
  },
};

export default LeaveService;
