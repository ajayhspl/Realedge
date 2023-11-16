import React from "react";
import "./Card.css";
const CardMobile = (props) => {
  const Data = props.Data;
  return (
    <div className="Card">
      <div className="TextWrapper">
        {Data.MainNumber && <p className="MainNumber">{Data.MainNumber}</p>}
        {Data.subTitle && <span className="subText">{Data.subTitle}</span>}
      </div>
      {Data.Description && (
        <div className="Description animate__animated animate__fadeIn">
          <p>{Data.Description}</p>
        </div>
      )}
    </div>
  );
};

export default CardMobile;
