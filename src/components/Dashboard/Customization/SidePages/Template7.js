import React, { useState, useEffect, useRef } from "react";
import DataTable from "react-data-table-component";

import { CreateToast } from "../../../../App";
import { DELETEPHOTO, UPLOADPHOTO, UPLOADVIDEO } from "../../../../server";
import Upload from "../../../../assets/upload.png";
import sortBy from "sort-by";
import VideoPlayer from "../../../VideoPlayer";
import shortid from "shortid";
import TipTap from "./RichTextEditor/tiptap";
import Input from "../../../Input/Input";
import Select from "react-select";

const HeaderContent = [
  { value: "Video", label: "Video" },
  { value: "Text", label: "Text" },
];
const fontFamilyOptions = [
  { value: "", label: "Default" },
  { value: "Inter", label: "Inter" },
  { value: "Comic Sans MS", label: "Comic Sans MS" },
  { value: "serif", label: "serif" },
  { value: "Sans-Serif", label: "Sans-Serif" },
  { value: "monospace", label: "monospace" },
  { value: "Fantasy", label: "Fantasy" },
  { value: "Arial Black", label: "Arial Black" },
  { value: "Verdana", label: "Verdana" },
  { value: "Tahoma", label: "Tahoma" },
  { value: "Trebuchet MS", label: "Trebuchet MS" },
  { value: "Georgia", label: "Georgia" },
  { value: "Courier", label: "Courier" },
  { value: "Bradley Hand", label: "Bradley Hand" },
  { value: "Luminari", label: "Luminari" },
];
const Template7 = ({ Data, UpdateData, BackEndName, setEdited, edited }) => {
  const [data, setData] = useState(Data);
  const [ShowAddDocument, setShowAddDocument] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoUploading, setVideoUploading] = useState(false);
  const [showPrice, setShowPrice] = useState(false);

  const [newDocument, setNewDocument] = useState({
    Document: "",
    name: "",
    id: "",
    fileExtension: "",
  });
  const [newPrice, setNewPrice] = useState({
    Cost: "",
    Type: "",
    id: "",
  });
  const DeleteDoc = async (id) => {
    const TargetDoc = data.documents.find((document) => {
      return document.id == id;
    });
    await DELETEPHOTO(
      `/customization/SidePages/${Data.id}/${TargetDoc.name}.${TargetDoc.fileExtension}`
    );
    let tempList = data.documents.filter((document) => {
      return document.id != id;
    });
    setData((prev) => {
      return { ...prev, documents: tempList };
    });
  };
  const DeletePlan = (id) => {
    let tempList = data.Pricing.filter((Price) => {
      return Price.id != id;
    });
    setData((prev) => {
      return { ...prev, Pricing: tempList };
    });
    GetID();
  };

  const handleDocEdit = async (e) => {
    const { name, value } = e.target;
    if (name === "Document") {
      if (!newDocument.name) {
        CreateToast("add a name first", "error", 2000);
        return;
      }
      CreateToast("uploading Document", "info", 2000);
      const file = e.target.files[0];
      const fileExtension = file.name.split(".").pop(); // Get the file extension
      const url = await UPLOADPHOTO(
        `/customization/SidePages/${Data.id}/${newDocument.name}.${fileExtension}`,
        file
      );
      setNewDocument((prev) => {
        return { ...prev, Document: url, fileExtension };
      });
      CreateToast("Document uploaded", "success", 2000);
    } else {
      setNewDocument((prev) => {
        return { ...prev, [name]: value };
      });
    }
  };
  const AddDocument = () => {
    if (newDocument.name === "" || newDocument.Document === "") {
      CreateToast("document name or file are missing", "error");
      return;
    }
    setData((prev) => ({
      ...prev,
      documents: [newDocument, ...prev.documents],
    }));
    setNewDocument({
      Document: "",
      name: "",
      id: "",
      fileExtension: "",
    });
  };
  const handlePriceEdit = (e) => {
    const { name, value } = e.target;
    setNewPrice((prev) => {
      return { ...prev, [name]: value };
    });
  };
  const AddData = () => {
    if (newPrice.Cost === "" || newPrice.Type === "") {
      return;
    }
    let OldTableData = data.Pricing;
    OldTableData.push(newPrice);
    setNewPrice({
      Cost: "",
      Type: "",
      id: "",
    });
    setData((prev) => ({ ...prev, Pricing: OldTableData }));
    GetID();
    setShowPrice(false);
  };
  const GetID = () => {
    let id;
    let priceID;
    if (data.Pricing.length === 0) {
      priceID = 0;
    } else {
      priceID = shortid.generate();
    }
    if (Data.documents.length === 0) {
      id = 0;
    } else {
      Data.documents.sort(sortBy("id"));
      Data.documents.forEach((document) => {
        id = +document.id + 1;
      });
    }
    setNewPrice((prev) => {
      return { ...prev, id: String(priceID) };
    });
    setNewDocument((prev) => {
      return { ...prev, id: String(id) };
    });
  };
  useEffect(() => {
    GetID();
  }, [Data]);
  const DeleteVideo = async () => {
    if (videoUploading) {
      CreateToast("Video Uploading, please wait...", "error", 2000);
      return;
    }
    CreateToast("deleting video", "info");
    await DELETEPHOTO(`/customization/SidePages/${Data.id}/Video.mp4`);
    await UpdateData(BackEndName, { ...data, Video: "" });
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
    if (name === "Video") {
      if (videoUploading) {
        CreateToast("uploading Video", "error", 2000);
        return;
      }
      setVideoUploading(true);
      CreateToast("uploading Video", "info", 10000);
      const file = e.target.files[0];
      const url = await UPLOADVIDEO(
        `/customization/SidePages/${Data.id}/Video.mp4`,
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
    } else if (name === "BG") {
      CreateToast("uploading photo", "info", 2000);

      const Photo = e.target.files[0];
      const url = await UPLOADPHOTO(
        `/customization/SidePages/${Data.id}/BG.jpg`,
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
  const handlePostBodyChange = (value, Target) => {
    let valueToChange;
    switch (Target) {
      case "HighlightsBody":
        valueToChange = "HighlightsBody";
        break;
      case "OverViewBody":
        valueToChange = "OverViewBody";
        break;
      case "Section3Body":
        valueToChange = "Section3Body";
        break;
      case "SupportBody":
        valueToChange = "SupportBody";
        break;
      default:
        break;
    }
    setData((prev) => {
      return { ...prev, [valueToChange]: value };
    });
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
  const columnsDoc = [
    {
      name: "FileName",
      selector: (row) => row.FileName,
      sortable: true,
      center: true,
      width: "200px",
    },
    {
      name: "preview",
      selector: (row) => row.preview,
      sortable: true,
      center: true,
    },
    {
      name: "options",
      selector: (row) => row.options,
      center: true,
    },
  ];
  const infoDoc = data.documents.map((document) => {
    return {
      FileName: document.name,
      preview: (
        <a target="_blank" rel="noopener noreferrer" href={document.Document}>
          {document.name}
        </a>
      ),
      options: (
        <button
          className="Button Danger"
          onClick={() => {
            DeleteDoc(document.id);
          }}
        >
          Delete
        </button>
      ),
    };
  });
  const columns = [
    {
      name: data.PricingTableHeader.Type,
      selector: (row) => row.Type,
      sortable: true,
      center: true,
      width: "200px",
    },
    {
      name: data.PricingTableHeader.Cost,
      selector: (row) => row.Cost,
      sortable: true,
      center: true,
    },
    {
      name: "options",
      selector: (row) => row.options,
      center: true,
    },
  ];
  const info = data.Pricing.map((Price) => {
    return {
      Type: Price.Type,
      Cost: Price.Cost,
      options: (
        <button
          className="Button Danger"
          onClick={() => {
            DeletePlan(Price.id);
          }}
        >
          Delete
        </button>
      ),
    };
  });
  return (
    <div className="DataEntry Hosting">
      <h2>General</h2>
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <div className="formItem">
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
        <div>
          <label htmlFor="generalColor">page text Color</label>
          <input
            className="ColorPicker"
            type="color"
            id="generalColor"
            value={data.Color ? data.Color : ""}
            name="Color"
            onChange={handleInput}
          />
        </div>
        <label htmlFor="fontSelect">page Font Family:</label>
        <Select
          options={fontFamilyOptions}
          value={fontFamilyOptions.find((font) => font.value === data.Font)}
          onChange={(selectedOption) =>
            setData((prev) => {
              return { ...prev, Font: selectedOption.value };
            })
          }
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
        label="Product SoldBy:"
        type="text"
        id="SoldBy"
        name="SoldBy"
        value={data.SoldBy}
        onChangeFunction={handleInput}
        customWidth="70%"
      />
      <Input
        label="Fulfillment method:"
        type="text"
        id="Fulfillment"
        name="Fulfillment"
        value={data.Fulfillment}
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

      <h2>Sections</h2>
      <div className="EditorWrapper">
        <TipTap
          editorClassName="First"
          setHTML={(value) => {
            handlePostBodyChange(value, "OverViewBody");
          }}
          OldData={data.OverViewBody}
        />
        <TipTap
          editorClassName="Second"
          setHTML={(value) => {
            handlePostBodyChange(value, "HighlightsBody");
          }}
          OldData={data.HighlightsBody}
        />
        <TipTap
          editorClassName="Third"
          setHTML={(value) => {
            handlePostBodyChange(value, "SupportBody");
          }}
          OldData={data.SupportBody}
        />
      </div>
      <h2>Pricing Information</h2>
      <button
        className="Button View"
        onClick={() => {
          setShowPrice(true);
        }}
      >
        Add pricing
      </button>
      {showPrice && (
        <div className="PriceAdding">
          <Input
            label="Cost:"
            type="text"
            id="Cost"
            name="Cost"
            value={newPrice.Cost}
            onChangeFunction={handlePriceEdit}
          />
          <Input
            label="Type:"
            type="text"
            id="Type"
            name="Type"
            value={newPrice.Type}
            onChangeFunction={handlePriceEdit}
          />

          <div className="Button-wrapper">
            <button className="Button View" onClick={AddData}>
              Add
            </button>
            <button
              className="Button Danger"
              onClick={() => {
                setShowPrice(false);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <DataTable
        className="Table animate__animated animate__fadeIn"
        style={{ animationDelay: ".4s" }}
        theme="light"
        highlightOnHover
        columns={columns}
        data={info}
      />
      <h2>Documents</h2>
      <button
        className="Button View"
        onClick={() => {
          setShowAddDocument((prev) => !prev);
        }}
      >
        {ShowAddDocument ? "close add Document menu" : "open add Document menu"}
      </button>
      {ShowAddDocument && (
        <div className="PriceAdding">
          <Input
            label="File Name:"
            type="text"
            id="name"
            name="name"
            value={newDocument.name}
            onChangeFunction={handleDocEdit}
          />

          <div className="formItem">
            <span>Document:</span>
            {newDocument.name ? (
              <label htmlFor="Document">
                <img
                  src={Upload}
                  style={{ width: "25px", cursor: "pointer" }}
                />
              </label>
            ) : (
              <p>choose a name first for the doucment</p>
            )}
            <input
              type="file"
              accept=".ppt, .pptx, .doc, .docx, .xls, .xlsx, .txt, .pdf"
              hidden
              id="Document"
              name="Document"
              onChange={handleDocEdit}
            />
          </div>
          <div className="Button-wrapper">
            <button className="Button View" onClick={AddDocument}>
              Add
            </button>
            <button
              className="Button Danger"
              onClick={() => {
                setShowAddDocument(false);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <DataTable
        className="Table animate__animated animate__fadeIn"
        style={{ animationDelay: ".4s" }}
        theme="light"
        highlightOnHover
        columns={columnsDoc}
        data={infoDoc}
      />
      <div className={`SubmitWrapper ${edited ? "fixed" : ""}`}>
        <button
          className="Button View"
          id="Submit"
          onClick={() => {
            if (videoUploading) {
              CreateToast("Video Uploading, please wait...", "error", 2000);
              return;
            }
            UpdateData(BackEndName, data);
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default Template7;
