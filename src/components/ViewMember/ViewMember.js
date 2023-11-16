import React from "react";
import { useParams } from "react-router-dom";
import "./ViewMember.css";
import linkedin from "../../assets/linkedin.png";
import Whatsapp from "../../assets/whatsapp.png";
import NotFound from "../NotFound/NotFound";
const ViewMember = ({ AllData, Tabs }) => {
  const id = useParams().ID;
  let Target = AllData.find((Team) => {
    return Team.id == id;
  });
  return (
    <div className="ViewMember">
      <div className="Nav">
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
            <h6>
              &#8226; {Target.Role ? Target.Role : ""} &mdash;{"  "}
              {Target.Location ? Target.Location : ""}
            </h6>

            {Target.overview && (
              <div className="OverView">
                <h5>Who is {Target.name}:</h5> <p>{Target.overview}</p>
              </div>
            )}
            <div className="Socials">
              <h5>Socials:</h5>
              {Target.Whatsapp && (
                <a
                  href={`https://wa.me/${Target.Whatsapp}`}
                  style={{ marginLeft: "auto", marginRight: "10px" }}
                >
                  <img src={Whatsapp} />
                </a>
              )}
              {Target.LinkedIn && (
                <a href={`${Target.LinkedIn}`}>
                  <img src={linkedin} />
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
