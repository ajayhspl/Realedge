import React, { useState, useEffect, useRef } from "react";
import { GETCOLLECTION } from "../../../../server";
const Section6 = ({ FetchedData, UpdateData, setEdited }) => {
  const [projects, SetProjects] = useState([]);
  const [data, setData] = useState(FetchedData);
  const handleSelectChange = (event, Position) => {
    const { name, value } = event.target;
    const updatedArray = data.Projects.map((obj) => {
      if (obj.Order === Position) {
        return { ...obj, ProjectID: +value };
      }
      return obj;
    });
    setData((prev) => {
      return { ...prev, Projects: updatedArray };
    });
  };

  const renderSelectElements = data.Projects.map((ProjectSlot) => {
    const renderIDs = projects?.map((Project) => {
      return (
        <option key={Project.ProjectID} value={Project.ProjectID}>
          {Project.Title}
        </option>
      );
    });
    return (
      <div key={ProjectSlot.Order} className="FormItem select-container">
        <label htmlFor="PersonPosition">Project{ProjectSlot.Order}: </label>
        <select
          className="styled-select"
          style={{ width: "200px" }}
          value={ProjectSlot.ProjectID}
          onChange={() => {
            handleSelectChange(event, ProjectSlot.Order);
          }}
        >
          {renderIDs}
        </select>
      </div>
    );
  });
  const handleInput = async (e) => {
    const { name, value } = e.target;

    setData((prev) => {
      return { ...prev, [name]: value };
    });
  };
  useEffect(() => {
    const FetchData = async () => {
      SetProjects(await GETCOLLECTION("Projects"));
    };
    FetchData();
  }, []);
  const handleCheckboxChange = () => {
    setData((prev) => ({ ...prev, Show: !prev.Show }));
  };
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      // Skip the first render
      firstRender.current = false;
    } else {
      setEdited(true);
    }
  }, [data]);
  return (
    <div className="DataEntry section6">
      <div className="formItem form-check CheckBox">
        <label className="form-check-label">
          Show Section:
          <input
            className="form-check-input"
            type="checkbox"
            checked={data.Show}
            onChange={handleCheckboxChange}
          />
        </label>
      </div>
      <div className="FormItem" id="Title">
        <label htmlFor="Title">Section Title:</label>
        <input
          type="text"
          required
          id="Title"
          name="Title"
          value={data.Title}
          onChange={handleInput}
        />
      </div>
      <div className="FormItem">
        <label htmlFor="SubTitle">Paragraph:</label>
        <textarea
          type="text"
          required
          id="SubTitle"
          name="paragraph"
          value={data.paragraph}
          onChange={handleInput}
        />
      </div>
      <div className="Select-wrapper">{renderSelectElements}</div>
      <button
        className="Button View"
        id="Submit"
        onClick={() => {
          UpdateData("Section6", data);
        }}
      >
        Save
      </button>
    </div>
  );
};

export default Section6;
/*  categories.sort(sortBy("id"));
      categories.forEach((category) => {
        id = +category.id + 1;
      });
      */
