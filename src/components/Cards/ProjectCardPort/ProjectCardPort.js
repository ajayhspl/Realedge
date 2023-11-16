import React from "react";
import ProjectPopup from "./ProjectPopup";
import "./ProjectCardPort.css";
const ProjectCardPort = (props) => {
  const delay = String(props.delay * 0.1) + "s";
  const [showModal, setShowModal] = React.useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const Project = props.data;
  return (
    <>
      <div
        className="ProjectCard animate__animated animate__fadeInUp"
        onClick={handleShowModal}
        style={{ animationDelay: delay }}
      >
        <img src={Project.Thumbnail} />
        <p>{Project.Title}</p>
      </div>
      <ProjectPopup
        show={showModal}
        handleClose={handleCloseModal}
        Data={Project}
      />
    </>
  );
};

export default ProjectCardPort;
