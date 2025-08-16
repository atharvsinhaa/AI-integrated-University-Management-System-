import React from "react";
import "./Courses.css"; // Importing CSS for hover effect

const Courses = () => {
  const courses = [
    {
      time: "10:00 - 10:30",
      title: "User Interface Design",
      description:
        "Learn the principles of user-centered design and how to create intuitive and engaging interfaces.",
      color: "text-warning",
    },
    {
      time: "13:00 - 13:30",
      title: "Programming in Java",
      description:
        "Understand the fundamentals of Java programming, including OOP concepts and advanced techniques.",
      color: "text-primary",
    },
    {
      time: "15:00 - 15:30",
      title: "Data Structures",
      description:
        "Master essential data structures like arrays, linked lists, trees, and graphs with practical examples.",
      color: "text-info",
    },
    {
      time: "16:00 - 16:45",
      title: "Database Management Systems",
      description:
        "Explore relational databases, SQL queries, and database optimization techniques in detail.",
      color: "text-danger",
    },
    {
      time: "17:00 - 17:30",
      title: "Artificial Intelligence",
      description:
        "Delve into AI fundamentals, including machine learning, neural networks, and AI applications.",
      color: "text-success",
    },
    {
      time: "18:00 - 18:30",
      title: "Cloud Computing",
      description:
        "Gain knowledge about cloud services, virtualization, and deploying applications in the cloud.",
      color: "text-secondary",
    },
  ];

  return (
    <div className="container-fluid bg-light min-vh-100">
      <div className="row">
        <div id="sidebar-container"></div>
        <div className="col p-5">
          <h1 className="mb-4 fw-bold">📚 My Courses</h1>
          <div className="row">
            {courses.map((course, index) => (
              <div key={index} className="col-md-6 col-lg-4 mb-4">
                <div className="card shadow-sm border-0 course-card">
                  <div className="card-body">
                    <p className="text-muted small">
                      Time: <strong>{course.time}</strong>
                    </p>
                    <h5 className={`card-title ${course.color}`}>
                      {course.title}
                    </h5>
                    <p className="card-text">{course.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
