import React from "react";
import "./ViewJob.css";
import ContactPopUp from "../../PopUps/ContactPopup/ContactPopup";
const ViewJob = (props) => {
  const [showModal, setShowModal] = React.useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const job = props.job;
  return (
    <div className="JobOffer">
      <h4>{job.Designation}</h4>
      <div className="JobDetails">
        {job.Designation && (
          <div className="Detail">
            <span>Designation: </span>
            <span>{job.Designation}</span>
          </div>
        )}
        {job.Qualification && (
          <div className="Detail">
            <span>Qualification: </span>
            <span> {job.Qualification}</span>
          </div>
        )}
        {job.Vacancy && (
          <div className="Detail">
            <span>Vacancy: </span>
            <span> {job.Vacancy}</span>
          </div>
        )}
        {job.Experience && (
          <div className="Detail">
            <span>Experience: </span>
            <span>{job.Experience}</span>
          </div>
        )}
        {job.JobLocation && (
          <div className="Detail">
            <span>Job Location: </span>
            <span>{job.JobLocation}</span>
          </div>
        )}
        {job.DateAdded && (
          <div className="Detail">
            <span>Date Added: </span>
            <span>{job.DateAdded}</span>
          </div>
        )}
      </div>
      <div className="Description">
        <p className="Description">Description</p>
        <div dangerouslySetInnerHTML={{ __html: job.DescriptionContent }}></div>
      </div>
      <div className="Description">
        <p className="Description">Desired Skills</p>
        <div
          dangerouslySetInnerHTML={{ __html: job.DesiredSkillsContent }}
        ></div>
      </div>
      <button className="Button" onClick={handleShowModal}>
        Apply Now
      </button>
      <ContactPopUp
        className="confirm"
        show={showModal}
        handleClose={handleCloseModal}
        screenWidth={props.screenWidth}
        type="Job"
        JobTitle={job.Designation}
      />
    </div>
  );
};

export default ViewJob;
