import React, { useState, useRef, useEffect } from "react";
import { CreateToast } from "../../../../App";
import Upload from "../../../../assets/upload.png";
import {
  UPLOADPHOTO,
  GETCOLLECTION,
  SETDOC,
  DELETEDOC,
} from "../../../../server";
import sortBy from "sort-by";
import MyModal from "../../../PopUps/Confirm/Confirm";
import TeamCard from "../../../Cards/Team/TeamCard";
const Template8 = ({ Data, UpdateData, BackEndName, setEdited }) => {
  const [photoUploaded, setPhotoUploaded] = useState(true);
  const [newPerson, setNewPerson] = useState({
    LinkedIn: "",
    Location: "",
    Role: "",
    Whatsapp: "",
    id: "",
    image: "",
    name: "",
    overview: "",
  });
  const [data, setData] = useState(Data);
  const [showModal, setShowModal] = useState(false);
  const [Team, setTeam] = useState([]);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handlePrimaryAction = async () => {
    if (!validateLink(newPerson.LinkedIn)) {
      CreateToast("LinkedIn is not a valid Link", "error");
      return;
    }

    if (!photoUploaded) {
      CreateToast("photo uploading please wait", "error");
      return;
    }
    handleCloseModal();
    CreateToast("Adding...", "info");

    await SETDOC("Team", newPerson.id, { ...newPerson }, true);
    setTeam(await GETCOLLECTION("Team"));

    CreateToast("Person Added", "success");
    setNewPerson({
      LinkedIn: "",
      Location: "",
      Role: "",
      Whatsapp: "",
      id: "",
      image: "",
      name: "",
      overview: "",
    });
    setPhotoUploaded(true);
  };
  const HandleNewInput = async (e) => {
    const { name, value } = e.target;

    if (name === "Photo") {
      setPhotoUploaded(false);
      CreateToast("uploading photo", "info", 2000);

      const Photo = e.target.files[0];
      const url = await UPLOADPHOTO(
        `/customization/SidePages/${BackEndName}/${newPerson.id}/Photo.jpg`,
        Photo
      );
      setNewPerson((prev) => {
        return { ...prev, image: url };
      });
      CreateToast("photo uploaded", "success", 2000);
      setPhotoUploaded(true);

      return;
    } else {
      setNewPerson((prev) => {
        return { ...prev, [name]: value };
      });
    }
  };
  const handleInput = async (e) => {
    const { name, value } = e.target;

    if (name === "BG") {
      CreateToast("uploading photo", "info", 2000);

      const Photo = e.target.files[0];
      const url = await UPLOADPHOTO(
        `/customization/SidePages/${BackEndName}/BG.jpg`,
        Photo
      );
      setData((prev) => {
        return { ...prev, BG: url };
      });
      CreateToast("photo uploaded", "success", 2000);

      return;
    } else {
      setData((prev) => {
        return { ...prev, [name]: value };
      });
    }
  };
  const validateLink = (link) => {
    const linkPattern = /^(http|https):\/\/([\w.-]+)\.([a-zA-Z]{2,})(\/\S*)?$/;
    return linkPattern.test(link);
  };
  useEffect(() => {
    const GetID = async () => {
      let id;
      const Team = await GETCOLLECTION("Team");
      if (Team.length === 0) {
        id = 1;
      } else {
        Team.sort(sortBy("id"));
        Team.forEach((Member) => {
          id = +Member.id + 1;
        });
      }
      setNewPerson((prev) => {
        return { ...prev, id };
      });
    };
    GetID();
  }, []);
  useEffect(() => {
    const FetchData = async () => {
      setTeam(await GETCOLLECTION("Team"));
    };
    FetchData();
  }, []);
  const DeletePerson = async (id) => {
    CreateToast(`Deleting...`, "info");
    await DELETEDOC("Team", id);
    setTeam(await GETCOLLECTION("Team"));
    CreateToast("deleted", "success");
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
  const renderTeam = Team.map((Person, index) => {
    const delayString = (index * 0.05).toString() + "s";

    return (
      <div className="Card-wrapper" key={Person.id}>
        <TeamCard Data={Person} delayString={delayString} admin={true} />
        <div className="Button-wrapper">
          <button
            className="Button View"
            onClick={() => {
              window.location.href = `/Dashboard/Member/${Person.id}`;
            }}
          >
            Edit
          </button>
          <button
            className="Button Danger"
            onClick={() => {
              DeletePerson(Person.id);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    );
  });
  return (
    <div className="DataEntry Hosting">
      {showModal && (
        <MyModal
          className="Confirm PricingModal"
          show={showModal}
          handleClose={handleCloseModal}
          title="Add Person"
          primaryButtonText={`Add`}
          handlePrimaryAction={handlePrimaryAction}
        >
          <>
            <div className="formItem" id="Name">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                required
                id="name"
                autoComplete="false"
                name="name"
                value={newPerson.name}
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
                value={newPerson.Location}
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
                value={newPerson.LinkedIn}
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
                value={newPerson.Whatsapp}
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
                value={newPerson.Role}
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
                value={newPerson.overview}
                onChange={HandleNewInput}
              />
            </div>

            <div className="formItem" id="logo">
              <span>Picture:</span>
              <label htmlFor="thumbnailInput">
                <img
                  src={Upload}
                  style={{ width: "25px", cursor: "pointer" }}
                />
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
          </>
        </MyModal>
      )}
      <div className="formItem" id="logo">
        <span>Background:</span>
        <label htmlFor="BG">
          <img src={Upload} style={{ width: "25px", cursor: "pointer" }} />
        </label>
        <input
          type="file"
          accept="image/*"
          hidden
          id="BG"
          name="BG"
          onChange={handleInput}
        />
      </div>
      <span style={{ margin: "20px" }}>
        to hide a page just leave the <strong>Page URL</strong> field empty
      </span>
      <div className="FormItem" id="Title">
        <label htmlFor="PageURL">Page URL:</label>
        <input
          type="text"
          id="PageURL"
          name="PageURL"
          value={data.PageURL}
          onChange={handleInput}
        />
      </div>
      <div className="FormItem" id="Title">
        <label htmlFor="PageName">Page Name:</label>
        <input
          type="text"
          id="PageName"
          name="PageName"
          value={data.PageName}
          onChange={handleInput}
        />
      </div>
      <div className="FormItem" id="Title">
        <label htmlFor="HeaderTitle">Header Title:</label>
        <input
          type="text"
          id="HeaderTitle"
          name="HeaderTitle"
          value={data.HeaderTitle}
          onChange={handleInput}
        />
      </div>
      <div className="FormItem">
        <label htmlFor="TopTitle">Top Title:</label>
        <input
          type="text"
          required
          id="TopTitle"
          name="TopTitle"
          value={data.TopTitle}
          onChange={handleInput}
        />
        <input
          className="ColorPicker"
          type="color"
          value={data.TopColor}
          name="TopColor"
          onChange={handleInput}
        />
      </div>
      <div className="FormItem">
        <label htmlFor="BottomTitle">Bottom Title:</label>
        <input
          type="text"
          required
          id="BottomTitle"
          name="BottomTitle"
          value={data.BottomTitle}
          onChange={handleInput}
          style={{ color: data.BottomColor }}
        />
        <input
          className="ColorPicker"
          type="color"
          value={data.BottomColor}
          name="BottomColor"
          onChange={handleInput}
        />
      </div>
      <button className="Button View" onClick={handleShowModal}>
        Add Person
      </button>
      {Team && <ul className="Team-wrapper">{renderTeam}</ul>}
      <button
        className="Button View"
        id="Submit"
        onClick={() => {
          UpdateData(BackEndName, data);
        }}
      >
        Save
      </button>
    </div>
  );
};

export default Template8;
