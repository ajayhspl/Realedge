import React, { useState, useEffect, useRef } from "react";
import MyModal from "../../../PopUps/Confirm/Confirm";
import { CreateToast } from "../../../../App";
import Upload from "../../../../assets/upload.png";
import { UPLOADPHOTO, UPLOADVIDEO, DELETEPHOTO } from "../../../../server";
import sortBy from "sort-by";
import "./SidePages.css";
import PriceCard from "../../../Cards/PriceCard/PriceCard";
import Input from "../../../Input/Input";

import Select from "react-select";
import VideoPlayer from "../../../VideoPlayer";
import TipTap from "./RichTextEditor/tiptap";
const HeaderContent = [
  { value: "Video", label: "Video" },
  { value: "Text", label: "Text" },
];

const Template6 = ({ Data, UpdateData, BackEndName, setEdited, edited }) => {
  const [data, setData] = useState(Data);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoUploading, setVideoUploading] = useState(false);

  const [proText, setProText] = useState("");
  const [highLightedID, setHighlightedId] = useState(null);
  const changeHighlight = (id) => {
    setHighlightedId(id);
  };
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const [pricingCard, setPricingCard] = useState({
    PerMonth: false,
    Price: "",
    description: "",
    title: "",
    pros: [],
    id: "",
  });
  const CheckData = () => {
    if (data.Plans.length === 3) {
      CreateToast("max Plans Reached", "error");
      return;
    }
    handleShowModal();
  };
  const handlePrimaryAction = () => {
    handleCloseModal();
    setData((prev) => {
      return { ...prev, Plans: [...prev.Plans, pricingCard] };
    });
    setPricingCard({
      PerMonth: false,
      Price: "",
      description: "",
      title: "",
      pros: [],
      id: "",
    });
  };
  const addPro = () => {
    if (proText === "") {
      return;
    }
    let id;
    if (pricingCard.pros.length === 0) {
      id = 0;
    } else {
      pricingCard.pros.sort(sortBy("id"));
      pricingCard.pros.forEach((category) => {
        id = +category.id + 1;
      });
    }
    setPricingCard((prev) => {
      return { ...prev, pros: [...prev.pros, { id: id, text: proText }] };
    });
    setProText("");
  };
  const DeletePro = (id) => {
    let tempList = pricingCard.pros.filter((pro) => {
      return pro.id != id;
    });
    setPricingCard((prev) => {
      return { ...prev, pros: tempList };
    });
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
    }

    setData((prev) => {
      return { ...prev, [name]: value };
    });
  };
  const DeletePricing = (id) => {
    const NewCards = data.Plans.filter((Card) => {
      return Card.id !== id;
    });
    setData((prev) => {
      return { ...prev, Plans: NewCards };
    });
  };

  useEffect(() => {
    let PricingID;
    if (data.Plans.length === 0) {
      PricingID = 1;
    } else {
      data.Plans.sort(sortBy("id"));
      data.Plans.forEach((category) => {
        PricingID = +category.id + 1;
      });
    }
    setPricingCard((prev) => {
      return { ...prev, id: PricingID };
    });
  }, [data]);
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      // Skip the first render
      firstRender.current = false;
    } else {
      setEdited(true);
    }
  }, [data]);
  const renderDummyPricingData = data.Plans.map((PricePlan) => {
    return (
      <div
        key={PricePlan.id}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <PriceCard
          data={PricePlan}
          changeHighlight={changeHighlight}
          highLightedID={highLightedID}
        />
        <button
          className="Button Danger"
          onClick={() => {
            DeletePricing(PricePlan.id);
          }}
        >
          Delete
        </button>
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
          title="add Pricing Card"
          primaryButtonText={`add`}
          handlePrimaryAction={() => {
            handlePrimaryAction("Pricing");
          }}
        >
          <>
            <div className="formItem">
              <label htmlFor="Subscription">Subscription:</label>
              <input
                id="Subscription"
                type="checkbox"
                name="PerMonth"
                style={{ height: "20px" }}
                checked={pricingCard.PerMonth}
                onChange={(e) =>
                  setPricingCard((prev) => {
                    return { ...prev, PerMonth: e.target.checked };
                  })
                }
              />
            </div>

            <Input
              label="Title:"
              type="text"
              id="title"
              name="title"
              value={pricingCard.title}
              onChangeFunction={(event) => {
                setPricingCard((prev) => {
                  return { ...prev, [event.target.name]: event.target.value };
                });
              }}
            />

            <Input
              label="Price:"
              type="text"
              id="Price"
              name="Price"
              value={pricingCard.Price}
              onChangeFunction={(event) => {
                setPricingCard((prev) => {
                  return { ...prev, [event.target.name]: event.target.value };
                });
              }}
            />
            <Input
              label="Description:"
              type="text"
              id="description"
              name="description"
              value={pricingCard.description}
              onChangeFunction={(event) => {
                setPricingCard((prev) => {
                  return { ...prev, [event.target.name]: event.target.value };
                });
              }}
              textarea={true}
            />

            <div className="formItem">
              <div className="Pros-Wrapper">
                <div className="Pros-Adder">
                  <Input
                    label="Pros"
                    type="text"
                    name="pro"
                    value={proText}
                    onChangeFunction={(e) => {
                      setProText(e.target.value);
                    }}
                  />

                  <button className="Button Add" onClick={addPro}>
                    Add
                  </button>
                </div>
                <ul>
                  {pricingCard.pros?.map((pro) => {
                    return (
                      <li key={pro.id}>
                        {pro.text}
                        <button
                          className="Button Danger"
                          onClick={() => {
                            DeletePro(pro.id);
                          }}
                        >
                          Delete
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </>
        </MyModal>
      )}
      <div className="formItem" id="logo">
        <span>Background:</span>
        <label htmlFor="thumbnailInput">
          <img src={Upload} style={{ width: "25px", cursor: "pointer" }} />
        </label>
        <input
          type="file"
          hidden
          accept="image/*"
          id="thumbnailInput"
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
      <Input
        textarea={true}
        label="Introduction"
        type="textarea"
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

      <div>
        <button
          className="Button Add"
          style={{ margin: "0px auto" }}
          onClick={CheckData}
        >
          Add Pricing Card
        </button>
      </div>
      <h4 style={{ margin: "20px" }}>Pricing Cards</h4>
      <div className="Pricing-container">{renderDummyPricingData}</div>
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

export default Template6;
