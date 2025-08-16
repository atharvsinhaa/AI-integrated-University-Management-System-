import React, { useState, useContext, useEffect } from "react";
import { ListGroup, Button, Form, Alert, Spinner } from "react-bootstrap";
import ProjectMarksContext from "../context/ProjectMarksContext";

const defaultMarks = [
    { criteria: "Background Study", score: 0 },
    { criteria: "Problem Statement", score: 0 },
    { criteria: "Implementation", score: 0 },
    { criteria: "Presentation", score: 0 }
];

const FacultyMarksList = ({ allStudentMarks, projectId }) => {
    const { updateMarks, fetchAllStudentMarks, addProjectMarks } = useContext(ProjectMarksContext);
    const [editMode, setEditMode] = useState({});
    const [newMarks, setNewMarks] = useState({});
    const [loadingStudents, setLoadingStudents] = useState({});

    useEffect(() => {
        const initializeMissingMarks = async () => {
            const studentsWithoutMarks = allStudentMarks.filter(({ marks }) => marks.length === 0);

            if (studentsWithoutMarks.length === 0) return;

            setLoadingStudents(prev => {
                const updatedState = { ...prev };
                studentsWithoutMarks.forEach(({ studentId }) => {
                    delete updatedState[studentId._id]; // Remove from loading state when done
                });
                return updatedState;
            });
            

            // 🔹 **Using `Promise.all` to initialize all students in parallel**
            await Promise.all(studentsWithoutMarks.map(async ({ studentId }) => {
                await addProjectMarks(studentId._id, projectId, defaultMarks);
            }));

            await fetchAllStudentMarks(projectId);  // 🔄 **Refresh after all students are initialized**

            setLoadingStudents({});
        };

        initializeMissingMarks();
    }, [allStudentMarks, projectId, addProjectMarks, fetchAllStudentMarks]);

    const handleMarkChange = (studentId, criteria, value) => {
        let clampedValue = Math.max(0, Math.min(10, Number(value)));
        setNewMarks(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], [criteria]: clampedValue },
        }));
    };

    const handleSave = async (studentId) => {
        const updatedMarks = Object.entries(newMarks[studentId] || {}).map(([criteria, score]) => ({
            criteria,
            score: Number(score),
        }));

        await updateMarks(studentId, projectId, updatedMarks);
        await fetchAllStudentMarks(projectId);

        setEditMode(prev => {
            const updatedState = { ...prev };
            delete updatedState[studentId];
            return updatedState;
        });

        setNewMarks(prev => ({ ...prev, [studentId]: {} }));
    };

    return allStudentMarks.length === 0 ? (
        <Alert variant="warning">No marks available for this project.</Alert>
    ) : (
        <div className="marks-container">
            {allStudentMarks
                .filter(({ studentId }) => studentId?.role === "student")
                .map(({ studentId, marks }) => {
                    const displayMarks = marks.length === 0 ? defaultMarks : marks;

                    return (
                        <div key={studentId._id} className="marks-table">
                            <ListGroup>
                                <ListGroup.Item className="bg-light d-flex justify-content-between align-items-center">
                                    <strong>{studentId.fullName} ({studentId.username})</strong>
                                    {loadingStudents[studentId._id] ? (
                                        <Spinner animation="border" size="sm" />
                                    ) : (
                                        <Button
                                            size="sm"
                                            variant="outline-primary"
                                            onClick={() => setEditMode(prev => ({
                                                ...prev,
                                                [studentId._id]: !prev[studentId._id]
                                            }))}>
                                            {editMode[studentId._id] ? "Cancel" : "Edit"}
                                        </Button>
                                    )}
                                </ListGroup.Item>

                                {marks.length === 0 && (
                                    <Alert variant="info" className="m-2">
                                        Default marks (zero) edit to update...
                                    </Alert>
                                )}

                                {displayMarks.map((mark, index) => (
                                    <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                                        <strong>{mark.criteria}</strong>
                                        {editMode[studentId._id] ? (
                                            <Form.Control
                                                type="number"
                                                value={newMarks[studentId._id]?.[mark.criteria] ?? mark.score}
                                                onChange={(e) => handleMarkChange(studentId._id, mark.criteria, e.target.value)}
                                                style={{ width: "80px" }}
                                                min="0"
                                                max="10"
                                            />
                                        ) : (
                                            <span>{mark.score}</span>
                                        )}
                                    </ListGroup.Item>
                                ))}

                                {editMode[studentId._id] && (
                                    <ListGroup.Item className="text-end">
                                        <Button size="sm" variant="success" onClick={() => handleSave(studentId._id)}>
                                            Save
                                        </Button>
                                    </ListGroup.Item>
                                )}
                            </ListGroup>
                        </div>
                    );
                })}
        </div>
    );
};

export default FacultyMarksList;
