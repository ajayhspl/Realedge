import "./PageOrder.css";
import React, { useState, useEffect, useRef } from "react";

const PageOrder = ({ FetchedData, UpdateData, setEdited }) => {
  const [PageOrder, setPageOrder] = useState(FetchedData);
  const handleSelectChange = (key, value) => {
    setPageOrder((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const sectionOrder = [
    "Section2",
    "Section3",
    "Section4",
    "Section5",
    "Section6",
    "Section7",
    "Section8",
  ];
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      // Skip the first render
      firstRender.current = false;
    } else {
      setEdited(true);
    }
  }, [PageOrder]);
  const selects = sectionOrder.map((key) => {
    const options = [];
    let name;
    switch (key) {
      case "Section2":
        name = "Section1";
        break;
      case "Section3":
        name = "Section2";
        break;
      case "Section4":
        name = "Section3";
        break;
      case "Section5":
        name = "Section4";
        break;
      case "Section6":
        name = "Section5";
        break;
      case "Section7":
        name = "Section6";
        break;
      case "Section8":
        name = "Section7";
        break;
      default:
        break;
    }
    for (let i = 1; i <= 7; i++) {
      options.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }

    return (
      <div key={key} className="select-container">
        <h6>{name}</h6>
        <select
          className="styled-select"
          value={PageOrder[key]}
          onChange={(e) => handleSelectChange(key, parseInt(e.target.value))}
        >
          {options}
        </select>
      </div>
    );
  });

  return (
    <section className="PageSort">
      <p>
        Here you can control how your Sections appear on the page, keeping in
        mind that number one is the top of the page after the header.
      </p>
      <span>(any hidden sections will be ignored)</span>
      <div className="Selects-wrapper">{selects}</div>
      <button
        className="Button View"
        onClick={() => {
          UpdateData("PageOrder", PageOrder);
        }}
      >
        Save
      </button>
    </section>
  );
};

export default PageOrder;
