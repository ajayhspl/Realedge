import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { CreateToast } from "../../../App";
import { DELETEDOC, GETCOLLECTION } from "../../../server";
import "./FormSubmits.css";
const FormSubmits = () => {
  const [forms, setForms] = useState(null);
  useEffect(() => {
    const getForms = async () => {
      const forms = await GETCOLLECTION("FormSubmits");
      setForms(forms);
    };

    getForms();
  }, []);
  const DeleteForm = async (id) => {
    CreateToast("Deleting", "None", 1000);

    await DELETEDOC("FormSubmits", id);
    const NewFormList = await GETCOLLECTION("FormSubmits");
    setForms(NewFormList);
    CreateToast("form has been deleted", "success", 1000);
  };
  const columns = [
    {
      name: "Full Name",
      selector: (row) => row.FullName,
      sortable: true,
      center: true,
      width: "300px",
    },
    {
      name: "Email",
      selector: (row) => row.Email,
      sortable: true,
      center: true,
      width: "300px",
    },
    {
      name: "Job Title",
      selector: (row) => row.JobTitle,
      sortable: true,
      center: true,
      width: "300px",
    },
    {
      name: "Phone",
      selector: (row) => row.Phone,
      sortable: true,
      center: true,
      width: "300px",
    },
    {
      name: "Follow Up",
      selector: (row) => row.FollowUp,
      sortable: true,
      center: true,
      width: "300px",
    },
    {
      name: "Country",
      selector: (row) => row.Country,
      sortable: true,
      center: true,
      width: "300px",
    },
    {
      name: "Company",
      selector: (row) => row.Company,
      sortable: true,
      center: true,
      width: "300px",
    },
    {
      name: "Date",
      selector: (row) => row.Date,
      sortable: true,
      center: true,
      width: "200px",
    },
    {
      name: "Document",
      selector: (row) => row.Document,
      sortable: true,
      center: true,
      width: "300px",
    },
    {
      name: "options",
      selector: (row) => row.options,

      center: true,
      width: "250px",
    },
  ];
  const data = forms?.map((form) => {
    return {
      id: form.ID,
      FullName: form.Fname + " " + form.Lname,
      Email: form.Email,
      JobTitle: form.JobTitle,
      Country: form.Country.label,
      Company: form.Company,
      Date: form.DateAdded,
      Document: form.DocumentName.label,
      Phone: form.Phone ? form.Phone : "Didn't choose",
      FollowUp: form.FollowUp.value ? "YES" : "NO   ",
      options: (
        <div className="Button-wrapper">
          <button
            className="Button Danger"
            onClick={() => {
              DeleteForm(form.ID);
            }}
          >
            Delete
          </button>
          {form.Phone && (
            <button
              className="Button View"
              onClick={() => {
                window.open(`tel:${form.Phone}`);
              }}
            >
              Call
            </button>
          )}
          <button
            className="Button View"
            onClick={() => {
              window.location.href = ` mailto:${form.Email}`;
            }}
          >
            Email
          </button>
        </div>
      ),
    };
  });
  return (
    <div className="formSubmits">
      <h2 style={{ textAlign: "center", margin: "30px" }}>Form submits</h2>
      <DataTable
        className="animate__animated animate__fadeIn"
        style={{ animationDelay: ".4s" }}
        theme="light"
        pagination
        highlightOnHover
        columns={columns}
        data={data}
      />
    </div>
  );
};

export default FormSubmits;
// [
//     {
//         "DocumentName": {
//             "label": "ipnd-reference-sheet-css-syntax",
//             "value": "ipnd-reference-sheet-css-syntax"
