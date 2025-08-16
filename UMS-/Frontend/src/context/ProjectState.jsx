import { useState, useEffect } from "react";
import axios from "axios";
import ProjectContext from "./ProjectContext";

export const ProjectState = ({ children }) => {
  const host = "http://localhost:8000";
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  // Fetch all projects
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${host}/api/v1/projects`, {
        withCredentials: true, // Include cookies for authentication
      });
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
    setLoading(false);
  };

  // Fetch a single project
  const fetchProjectById = async (id) => {
    try {
      const { data } = await axios.get(`${host}/api/v1/projects/${id}`, {
        withCredentials: true, // Include cookies for authentication
      });
      return data;
    } catch (error) {
      console.error("Error fetching project:", error);
      return null; // Return null if there's an error
    }
  };

  // Create a new project
  const createProject = async (projectData, files) => {
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("projectFiles", file)); // Append files to FormData

      const response = await axios.post(
        `${host}/api/v1/projects`,
        {
          title: projectData.title,
          description: projectData.description,
          teamMembers: JSON.stringify(projectData.teamMembers), // Send team members as a JSON string
          facultyUsername: projectData.facultyUsername, // Faculty username for validation
          repositoryLink: projectData.repositoryLink,
          type: projectData.type,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Include cookies for authentication
        }
      );

      const project = response.data;

      // If there are files, upload them
      if (files.length > 0) {
        await axios.post(
          `${host}/api/v1/projects/${project.projectId}/upload`,
          formData,
          {
            withCredentials: true, // Include cookies for authentication
          }
        );
      }

      setProjects([...projects, project]); // Add the new project to state
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  // Delete a project
  const deleteProject = async (projectId) => {
    try {
      await axios.delete(`${host}/api/v1/projects/${projectId}`, {
        withCredentials: true, // Include cookies for authentication
      });

      // Refresh projects list after deletion
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  // Update project status
  const updateProjectStatus = async (id, status) => {
    try {
      const { data } = await axios.put(
        `${host}/api/v1/projects/${id}/status`,
        { status },
        {
          withCredentials: true, // Include cookies for authentication
        }
      );
      setProjects(projects.map((p) => (p._id === id ? { ...p, status: data.project.status } : p)));
    } catch (error) {
      console.error("Error updating project status:", error);
    }
  };

  // Upload project files
  const uploadProjectFiles = async (id, files) => {
    try {
      if (files.length === 0) {
        console.log("No files to upload.");
        return;
      }

      const formData = new FormData();
      files.forEach((file) => formData.append("projectFiles", file));

      const { data } = await axios.post(`${host}/api/v1/projects/${id}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      setProjects((prevProjects) =>
        prevProjects.map((p) =>
          p._id === id ? { ...p, projectFiles: data.project.projectFiles } : p
        )
      );

      console.log("Files uploaded successfully:", data.project.projectFiles);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  // Upload repository link
  const uploadRepositoryLink = async (id, repositoryLink) => {
    try {
      const response = await axios.put(
        `${host}/api/v1/projects/${id}/repository`,
        { repositoryLink },
        {
          withCredentials: true, // Include cookies for authentication
        }
      );

      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project._id === id ? { ...project, repositoryLink: response.data.repositoryLink } : project
        )
      );

      console.log("Repository link updated successfully.");
    } catch (error) {
      console.error("Error updating repository link:", error);
    }
  };

  // 🔥 New Function: Faculty adds or updates recommendations
  const updateRecommendation = async (id, recommendation) => {
    try {
      const { data } = await axios.put(
        `${host}/api/v1/projects/${id}/recommendation`,
        { recommendation },
        {
          withCredentials: true,
        }
      );

      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project._id === id ? { ...project, recommendation: data.project.recommendation } : project
        )
      );

      console.log("Recommendation updated successfully.");
    } catch (error) {
      console.error("Error updating recommendation:", error);
    }
  };

  // 🔥 New Function: Fetch recommendation (for students to view)
  const fetchRecommendation = async (id) => {
    try {
      const { data } = await axios.get(`${host}/api/v1/projects/${id}/recommendation`, {
        withCredentials: true,
      });

      return data.recommendation;
    } catch (error) {
      console.error("Error fetching recommendation:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        loading,
        fetchProjects,
        fetchProjectById,
        createProject,
        updateProjectStatus,
        uploadProjectFiles,
        uploadRepositoryLink,
        selectedProjectId,
        setSelectedProjectId,
        deleteProject,
        updateRecommendation, // New function for faculty to add/update recommendation
        fetchRecommendation, // New function for students to view recommendation
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectState;
