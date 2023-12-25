import React from "react";
import "./WhyUs.css";
const WhyUs = (props) => {
  return (
    <div
      className="WhyUs-Card"
      data-aos="fade-up"
      style={{ cursor: props.Data.Link ? "pointer" : "" }}
      onClick={() => {
        props.Data.Link ? (window.location.href = props.Data.Link) : "";
      }}
    >
      {props.Data.iconURL && (
        <div className="IMGWrapper">
          <img src={props.Data.iconURL} />
        </div>
      )}

      {props.Data.title && <h4>{props.Data.title}</h4>}
      {props.Data.description && <span>{props.Data.description}</span>}
    </div>
  );
};

export default WhyUs;
