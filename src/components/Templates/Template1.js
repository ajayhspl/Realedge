import React from "react";
import "./Templates.css";
const Template1 = ({ Data }) => {
  return (
    <div
      className="Outsource"
      dangerouslySetInnerHTML={{ __html: Data.Content }}
    ></div>
  );
};

export default Template1;
