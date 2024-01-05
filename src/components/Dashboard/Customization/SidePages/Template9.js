import React, { useState, useEffect, useRef } from "react";
import { DELETEPHOTO, UPLOADPHOTO, UPLOADVIDEO } from "../../../../server";
import { CreateToast } from "../../../../App";
import DataTable from "react-data-table-component";
import MyModal from "../../../PopUps/Confirm/Confirm";
import sortBy from "sort-by";

import Upload from "../../../../assets/upload.png";
import "./SidePages.css";
import TipTap from "./RichTextEditor/tiptap";
import Input from "../../../Input/Input";
import Select from "react-select";
import VideoPlayer from "../../../VideoPlayer";
const HeaderContent = [
  { value: "Video", label: "Video" },
  { value: "Text", label: "Text" },
];

const Template9 = ({ Data, UpdateData, BackEndName, setEdited, edited }) => {
  const [data, setData] = useState(Data);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoUploading, setVideoUploading] = useState(false);
  const [NewCard, setNewCard] = useState({
    text: "",
    title: "",
    id: "",
  });
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handlePrimaryAction = () => {
    setData((prev) => {
      return { ...prev, Cards: [...prev.Cards, NewCard] };
    });
    setNewCard({ text: "", title: "", id: "" });
    handleCloseModal();
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
  const Cardscolumns = [
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
      center: true,
      width: "200px",
    },
    {
      name: "Description",
      selector: (row) => <div className="text-wrap">{row.Description}</div>,
      sortable: true,
      center: true,
    },

    {
      name: "Options",
      selector: (row) => row.Options,
      center: true,
      width: "200px",
    },
  ];
  const DeleteCard = (id) => {
    const NewCards = data.Cards.filter((Card) => {
      return Card.id !== id;
    });

    setData((prev) => {
      return { ...prev, Cards: NewCards };
    });
  };

  const CardsData = data.Cards.map((Card) => {
    const handleChange = (e) => {
      const { name, value } = e.target;
      let oldData = data.Cards;
      let newData = oldData.map((oldCard) => {
        if (oldCard.id === Card.id) {
          return {
            ...oldCard,
            [name]: value,
          };
        } else {
          return oldCard;
        }
      });
      setData((prev) => ({ ...prev, Cards: newData }));
    };
    return {
      id: Card.id,
      title: (
        <Input
          label="Title:"
          type="text"
          name="title"
          value={Card.title}
          onChangeFunction={handleChange}
        />
      ),
      Description: (
        <Input
          textarea={true}
          type="textarea"
          name="text"
          customWidth="800px"
          onChangeFunction={handleChange}
          value={Card.text}
        />
      ),
      Options: (
        <button
          className="Button Danger"
          onClick={() => {
            DeleteCard(Card.id);
          }}
        >
          Delete
        </button>
      ),
    };
  });
  useEffect(() => {
    let id;
    if (data.Cards.length === 0) {
      id = 1;
    } else {
      data.Cards.sort(sortBy("id"));
      data.Cards.forEach((category) => {
        id = +category.id + 1;
      });
    }
    setNewCard((prev) => {
      return { ...prev, id };
    });
  }, []);
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
    <div className="DataEntry Hosting">
      {showModal && (
        <MyModal
          className="Confirm"
          show={showModal}
          handleClose={handleCloseModal}
          title="add Card"
          primaryButtonText={`add`}
          handlePrimaryAction={handlePrimaryAction}
        >
          <>
            <Input
              label="Title:"
              type="text"
              id="title"
              name="title"
              value={NewCard.title}
              onChangeFunction={(event) => {
                setNewCard((prev) => {
                  return { ...prev, [event.target.name]: event.target.value };
                });
              }}
            />

            <Input
              textarea={true}
              label="Description:"
              type="textarea"
              id="text"
              name="text"
              value={NewCard.text}
              onChangeFunction={(event) => {
                setNewCard((prev) => {
                  return { ...prev, [event.target.name]: event.target.value };
                });
              }}
            />
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
        />

        <input
          className="ColorPicker"
          type="color"
          value={data.BottomColor}
          name="BottomColor"
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
        label="Sub Title:"
        type="text"
        id="Title"
        name="Title"
        value={data.Title}
        onChangeFunction={handleInput}
        customWidth="70%"
      />

      <Input
        textarea={true}
        label="Paragraph:"
        id="Para"
        name="Para"
        value={data.Para}
        onChangeFunction={handleInput}
        customWidth="70%"
      />
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

      <button
        className="Button Add"
        style={{ margin: "0px 20px" }}
        onClick={handleShowModal}
      >
        Add Card
      </button>
      <h4 style={{ margin: "20px" }}>Cards Table</h4>
      <DataTable
        className="Table animate__animated animate__fadeIn"
        style={{ animationDelay: ".4s" }}
        theme="light"
        highlightOnHover
        columns={Cardscolumns}
        data={CardsData}
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

export default Template9;
