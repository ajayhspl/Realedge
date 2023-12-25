import React, { useState, useEffect, useRef } from "react";
import {
  UPLOADPHOTO,
  DELETEPHOTO,
  GETCOLLECTION,
  EMPTYFOLDER,
  SETDOC,
  DELETEDOC,
  UPLOADVIDEO,
} from "../../../../server";
import { CreateToast } from "../../../../App";
import { initializeApp } from "firebase/app";
import Upload from "../../../../assets/upload.png";
import sortBy from "sort-by";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import MyModal from "../../../PopUps/Confirm/Confirm";
import { con } from "../../../../Conf";
import ProjectCardPort from "../../../Cards/ProjectCardPort/ProjectCardPort";
import Input from "../../../Input/Input";
import Select from "react-select";
import VideoPlayer from "../../../VideoPlayer";
import TipTap from "./RichTextEditor/tiptap";
const HeaderContent = [
  { value: "Video", label: "Video" },
  { value: "Text", label: "Text" },
];

const app = initializeApp(con);
const storage = getStorage(app);
const Template5 = ({ Data, UpdateData, BackEndName, setEdited, edited }) => {
  const [data, setData] = useState(Data);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoUploading, setVideoUploading] = useState(false);

  const [activeTab, setActiveTab] = useState("All");
  const [DisplayedProjects, setDisplayedProjects] = useState([]);
  const [projects, setProjects] = useState([]);
  const [Categories, setCategories] = useState([]);

  useEffect(() => {
    const uniqueCategories = new Set(Categories); // Create a Set to store unique roles
    projects.forEach((Project) => {
      uniqueCategories.add(Project.Category); // Add each person's role to the Set
    });

    setCategories(Array.from(uniqueCategories)); // Update the roles state with the unique roles
  }, []);
  const [NewProject, setNewProject] = useState({
    Thumbnail: "",
    Title: "",
    Description: "",
    Category: "",
    CompanyLogo: "",
    CompanyName: "",
    Country: "",
    Website: "",
    ExtraImages: [],
    ProjectID: "",
  });
  const [photoUploaded, setPhotoUploaded] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [urlDone, setUrlDone] = useState("false");

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handlePrimaryAction = async () => {
    if (urlDone === "true" && photoUploaded) {
      handleCloseModal();

      await SETDOC("Projects", NewProject.ProjectID, { ...NewProject }, true);
      GETCOLLECTION("Projects").then((res) => {
        setProjects(res), setDisplayedProjects(res);
      });
      setNewProject({
        Thumbnail: "",
        Title: "",
        Description: "",
        Category: "Business Development",
        CompanyLogo: "",
        CompanyName: "",
        Country: "",
        Website: "",
        ExtraImages: [],
        ProjectID: "",
      });
    } else if (urlDone === "false" || !photoUploaded) {
      CreateToast(
        "please upload at least one extra photo and one main photo",
        "error"
      );
    } else {
      CreateToast("uploading...please wait", "warning");
    }
  };
  const handleProjectInput = async (e) => {
    const { name, value } = e.target;
    let filesAR = [];
    if (name === "CompanyLogo") {
      CreateToast("uploading Logo", "info", 2000);
      const Photo = e.target.files[0];
      const img = await UPLOADPHOTO(
        `/Projects/${NewProject.ProjectID}/CompanyLogo.png`,
        Photo
      );
      setNewProject((prev) => {
        return {
          ...prev,
          CompanyLogo: img,
        };
      });
      CreateToast("photo uploaded", "success");
    } else if (name === "images") {
      CreateToast("uploading Photos", "info", 2000);

      filesAR = Array.from(e.target.files);
      let urlList = [];
      filesAR.forEach((element, index) => {
        setUrlDone("pending");
        const imageRef = ref(
          storage,
          `/Projects/${NewProject.ProjectID}/${index}`
        );
        uploadBytes(imageRef, element).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => {
            urlList.push({ index, url });
            if (urlList.length === filesAR.length) {
              setUrlDone("true");
              CreateToast("uploaded photos", "success");
            }
            setNewProject((prev) => {
              return { ...prev, ExtraImages: urlList };
            });
          });
        });
      });
    } else if (name === "URL") {
      setPhotoUploaded(false);
      CreateToast("uploading photo", "info", 2000);
      const Photo = e.target.files[0];
      const img = await UPLOADPHOTO(
        `/Projects/${NewProject.ProjectID}/${NewProject.ProjectID}.png`,
        Photo
      );
      setNewProject((prev) => {
        return {
          ...prev,
          Thumbnail: img,
        };
      });
      CreateToast("photo uploaded", "success");
      setPhotoUploaded(true);
      return;
    } else {
      setNewProject((prev) => ({ ...prev, [name]: value }));
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
      setData((prev) => ({ ...prev, BG: url }));
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

  const DeleteCard = async (id) => {
    EMPTYFOLDER(`/Projects/${id}`);
    DELETEDOC("Projects", id);

    GETCOLLECTION("Projects").then((res) => {
      setProjects(res), setDisplayedProjects(res);
    });
    CreateToast("Project has been deleted", "success");
  };

  useEffect(() => {
    const FetchProjects = async () => {
      GETCOLLECTION("Projects").then((res) => {
        setProjects(res), setDisplayedProjects(res);
      });
    };
    FetchProjects();
  }, []);
  useEffect(() => {
    let id;
    if (projects.length === 0) {
      id = 1;
    } else {
      projects.sort(sortBy("id"));
      projects.forEach((category) => {
        id = +category.ProjectID + 1;
      });
    }
    setNewProject((prev) => ({ ...prev, ProjectID: id }));
  }, [projects]);
  const renderCate = Categories.map((cate, index) => {
    return (
      <li
        key={index}
        onClick={() => {
          setActiveTab(cate);
        }}
        className={`TabItem ${cate === activeTab ? "active" : ""}`}
      >
        {cate}
      </li>
    );
  });
  useEffect(() => {
    setDisplayedProjects([]);
    const filteredProjects = projects.filter((project) => {
      return project.Category == activeTab || activeTab === "All";
    });
    setDisplayedProjects(filteredProjects);
  }, [activeTab]);
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      // Skip the first render
      firstRender.current = false;
    } else {
      setEdited(true);
    }
  }, [data]);
  const RenderProjects = DisplayedProjects?.map((project, index) => {
    return (
      <div
        key={project.ProjectID}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <ProjectCardPort data={project} delay={index} />
        <button
          className="Button Danger"
          onClick={() => {
            DeleteCard(project.ProjectID);
          }}
        >
          Delete
        </button>
      </div>
    );
  });

  return (
    <div className="DataEntry Hosting Portfolio">
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
              label="Title:"
              type="text"
              id="Title"
              name="Title"
              value={NewProject.Title}
              onChangeFunction={handleProjectInput}
            />
            <Input
              label="Website:"
              type="text"
              id="Website"
              name="Website"
              value={NewProject.Website}
              onChangeFunction={handleProjectInput}
            />
            <Input
              label="Category:"
              type="text"
              id="Category"
              name="Category"
              value={NewProject.Category}
              onChangeFunction={handleProjectInput}
            />

            <Input
              textarea={true}
              label="Description:"
              id="Description"
              name="Description"
              value={NewProject.Description}
              onChangeFunction={handleProjectInput}
            />

            <Input
              label="Company Name:"
              type="text"
              id="CompanyName"
              name="CompanyName"
              value={NewProject.CompanyName}
              onChangeFunction={handleProjectInput}
            />
            <Input
              label="Country:"
              type="text"
              id="Country"
              name="Country"
              value={NewProject.Country}
              onChangeFunction={handleProjectInput}
            />

            <div className="formItem" id="Thumbnail">
              <span>Thumbnail:</span>
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
                name="URL"
                onChange={handleProjectInput}
              />
            </div>
            <div
              className="formItem"
              id="Thumbnail"
              style={{ marginTop: "20px" }}
            >
              <span>Project Photos:</span>
              <label htmlFor="Photos">
                <img
                  src={Upload}
                  style={{ width: "25px", cursor: "pointer" }}
                />
              </label>
              <input
                type="file"
                hidden
                required
                id="Photos"
                multiple="multiple"
                name="images"
                onChange={handleProjectInput}
              />
            </div>
            <div className="formItem" id="logo" style={{ marginTop: "20px" }}>
              <span>Company Logo:</span>
              <label htmlFor="LogoInput">
                <img
                  src={Upload}
                  style={{ width: "25px", cursor: "pointer" }}
                />
              </label>
              <input
                type="file"
                hidden
                required
                id="LogoInput"
                name="CompanyLogo"
                onChange={handleProjectInput}
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

      <button
        className="Button Add"
        style={{ margin: "0px 20px" }}
        onClick={handleShowModal}
      >
        Add Project
      </button>
      <div className="Projects">
        <h4>Projects:</h4>
        <ul style={{ listStyle: "none" }} className="Categories">
          <li
            onClick={() => {
              setActiveTab("All");
            }}
            className={`TabItem ${"All" === activeTab ? "active" : ""}`}
          >
            All
          </li>
          {renderCate}
        </ul>
        <ul className="Projects-wrapper">{RenderProjects}</ul>
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

export default Template5;
