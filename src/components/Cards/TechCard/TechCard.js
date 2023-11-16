import React from "react";
import "./TechCard.css";
const TechCard = (props) => {
  return (
    <div className="TechCard">
      {props.Data.title && <h2>{props.Data.title}</h2>}
      {props.Data.text && (
        <div className="Text">
          <p>{props.Data.text}</p>
        </div>
      )}
    </div>
  );
};

export default TechCard;
