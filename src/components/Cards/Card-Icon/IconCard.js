import React from "react";
import "./IconCard.css";
const IconCard = (props) => {
  return (
    <div className="IconCard">
      {props.data.title && <h4>{props.data.title}</h4>}
      <div className="Card-content">
        {props.data.img && <img src={props.data.img} />}
        {props.data.text && <p>{props.data.text}</p>}
      </div>
    </div>
  );
};

export default IconCard;
