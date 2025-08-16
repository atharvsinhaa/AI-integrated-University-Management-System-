    import { useState, useContext } from "react";
    import { Modal, Button, Form } from "react-bootstrap";
    import ProjectContext from "../context/ProjectContext";

    const CreateProjectModal = ({ show, handleClose,facultyUsername }) => {
    const { createProject } = useContext(ProjectContext);
    const [projectData, setProjectData] = useState({
        title: "",
        description: "",
        teamMembers: "",
        facultyUsername: facultyUsername,
        repositoryLink: "",
        type: "capstone",
    });
    const [files, setFiles] = useState([]);

    const handleChange = (e) => {
        setProjectData({ ...projectData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFiles([...e.target.files]);
    };

    const { fetchProjects } = useContext(ProjectContext); // Add fetchProjects

const handleSubmit = async (e) => {
    e.preventDefault();
    
    const teamMembersArray = projectData.teamMembers
        .split(",")
        .map((member) => member.trim());

    const finalProjectData = {
        ...projectData,
        teamMembers: teamMembersArray,
    };

    await createProject(finalProjectData, files);
    
    fetchProjects(); // Fetch updated projects list
    handleClose(); // Close the modal after refresh
};


    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
        {/* Modal Header */}
        <Modal.Header closeButton className="bg-primary text-white">
            <Modal.Title>Create New Project</Modal.Title>
        </Modal.Header>

        {/* Scrollable Modal Body */}
        <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto", padding: "1.5rem" }}>
            <Form onSubmit={handleSubmit}>
            {/* Project Title */}
            <Form.Group className="mb-3">
                <Form.Label><b>Project Title</b></Form.Label>
                <Form.Control
                type="text"
                name="title"
                placeholder="Write a title for your project"
                value={projectData.title}
                onChange={handleChange}
                required
                />
            </Form.Group>

            {/* Description */}
            <Form.Group className="mb-3">
                <Form.Label><b>Description</b></Form.Label>
                <Form.Control
                as="textarea"
                rows={4}
                name="description"
                placeholder="Briefly describe your project..."
                value={projectData.description}
                onChange={handleChange}
                required
                />
            </Form.Group>

            {/* Team Members */}
            <Form.Group className="mb-3">
                <Form.Label><b>Team Members</b> <span className="text-muted">(Enter Registration Numbers, comma-separated)</span></Form.Label>
                <Form.Control
                type="text"
                name="teamMembers"
                value={projectData.teamMembers}
                onChange={handleChange}
                required
                />
            </Form.Group>

            {/* Faculty Employee ID
            <Form.Group className="mb-3">
                <Form.Label><b>Faculty Employee ID</b></Form.Label>
                <Form.Control
                type="text"
                name="facultyUsername"
                placeholder="Enter Faculty Employee ID"
                value={projectData.facultyUsername}
                onChange={handleChange}
                required
                />
            </Form.Group> */}

            {/* Repository Link */}
            <Form.Group className="mb-3">
                <Form.Label>
                <b>Repository Link</b> <span className="text-muted">(Optional)</span>
                </Form.Label>
                <Form.Control
                type="url"
                name="repositoryLink"
                placeholder="https://github.com/your-repo-link"
                value={projectData.repositoryLink}
                onChange={handleChange}
                />
            </Form.Group>

            {/* Project Type */}
            <Form.Group className="mb-3">
                <Form.Label><b>Project Type</b></Form.Label>
                <Form.Control as="select" name="type" value={projectData.type} onChange={handleChange}>
                <option value="capstone">Capstone</option>
                <option value="epic">Epic</option>
                <option value="research">Research</option>
                <option value="internship">Internship</option>
                <option value="mini">Mini</option>
                <option value="hackathon">Hackathon</option>
                </Form.Control>
            </Form.Group>

            {/* Upload Files */}
            <Form.Group className="mb-3">
                <Form.Label>
                <b>Upload Files</b> <span className="text-muted">(Optional)</span>
                </Form.Label>
                <Form.Control type="file" multiple onChange={handleFileChange} />
            </Form.Group>
            </Form>
        </Modal.Body>

        {/* Modal Footer with Buttons */}
        <Modal.Footer className="d-flex justify-content-between">
            <Button variant="secondary" onClick={handleClose}>
            Cancel
            </Button>
            <Button type="submit" variant="primary" onClick={handleSubmit}>
            Create Project
            </Button>
        </Modal.Footer>
        </Modal>
    );
    };

    export default CreateProjectModal;
