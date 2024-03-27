// import React, { useState } from "react";
// import "./Jobs.css";
// import { Create } from "./Create";
// const Jobs = () => {
//   const [activePage, setActivePage] = useState(null);
//   return (
//     <div className="Jobs">
//       <ul className="Nav">
//         <li
//           className="Button"
//           onClick={() => {
//             setActivePage("Create");
//           }}
//         >
//           Create a Job
//         </li>
//         <li
//           className="Button"
//           onClick={() => {
//             setActivePage("Submissions");
//           }}
//         >
//           Jobs submissions
//         </li>
//         <li
//           className="Button"
//           onClick={() => {
//             setActivePage("Jobs");
//           }}
//         >
//           Jobs
//         </li>
//       </ul>
//       {activePage === "Create" && <Create />}
//       {activePage === "Submissions" && <div className="Container"></div>}
//       {activePage === "Jobs" && <div className="Container"></div>}
//     </div>
//   );
// };

// export default Jobs;
