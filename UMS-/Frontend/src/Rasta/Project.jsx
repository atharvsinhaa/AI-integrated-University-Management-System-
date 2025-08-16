import React, { useEffect, useState, useContext } from "react";
import { Table, Button } from "react-bootstrap";
import ProjectContext from "../context/ProjectContext";
import UserContext from "../context/UserContext";
import MarksModal from "../modal/MarksModal";
import ViewModal from "../modal/ViewModal";
import UploadModal from "../modal/UploadModal";
import ProjectDropdown from "../component/ProjectDropdown";
import useUserRole from "../context/useUserRole";
import CreateProjectModal from "../modal/CreateProjectModal";
import DeleteConfirmationModal from "../modal/DeleteConfirmationModal";
import RecommendationModal from "../modal/RecommendationModal.jsx";

const Projects = () => {
  const {
    projects,
    fetchProjects,
    uploadProjectFiles,
    uploadRepositoryLink,
    setSelectedProjectId,
    selectedProjectId,
  // eslint-disable-next-line no-unused-vars
    createProject,
    deleteProject,
  } = useContext(ProjectContext);
  const { user, fetchUserDetails } = useContext(UserContext);
  const { role } = useUserRole();

  const [isLoading, setIsLoading] = useState(false);
  const [showMarksModal, setShowMarksModal] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [showViewModal, setShowViewModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [repositoryLink, setRepositoryLink] = useState("");
  const [error, setError] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showRecommendationModal, setShowRecommendationModal] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [currentProjectTitle, setCurrentProjectTitle] = useState("");

  
  const refreshData = async () => {
    await fetchUserDetails();
    const updated = await fetchProjects();
    return updated;
  };
  

  useEffect(() => {
    refreshData();
  }, []);


    // ✅ Function to handle repository link update
    const handleRepositoryUpload = async () => {
      try {
        if (!repositoryLink.trim()) {
          setError("Repository link cannot be empty.");
          return;
        }

        await uploadRepositoryLink(selectedProjectId, repositoryLink);
        // 🔹 Simulate API call (Replace with actual API request)
        console.log("Uploading repo link:", repositoryLink);
        alert("Repository link updated successfully!");
        refreshData();
        // setShowUploadModal(false);
  
        // Optionally update the project state if needed
      } catch (err) {
        setError("Failed to update repository link.");
        console.log(err);
      }
    };

    const handleFileChange = (e) => {
      setSelectedFiles([...e.target.files]);
    };
  
    // ✅ Function to upload selected files
    const handleUpload = async () => {
      if (selectedFiles.length === 0) {
        setError("Please select at least one file.");
        return;
      }

      setIsLoading(true);
      
      
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append("projectFiles", file));
      await uploadProjectFiles(selectedProjectId, formData);
      setIsLoading(false);
      
      const updatedProjects = await refreshData();
      const updatedProject = updatedProjects?.find(p => p._id === selectedProjectId);
      setCurrentProject(updatedProject);
      
      // setShowUploadModal(false);
      refreshData();
      
      console.log("Uploading files:", selectedFiles);
      alert("Files uploaded successfully!");
    };
  



  const handleMarksClick = (project) => {
    setSelectedProjectId(project._id);
    setShowMarksModal(true);
  };

  const handleView = (project) => {
    setCurrentProject(project);
    setSelectedProjectId(project._id);
    setShowViewModal(true);
  };

  const handleUploadClick = (project) => {
    setCurrentProject(project);
    setSelectedProjectId(project._id);
    setRepositoryLink(project.repositoryLink || "");
    setShowUploadModal(true);
  };

  const handleDelete = (projectId) => {
    setSelectedProjectId(projectId);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteProject(selectedProjectId);
      fetchProjects();
      setShowDeleteConfirmation(false);
    } catch (error) {
      console.error("Error deleting project: ", error);
      setShowDeleteConfirmation(false);
    }
  };

  // Copy project title to clipboard
  const handleCopy = (project) => {
    setCurrentProject(project);
    setSelectedProjectId(project._id);
    setShowRecommendationModal(true);
  };
  

  const filteredProjects = projects?.filter(
    (project) =>
      (project.createdBy?._id === user?._id ||
        project.teamMembers?.some((member) => member?._id === user?._id)) &&
      (selectedType
        ? project.type.toLowerCase() === selectedType.toLowerCase()
        : true)
  );

  return (
    <div className="container mx-auto p-6" style={{ textAlign: "center" }}>
      <div className="d-flex align-items-center mb-3">
        <ProjectDropdown
          selectedType={selectedType}
          setSelectedType={setSelectedType}
        />
        {role === "faculty" && (
          <Button
            variant="primary"
            className="ms-3"
            onClick={() => setShowCreateModal(true)}
          >
            + Create Project
          </Button>
        )}
      </div>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Status</th>
            <th>Faculty</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <tr key={project._id}>
                <td>{project.title}</td>
                <td>{project.type}</td>
                <td>{project.status}</td>
                <td>{project.faculty?.fullName || "Not Assigned"}</td>
                <td>
                <Button
                    variant="primary"
                    onClick={() => handleCopy(project)}
                  >
                    💬
                  </Button>
                  {" "}
                  <Button variant="info" onClick={() => handleView(project)}>
                  View
                  </Button>{" "}
                  <Button
                    variant="success"
                    onClick={() => handleUploadClick(project)}
                    >
                    Files
                  </Button>{" "}
                  <Button
                    variant="warning"
                    onClick={() => handleMarksClick(project)}
                  >
                    Marks
                  </Button>{" "}
                  
                  {role === "faculty" && (
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(project._id)}
                    >
                      Delete
                    </Button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No projects found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <ViewModal
        show={showViewModal}
        handleClose={() => setShowViewModal(false)}
        project={currentProject}
      />
      <UploadModal
      show={showUploadModal}
      handleClose={() => setShowUploadModal(false)}
      project={currentProject}
      repositoryLink={repositoryLink}
      setRepositoryLink={setRepositoryLink}
      handleRepositoryUpload={handleRepositoryUpload}   // <-- This function needs to be defined
      handleFileChange={handleFileChange}  // <-- This function needs to be defined
      handleUpload={handleUpload} // <-- This function needs to be defined!
      selectedFiles={selectedFiles}
      error={error}
      isLoading={isLoading}
/>

      <MarksModal
        show={showMarksModal}
        project={currentProject}
        handleClose={() => setShowMarksModal(false)}
        projectId={selectedProjectId}
        studentId={role === "student" ? user?._id : undefined}
      />
      <CreateProjectModal
        show={showCreateModal}
        facultyUsername={user?.username}
        handleClose={() => setShowCreateModal(false)}
      />
      <DeleteConfirmationModal
        show={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={confirmDelete}
      />

<RecommendationModal
  show={showRecommendationModal}
  handleClose={() => setShowRecommendationModal(false)}
  projectId={selectedProjectId}
  selectedFiles={selectedFiles}

  projectTitle={currentProject?.title || ""}
  facultyName={currentProject?.faculty?.fullName || ""} // Pass faculty's full name
  isFaculty={role === "faculty"} // Pass true if faculty, false if student
/>

    </div>
  );
};

export default Projects;
