import React, { useState } from "react";
import "./Templates.css";

const Template10 = ({ Data }) => {
  const [activeTab, setActiveTab] = useState("Business Websites");
  return (
    <div className="Outsource">
      <div className="Sec1">
        {Data.Sec1Title && <p>{Data.Sec1Title}</p>}
        <div dangerouslySetInnerHTML={{ __html: Data.Sec1Body }}></div>
      </div>
      <div className="Sec2">
        {Data.Sec2Title && <h3>{Data.Sec2Title}</h3>}
        <div dangerouslySetInnerHTML={{ __html: Data.Sec2Body }}></div>
      </div>
      <div className="Sec3">
        {Data.Sec3Title && <h3>{Data.Sec3Title}</h3>}
        <ul>
          {Data.Sec3Elements.map((element) => {
            return (
              <li
                className={`${
                  activeTab === element.Name ? "active" : ""
                } TabItem`}
                key={element.id}
                onClick={() => {
                  setActiveTab(element.Name);
                }}
              >
                {element.Name}
              </li>
            );
          })}
        </ul>
        <div className="Content">
          {Data.Sec3Elements.map((Element) => {
            return (
              activeTab === Element.Name && (
                <div
                  className="animate__animated animate__fadeIn"
                  dangerouslySetInnerHTML={{ __html: Element.Content }}
                ></div>
              )
            );
          })}
        </div>
      </div>
      <div className="Sec4">
        {Data.Sec4Title && <h3>{Data.Sec4Title}</h3>}
        {Data.Sec4Subtitle && <h6>{Data.Sec4Subtitle}</h6>}

        <div dangerouslySetInnerHTML={{ __html: Data.Sec4Body }}></div>
      </div>
      <div className="Sec5">
        {Data.Sec5Title && <h3>{Data.Sec5Title}</h3>}
        <div dangerouslySetInnerHTML={{ __html: Data.Sec5Body }}></div>
      </div>
      <div className="Sec6">
        {Data.Sec6Title && <h3>{Data.Sec6Title}</h3>}
        <div dangerouslySetInnerHTML={{ __html: Data.Sec6Body }}></div>
      </div>
      <div className="Sec7">
        {Data.Sec7Title && <h3>{Data.Sec7Title}</h3>}
        <div dangerouslySetInnerHTML={{ __html: Data.Sec7Body }}></div>
      </div>
    </div>
  );
};

export default Template10;
