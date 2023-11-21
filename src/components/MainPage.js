import React from "react";
import Section2 from "./LandingPage/Section2/Section2";
import Section3 from "./LandingPage/Section3/Section3";
import Section4 from "./LandingPage/Section4/Section4";
import Section5 from "./LandingPage/Section5/Section5";
import Section6 from "./LandingPage/Section6/Section6";
import Section7 from "./LandingPage/Section7/Section7";
import Section8 from "./LandingPage/Section8/Section8";
const MainPage = ({ width, FetchedData, Projects, Tabs, PageOrder }) => {
  const sortedEntries = Object.entries(PageOrder).sort((a, b) => a[1] - b[1]);
  const componentMap = {
    Section2,
    Section3,
    Section4,
    Section5,
    Section6,
    Section7,
    Section8,
  };

  return (
    <div className="section-wrapper">
      {sortedEntries.map(([key, value]) => {
        let Data;
        switch (key) {
          case "Section2":
            Data = FetchedData[0].Section1;
            break;
          case "Section3":
            Data = FetchedData[0].Section3;
            break;
          case "Section4":
            Data = FetchedData[0].Section4;
            break;
          case "Section5":
            Data = FetchedData[0].Section5;
            break;
          case "Section6":
            Data = FetchedData[0].Section6;
            break;
          case "Section7":
            Data = FetchedData[0].Section7;
            break;
          case "Section8":
            Data = FetchedData[0].Section8;
            break;
          default:
            break;
        }
        const Component = componentMap[key];
        if (Data.Show) {
          return (
            <Component
              screenWidth={width}
              key={key}
              value={value}
              ServerData={Data}
              Tabs={Tabs}
              Projects={Projects}
            />
          );
        }
      })}
    </div>
  );
};
export default MainPage;
