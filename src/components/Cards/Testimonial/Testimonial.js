import React, { useState, useEffect } from "react";
import "./Testimonial.css";

export default function Testimonial(props) {
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

  const ProjectData = props.Project;
  const Testimonial = props.Testimonial;

  return (
    <div className="Testimonial">
      <div className="Left">
        {Testimonial.Title && (
          <h2 className="ShortDesc">{Testimonial.Title}</h2>
        )}
        {Testimonial.Description && (
          <p className="Review">{Testimonial.Description}</p>
        )}
        <div className="Person">
          {Testimonial.PersonName && (
            <p className="name">{Testimonial.PersonName}</p>
          )}
          {Testimonial.PersonPosition && (
            <p className="position">
              {Testimonial.PersonPosition} {ProjectData ? "at " : ""}
              {ProjectData?.CompanyName}
            </p>
          )}
        </div>
      </div>
      {width > 1000
        ? ProjectData && (
            <div className="Project">
              {ProjectData.CompanyLogo && (
                <img className="companyLogo" src={ProjectData.CompanyLogo} />
              )}
              <span className="miniTitle">PROJECT</span>
              {ProjectData.Description && (
                <p className="Description">{ProjectData.Description}</p>
              )}
              {ProjectData.Country && (
                <span className="miniTitle">COUNTRY</span>
              )}
              <div className="CountryWrapper">
                {ProjectData.CountryFlag && (
                  <img src={ProjectData.CountryFlag} />
                )}
                {ProjectData.Country && (
                  <p className="country">{ProjectData.Country}</p>
                )}
              </div>
            </div>
          )
        : ""}
    </div>
  );
}
