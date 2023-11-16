import React, { useState, useEffect } from "react";
import "./WebSettings.css";
import { GETCOLLECTION, SETDOC } from "../../../server";
import Main from "./Main";
import Loading from "../../../assets/Loading.gif";
import Template1 from "./SidePages/Template1";
import Template2 from "./SidePages/Template2";
import Template3 from "./SidePages/Template3";
import Template4 from "./SidePages/Template4";
import Template5 from "./SidePages/Template5";
import Template6 from "./SidePages/Template6";
import Template7 from "./SidePages/Template7";
import Template8 from "./SidePages/Template8";
import Template9 from "./SidePages/Template9";
import Template10 from "./SidePages/Template10";
import { CreateToast } from "../../../App";
import General from "./General";
const WebSettings = ({ SetCustomizationPage, customizationPage }) => {
  const [saving, SetSaving] = useState(false);
  const [activePage, setActivePage] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [fetchedData, setFetchedData] = useState(null);
  const [componentMapping, setComponentMapping] = useState({});
  const [combinedList, setCombinedList] = useState([]);
  const objectToArray = (obj) => {
    return Object.keys(obj).map((key) => ({
      key,
      ...obj[key],
    }));
  };
  useEffect(() => {
    let NewList = [];
    if (!isLoading) {
      for (const key in fetchedData[1]) {
        NewList.push(fetchedData[1][key].id);
      }
      NewList.sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

      setCombinedList(NewList);
    }
  }, [fetchedData]);

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
  const extractComponentMapping = (FetchedData) => {
    const componentMapping = {};
    Object.entries(FetchedData).forEach(([key, value]) => {
      const { Template, id } = value;
      const ComponentToRender = templateComponents[Template];
      if (ComponentToRender) {
        componentMapping[id] = { ComponentToRender, DataToFetch: key };
      }
    });

    return componentMapping;
  };
  useEffect(() => {
    if (fetchedData) {
      setComponentMapping(extractComponentMapping(fetchedData[1]));
    }
  }, [fetchedData]);

  const FindPage = (id) => {
    let TargetData;
    for (const key in fetchedData[1]) {
      const element = fetchedData[1][key];
      if (element.id == id) {
        TargetData = element;
        break;
      }
    }
    return TargetData;
  };
  const RenderNav = fetchedData
    ? combinedList.map((tab, index) => {
        const Page = FindPage(tab);

        const delayString = (index * 0.05).toString() + "s";
        let nameToRender;
        switch (Page.PageURL) {
          case "":
            nameToRender = "Hidden page";
            break;

          default:
            nameToRender = FindPage(tab).PageName;
            break;
        }
        return (
          <li
            style={{ animationDelay: delayString }}
            className="animate__animated animate__fadeIn"
            key={tab}
            onClick={() => {
              SetCustomizationPage(tab);
            }}
          >
            <div>
              <p> {nameToRender}</p>

              <p>Page ID : {Page.id}</p>

              <p>Page Type : {Page.PageType}</p>
            </div>
          </li>
        );
      })
    : "";
  useEffect(() => {
    const FetchData = async () => {
      setFetchedData(await GETCOLLECTION("customization"));
      setLoading(false);
    };
    FetchData();
  }, []);
  const UpdateGeneralData = async (NewValue) => {
    SetSaving(true);
    await SETDOC("customization", "Website", { ...NewValue }, false);
    setFetchedData(await GETCOLLECTION("customization"));
    CreateToast("Data Updated", "success", 2000);
    SetSaving(false);
  };
  const UpdateData = async (ChangedValue, NewValue) => {
    SetSaving(true);
    if (!NewValue.PageName) {
      CreateToast("Page Name cant be empty", "error", 1000);
      return;
    }
    const FormattedPageName = NewValue.PageName.replace(/\s+$/, "");
    const FormattedPageURL = NewValue.PageURL.replace(/\s+$/, "");

    CreateToast("Updating Data..", "info", 1000);
    const FetchedData = await GETCOLLECTION("customization");
    const FetchedDataAr = objectToArray(FetchedData[1]);
    for (const element of FetchedDataAr) {
      if (element.id === NewValue.id) {
        continue;
      }
      if (FormattedPageURL !== "" && element.PageURL === FormattedPageURL) {
        CreateToast("Page URL already exists", "error", 1000);
        return; // exit the function if condition is met
      }
    }

    const DataToSend = {
      ...FetchedData[1],
      [ChangedValue]: {
        ...NewValue,
        PageName: FormattedPageName,
        PageURL: FormattedPageURL,
      },
    };
    await SETDOC("customization", "Sidepages", { ...DataToSend }, false);
    setFetchedData(await GETCOLLECTION("customization"));
    CreateToast("Data Updated", "success", 2000);
    SetSaving(false);
  };

  const handleNav = (WhereTo) => {
    if (WhereTo === "Tab") {
      if (saving) {
        CreateToast("saving please wait", "error", 2000);
        return;
      } else {
        setActivePage("");
      }
    } else {
      if (saving) {
        CreateToast("saving please wait", "error", 2000);
        return;
      } else {
        setActivePage("");
        SetCustomizationPage("Nav1");
      }
    }
  };
  return (
    <div className="WebSettings">
      {!isLoading && (
        <>
          <h1 className="animate__animated animate__backInDown ql-align-center">
            {customizationPage === "Nav1"
              ? "Website Settings"
              : customizationPage === "TOU"
              ? "Terms of Use"
              : customizationPage === "Landing Page"
              ? "Main Page"
              : customizationPage === "General"
              ? "General Settings"
              : FindPage(customizationPage).PageName}
          </h1>
          {customizationPage === "Nav1" && (
            <p style={{ textAlign: "center", color: "green" }}>
              Ctrl+F to search
            </p>
          )}
          {customizationPage === "Nav1" && (
            <ul className="NavWrapper">
              <>
                <li
                  className="animate__animated animate__fadeIn"
                  onClick={() => {
                    SetCustomizationPage("General");
                  }}
                >
                  General
                </li>
                <li
                  className="animate__animated animate__fadeIn"
                  onClick={() => {
                    SetCustomizationPage("Landing Page");
                  }}
                >
                  Landing Page
                </li>
                {RenderNav}
              </>
            </ul>
          )}
          {customizationPage !== "Nav1" && (
            <span
              className="Link Reverse"
              onClick={() => {
                handleNav("Main");
              }}
            >
              Go Back to Main tab
            </span>
          )}
          {customizationPage === "Landing Page" && activePage !== "" && (
            <span
              className="Link Reverse"
              onClick={() => {
                handleNav("Tab");
              }}
            >
              Go Back to previous tab
            </span>
          )}
        </>
      )}
      {isLoading && (
        <div className={`Loading-wrapper ${isLoading ? "" : "FADE"}`}>
          <img src={Loading} />
        </div>
      )}
      {customizationPage === "Landing Page" && (
        <Main
          Data={fetchedData[0]}
          setActivePage={setActivePage}
          ActivePage={activePage}
          activeTab={customizationPage}
          setFetchedData={setFetchedData}
          setSaving={SetSaving}
          Tabs={fetchedData[1]}
        />
      )}
      {customizationPage === "General" && (
        <General Data={fetchedData[2]} UpdateGeneralData={UpdateGeneralData} />
      )}
      {combinedList.map((tab) => {
        const { ComponentToRender, DataToFetch } = componentMapping[tab] || {};

        if (customizationPage === tab && ComponentToRender) {
          return (
            <ComponentToRender
              key={tab}
              Data={fetchedData[1][DataToFetch]}
              UpdateData={UpdateData}
              BackEndName={DataToFetch}
            />
          );
        }
        return null;
      })}
    </div>
  );
};

export default WebSettings;
/*
1: Template1, Automation
2: Template1, Outsourcing
3:Template1, Software 
13: Template1, About
5: Template1, BigData
9: Template1, business
11: Template1,data
16: Template1,terms 
17: Template1,privacy
10: Template2,career
8: Template3,cardsimgpage
7: Template3,cardsimgpage
29: Template3,cardsimgpage
30: Template3,cardsimgpage
31: Template3,cardsimgpage
15: Template4,hosting
12: Template5,portfolio
14: Template6,pricing
19: Template7,product
20: Template7,product
21: Template7,product
22: Template7,product
23: Template7,product
24: Template7,product
25: Template7,product
26: Template7,product
27: Template7,product
28: Template7,product
18: Template8,team
6: Template9,WebTechnologies
4: Template10,WebDesign
   */
