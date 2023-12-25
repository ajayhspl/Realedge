import React, { useState, useEffect, useRef } from "react";
import DataTable from "react-data-table-component";
import MyModal from "../../../PopUps/Confirm/Confirm";
import { CreateToast } from "../../../../App";
import Upload from "../../../../assets/upload.png";
import { DELETEPHOTO, UPLOADPHOTO, UPLOADVIDEO } from "../../../../server";
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

const Template4 = ({ Data, UpdateData, BackEndName, setEdited, edited }) => {
  const [data, setData] = useState(Data);
  const [photoUploaded, setPhotoUploaded] = useState(true);
  const [proText, setProText] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoUploading, setVideoUploading] = useState(false);

  const [highLightedID, setHighlightedId] = useState(null);
  const changeHighlight = (id) => {
    setHighlightedId(id);
  };
  const [showModal, setShowModal] = useState({
    Pricing: false,
    Card: false,
  });
  const [NewCard, setNewCard] = useState({
    img: "",
    text: "",
    title: "",
    id: "",
  });
  const [pricingCard, setPricingCard] = useState({
    PerMonth: false,
    Price: "",
    description: "",
    title: "",
    pros: [],
    id: "",
  });
  const handleShowModal = (Target) => {
    if (Target === "Pricing") {
      if (Data.Pricing.length === 2) {
        CreateToast("you can only add 2 pricing plans here", "error");
        return;
      } else {
        setShowModal({ Pricing: true, Card: false });
      }
    }
    if (Target === "Card") {
      setShowModal({ Pricing: false, Card: true });
    }
  };
  const handleCloseModal = (Target) => {
    if (Target === "Pricing") {
      setShowModal({ Pricing: false, Card: false });
    }
    if (Target === "Card") {
      setShowModal({ Pricing: false, Card: false });
    }
  };
  const handlePrimaryAction = (Target) => {
    if (Target === "Card") {
      if (!photoUploaded) {
        CreateToast("photo uploading please wait", "error");
        return;
      }
      handleCloseModal("Card");
      setData((prev) => {
        return { ...prev, Cards: [...prev.Cards, NewCard] };
      });

      setNewCard({ img: "", text: "", title: "", id: "" });
      setPhotoUploaded(false);
    }
    if (Target === "Pricing") {
      handleCloseModal("Pricing");
      setData((prev) => {
        return { ...prev, Pricing: [...prev.Pricing, pricingCard] };
      });
      setPricingCard({
        PerMonth: false,
        Price: "",
        description: "",
        title: "",
        pros: [],
        id: "",
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
    }
    if (name === "url") {
      CreateToast("uploading photo", "info", 2000);
      const Photo = e.target.files[0];
      const url = await UPLOADPHOTO(
        `/customization/SidePages/${BackEndName}/Icon${NewCard.id}.png`,
        Photo
      );
      setNewCard((prev) => {
        return {
          ...prev,
          img: url,
        };
      });
      CreateToast("photo uploaded", "success");
      setPhotoUploaded(true);
      return;
    }
    if (name === "PageURL") {
      setData((prev) => {
        return { ...prev, [name]: value };
      });
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

    setNewCard((prev) => {
      return { ...prev, [name]: value };
    });
  };
  const DeleteCard = (id) => {
    const NewCards = data.Cards.filter((Card) => {
      return Card.id !== id;
    });
    DELETEPHOTO(`/customization/SidePages/${BackEndName}/Icon${id}.png`);
    setData((prev) => {
      return { ...prev, Cards: NewCards };
    });
  };
  const DeletePricing = (id) => {
    const NewCards = data.Pricing.filter((Card) => {
      return Card.id !== id;
    });
    setData((prev) => {
      return { ...prev, Pricing: NewCards };
    });
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
      name: "image",
      selector: (row) => row.img,
      center: true,
      width: "200px",
    },
    {
      name: "Options",
      selector: (row) => row.Options,
      center: true,
      width: "200px",
    },
  ];
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
          type="text"
          name="title"
          value={Card.title}
          onChangeFunction={handleChange}
        />
      ),
      Description: (
        <Input
          textarea={true}
          name="text"
          onChangeFunction={handleChange}
          value={Card.text}
          customWidth="70%"
        />
      ),
      img: <img src={Card.img} style={{ maxWidth: "50px", margin: "10px" }} />,
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
      return { ...prev, id: id };
    });
    let PricingID;
    if (data.Pricing.length === 0) {
      PricingID = 1;
    } else {
      data.Pricing.sort(sortBy("id"));
      data.Pricing.forEach((category) => {
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
  const renderDummyPricingData = data.Pricing.map((PricePlan) => {
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
      {showModal.Card && (
        <MyModal
          className="Confirm"
          show={showModal.Card}
          handleClose={() => {
            handleCloseModal("Card");
          }}
          title="add Card"
          primaryButtonText={`add`}
          handlePrimaryAction={() => {
            handlePrimaryAction("Card");
          }}
        >
          <>
            <div className="formItem" id="logo">
              <span>Photo:</span>
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
                name="url"
                onChange={handleInput}
              />
            </div>
            <Input
              label="title"
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
              label="Description"
              textarea={true}
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
      {showModal.Pricing && (
        <MyModal
          className="Confirm PricingModal"
          show={showModal.Pricing}
          handleClose={() => {
            handleCloseModal("Pricing");
          }}
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
              label="title"
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
              label="Price"
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
              label="Description"
              textarea={true}
              id="description"
              name="description"
              value={pricingCard.description}
              onChangeFunction={(event) => {
                setPricingCard((prev) => {
                  return { ...prev, [event.target.name]: event.target.value };
                });
              }}
            />
            <div className="formItem">
              <div className="Pros-Wrapper">
                <div className="Pros-Adder">
                  <Input
                    label="Pros"
                    type="text"
                    id="proText"
                    name="proText"
                    value={proText}
                    customWidth="70%"
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
        label="Page URL"
        type="text"
        id="PageURL"
        name="PageURL"
        value={data.PageURL}
        customWidth="70%"
        onChangeFunction={handleInput}
      />

      <Input
        label="Page Name in navigation "
        type="text"
        id="PageName"
        name="PageName"
        value={data.PageName}
        customWidth="70%"
        onChangeFunction={(e) => {
          setData((prev) => {
            return { ...prev, PageName: e.target.value };
          });
        }}
      />

      <Input
        label="Header Title"
        type="text"
        id="HeaderTitle"
        name="HeaderTitle"
        value={data.HeaderTitle}
        customWidth="70%"
        onChangeFunction={(e) => {
          setData((prev) => {
            return { ...prev, HeaderTitle: e.target.value };
          });
        }}
      />

      <div className="FormItem" style={{ width: "70%" }}>
        <Input
          label="Top Title"
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
        label="Sub Title:"
        type="text"
        id="Title"
        name="Title"
        value={data.Title}
        onChangeFunction={(e) => {
          setData((prev) => {
            return { ...prev, Title: e.target.value };
          });
        }}
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
          style={{ margin: "0px 20px" }}
          onClick={() => {
            handleShowModal("Card");
          }}
        >
          Add Card
        </button>
        <button
          className="Button Add"
          style={{ margin: "0px auto" }}
          onClick={() => {
            handleShowModal("Pricing");
          }}
        >
          Add Pricing Card
        </button>
      </div>
      <h4 style={{ margin: "20px" }}>Pricing Cards</h4>
      <div className="Pricing-container">{renderDummyPricingData}</div>
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

export default Template4;
