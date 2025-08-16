/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { Modal, Button, Spinner, Alert } from "react-bootstrap";
import ProjectMarksContext from "../context/ProjectMarksContext";
import useUserRole from "../context/useUserRole";
import StudentMarksList from "./StudentMarksList"; // Extracted component
import FacultyMarksList from "./FacultyMarksList"; // Extracted component
import "../styles/MarksModal.css";

const MarksModal = ({ show, handleClose, studentId, projectId, project }) => {
    const { role } = useUserRole();
    const { marks, fetchMarks, loading, error, allStudentMarks, fetchAllStudentMarks } = useContext(ProjectMarksContext);

    useEffect(() => {
        if (show && projectId) {
            role === "faculty" ? fetchAllStudentMarks(projectId) : fetchMarks(studentId, projectId);
        }
    }, [show, studentId, projectId, role]);

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{role === "faculty" ? "All Students' Marks" : "Project Marks"}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="marks-modal-body">
                {loading ? (
                    <div className="d-flex justify-content-center">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : error ? (
                    <Alert variant="danger">{error}</Alert>
                ) : role === "faculty" ? (
                    <FacultyMarksList allStudentMarks={allStudentMarks} projectId={projectId} />
                ) : (
                    <StudentMarksList marks={marks} />
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MarksModal;
