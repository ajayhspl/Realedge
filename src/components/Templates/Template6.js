import React, { useState } from "react";
import "./Templates.css";
import PriceCard from "../Cards/PriceCard/PriceCard";
const Template6 = ({ Data }) => {
  const [highLightedID, setHighlightedId] = useState(null);
  const changeHighlight = (id) => {
    setHighlightedId(id);
  };

  const renderPricingData = Data.Plans.map((PricePlan) => {
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
    <div className="Outsource pricing">
      {Data.Title && <h2>{Data.Title}</h2>}
      {Data.Para && <p>{Data.Para}</p>}
      <div className="Pricing-container">{renderPricingData}</div>
    </div>
  );
};

export default Template6;
