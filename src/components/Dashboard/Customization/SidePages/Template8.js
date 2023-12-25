import React, { useState, useRef, useEffect } from "react";
import { CreateToast } from "../../../../App";
import Upload from "../../../../assets/upload.png";
import {
  UPLOADPHOTO,
  GETCOLLECTION,
  SETDOC,
  DELETEDOC,
  DELETEPHOTO,
  UPLOADVIDEO,
} from "../../../../server";
import DataTable from "react-data-table-component";
import sort from "../../../../assets/sort.png";

import sortBy from "sort-by";
import MyModal from "../../../PopUps/Confirm/Confirm";
import Input from "../../../Input/Input";
import Select from "react-select";
import VideoPlayer from "../../../VideoPlayer";
import TipTap from "./RichTextEditor/tiptap";
const HeaderContent = [
  { value: "Video", label: "Video" },
  { value: "Text", label: "Text" },
];

const Template8 = ({ Data, UpdateData, BackEndName, setEdited, edited }) => {
  const [photoUploaded, setPhotoUploaded] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoUploading, setVideoUploading] = useState(false);

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
    setData((prev) => {
      return {
        ...prev,
        Order: [
          ...prev.Order,
          { id: newPerson.id, index: prev.Order.length + 1 },
        ],
      };
    });
    await UpdateData(BackEndName, {
      ...data,
      Order: [
        ...data.Order,
        { id: newPerson.id, index: data.Order.length + 1 },
      ],
    });
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
  const DeleteVideo = async () => {
    if (videoUploading) {
      CreateToast("Video Uploading, please wait...", "error", 2000);
      return;
    }
    CreateToast("deleting video", "info");
    await DELETEPHOTO(`/customization/SidePages/${BackEndName}/Video`);
    await UpdateData(BackEndName, { ...data, Video: "", WhatToShow: "Text" });
    setData((prev) => ({ ...prev, Video: "" }));
    CreateToast("video deleted", "success");
  };
  const handleProgress = (progress) => {
    setUploadProgress(progress);
    if (progress === 100) {
      setVideoUploading(false);
    }
  };
  const handleHeaderDataChange = (value) => {
    setData((prev) => {
      return { ...prev, HeaderData: value };
    });
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
    } else if (name === "Video") {
      if (videoUploading) {
        CreateToast("uploading Video", "error", 2000);
        return;
      }
      setVideoUploading(true);
      CreateToast("uploading Video", "info", 10000);
      const file = e.target.files[0];
      const url = await UPLOADVIDEO(
        `/customization/SidePages/${BackEndName}/Video`,
        file,
        handleProgress
      );

      setData((prev) => {
        return { ...prev, Video: url };
      });
      setUploadProgress(0);
      CreateToast("Video uploaded", "success", 2000);

      UpdateData(BackEndName, { ...data, Video: url });
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
    let newOrderList = data.Order.filter((person) => {
      return person.id !== id;
    });
    console.log(newOrderList);
    setData((prev) => {
      return {
        ...prev,
        Order: newOrderList,
      };
    });
    await UpdateData(BackEndName, {
      ...data,
      Order: newOrderList,
    });
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
  const moveToTop = (index) => {
    if (index === 0) {
      return; // If the item is already at the top, do nothing
    }
    const updatedItems = data.Order.map(({ id }) =>
      Team.find((item) => item.id === id)
    );
    const selectedItem = updatedItems.splice(index, 1)[0];
    updatedItems.splice(index - 1, 0, selectedItem);
    const extractedArray = updatedItems.map((obj, index) => ({
      id: obj.id,
      index: index + 1,
    }));
    setTeam(updatedItems);
    setData((prev) => {
      return {
        ...prev,
        Order: extractedArray,
      };
    });
  };
  const tableColumns = [
    {
      name: "Name",
      selector: (row) => <div className="text-wrap"> {row.Name}</div>,
      sortable: true,
      center: true,
      width: "200px",
    },
    {
      name: "Location",
      selector: (row) => row.Location,
      sortable: true,
      center: true,
    },
    {
      name: "LinkedIn",
      selector: (row) => row.LinkedIn,
      sortable: true,
      center: true,
    },
    {
      name: "Whatsapp",
      selector: (row) => row.Whatsapp,
      sortable: true,
      center: true,
    },
    {
      name: "Role",
      selector: (row) => row.Role,
      sortable: true,
      center: true,
    },
    {
      name: "Overview",
      selector: (row) => <div className="text-wrap">{row.Overview}</div>,
      sortable: true,
      center: true,
      width: "300px",
    },
    {
      name: "Photo",
      selector: (row) => row.Photo,
      sortable: true,
      center: true,
      width: "300px",
    },
    {
      id: "Place",
      name: "Place",
      selector: (row) => row.Place,
      sortable: true,
      center: true,
      width: "100px",
    },
    {
      name: "Options",
      selector: (row) => row.Options,
      center: true,
      width: "300px",
    },
  ];
  const tableData = Team.map((team, Index) => {
    const order = data?.Order?.find((member) => {
      if (member.id === team.id) {
        return member.index;
      }
    });
    return {
      id: team.id,
      Place: order?.index,
      Name: team.name,
      Location: team.Location,
      LinkedIn: team.LinkedIn,
      Whatsapp: team.Whatsapp,
      Role: team.Role,
      Overview: team.overview,
      Photo: (
        <img style={{ maxWidth: "200px", margin: "20px 0" }} src={team.image} />
      ),
      Options: (
        <div className="Button-wrapper">
          <button
            className="Button Sort"
            onClick={() => {
              moveToTop(Index);
            }}
          >
            <img src={sort} />
          </button>
          <button
            className="Button View"
            onClick={() => {
              window.location.href = `/Dashboard/Member/${team.id}`;
            }}
          >
            Edit
          </button>
          <button
            className="Button Danger"
            onClick={() => {
              DeletePerson(team.id);
            }}
          >
            Delete
          </button>
        </div>
      ),
    };
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
            <Input
              label="Name:"
              type="text"
              required
              id="name"
              autoComplete="false"
              name="name"
              value={newPerson.name}
              onChangeFunction={HandleNewInput}
            />

            <Input
              label="Location:"
              type="text"
              required
              id="Location"
              autoComplete="false"
              name="Location"
              value={newPerson.Location}
              onChangeFunction={HandleNewInput}
            />

            <Input
              label="LinkedIn:"
              type="url"
              required
              id="LinkedIn"
              autoComplete="false"
              name="LinkedIn"
              value={newPerson.LinkedIn}
              onChangeFunction={HandleNewInput}
            />

            <Input
              label="Whatsapp:"
              type="number"
              required
              id="Whatsapp"
              autoComplete="false"
              name="Whatsapp"
              value={newPerson.Whatsapp}
              onChangeFunction={HandleNewInput}
            />

            <Input
              label="Role:"
              type="text"
              required
              id="Role"
              autoComplete="false"
              name="Role"
              value={newPerson.Role}
              onChangeFunction={HandleNewInput}
            />

            <Input
              textarea={true}
              label="Overview:"
              type="textarea"
              required
              id="overview"
              autoComplete="false"
              name="overview"
              value={newPerson.overview}
              onChangeFunction={HandleNewInput}
            />

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
      <Input
        label="Page URL:"
        type="text"
        id="PageURL"
        name="PageURL"
        value={data.PageURL}
        onChangeFunction={handleInput}
        customWidth="70%"
      />

      <Input
        label="Page Name in navigation :"
        type="text"
        id="PageName"
        name="PageName"
        value={data.PageName}
        onChangeFunction={handleInput}
        customWidth="70%"
      />

      <Input
        label="Header Title:"
        type="text"
        id="HeaderTitle"
        name="HeaderTitle"
        value={data.HeaderTitle}
        onChangeFunction={handleInput}
        customWidth="70%"
      />

      <div className="FormItem" style={{ width: "70%" }}>
        <Input
          label="Top Title:"
          type="text"
          required={true}
          id="TopTitle"
          name="TopTitle"
          value={data.TopTitle}
          onChangeFunction={handleInput}
        />
        <input
          className="ColorPicker"
          type="color"
          value={data.TopColor}
          name="TopColor"
          onChange={handleInput}
        />
      </div>

      <div className="FormItem" style={{ width: "70%" }}>
        <Input
          label="Bottom Title:"
          type="text"
          required={true}
          id="BottomTitle"
          name="BottomTitle"
          value={data.BottomTitle}
          onChangeFunction={handleInput}
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
      <h2>Media</h2>
      <div>
        <label>What To Show:</label>
        <Select
          options={HeaderContent}
          value={HeaderContent.find(
            (object) => object.value === data.WhatToShow
          )}
          onChange={(selectedOption) =>
            setData((prev) => {
              return { ...prev, WhatToShow: selectedOption.value };
            })
          }
        />
      </div>
      <div className="HeaderContent">
        <div className="video">
          <div className="UploadWrapper">
            <div className="FormItem">
              <span>Video: </span>
              <label htmlFor="Video">
                <img
                  src={Upload}
                  style={{ width: "25px", cursor: "pointer" }}
                />
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
          </div>
          {uploadProgress != 0 && (
            <div className="video-progress-bar">
              <div
                className="video-progress-bar-fill"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
          {data.Video && (
            <div style={{ width: "500px" }}>
              <VideoPlayer videoUrl={data.Video} />

              <button className="Button Danger" onClick={DeleteVideo}>
                Delete Video
              </button>
            </div>
          )}
        </div>
        <div className="textEditor">
          <TipTap
            editorClassName="smallEditor"
            setHTML={handleHeaderDataChange}
            OldData={data.HeaderData}
          />
        </div>
      </div>

      <button className="Button View" onClick={handleShowModal}>
        Add Person
      </button>
      <DataTable
        className="Table animate__animated animate__fadeIn"
        style={{ animationDelay: ".4s" }}
        theme="light"
        highlightOnHover
        defaultSortFieldId="Place"
        columns={tableColumns}
        data={tableData}
      />
      <div className={`SubmitWrapper ${edited ? "fixed" : ""}`}>
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
    </div>
  );
};

export default Template8;
