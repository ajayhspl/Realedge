/* eslint-disable no-debugger */
import React, { useState, useEffect, useRef } from "react";
import Upload from "../../../../assets/upload.png";
import { CreateToast } from "../../../../App";
import { UPLOADPHOTO, UPLOADVIDEO, DELETEPHOTO } from "../../../../server";
import "../DataEntry.css";
import VideoPlayer from "../../../VideoPlayer";
import Input from "../../../Input/Input";
const HeaderSettings = ({ Data, UpdateData, setEdited }) => {
  const [data, setData] = useState(Data);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoUploading, setVideoUploading] = useState(false);
  const handleCheckboxChange = (e) => {
    const { name } = e.target;
    setData((prev) => ({ ...prev, [name]: !prev[name] }));
  };
  const handleInput = async (e) => {
    const { name, value } = e.target;
    if (name === "Video") {
      if (videoUploading) {
        CreateToast("uploading Video", "error", 2000);
        return;
      }
      setVideoUploading(true);
      CreateToast("uploading Video", "info", 10000);
      const file = e.target.files[0];
      const url = await UPLOADVIDEO(
        `/customization/Main/VideoBG`,
        file,
        handleProgress
      );

      setData((prev) => {
        return { ...prev, VideoBG: url };
      });
      setUploadProgress(0);
      CreateToast("Video uploaded", "success", 2000);

      UpdateData("Header", { ...data, VideoBG: url });
      return;
    } else if (name === "Thumbnail") {
      CreateToast("uploading thumbnail", "info");
      const Photo = e.target.files[0];
      const url = await UPLOADPHOTO(`/customization/Main/HeaderBG.jpg`, Photo);
      setData((prev) => {
        return {
          ...prev,
          thumbnail: url,
        };
      });
      CreateToast("thumbnail uploaded", "success");
      return;
    } else {
      setData((prev) => {
        return { ...prev, [name]: value };
      });
    }
  };
  const DeleteVideo = async () => {
    if (videoUploading) {
      CreateToast("Video Uploading, please wait...", "error", 2000);
      return;
    }
    CreateToast("deleting video", "info");
    await DELETEPHOTO(`/customization/Main/VideoBG`);
    await UpdateData("Header", { ...data, VideoBG: "" });
    setData((prev) => ({ ...prev, VideoBG: "" }));
    CreateToast("video deleted", "success");
  };
  const handleProgress = (progress) => {
    setUploadProgress(progress);
    if (progress === 100) {
      setVideoUploading(false);
    }
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
    <div className="DataEntry Head">
      <div className="FormItem" style={{ width: "70%" }}>
        <Input
          label="Title"
          type="text"
          required={true}
          id="Title"
          name="Title"
          value={data.Title}
          onChangeFunction={handleInput}
        />
        <input
          style={{ marginLeft: "10px" }}
          className="ColorPicker"
          type="color"
          value={data.TitleColor}
          name="TitleColor"
          onChange={handleInput}
        />
      </div>
      <div className="FormItem" style={{ width: "70%" }}>
        <Input
          textarea={true}
          label="Sub Title"
          required={true}
          id="SubTitle"
          name="SubTitle"
          value={data.SubTitle}
          onChangeFunction={handleInput}
        />
        <input
          style={{ marginLeft: "10px" }}
          className="ColorPicker"
          type="color"
          value={data.SubTitleColor}
          name="SubTitleColor"
          onChange={handleInput}
        />
      </div>
      <div className="CheckMarkWrapper" style={{ width: "70%" }}>
        <Input
          label="Button Text"
          required={true}
          id="buttonText"
          name="buttonText"
          value={data.buttonText}
          onChangeFunction={handleInput}
        />
        <div className="CheckBox">
          <span>Show</span>
          <input
            className="form-check-input"
            type="checkbox"
            checked={data.ShowButton}
            name="ShowButton"
            onChange={handleCheckboxChange}
          />
        </div>
        <input
          style={{ marginLeft: "10px" }}
          className="ColorPicker"
          type="color"
          value={data.ButtonTextColor}
          name="ButtonTextColor"
          onChange={handleInput}
        />
      </div>
      <div className="CheckMarkWrapper" style={{ width: "70%" }}>
        <Input
          label="Contact Button Text"
          required={true}
          id="ContactText"
          name="ContactText"
          value={data.ContactText}
          onChangeFunction={handleInput}
        />
        <div className="CheckBox">
          <span>Show</span>

          <input
            className="form-check-input"
            type="checkbox"
            checked={data.ShowContact}
            name="ShowContact"
            onChange={handleCheckboxChange}
          />
        </div>

        <input
          style={{ marginLeft: "10px" }}
          className="ColorPicker"
          type="color"
          value={data.ContactColor}
          name="ContactColor"
          onChange={handleInput}
        />
      </div>
      <h2>Media</h2>
      <div className="UploadWrapper">
        <div className="FormItem">
          <span>Background: </span>
          <label htmlFor="thumbnailInput">
            <img src={Upload} style={{ width: "25px", cursor: "pointer" }} />
          </label>
          <input
            type="file"
            hidden
            accept="image/*"
            required
            id="thumbnailInput"
            name="Thumbnail"
            onChange={handleInput}
          />
        </div>
        <div className="FormItem">
          <span>Video: </span>
          <label htmlFor="Video">
            <img src={Upload} style={{ width: "25px", cursor: "pointer" }} />
          </label>
          <input
            type="file"
            accept="video/*"
            hidden
            id="Video"
            name="Video"
            onChange={handleInput}
          />
        </div>
        <div className="FormItem">
          <span> Show Video:</span>
          <input
            className="form-check-input"
            type="checkbox"
            checked={data.ShowVideo}
            name="ShowVideo"
            onChange={handleCheckboxChange}
          />
        </div>
      </div>

      {uploadProgress != 0 && (
        <div className="video-progress-bar">
          <div
            className="video-progress-bar-fill"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}
      {data.VideoBG && (
        <div style={{ width: "500px" }}>
          <VideoPlayer videoUrl={data.VideoBG} />

          <button className="Button Danger" onClick={DeleteVideo}>
            Delete Video
          </button>
        </div>
      )}

      <button
        className="Button View"
        id="Submit"
        onClick={() => {
          debugger;
          UpdateData("Header", data);
        }}
      >
        Save
      </button>
    </div>
  );
};

export default HeaderSettings;
