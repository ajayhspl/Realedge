import React from "react";
import "./SkillCard.css";
const SkillCard = (prop) => {
  return (
    <div className="SkillCard" data-aos="flip-left">
      {prop.Data.URL && <img src={prop.Data.URL} />}
      {prop.Data.Name && <p>{prop.Data.Name}</p>}
    </div>
  );
};

export default SkillCard;
