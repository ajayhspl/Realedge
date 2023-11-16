/* eslint-disable no-debugger */
import React, { useState } from "react";
import { CreateToast } from "../../../App";
import { UPLOADPHOTO } from "../../../server";
import Upload from "../../../assets/upload.png";

const General = ({ Data, UpdateGeneralData }) => {
  const [data, setData] = useState(Data);
  const [emailChanged, setEmailChanged] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleInput = async (e) => {
    const { name, value } = e.target;
    if (name === "Email") {
      setEmailChanged(true);
    }
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

  const SendEmail = () => {
    if (!data.Email) {
      CreateToast("email cant be left empty", "error");
      return;
    }
    CreateToast("Sending email...", "info", 3000);
    let url = `https://formsubmit.co/ajax/${data.Email}`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        message: "This is an email to verify your email address mail",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message.includes("This form needs Activation")) {
          CreateToast(
            "Email verification is required. check your mail",
            "info"
          );
        }
        if (data.success === "true") {
          CreateToast("email is already verified", "success");
        }
        setVerified(true);
        setEmailChanged(false);
      })
      .catch((error) => CreateToast(error, "error"));
  };
  const checkEmail = async () => {
    CreateToast("Checking mail", "info");
    let url = `https://formsubmit.co/ajax/${data.Email}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          message: "Congrats! the email is working",
        }),
      });

      const responseData = await response.json();
      return responseData.success === "true";
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const UpdateData = async () => {
    const emailSent = await checkEmail();
    if (emailSent) {
      if (!emailChanged) {
        CreateToast("Updating Data..", "info", 1000);

        UpdateGeneralData(data);
        return;
      }
      if (!verified) {
        CreateToast("Verify the new Email", "error");
        return;
      }
    } else {
      CreateToast(
        "Email wasn't verified,new email verification sent",
        "error",
        2000
      );
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
      {emailChanged && (
        <button className="Button View" id="Submit" onClick={SendEmail}>
          verify Email
        </button>
      )}
      <div className="FormItem" id="Title">
        <label htmlFor="ModalDescription">Contact us Description:</label>
        <input
          type="text"
          id="ModalDescription"
          name="ModalDescription"
          value={data.ModalDescription}
          onChange={handleInput}
        />
      </div>
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
      <div className="WebTheme">
        <h2>Website Colors</h2>
        <ul>{RenderColors}</ul>
      </div>
      <button className="Button View" id="Submit" onClick={UpdateData}>
        Save
      </button>
    </div>
  );
};

export default General;
