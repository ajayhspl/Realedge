import React, { useEffect, useState } from "react";
import "./PriceCard.css";
import ContactPopUp from "../../PopUps/ContactPopup/ContactPopup";
const PriceCard = (props) => {
  const [width, setWidth] = useState(window.innerWidth);
  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const [showModal, setShowModal] = React.useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const RenderPros = props.data.pros.map((pros) => {
    const highlight = props.highLightedID === pros.id ? true : false;
    return (
      <p
        className={`${pros.id} ${highlight ? "highLight" : ""}`}
        key={pros.id}
        onMouseEnter={() => {
          props.changeHighlight(pros.id);
        }}
        onMouseLeave={() => {
          props.changeHighlight(null);
        }}
      >
        {pros.text}
      </p>
    );
  });
  return (
    <div className="PriceCard">
      <div className="TopPart">
        {props.data.title && <p className="Plan">{props.data.title}</p>}
        <div className="Price-wrapper">
          {props.data.Price && <h4>{props.data.Price} </h4>}
          {props.data.PerMonth && <span> {"  "} / Month</span>}
        </div>
        {props.data.description && (
          <p className="PlanDesc">{props.data.description}</p>
        )}
      </div>
      <div className="BottomPart">{RenderPros}</div>
      <button className="Button" onClick={handleShowModal}>
        Sign Up
      </button>
      <ContactPopUp
        show={showModal}
        handleClose={handleCloseModal}
        screenWidth={width}
        type="Price"
        Name={props.data.title}
      />
    </div>
  );
};

export default PriceCard;
