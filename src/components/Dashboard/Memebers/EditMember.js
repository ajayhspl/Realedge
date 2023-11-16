import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../../ViewMember/ViewMember.css";
import Upload from "../../../assets/upload.png";
import { CreateToast } from "../../../App";
import { SETDOC, UPLOADPHOTO } from "../../../server";

const EditMember = ({ AllData }) => {
  const [Data, setData] = useState(null);
  const [photoUploaded, setPhotoUploaded] = useState(true);

  const id = useParams().ID;
  useEffect(() => {
    setData(
      AllData.find((Team) => {
        return Team.id == id;
      })
    );
  }, []);
  const HandleNewInput = async (e) => {
    const { name, value } = e.target;

    if (name === "Photo") {
      setPhotoUploaded(false);
      CreateToast("uploading photo", "info", 2000);

      const Photo = e.target.files[0];
      const url = await UPLOADPHOTO(
        `/customization/SidePages/Team/${Data.id}/Photo.jpg`,
        Photo
      );
      setData((prev) => {
        return { ...prev, image: url };
      });
      CreateToast("photo uploaded", "success", 2000);
      setPhotoUploaded(true);

      return;
    } else {
      setData((prev) => {
        return { ...prev, [name]: value };
      });
    }
  };
  const UpdateData = async () => {
    if (!photoUploaded) {
      CreateToast(" Photo Uploading", "warning", 2000);
      return;
    }
    CreateToast(" Updating", "info", 2000);
    await SETDOC("Team", Data.id, { ...Data }, false);
    CreateToast("Team Updated", "success", 2000);
  };
  return (
    Data && (
      <div className="ViewMember Edit">
        <div className="Nav">
          <a href="/Dashboard" className="Link Reverse">
            Go Back to the Dashboard
          </a>
        </div>
        <div className="DataEntry Hosting">
          <div className="formItem" id="Name">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              required
              id="name"
              autoComplete="false"
              name="name"
              value={Data.name}
              onChange={HandleNewInput}
            />
          </div>
          <div className="formItem" id="Name">
            <label htmlFor="Location">Location:</label>
            <input
              type="text"
              required
              id="Location"
              autoComplete="false"
              name="Location"
              value={Data.Location}
              onChange={HandleNewInput}
            />
          </div>
          <div className="formItem" id="Name">
            <label htmlFor="LinkedIn">LinkedIn:</label>
            <input
              type="text"
              required
              id="LinkedIn"
              autoComplete="false"
              name="LinkedIn"
              value={Data.LinkedIn}
              onChange={HandleNewInput}
            />
          </div>
          <div className="formItem" id="Name">
            <label htmlFor="Whatsapp">Whatsapp:</label>
            <input
              type="number"
              required
              id="Whatsapp"
              autoComplete="false"
              name="Whatsapp"
              value={Data.Whatsapp}
              onChange={HandleNewInput}
            />
          </div>
          <div className="formItem" id="Name">
            <label htmlFor="Role">Role:</label>
            <input
              type="text"
              required
              id="Role"
              autoComplete="false"
              name="Role"
              value={Data.Role}
              onChange={HandleNewInput}
            />
          </div>
          <div className="formItem" id="Name">
            <label htmlFor="overview">overview:</label>
            <textarea
              type="text"
              required
              id="overview"
              autoComplete="false"
              name="overview"
              value={Data.overview}
              onChange={HandleNewInput}
            />
          </div>
        </div>
        <div className="formItem" id="logo">
          <span>Picture:</span>
          <label htmlFor="thumbnailInput">
            <img src={Upload} style={{ width: "25px", cursor: "pointer" }} />
          </label>
          <input
            type="file"
            hidden
            required
            id="thumbnailInput"
            name="Photo"
            onChange={HandleNewInput}
          />
        </div>
        <button className="Button View" onClick={UpdateData}>
          Save Changes
        </button>
      </div>
    )
  );
};

export default EditMember;
