import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../../ViewMember/ViewMember.css";
import Upload from "../../../assets/upload.png";
import { CreateToast } from "../../../App";
import { GETDOC, SETDOC, UPLOADPHOTO, decrypt } from "../../../server";
import NotFound from "../../NotFound/NotFound";
import Input from "../../Input/Input";

const EditMember = ({ AllData }) => {
  const [ActiveUser, setActiveUser] = useState(
    sessionStorage.getItem("activeUser")
      ? decrypt(JSON.parse(sessionStorage.getItem("activeUser")).id)
      : ""
  );
  const [authorized, setAuthorized] = useState(null);
  const [Data, setData] = useState(null);
  const [photoUploaded, setPhotoUploaded] = useState(true);
  const id = useParams().ID;

  useEffect(() => {
    const GetUser = async () => {
      const fetchedUser = await GETDOC("users", ActiveUser);
      setActiveUser(fetchedUser);
      setAuthorized(
        fetchedUser.Role === "Admin" || fetchedUser.Role === "Owner"
          ? true
          : false
      );
    };
    GetUser();
  }, []);
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
  return Data && authorized ? (
    <div className="ViewMember Edit">
      <div className="Nav">
        <a href="/Dashboard" className="Link Reverse">
          Go Back to the Dashboard
        </a>
      </div>
      <div className="DataEntry Hosting">
        <Input
          label="Name:"
          type="text"
          required={true}
          id="name"
          autoComplete="false"
          name="name"
          value={Data.name}
          onChangeFunction={HandleNewInput}
          customWidth="45%"
        />

        <Input
          label="Location:"
          type="text"
          required={true}
          id="Location"
          autoComplete="false"
          name="Location"
          value={Data.Location}
          onChangeFunction={HandleNewInput}
          customWidth="45%"
        />

        <Input
          label="LinkedIn:"
          type="text"
          required={true}
          id="LinkedIn"
          autoComplete="false"
          name="LinkedIn"
          value={Data.LinkedIn}
          onChangeFunction={HandleNewInput}
        />

        <Input
          label="Whatsapp:"
          type="number"
          required={true}
          id="Whatsapp"
          autoComplete="false"
          name="Whatsapp"
          value={Data.Whatsapp}
          onChangeFunction={HandleNewInput}
          customWidth="45%"
        />

        <Input
          label="Role:"
          type="text"
          required={true}
          id="Role"
          autoComplete="false"
          name="Role"
          value={Data.Role}
          onChangeFunction={HandleNewInput}
          customWidth="45%"
        />

        <Input
          textarea={true}
          label="Overview:"
          type="textarea"
          required={true}
          id="overview"
          autoComplete="false"
          name="overview"
          value={Data.overview}
          onChangeFunction={HandleNewInput}
        />
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
  ) : (
    <NotFound />
  );
};

export default EditMember;
