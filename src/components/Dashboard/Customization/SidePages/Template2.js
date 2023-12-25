import React, { useState, useEffect, useRef } from "react";
import { DELETEPHOTO, UPLOADPHOTO, UPLOADVIDEO } from "../../../../server";
import { CreateToast } from "../../../../App";
import Upload from "../../../../assets/upload.png";
import sortBy from "sort-by";
import DataTable from "react-data-table-component";
import date from "date-and-time";
const pattern = date.compile("MMM DD YYYY");
import TipTap from "./RichTextEditor/tiptap";
import MyModal from "../../../PopUps/Confirm/Confirm";
import Input from "../../../Input/Input";
import Select from "react-select";
import VideoPlayer from "../../../VideoPlayer";
const HeaderContent = [
  { value: "Video", label: "Video" },
  { value: "Text", label: "Text" },
];

const Template2 = ({ Data, UpdateData, BackEndName, setEdited, edited }) => {
  const [data, setData] = useState(Data);
  const [editingState, setEditingState] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoUploading, setVideoUploading] = useState(false);

  const [NewJob, setNewJob] = useState({
    DateAdded: "",
    DescriptionContent: "",
    Designation: "",
    DesiredSkillsContent: "",
    Experience: "",
    JobLocation: "",
    Qualification: "",
    Vacancy: "",
    id: "",
  });
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const SaveJob = () => {
    const updatedJobs = data.jobs.map((Job) => {
      if (Job.id === NewJob.id) {
        return { ...Job, ...NewJob };
      }
      return Job;
    });
    setData((prev) => {
      return { ...prev, jobs: updatedJobs };
    });

    setNewJob({
      DateAdded: "",
      DescriptionContent: "",
      Designation: "",
      DesiredSkillsContent: "",
      Experience: "",
      JobLocation: "",
      Qualification: "",
      Vacancy: "",
      id: "",
    });
    handleCloseModal();
  };
  const handleJobUpdate = (e) => {
    const { name, value } = e.target;
    setNewJob((prev) => {
      return { ...prev, [name]: value };
    });
  };
  const handlePrimaryAction = () => {
    const now = new Date();
    setData((prev) => {
      return {
        ...prev,
        jobs: [
          ...prev.jobs,
          { ...NewJob, DateAdded: date.format(now, pattern) },
        ],
      };
    });
    setNewJob({
      DateAdded: "",
      DescriptionContent: "",
      Designation: "",
      DesiredSkillsContent: "",
      Experience: "",
      JobLocation: "",
      Qualification: "",
      Vacancy: "",
      id: "",
    });
    handleCloseModal();
  };
  const handlePostBodyChange = (value, Target) => {
    let valueToChange;
    switch (Target) {
      case "DescriptionContent":
        valueToChange = "DescriptionContent";
        break;
      case "DesiredSkillsContent":
        valueToChange = "DesiredSkillsContent";
        break;
    }
    setNewJob((prev) => {
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
  const jobsColumns = [
    {
      name: "Designation",
      selector: (row) => row.Designation,
      sortable: true,
      center: true,
      width: "200px",
    },
    {
      name: "Qualification",
      selector: (row) => row.Qualification,
      sortable: true,
      center: true,
      width: "200px",
    },
    {
      name: "Vacancy",
      selector: (row) => row.Vacancy,
      sortable: true,
      center: true,
      width: "200px",
    },
    {
      name: "Location",
      selector: (row) => row.JobLocation,
      sortable: true,
      center: true,
      width: "200px",
    },

    {
      name: "DateAdded",
      selector: (row) => row.DateAdded,
      sortable: true,
      center: true,
      width: "150px",
    },
    {
      name: "Experience",
      selector: (row) => <div className="text-wrap"> {row.Experience} </div>,
      center: true,
    },
    {
      name: "Description",
      selector: (row) => (
        <div
          className="text-wrap"
          dangerouslySetInnerHTML={{ __html: row.Description }}
        ></div>
      ),
      width: "400px",
      center: true,
    },
    {
      name: "Desired skills",
      selector: (row) => (
        <div
          className="text-wrap"
          dangerouslySetInnerHTML={{ __html: row.DesiredSkills }}
        ></div>
      ),
      center: true,
      width: "400px",
    },

    {
      name: "Options",
      selector: (row) => row.Options,
      center: true,
      width: "200px",
    },
  ];
  const DeleteCard = (id) => {
    const NewJobs = data.jobs.filter((Job) => {
      return Job.id !== id;
    });

    setData((prev) => {
      return { ...prev, jobs: NewJobs };
    });
  };

  const jobsData = data.jobs.map((Job) => {
    return {
      id: Job.id,
      Designation: Job.Designation,
      DateAdded: Job.DateAdded,
      JobLocation: Job.JobLocation,
      Qualification: Job.Qualification,
      Vacancy: Job.Vacancy,
      Experience: Job.Experience,
      Description: Job.DescriptionContent,
      DesiredSkills: Job.DesiredSkillsContent,
      Options: (
        <div className="button-wrapper">
          <button
            className="Button"
            onClick={() => {
              setNewJob(Job);
              setEditingState(Job.id);
              handleShowModal();
            }}
          >
            Edit
          </button>
          <button
            className="Button Danger"
            onClick={() => {
              DeleteCard(Job.id);
            }}
          >
            Delete
          </button>
        </div>
      ),
    };
  });
  useEffect(() => {
    let id;
    if (data.jobs.length === 0) {
      id = 1;
    } else {
      data.jobs.sort(sortBy("id"));
      data.jobs.forEach((job) => {
        id = +job.id + 1;
      });
    }
    setNewJob((prev) => {
      return { ...prev, id };
    });
  }, []);
  return (
    <div className="DataEntry Hosting">
      {showModal && (
        <MyModal
          className="Confirm PricingModal"
          show={showModal}
          handleClose={handleCloseModal}
          title={editingState ? `Edit ${NewJob.Designation}` : "add Job"}
          primaryButtonText={editingState ? "Save" : "add"}
          handlePrimaryAction={editingState ? SaveJob : handlePrimaryAction}
        >
          <>
            <Input
              label="Designation"
              type="text"
              id="Designation"
              name="Designation"
              value={NewJob.Designation}
              onChangeFunction={handleJobUpdate}
              customWidth="70%"
            />
            <Input
              label="Experience"
              type="text"
              id="Experience"
              name="Experience"
              value={NewJob.Experience}
              onChangeFunction={handleJobUpdate}
              customWidth="70%"
            />
            <Input
              label="Qualification"
              type="text"
              id="Qualification"
              name="Qualification"
              value={NewJob.Qualification}
              onChangeFunction={handleJobUpdate}
              customWidth="70%"
            />
            <Input
              label="Vacancy"
              type="text"
              id="Vacancy"
              name="Vacancy"
              value={NewJob.Vacancy}
              onChangeFunction={handleJobUpdate}
              customWidth="70%"
            />
            <Input
              label="Job Location"
              type="text"
              id="JobLocation"
              name="JobLocation"
              value={NewJob.JobLocation}
              onChangeFunction={handleJobUpdate}
              customWidth="70%"
            />

            <div className="formItem" style={{ flexDirection: "column" }}>
              <label htmlFor="DescriptionContent">Description:</label>
              <TipTap
                setHTML={(value) => {
                  handlePostBodyChange(value, "DescriptionContent");
                }}
                OldData={NewJob.DescriptionContent}
              />
            </div>
            <div className="formItem" style={{ flexDirection: "column" }}>
              <label htmlFor="DesiredSkillsContent">Desired Skills:</label>
              <TipTap
                setHTML={(value) => {
                  handlePostBodyChange(value, "DesiredSkillsContent");
                }}
                OldData={NewJob.DesiredSkillsContent}
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
        label="Page URL"
        type="text"
        id="PageURL"
        name="PageURL"
        value={data.PageURL}
        onChangeFunction={handleInput}
        customWidth="70%"
      />
      <Input
        label="Page Name in navigation "
        type="text"
        id="PageName"
        name="PageName"
        value={data.PageName}
        onChangeFunction={handleInput}
        customWidth="70%"
      />
      <Input
        label="Header Title"
        type="text"
        id="HeaderTitle"
        name="HeaderTitle"
        value={data.HeaderTitle}
        onChangeFunction={handleInput}
        customWidth="70%"
      />
      <Input
        label="Top Title"
        type="text"
        id="TopTitle"
        name="TopTitle"
        required={true}
        value={data.TopTitle}
        onChangeFunction={handleInput}
        customWidth="70%"
      />
      <Input
        label="Bottom Title"
        type="text"
        id="BottomTitle"
        name="BottomTitle"
        required={true}
        value={data.BottomTitle}
        onChangeFunction={handleInput}
        customWidth="70%"
      />
      <Input
        label="Sub Title"
        type="text"
        id="Title"
        name="Title"
        value={data.Title}
        onChangeFunction={handleInput}
        customWidth="70%"
      />
      <Input
        textarea={true}
        label="Paragraph"
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

      <button
        className="Button Add"
        style={{ margin: "0px 20px" }}
        onClick={handleShowModal}
      >
        Add Job
      </button>
      <h4 style={{ margin: "20px" }}>Jobs Table</h4>
      <DataTable
        className="Table animate__animated animate__fadeIn"
        style={{ animationDelay: ".4s" }}
        theme="light"
        highlightOnHover
        columns={jobsColumns}
        data={jobsData}
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

export default Template2;
