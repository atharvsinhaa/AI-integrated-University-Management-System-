import { useState, useEffect, useContext } from "react";
import axios from "axios";
import ProjectMarksContext from "./ProjectMarksContext"; // Importing created context
import ProjectContext from "../context/ProjectContext";
import UserContext from "../context/UserContext";

export const ProjectMarksState = ({ children }) => {
  const { selectedProjectId } = useContext(ProjectContext);
  const { user } = useContext(UserContext);

  const [allStudentMarks, setAllStudentMarks] = useState([]); // Store all students' marks
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = "http://localhost:8000/api/v1/projectMarks";

  useEffect(() => {
    if (!selectedProjectId || !user) return;
  
    // Ensure fetchMarks is only called when the user is a student
    if (user.role === "student") {
      fetchMarks(user._id, selectedProjectId);
    }
  }, [selectedProjectId, user]);


  const addProjectMarks = async (studentId, projectId, marks) => {
    try {
        const response = await axios.post(`${API_URL}/api/v1/projectMarks/add`, {
            studentId,
            projectId,
            marks,  // Optional, default will be applied if not sent
        });

        if (response.data.success) {
            toast.success("Marks assigned successfully!");

            // 🔹 Fetch updated student marks list (if needed)
            await fetchAllStudentMarks(projectId); 
        }
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to assign marks.");
    }
};

  
  

  const fetchAllStudentMarks = async (projectId) => {
    setLoading(true);
    setError(null);
    try {
        const response = await axios.get(`${API_URL}/${projectId}/students-marks`, {
        withCredentials: true,
    });
    console.log("All studnets marks:", allStudentMarks);
        setAllStudentMarks(response.data.data); 
    } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch all students' marks");
    }
    setLoading(false);
};

  const fetchMarks = async (studentId, projectId) => {
    if (!studentId || !projectId) return;
    setLoading(true);
    setError(null); // Reset error state on new fetch

    try {
      const response = await axios.get(`${API_URL}/${studentId}/${projectId}`, {
        withCredentials: true,
      });

      if (response.data.data.length === 0) {
        setMarks([]); // Set empty marks instead of an error
      } else {
        setMarks(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching marks:", error);
      setMarks([]); // Instead of error, set marks to empty array
    } finally {
      setLoading(false);
    }
  };

  const updateMarks = async (studentId, projectId, updatedMarks) => {
    if (!studentId || !projectId || !updatedMarks || updatedMarks.length === 0) {
        setError("Invalid marks data");
        return;
    }

    setLoading(true);
    try {
        const response = await axios.post(
            `${API_URL}/update`,
            { studentId, projectId, marks: updatedMarks }, // Send `marks` as an array
            { withCredentials: true }
        );
        setAllStudentMarks(prevMarks =>
            prevMarks.map(m =>
                m.studentId._id === studentId ? { ...m, marks: response.data.data.marks } : m
            )
        );
    } catch (error) {
        console.error("Error updating marks:", error);
        setError("Failed to update marks");
    } finally {
        setLoading(false);
    }
};


  return (
    <ProjectMarksContext.Provider
      value={{ marks, fetchMarks, updateMarks, loading, error, allStudentMarks, fetchAllStudentMarks, addProjectMarks}}
    >
      {children}
    </ProjectMarksContext.Provider>
  );
};

export default ProjectMarksState;
