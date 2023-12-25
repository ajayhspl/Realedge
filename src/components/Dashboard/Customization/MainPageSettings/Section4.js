import React, { useState, useEffect, useRef } from "react";
import { UPLOADPHOTO } from "../../../../server";
import Upload from "../../../../assets/upload.png";
import { CreateToast } from "../../../../App";
import Input from "../../../Input/Input";
const Section4 = ({ FetchedData, UpdateData, setEdited, edited }) => {
  const [data, setData] = useState(FetchedData);
  const [photoUploaded, setPhotoUploaded] = useState(true);

  const handleInput = async (e) => {
    const { name, value } = e.target;
    if (name === "url") {
      CreateToast("uploading photo", "info", 2000);
      const Photo = e.target.files[0];
      const URL = await UPLOADPHOTO(`/customization/Section4/BG`, Photo);
      setData((prev) => ({ ...prev, URL }));

      CreateToast("photo uploaded", "success");
      setPhotoUploaded(true);
      return;
    }
    setData((prev) => {
      return { ...prev, [name]: value };
    });
  };
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
    <div className="DataEntry section4">
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
      <div className="FormItem">
        <span>Section Photo:</span>
        <label htmlFor="thumbnailInput">
          <img src={Upload} style={{ width: "25px", cursor: "pointer" }} />
        </label>
        <input
          type="file"
          hidden
          accept="image/*"
          required
          id="thumbnailInput"
          name="url"
          onChange={handleInput}
        />
      </div>
      <p>Section color</p>
      <input
        style={{ marginLeft: "10px" }}
        className="ColorPicker"
        type="color"
        value={data.sectionColor}
        name="sectionColor"
        onChange={handleInput}
      />
      <Input
        label="Section Title"
        type="text"
        required={true}
        id="title"
        name="title"
        value={data.title}
        onChangeFunction={handleInput}
        customWidth="70%"
      />

      <Input
        textarea={true}
        label="Paragraph"
        required={true}
        id="paragraph"
        name="paragraph"
        value={data.paragraph}
        onChangeFunction={handleInput}
        customWidth="70%"
      />
      <div className={`SubmitWrapper ${edited ? "fixed" : ""}`}>
        <button
          className="Button View"
          id="Submit"
          onClick={() => {
            if (!photoUploaded) {
              CreateToast("photo uploading please wait", "error");
              return;
            }
            setEdited(false);
            UpdateData("Section4", data);
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default Section4;
