import React, { useState, useEffect } from "react";
import { UPLOADPHOTO } from "../../../../server";
import { CreateToast } from "../../../../App";
import Upload from "../../../../assets/upload.png";
import sortBy from "sort-by";
import DataTable from "react-data-table-component";
import date from "date-and-time";
const pattern = date.compile("MMM DD YYYY");
import TipTap from "./RichTextEditor/tiptap";
import MyModal from "../../../PopUps/Confirm/Confirm";
const Template2 = ({ Data, UpdateData, BackEndName }) => {
  const [data, setData] = useState(Data);
  const [editingState, setEditingState] = useState(null);
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
            <div className="formItem ">
              <label htmlFor="title">Designation:</label>
              <input
                type="text"
                id="Designation"
                name="Designation"
                value={NewJob.Designation}
                onChange={handleJobUpdate}
              ></input>
            </div>
            <div className="formItem ">
              <label htmlFor="text">Experience:</label>
              <input
                name="Experience"
                id="Experience"
                type="text"
                value={NewJob.Experience}
                onChange={handleJobUpdate}
              />
            </div>
            <div className="formItem ">
              <label htmlFor="text">Qualification:</label>
              <input
                type="text"
                id="Qualification"
                name="Qualification"
                value={NewJob.Qualification}
                onChange={handleJobUpdate}
              />
            </div>
            <div className="formItem ">
              <label htmlFor="text">Vacancy:</label>
              <input
                type="text"
                id="Vacancy"
                name="Vacancy"
                value={NewJob.Vacancy}
                onChange={handleJobUpdate}
              />
            </div>
            <div className="formItem ">
              <label htmlFor="text">Job Location:</label>
              <input
                type="text"
                id="JobLocation"
                name="JobLocation"
                value={NewJob.JobLocation}
                onChange={handleJobUpdate}
              />
            </div>
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
        />
        <input
          className="ColorPicker"
          type="color"
          value={data.BottomColor}
          name="BottomColor"
          onChange={handleInput}
        />
      </div>
      <div className="FormItem" id="Title">
        <label htmlFor="Title">Sub Title:</label>
        <input
          type="text"
          id="Title"
          name="Title"
          value={data.Title}
          onChange={handleInput}
        />
      </div>
      <div className="FormItem" id="Para">
        <label htmlFor="Para">Paragraph:</label>
        <textarea
          id="Para"
          name="Para"
          value={data.Para}
          onChange={handleInput}
        />
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

export default Template2;
