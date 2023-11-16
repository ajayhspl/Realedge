import React from "react";
import "./Templates.css";
import IconCard from "../Cards/Card-Icon/IconCard";
const Template9 = ({ Data }) => {
  const renderDummyData = Data.Cards.map((CardData) => {
    return <IconCard data={CardData} key={CardData.id} />;
  });
  return (
    <div className="Outsource">
      {Data.Title && <p>{Data.Title}</p>}
      {Data.Para && <p>{Data.Para}</p>}
      <div className="Cards-wrapper">{renderDummyData}</div>
    </div>
  );
};

export default Template9;
