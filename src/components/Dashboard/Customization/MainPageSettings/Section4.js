import React, { useState } from "react";
import { UPLOADPHOTO } from "../../../../server";
import Upload from "../../../../assets/upload.png";
import { CreateToast } from "../../../../App";
const Section4 = ({ FetchedData, UpdateData }) => {
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
      <div className="FormItem" id="Title">
        <label htmlFor="Title">Section Title:</label>
        <input
          type="text"
          required
          id="Title"
          name="title"
          value={data.title}
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
      <button
        className="Button View"
        id="Submit"
        onClick={() => {
          if (!photoUploaded) {
            CreateToast("photo uploading please wait", "error");
            return;
          }
          UpdateData("Section4", data);
        }}
      >
        Save
      </button>
    </div>
  );
};

export default Section4;
