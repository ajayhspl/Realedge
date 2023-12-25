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
  const [NewCard, setNewCard] = useState({
    Content: "",
    Name: "",
    id: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoUploading, setVideoUploading] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handlePrimaryAction = () => {
    if (data.Sec3Elements.length === 5) {
      CreateToast("max Cards Reached", "error");
      return;
    }
    const FoundName = data.Sec3Elements.some((element) => {
      return element.Name === NewCard.Name;
    });
    if (FoundName) {
      CreateToast("Name is taken by another card", "error");
      return;
    }
    setData((prev) => ({
      ...prev,
      Sec3Elements: [...prev.Sec3Elements, NewCard],
    }));
    setNewCard({
      Content: "",
      Name: "",
      id: "",
    });
    handleCloseModal();
  };
  const handlePostBodyChange = (value, Target) => {
    if (Target === "NewCard") {
      setNewCard((prev) => {
        return { ...prev, Content: value };
      });
      return;
    }
    let valueToChange;
    switch (Target) {
      case "Section1":
        valueToChange = "Sec1Body";
        break;
      case "Section2":
        valueToChange = "Sec2Body";
        break;
      case "Section4":
        valueToChange = "Sec4Body";
        break;
      case "Section5":
        valueToChange = "Sec5Body";
        break;
      case "Section6":
        valueToChange = "Sec6Body";
        break;
      case "Section7":
        valueToChange = "Sec7Body";
        break;

      default:
        break;
    }
    setData((prev) => {
      return { ...prev, [valueToChange]: value };
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

  const DeleteCard = (id) => {
    const NewCards = data.Sec3Elements.filter((Card) => {
      return Card.id !== id;
    });

    setData((prev) => {
      return { ...prev, Sec3Elements: NewCards };
    });
  };
  const CardsData = data.Sec3Elements.map((Card) => {
    return {
      id: Card.id,
      title: Card.Name,
      Description: Card.Content,
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
  const CardsColumns = [
    {
      name: "Name",
      selector: (row) => row.title,
      sortable: true,
      center: true,
      width: "200px",
    },
    {
      name: "Description",
      selector: (row) => (
        <div
          className="text-wrap"
          dangerouslySetInnerHTML={{ __html: row.Description }}
        ></div>
      ),
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
  useEffect(() => {
    let id;
    if (data.Sec3Elements.length === 0) {
      id = 1;
    } else {
      data.Sec3Elements.sort(sortBy("id"));
      data.Sec3Elements.forEach((category) => {
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
          className="Confirm PricingModal"
          show={showModal}
          handleClose={handleCloseModal}
          title="add Card"
          primaryButtonText={`add`}
          handlePrimaryAction={handlePrimaryAction}
        >
          <>
            <Input
              label="Tab Name:"
              type="text"
              id="Name"
              name="Name"
              value={NewCard.Name}
              onChangeFunction={(event) => {
                setNewCard((prev) => {
                  return { ...prev, [event.target.name]: event.target.value };
                });
              }}
            />

            <TipTap
              setHTML={(value) => {
                handlePostBodyChange(value, "NewCard");
              }}
              OldData={NewCard.Content}
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
        AddCard
      </button>
      <DataTable
        className="Table animate__animated animate__fadeIn"
        style={{ animationDelay: ".4s" }}
        theme="light"
        highlightOnHover
        columns={CardsColumns}
        data={CardsData}
      />

      <div className="Section-wrapper">
        <h3>Section one</h3>
        <Input
          label="Section one Title:"
          type="text"
          id="Sec1Title"
          name="Sec1Title"
          value={data.Sec1Title}
          onChangeFunction={handleInput}
          customWidth="70%"
        />

        <TipTap
          setHTML={(value) => {
            handlePostBodyChange(value, "Section1");
          }}
          OldData={data.Sec1Body}
        />
      </div>
      <div className="Section-wrapper">
        <h3>Section Two</h3>
        <Input
          label="Section Two Title:"
          type="text"
          id="Sec2Title"
          name="Sec2Title"
          value={data.Sec2Title}
          onChangeFunction={handleInput}
          customWidth="70%"
        />

        <TipTap
          setHTML={(value) => {
            handlePostBodyChange(value, "Section2");
          }}
          OldData={data.Sec2Body}
        />
      </div>
      <div className="Section-wrapper">
        <h3>Section Four</h3>
        <Input
          label="Section Four Title:"
          type="text"
          id="Sec4Title"
          name="Sec4Title"
          value={data.Sec4Title}
          onChangeFunction={handleInput}
          customWidth="70%"
        />

        <Input
          label="Section Four Sub Title:"
          type="text"
          id="Sec4Subtitle"
          name="Sec4Subtitle"
          value={data.Sec4Subtitle}
          onChangeFunction={handleInput}
          customWidth="70%"
        />

        <TipTap
          setHTML={(value) => {
            handlePostBodyChange(value, "Section4");
          }}
          oldData={data.Sec4Body}
        />
      </div>
      <div className="Section-wrapper">
        <h3>Section Five</h3>
        <Input
          label="Section Five Title:"
          type="text"
          id="Sec5Title"
          name="Sec5Title"
          value={data.Sec5Title}
          onChangeFunction={handleInput}
          customWidth="70%"
        />

        <TipTap
          setHTML={(value) => {
            handlePostBodyChange(value, "Section5");
          }}
          oldData={data.Sec5Body}
        />
      </div>
      <div className="Section-wrapper">
        <h3>Section Six</h3>
        <Input
          label="Section Six Title:"
          type="text"
          id="Sec6Title"
          name="Sec6Title"
          value={data.Sec6Title}
          onChangeFunction={handleInput}
          customWidth="70%"
        />

        <TipTap
          setHTML={(value) => {
            handlePostBodyChange(value, "Section6");
          }}
          oldData={data.Sec6Body}
        />
      </div>
      <div className="Section-wrapper">
        <h3>Section Seven</h3>
        <Input
          label="Section Seven Title:"
          type="text"
          id="Sec7Title"
          name="Sec7Title"
          value={data.Sec7Title}
          onChangeFunction={handleInput}
          customWidth="70%"
        />

        <TipTap
          setHTML={(value) => {
            handlePostBodyChange(value, "Section7");
          }}
          oldData={data.Sec7Body}
        />
      </div>
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
