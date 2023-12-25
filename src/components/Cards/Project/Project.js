import React from "react";
import "./Project.css";
const Project = ({ project, ProjectTab, ClassName, ViewPort }) => {
  const data = project;
  return (
    <div className={`${ClassName} Project-card`} data-aos="fade">
      <div className="ImgWrapper">
        <img src={data.Thumbnail} />
      </div>
      {data.Description && (
        <div className="Description">
          <p>{data.Description}</p>
        </div>
      )}
      {ViewPort && ProjectTab.PageURL && (
        <a className="Link" href={`/${ProjectTab.PageURL}`}>
          Explore our Portfolio
        </a>
      )}
    </div>
  );
};

export default Project;
