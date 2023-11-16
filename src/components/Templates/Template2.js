import React, { useState } from "react";
import "./Templates.css";
import ViewJob from "../Cards/ViewJob/ViewJob";
const Template2 = ({ Data }) => {
  const [activeJob, setActiveJob] = useState(Data.jobs[0]);
  const renderJobs = Data.jobs.map((job) => {
    return (
      <p
        key={job.id}
        className={`JobTab ${activeJob.id == job.id ? "active" : ""}`}
        onClick={() => {
          setActiveJob(job);
        }}
      >
        {job.Designation}
      </p>
    );
  });
  return (
    <div className="Outsource">
      {Data.Title && <h2>{Data.Title}</h2>}
      {Data.Para && <p>{Data.Para}</p>}
      <div className="CareerContent">
        <div className="sidebarCareer">{renderJobs}</div>
        <div className="ViewJob">
          {activeJob && <ViewJob job={activeJob} />}
        </div>
      </div>
    </div>
  );
};

export default Template2;
