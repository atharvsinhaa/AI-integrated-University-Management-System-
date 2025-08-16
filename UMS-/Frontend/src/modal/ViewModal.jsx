import React from "react";
import { Modal, Button } from "react-bootstrap";

const ViewModal = ({ show, handleClose, project }) => {
  if (!project) return null;

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{project.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <strong>Description:</strong> {project.description}
        </p>
        <p>
          <strong>Type:</strong> {project.type}
        </p>
        <p>
          <strong>Status:</strong> {project.status}
        </p>
        <p>
          <strong>Faculty:</strong> {project.faculty?.fullName || "Not Assigned"}
        </p>
        <h5>Team Members</h5>
        <ul>
          {project.teamMembers?.length > 0 ? (
            project.teamMembers.map((member) => (
              <li key={member._id}>
                {member.fullName}: {member.username}
              </li>
            ))
          ) : (
            <li>No team members assigned</li>
          )}
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewModal;
