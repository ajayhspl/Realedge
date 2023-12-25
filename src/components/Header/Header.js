import React from "react";
import "./Header.css";
import ContactPopUp from "../PopUps/ContactPopup/ContactPopup";
const Header = (props) => {
  const severData = props.ServerData;
  const [showModal, setShowModal] = React.useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  return (
    <div className="Header">
      <div className="Content ">
        <div className="TopBar">
          {props.screenWidth > 1000 && severData.ShowContact && (
            <div className="Right animate__animated animate__fadeInRight">
              <span
                onClick={handleShowModal}
                style={{ color: severData.ContactColor }}
              >
                {severData.ContactText}
              </span>
            </div>
          )}
        </div>
        <div className="BTM" style={{ marginBottom: "20px", gap: "0" }}>
          {severData.Title && (
            <h1
              id="HeaderTitle"
              className="animate__animated animate__fadeInDown"
              style={{ color: severData.TitleColor }}
            >
              {severData.Title}
            </h1>
          )}
          {severData.SubTitle && (
            <h3
              className="animate__animated animate__fadeInUp"
              style={{ color: severData.SubTitleColor }}
            >
              {severData.SubTitle}
            </h3>
          )}
          {severData.buttonText && severData.ShowButton && (
            <button
              className="Button animate__animated animate__fadeInLeft"
              onClick={handleShowModal}
            >
              {severData.buttonText}
            </button>
          )}
        </div>
      </div>

      <div
        className={`overlay ${
          props.screenWidth > 500 && severData.ShowVideo ? "Video" : "Photo"
        }`}
        style={{
          backgroundImage: `url(${
            severData.ShowVideo
              ? props.screenWidth < 500
                ? severData.BGURL
                : ""
              : severData.BGURL
          })`,
        }}
      >
        {severData.ShowVideo && props.screenWidth > 500 && (
          <video autoPlay muted loop>
            <source src={severData.VideoBG} />
          </video>
        )}
      </div>
      <ContactPopUp
        show={showModal}
        handleClose={handleCloseModal}
        type="Project"
      />
    </div>
  );
};

export default Header;
