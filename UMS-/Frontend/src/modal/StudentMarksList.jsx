import React from "react";
import { ListGroup, Alert } from "react-bootstrap";

const StudentMarksList = ({ marks }) => {
    return marks.length === 0 ? (
        <Alert variant="warning">No marks available for this project.</Alert>
    ) : (
        <ListGroup>
            {marks.map((mark, index) => (
                <ListGroup.Item key={index} className="d-flex justify-content-between">
                    <strong>{mark.criteria}</strong>
                    <span>{mark.score}</span>
                </ListGroup.Item>
            ))}
        </ListGroup>
    );
};

export default StudentMarksList;
