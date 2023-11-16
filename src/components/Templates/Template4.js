import React, { useState } from "react";
import "./Templates.css";
import IconCard from "../Cards/Card-Icon/IconCard";
import PriceCard from "../Cards/PriceCard/PriceCard";
const Template4 = ({ Data }) => {
  const [highLightedID, setHighlightedId] = useState(null);
  const changeHighlight = (id) => {
    setHighlightedId(id);
  };

  const renderDummyData = Data.Cards.map((CardData) => {
    return <IconCard data={CardData} key={CardData.id} />;
  });

  const renderDummyPricingData = Data.Pricing.map((PricePlan) => {
    return (
      <PriceCard
        key={PricePlan.id}
        data={PricePlan}
        changeHighlight={changeHighlight}
        highLightedID={highLightedID}
      />
    );
  });

  return (
    <div className="Outsource">
      {Data.Title && <h2>{Data.Title}</h2>}
      <div className="Cards-wrapper">{renderDummyData}</div>
      <div className="Pricing-container">{renderDummyPricingData}</div>
    </div>
  );
};

export default Template4;
