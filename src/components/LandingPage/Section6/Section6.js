import React from "react";
import "./Section6.css";
import Project from "../../Cards/Project/Project";

import ContactPopUp from "../../PopUps/ContactPopup/ContactPopup";

const Section6 = (props) => {
  const objectToArray = (obj) => {
    return Object.keys(obj).map((key) => ({
      key,
      ...obj[key],
    }));
  };
  const Tabs = objectToArray(props.Tabs);
  const ProjectTab = Tabs.find((tab) => tab.id === "12");
  const [showModal, setShowModal] = React.useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const RenderDummyData = props.ServerData.Projects.map((data) => {
    const targetProject = props.Projects.find((Project) => {
      return Project.ProjectID == data.ProjectID;
    });
    let className;
    switch (data.Order) {
      case 1:
        className = "Main";
        break;
      case 2:
        className = "secondary1";
        break;
      case 3:
        className = "secondary2";
        break;
      case 4:
        className = "secondary3";
        break;
      case 5:
        className = "secondary4";
        break;
      case 6:
        className = "secondary5";
        break;
      default:
        break;
    }
    if (!targetProject) {
      return;
    } else {
      return (
        <Project
          ProjectTab={ProjectTab}
          ClassName={className}
          ViewPort={true}
          key={data.id}
          project={targetProject}
        />
      );
    }
  });
  return (
    <section className="Section6">
      {props.ServerData.Title && (
        <h2 data-aos="fade-down">{props.ServerData.Title}</h2>
      )}
      <p data-aos="fade-up">Latest Projects</p>
      <div className="Project-wrapper">{RenderDummyData}</div>
      {props.ServerData.paragraph && (
        <div className="Alert" data-aos="fade">
          <p>{props.ServerData.paragraph}</p>
          <button className="Button" onClick={handleShowModal}>
            Contact us
          </button>
        </div>
      )}
      <ContactPopUp
        show={showModal}
        handleClose={handleCloseModal}
        type="Project"
      />
    </section>
  );
};

export default Section6;
