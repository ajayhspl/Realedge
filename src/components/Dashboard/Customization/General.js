import React, { useState, useEffect, useRef } from "react";
import { CreateToast } from "../../../App";
import { UPLOADPHOTO } from "../../../server";
import Upload from "../../../assets/upload.png";
import Input from "../../Input/Input";
import Select from "react-select";

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
  const fontFamilyOptions = [
    { value: "Roboto", label: "Roboto" },
    { value: "Inter", label: "Inter" },
    { value: "Comic Sans MS", label: "Comic Sans MS" },
    { value: "serif", label: "serif" },
    { value: "Sans-Serif", label: "Sans-Serif" },
    { value: "monospace", label: "monospace" },
    { value: "Fantasy", label: "Fantasy" },
    { value: "Arial Black", label: "Arial Black" },
    { value: "Verdana", label: "Verdana" },
    { value: "Tahoma", label: "Tahoma" },
    { value: "Trebuchet MS", label: "Trebuchet MS" },
    { value: "Georgia", label: "Georgia" },
    { value: "Courier", label: "Courier" },
    { value: "Bradley Hand", label: "Bradley Hand" },
    { value: "Luminari", label: "Luminari" },
  ];
  const handleColorChange = (colorName, newColor) => {
    setData((prevData) => ({
      ...prevData,
      Colors: {
        ...prevData.Colors,
        [colorName]: newColor,
      },
    }));
  };
  const handleCheckboxChange = () => {
    setData((prev) => ({
      ...prev,
      disableRecaptcha: !prev.disableRecaptcha,
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
        case "formsBackground":
          nameToRender = "Forms Background";
          break;
        case "FooterBackground":
          nameToRender = "Footer Background";
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

  return (
    <div className="DataEntry section4">
      <div
        style={{
          display: "flex",
          gap: "50px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
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

        <div className="formItem form-check CheckBox">
          <label className="form-check-label">
            Disable recaptcha:
            <input
              className="form-check-input"
              type="checkbox"
              checked={data.disableRecaptcha}
              onChange={handleCheckboxChange}
            />
          </label>
        </div>
        <div className="FormItem" style={{ width: "auto" }}>
          <label htmlFor="fontSelect">website Font:</label>
          <Select
            options={fontFamilyOptions}
            value={fontFamilyOptions.find((font) => font.value === data.Font)}
            onChange={(selectedOption) =>
              setData((prev) => {
                return { ...prev, Font: selectedOption.value };
              })
            }
          />
        </div>
      </div>
      <h3>Meta Data</h3>
      <span style={{ color: "red" }}>
        Warning: the below changes might effect the search engine results
      </span>
      <Input
        label="Website Name"
        type="text"
        id="WebsiteName"
        name="WebsiteName"
        value={data.WebsiteName}
        onChangeFunction={handleInput}
        customWidth="70%"
      />

      <Input
        label="Website Description"
        type="text"
        id="Description"
        name="Description"
        value={data.Description}
        onChangeFunction={handleInput}
        customWidth="70%"
      />

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
