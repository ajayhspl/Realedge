import React from "react";
import "./SkillCard.css";
const SkillCard = (prop) => {
  return (
    <div
      className="SkillCard"
      data-aos="flip-left"
      onClick={() => {
        prop.Data.Link ? (window.location.href = prop.Data.Link) : "";
      }}
    >
      {prop.Data.URL && (
        <img
          className={`${prop.Data.Name ? "" : "fullWidth"}`}
          src={prop.Data.URL}
        />
      )}
      {prop.Data.Name && <p>{prop.Data.Name}</p>}
    </div>
  );
};

export default SkillCard;
