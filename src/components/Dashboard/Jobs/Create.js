// import React, { useState } from "react";

// export const Create = () => {
//   const [NewJob, setNewJob] = useState({
//     DateAdded: "",
//     DescriptionContent: "",
//     Designation: "",
//     DesiredSkillsContent: "",
//     Experience: "",
//     JobLocation: "",
//     Qualification: "",
//     Vacancy: "",
//     id: "",
//   });
//   const SaveJob = () => {
//     const updatedJobs = data.jobs.map((Job) => {
//       if (Job.id === NewJob.id) {
//         return { ...Job, ...NewJob };
//       }
//       return Job;
//     });
//     setData((prev) => {
//       return { ...prev, jobs: updatedJobs };
//     });

//     setNewJob({
//       DateAdded: "",
//       DescriptionContent: "",
//       Designation: "",
//       DesiredSkillsContent: "",
//       Experience: "",
//       JobLocation: "",
//       Qualification: "",
//       Vacancy: "",
//       id: "",
//     });
//     handleCloseModal();
//   };
//   const handleJobUpdate = (e) => {
//     const { name, value } = e.target;
//     setNewJob((prev) => {
//       return { ...prev, [name]: value };
//     });
//   };
//   return <div className="Container"></div>;
// };
