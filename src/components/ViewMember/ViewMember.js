import React from "react";
import { useParams } from "react-router-dom";
import "./ViewMember.css";
import NotFound from "../NotFound/NotFound";
import { FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import { CiLinkedin } from "react-icons/ci";

const ViewMember = ({ AllData, Tabs }) => {
  const id = useParams().ID;
  let Target = AllData.find((Team) => {
    return Team.id == id;
  });
  return (
    <div className="ViewMember">
      <div style={{ width: "95%", margin: " 0 20px" }}>
        <a href={`/${Tabs.Team.PageURL}`} className="Link Reverse">
          Go Back to Teams
        </a>
      </div>
      {Target ? (
        <div className="content">
          <div className="Picture">
            <img src={Target.image} />
          </div>
          <div className="Details">
            <h5> {Target.name}</h5>
            <h6>
              {Target.Role ? Target.Role : ""} &mdash;{"  "}
              {Target.Location ? Target.Location : ""}
            </h6>

            {Target.overview && (
              <div className="OverView">
                <p>{Target.overview}</p>
              </div>
            )}
            <div className="Socials">
              {Target.Whatsapp && (
                <a
                  href={`https://wa.me/${Target.Whatsapp}`}
                  style={{ marginLeft: "auto", marginRight: "10px" }}
                >
                  <FaWhatsapp
                    style={{ fontSize: "2rem", color: "var(--icons)" }}
                  />
                </a>
              )}
              {Target.Whatsapp && (
                <button className="phone">
                  <FaPhoneAlt
                    style={{
                      fontSize: "1.2rem",
                      color: "var(--icons)",
                      marginRight: "5px",
                    }}
                  />
                  {Target.Whatsapp}
                </button>
              )}
              {Target.LinkedIn && (
                <a href={`${Target.LinkedIn}`}>
                  <CiLinkedin
                    style={{ fontSize: "2rem", color: "var(--icons)" }}
                  />
                </a>
              )}
            </div>
          </div>
        </div>
      ) : (
        <NotFound />
      )}
    </div>
  );
};

export default ViewMember;
