import React, { useState, useEffect, useContext } from "react";
import { Modal, Button, Form, Card } from "react-bootstrap";
import ProjectContext from "../context/ProjectContext";

const RecommendationModal = ({ show, handleClose, projectId, projectTitle, isFaculty, facultyName }) => {
  const { updateRecommendation, fetchRecommendation } = useContext(ProjectContext);
  const [recommendation, setRecommendation] = useState("");

  useEffect(() => {
    if (show && projectId) {
      setRecommendation(""); // Reset state to prevent showing old recommendation
      fetchRecommendation(projectId).then((rec) => {
        setRecommendation(rec || ""); // Ensure we update with correct data
      });
    }
  }, [show, projectId]); // Dependency updated to ensure correct data fetching

  const handleSave = async () => {
    if (isFaculty) {
      await updateRecommendation(projectId, recommendation);
    }
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Recommendation for "{projectTitle}"</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isFaculty ? (
          <Form>
            <Form.Group controlId="recommendationText">
              <Form.Label>Recommendation:</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={recommendation}
                onChange={(e) => setRecommendation(e.target.value)}
                placeholder="Enter your recommendation here..."
              />
            </Form.Group>
          </Form>
        ) : (
          <Card className="border-0 shadow-sm p-3">
            <Card.Body>
              <Card.Text className="text">
                {recommendation || "No recommendation available yet."}
              </Card.Text>
            </Card.Body>
          </Card>
        )}
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between align-items-center">
        <small className="text-muted">
          <i>...by {facultyName || "Unknown Faculty"}</i>
        </small>
        <div>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {isFaculty && (
            <Button variant="primary" onClick={handleSave} className="ms-2">
              Save
            </Button>
          )}
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default RecommendationModal;
