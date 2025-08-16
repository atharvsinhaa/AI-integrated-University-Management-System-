import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const LeaveContext = createContext();


export const LeaveProvider = ({ children }) => {
  const [leaves, setLeaves] = useState([]); 
  const [loading, setLoading] = useState(false);

  
useEffect(() => {
  console.log("🔄 useEffect - Leaves Updated:", leaves);
}, [leaves]);

//delete
const deleteLeave = async (leaveId) => {
  try {
    const response = await axios.delete(`http://localhost:8000/api/v1/leave/${leaveId}/delete`, {
      withCredentials: true,
    });
    // console.log(response.data.data);
    setLeaves((prev) => (Array.isArray(prev) ? prev.filter((leave) => leave._id !== leaveId) : []));
    console.log(`Deleted leave request: ${leaveId}`);
  } catch (error) {
    console.error("Error deleting leave:", error.response?.data?.message || error.message);
  }
};


  // Fetch user's own leave requests (for Students)
  const fetchMyLeaves = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/api/v1/leave/my-leaves", {
        withCredentials: true,
      });
      console.log("Fetched My Leaves:", response.data); 
      setLeaves(response.data.data || []); 
    } catch (error) {
      console.error("Error fetching leaves:", error.response?.data?.message || error.message);
      setLeaves([]);
    }
    setLoading(false);
  };

  // Fetch pending leave requests (For Faculty)
  const fetchPendingLeaves = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/api/v1/leave/pending", {
        withCredentials: true,
      });
  
      const fetchedLeaves = response.data.data || [];
      
      console.log("🟢 BEFORE updating state - Leaves:", leaves); // ✅ Log current state
      setLeaves(fetchedLeaves);
      console.log("🟢 AFTER updating state - Leaves:", fetchedLeaves); // ✅ Log updated state
    } catch (error) {
      console.error("❌ Error fetching pending leaves:", error.response?.data?.message || error.message);
      setLeaves([]);
    }
    setLoading(false);
  };
  

  // Request leave (Student)
  const requestLeave = async (leaveData) => {
    try {
      const response = await axios.post("http://localhost:8000/api/v1/leave/request", leaveData, {
        withCredentials: true,
      });
      setLeaves((prev) => [response.data.data, ...prev]);
    } catch (error) {
      console.error("Error requesting leave:", error.response?.data?.message || error.message);
    }
  };

  // Approve leave request (Faculty)
  const approveLeave = async (leaveId) => {
    try {
      await axios.put(`http://localhost:8000/api/v1/leave/${leaveId}/approve`, {}, {
        withCredentials: true,
      });
      setLeaves((prev) => prev.filter((leave) => leave._id !== leaveId));
    } catch (error) {
      console.error("Error approving leave:", error.response?.data?.message || error.message);
    }
  };

  // Reject leave request (Faculty)
  const rejectLeave = async (leaveId) => {
    try {
      await axios.put(`http://localhost:8000/api/v1/leave/${leaveId}/reject`, {}, {
        withCredentials: true,
      });
      setLeaves((prev) => prev.filter((leave) => leave._id !== leaveId));
    } catch (error) {
      console.error("Error rejecting leave:", error.response?.data?.message || error.message);
    }
  };

  return (
    <LeaveContext.Provider value={{ leaves,deleteLeave, loading, requestLeave, fetchMyLeaves, fetchPendingLeaves, approveLeave, rejectLeave }}>
      {children}
    </LeaveContext.Provider>
  );
};

export const useLeave = () => useContext(LeaveContext);
