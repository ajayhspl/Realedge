import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header2 from "./Header/Header2";
import NotFound from "./NotFound/NotFound";
import Template1 from "./Templates/Template1";
import Template2 from "./Templates/Template2";
import Template3 from "./Templates/Template3";
import Template4 from "./Templates/Template4";
import Template5 from "./Templates/Template5";
import Template6 from "./Templates/Template6";
import Template7 from "./Templates/Template7";
import Template8 from "./Templates/Template8";
import Template9 from "./Templates/Template9";
import Template10 from "./Templates/Template10";
const Redirect = ({ data, Projects, Teams, screenWidth }) => {
  const PageURL = useParams().NAME;
  const [TargetPage, setTargetPage] = useState(null);
  let ArPages = [];

  const templateComponents = {
    Template1,
    Template2,
    Template3,
    Template4,
    Template5,
    Template6,
    Template7,
    Template8,
    Template9,
    Template10,
  };

  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      const element = data[key];
      ArPages.push(element);
    }
  }
  useEffect(() => {
    if (ArPages.length > 0) {
      const foundPage = ArPages.find((page) => page.PageURL === PageURL);

      setTargetPage(foundPage);
    }
  }, [PageURL]);
  if (!TargetPage) {
    return <NotFound />;
  }
  const {
    HeaderTitle,
    BG,
    Template,
    TopTitle,
    TopColor,
    BottomTitle,
    BottomColor,
    Font,
    Color,
    HeaderData,
    WhatToShow,
    Video,
  } = TargetPage;
  const Component = templateComponents[Template];
  return (
    <>
      <Header2
        screenWidth={screenWidth}
        title={HeaderTitle}
        bg={BG}
        TopTitle={TopTitle}
        TopColor={TopColor}
        BottomTitle={BottomTitle}
        BottomColor={BottomColor}
        Font={Font}
        Color={Color}
        HeaderData={HeaderData}
        WhatToShow={WhatToShow}
        Video={Video}
      />
      {Component && (
        <Component Data={TargetPage} FetchedProjects={Projects} Teams={Teams} />
      )}
    </>
  );
};

export default Redirect;
