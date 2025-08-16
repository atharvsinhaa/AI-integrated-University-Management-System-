import { useEffect } from "react";
import { useLeave } from "../context/LeaveContext";

const MyLeaves = () => {
  const { leaves, loading, fetchMyLeaves } = useLeave();

  useEffect(() => {
    fetchMyLeaves();
  }, []);

  return (
    <div className="container mt-4">
      <h2>My Leave Requests</h2>

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
                  <span
                    className={`badge ${
                      leave.status === "Pending"
                        ? "bg-warning"
                        : leave.status === "Approved"
                        ? "bg-success"
                        : "bg-danger"
                    }`}
                  >
                    {leave.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyLeaves;
