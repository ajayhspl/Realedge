import React from "react";
import "./Section4.css";
const Section4 = (props) => {
  return (
    <section className="Section4">
      <div className="Left">
        {props.ServerData.title && (
          <h2 data-aos="fade-down">{props.ServerData.title}</h2>
        )}
        {props.ServerData.paragraph && (
          <p data-aos="fade-up">{props.ServerData.paragraph}</p>
        )}
      </div>
      {props.screenWidth > 1000 ? (
        <div className="Right" data-aos="fade-left">
          <img src={props.ServerData.URL} />
        </div>
      ) : (
        ""
      )}
    </section>
  );
};

export default Section4;
