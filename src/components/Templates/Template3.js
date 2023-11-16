import React from "react";
import "./Templates.css";
import IconCard from "../Cards/Card-Icon/IconCard";

const Template3 = ({ Data }) => {
  const renderDummyData = Data.Cards.map((CardData) => {
    return <IconCard data={CardData} key={CardData.id} />;
  });
  return (
    <div className="Outsource">
      <div
        className="Outsource"
        dangerouslySetInnerHTML={{ __html: Data.PageText }}
      ></div>
      <div className="Cards-wrapper">{renderDummyData}</div>
    </div>
  );
};

export default Template3;
