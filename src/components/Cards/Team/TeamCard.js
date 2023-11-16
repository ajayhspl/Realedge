import React from "react";
import "./TeamCard.css";
import linkedin from "../../../assets/linkedin.png";
import Whatsapp from "../../../assets/whatsapp.png";
const TeamCard = ({ Data, delayString, admin }) => {
  return (
    <div
      style={{ animationDelay: delayString }}
      className="TeamCard animate__animated animate__fadeInUp"
    >
      <div className="Photo">
        <img
          src={Data.image}
          alt={Data.name}
          onClick={() => {
            admin ? "" : (window.location.href = `/Member/${Data.id}`);
          }}
        />
      </div>
      <div className="Details">
        <p
          onClick={() => {
            admin ? "" : (window.location.href = `/Member/${Data.id}`);
          }}
        >
          {Data.name}
        </p>
        <br />
        {Data.Whatsapp && (
          <a
            href={`https://wa.me/${Data.Whatsapp}`}
            style={{ marginLeft: "auto", marginRight: "10px" }}
          >
            <img src={Whatsapp} />
          </a>
        )}
        {Data.LinkedIn && (
          <a href={Data.LinkedIn}>
            <img src={linkedin} />
          </a>
        )}
        {Data.Role && <p className="Role">{Data.Role}</p>}
      </div>
    </div>
  );
};

export default TeamCard;
