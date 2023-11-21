import React, { useState, useEffect, useRef } from "react";
import { CreateToast } from "../../../App";
import { UPLOADPHOTO } from "../../../server";
import Upload from "../../../assets/upload.png";

const General = ({ Data, UpdateGeneralData, setEdited }) => {
  const [data, setData] = useState(Data);
  const handleInput = async (e) => {
    const { name, value } = e.target;

    if (name === "Logo") {
      CreateToast("uploading photo", "info", 2000);

      const Photo = e.target.files[0];
      const url = await UPLOADPHOTO(`/customization/General/Logo`, Photo);
      setData((prev) => {
        return { ...prev, Logo: url };
      });
      CreateToast("photo uploaded", "success", 2000);

      return;
    } else if (name === "FavIcon") {
      CreateToast("uploading photo", "info", 2000);

      const Photo = e.target.files[0];
      const url = await UPLOADPHOTO(`/customization/General/FavIcon`, Photo);
      setData((prev) => {
        return { ...prev, FavIcon: url };
      });
      CreateToast("photo uploaded", "success", 2000);

      return;
    } else {
      setData((prev) => {
        return { ...prev, [name]: value };
      });
    }
  };
  const handleColorChange = (colorName, newColor) => {
    setData((prevData) => ({
      ...prevData,
      Colors: {
        ...prevData.Colors,
        [colorName]: newColor,
      },
    }));
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
  let RenderColors = Object.entries(data.Colors).map(
    ([colorName, colorValue]) => {
      let nameToRender = "";
      switch (colorName) {
        case "LinkLines":
          nameToRender = "Underline for text";
          break;
        case "ButtonColors":
          nameToRender = "Button Colors";
          break;
        case "HoverText":
          nameToRender = "Text on hover";
          break;
        default:
          nameToRender = colorName;
          break;
      }
      return (
        <li key={colorName}>
          <label>
            {nameToRender}:
            <input
              type="color"
              className="ColorPicker"
              value={colorValue}
              onChange={(e) => handleColorChange(colorName, e.target.value)}
            />
          </label>
        </li>
      );
    }
  );
  const handleCheckboxChange = () => {
    setData((prev) => ({
      ...prev,
      DefaultJobContactTitle: !prev.DefaultJobContactTitle,
    }));
  };
  return (
    <div className="DataEntry section4">
      <div className="formItem">
        <span>Tab Icon:</span>
        <label htmlFor="FavIcon">
          <img
            src={Upload}
            style={{ width: "25px", cursor: "pointer", marginLeft: "20px" }}
          />
        </label>
        <input
          type="file"
          hidden
          id="FavIcon"
          name="FavIcon"
          onChange={handleInput}
        />
      </div>
      <div className="formItem">
        <span>Logo:</span>
        <label htmlFor="Logo">
          <img
            src={Upload}
            style={{ width: "25px", cursor: "pointer", marginLeft: "20px" }}
          />
        </label>
        <input
          type="file"
          hidden
          id="Logo"
          name="Logo"
          onChange={handleInput}
        />
      </div>

      <span>
        hint: the Email that you will receive the any kind of form submits on
      </span>
      <div className="FormItem" id="Title">
        <label htmlFor="Email">Email:</label>
        <input
          type="email"
          id="Email"
          name="Email"
          value={data.Email}
          onChange={handleInput}
        />
      </div>
      <h3>Contact forms</h3>

      <div className="FormItem" id="Title">
        <label htmlFor="NavBarContactDescription">
          Nav bar contact form Description:
        </label>
        <input
          type="text"
          id="NavBarContactDescription"
          name="NavBarContactDescription"
          value={data.NavBarContactDescription}
          onChange={handleInput}
        />
      </div>
      <div className="FormItem" id="Title">
        <label htmlFor="NavBarContactTitle">NavBar contact form title:</label>
        <input
          type="text"
          id="NavBarContactTitle"
          name="NavBarContactTitle"
          value={data.NavBarContactTitle}
          onChange={handleInput}
        />
      </div>
      <div className="FormItem" id="Title">
        <label htmlFor="HeaderContactTitle">header contact form title:</label>
        <input
          type="text"
          id="HeaderContactTitle"
          name="HeaderContactTitle"
          value={data.HeaderContactTitle}
          onChange={handleInput}
        />
      </div>
      <div className="FormItem" id="Title">
        <label htmlFor="HeaderContactDescription">
          header contact form Description:
        </label>
        <input
          type="text"
          id="HeaderContactDescription"
          name="HeaderContactDescription"
          value={data.HeaderContactDescription}
          onChange={handleInput}
        />
      </div>
      <div className="FormItem" id="Title">
        <label htmlFor="JobRequestDescription">
          Job Request form Description:
        </label>
        <input
          type="text"
          id="JobRequestDescription"
          name="JobRequestDescription"
          value={data.JobRequestDescription}
          onChange={handleInput}
        />
      </div>
      <div className="FormItem" id="Title">
        <label htmlFor="JobRequestTitle">Job Request form Title:</label>
        <input
          type="text"
          id="JobRequestTitle"
          name="JobRequestTitle"
          value={data.JobRequestTitle}
          onChange={handleInput}
        />
        <div className="formItem form-check CheckBox">
          <label className="form-check-label">
            Default Naming:
            <input
              className="form-check-input"
              type="checkbox"
              checked={data.DefaultJobContactTitle}
              onChange={handleCheckboxChange}
            />
          </label>
        </div>
      </div>

      <div className="FormItem" id="Title">
        <label htmlFor="PriceContactDescription">
          Price Plan Request form Description:
        </label>
        <input
          type="text"
          id="PriceContactDescription"
          name="PriceContactDescription"
          value={data.PriceContactDescription}
          onChange={handleInput}
        />
      </div>
      <div className="FormItem" id="Title">
        <label htmlFor="PriceContactTitle">
          Price Plan Request form Title:
        </label>
        <input
          type="text"
          id="PriceContactTitle"
          name="PriceContactTitle"
          value={data.PriceContactTitle}
          onChange={handleInput}
        />
        <div className="formItem form-check CheckBox">
          <label className="form-check-label">
            Default Naming:
            <input
              className="form-check-input"
              type="checkbox"
              checked={data.DefaultPriceContactTitle}
              onChange={() => {
                setData((prev) => ({
                  ...prev,
                  DefaultPriceContactTitle: !prev.DefaultPriceContactTitle,
                }));
              }}
            />
          </label>
        </div>
      </div>
      <h3>Meta Data</h3>
      <span style={{ color: "red" }}>
        Warning: the below changes might effect the search engine results
      </span>
      <div className="FormItem" id="Title">
        <label htmlFor="WebsiteName">Website Name:</label>
        <input
          type="text"
          id="WebsiteName"
          name="WebsiteName"
          value={data.WebsiteName}
          onChange={handleInput}
        />
      </div>
      <div className="FormItem" id="Title">
        <label htmlFor="Description">Website Description:</label>
        <input
          type="text"
          id="Description"
          name="Description"
          value={data.Description}
          onChange={handleInput}
        />
      </div>
      <h3>Website Colors</h3>
      <div className="WebTheme">
        <ul>{RenderColors}</ul>
      </div>
      <button
        className="Button View"
        id="Submit"
        onClick={() => {
          UpdateGeneralData(data);
        }}
      >
        Save
      </button>
    </div>
  );
};

export default General;
