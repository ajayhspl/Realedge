import React from "react";
import "./TeamCard.css";

import { FaWhatsapp } from "react-icons/fa";
import { CiLinkedin } from "react-icons/ci";

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
        <div>
          {Data.Whatsapp && (
            <a
              href={`https://wa.me/${Data.Whatsapp}`}
              style={{ marginLeft: "auto", marginRight: "10px" }}
            >
              <FaWhatsapp style={{ fontSize: "2rem", color: "var(--icons)" }} />
            </a>
          )}
          {Data.LinkedIn && (
            <a href={Data.LinkedIn}>
              <CiLinkedin style={{ fontSize: "2rem", color: "var(--icons)" }} />
            </a>
          )}
        </div>
        {Data.Role && <p className="Role">{Data.Role}</p>}
      </div>
    </div>
  );
};

export default TeamCard;
