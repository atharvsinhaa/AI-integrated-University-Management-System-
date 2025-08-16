/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

// Simple delete confirmation modal
const DeleteConfirmationModal = ({ show, onClose, onConfirm }) => (
  <Modal show={show} onHide={onClose}>
    <Modal.Header closeButton>
      <Modal.Title>Confirm Deletion</Modal.Title>
    </Modal.Header>
    <Modal.Body>Are you sure you want to delete this project?</Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onClose}>
        Cancel
      </Button>
      <Button variant="danger" onClick={onConfirm}>
        Delete
      </Button>
    </Modal.Footer>
  </Modal>
);

export default DeleteConfirmationModal;