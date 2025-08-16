import React from "react";
import { Dropdown } from "react-bootstrap";

const ProjectDropdown = ({ selectedType, setSelectedType }) => {
  const projectTypes = ["Capstone", "Epic", "Research", "Internship", "Mini", "Hackathon"];

  return (
    <Dropdown onSelect={(type) => setSelectedType(type)}>
      <Dropdown.Toggle variant="primary">
        {selectedType || "Select Project Type"}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item eventKey="">All</Dropdown.Item>
        {projectTypes.map((type) => (
          <Dropdown.Item key={type} eventKey={type}>
            {type}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ProjectDropdown;
