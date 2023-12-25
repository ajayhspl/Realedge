/* eslint-disable no-undef */
import React, { useEffect } from "react";
import DataTable from "react-data-table-component";
import VideoPlayer from "../VideoPlayer";
import { useState } from "react";
import Select from "react-select";
import { CreateToast } from "../../App";
import { GETDOC, SENDMAIL, SETDOC } from "../../server";
import { v4 as uuidv4 } from "uuid";
import date from "date-and-time";
import EmailTemplate from "./EmailTemplate";
import ReactDOMServer from "react-dom/server";
import EmailTemplate2 from "../PopUps/EmailTemplate2";
import Input from "../Input/Input";

const pattern = date.compile("MMM DD YYYY");
const Template7 = ({ Data }) => {
  const [SavedData, setSavedData] = useState(
    JSON.parse(localStorage.getItem("userInfo")) || false
  );
  const [showHint, setShowHint] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [socials, setSocials] = useState(null);
  const [webName, setWebName] = useState(null);
  const [Email, setEmail] = useState("");
  const [mainEmail, setMainEmail] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [formData, setFormData] = useState({
    Date: "",
    Fname: "",
    Lname: "",
    JobTitle: "",
    Company: "",
    Email: "",
    Country: "",
    Phone: "",
    ID: "",
    FollowUp: "",
    DocumentName: "",
  });
  const [countries, setCountries] = useState([]);
  useEffect(() => {
    const fetchPhone = async () => {
      const WebData = await GETDOC("customization", "Website");
      const SocialsRaw = await GETDOC("customization", "Main");
      setWebName(WebData.WebsiteName);
      setSocials(SocialsRaw.FooterData);
      setEmail(WebData.ContactEmail);
      setMainEmail(WebData.Email);
    };

    const fetchAllCountries = async () => {
      fetch("https://restcountries.com/v2/all")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            value: country.name,
            label: country.name,
          }));
          setCountries(countries);
        })
        .catch((error) => console.error(error));
    };
    fetchAllCountries();
    fetchPhone();
  }, []);

  useEffect(() => {
    const documentOptions = Data.documents.map((document) => ({
      value: document.name,
      label: document.name,
    }));
    setDocuments(documentOptions);
  }, [Data.documents]);
  const columns = [
    {
      name: Data.PricingTableHeader.Type,
      selector: (row) => (
        <div
          className="no-wrap"
          style={{
            fontFamily: Data.Font ? Data.Font : "",
            color: Data.Color ? Data.Color : "",
            fontSize: "1.2rem",
          }}
        >
          {row.Type}
        </div>
      ),
      sortable: true,
      center: true,
    },
    {
      name: Data.PricingTableHeader.Cost,
      selector: (row) => (
        <div
          className="no-wrap"
          style={{
            fontFamily: Data.Font ? Data.Font : "",
            color: Data.Color ? Data.Color : "",
            fontSize: "1.2rem",
          }}
        >
          {row.Cost}
        </div>
      ),
      sortable: true,
      center: true,
    },
  ];
  const data = Data.Pricing.map((Price) => {
    return {
      Type: Price.Type,
      Cost: Price.Cost,
    };
  });
  const ReplaceData = () => {
    setFormData(SavedData);
    CreateToast("Data Loaded successfully", "success");
  };
  const handleCountryChange = (selectedOption) => {
    setFormData((prev) => {
      return { ...prev, Country: selectedOption };
    });
  };
  const handleFollowupChange = (selectedOption) => {
    setFormData((prev) => {
      return { ...prev, FollowUp: selectedOption };
    });
  };
  const handleDocChange = (selectedOption) => {
    setFormData((prev) => {
      return { ...prev, DocumentName: selectedOption };
    });
  };
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const EmailValidator = (email) =>
    ![
      "gmail",
      "hotmail",
      "yahoo",
      "outlook",
      "hotmail",
      "protonmail",
      "zoho",
      "runbox",
      "icloud",
      "inbox",
      "mail",
      "fastmail",
      "tutanota",
      "yandex",
      "gmx",
    ].includes(email.split("@")[1].split(".")[0]);
  const validateForm = async (e) => {
    e.preventDefault();
    if (formData.Email === "") {
      CreateToast("email cant be empty", "error");
      return;
    }
    if (!EmailValidator(formData.Email)) {
      CreateToast("not a Valid work email", "error");
      return;
    }
    if (formData.Country === "") {
      CreateToast("Please Choose a country", "error");
      return;
    }
    if (formData.FollowUp === "") {
      CreateToast("Please Choose a followUp option", "error");
      return;
    }
    if (formData.DocumentName === "") {
      CreateToast("Please Choose a Document", "error");
      return;
    }
    setSendingEmail(true);
    CreateToast("sending email", "info", 3000);
    const now = new Date();

    localStorage.setItem(
      "userInfo",
      JSON.stringify({ ...formData, DocumentName: "" })
    );
    setSavedData({ ...formData, DocumentName: "" });
    const ID = uuidv4();
    await SETDOC(
      "FormSubmits",
      ID,
      { ...formData, ID, DateAdded: date.format(now, pattern) },
      true
    );
    const SelectedDoc = Data.documents.find((doc) => {
      return doc.name === formData.DocumentName.label;
    });

    const emailHtml = getEmailHTML(
      Email,
      formData.Fname + " " + formData.Lname,
      SelectedDoc.Document,
      socials?.Socials.Twitter,
      socials?.Socials.Facebook,
      socials?.Socials.Linkedin,
      webName
    );
    const emailData = {
      sender: {
        name: webName,
        email: Email,
      },
      to: [
        {
          email: formData.Email,
          name: formData.Fname + " " + formData.Lname,
        },
      ],
      subject: "Your requested file is ready",
      htmlContent: emailHtml,
    };
    const requestOptions = {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": process.env.REACT_APP_EMAILKEY,
        "content-type": "application/json",
      },
      body: JSON.stringify(emailData),
    };
    await fetch("https://api.brevo.com/v3/smtp/email", requestOptions)
      .then((response) => response.json())
      .then(() => {
        CreateToast("email has been sent", "success", 2000);
      })
      .catch((error) => {
        console.error("Error:", error);
        CreateToast("error sending the email" + error, "error", 2000);
      });
    await SENDMAIL(
      EmailTemplate2,
      mainEmail,
      webName,
      `${formData.Fname} ${formData.Lname} requested to download a file`,
      formData,
      `File request from ${webName}`
    );
    setSendingEmail(false);
  };
  function getEmailHTML(
    Email,
    name,
    Doc,
    twitter,
    facebook,
    linkedin,
    webName
  ) {
    const emailTemplate = (
      <EmailTemplate
        ContactEmail={Email}
        Receiver={name}
        DocLink={Doc}
        Twitter={twitter}
        Facebook={facebook}
        LinkedIn={linkedin}
        webName={webName}
      />
    );
    const htmlString = `
    <!DOCTYPE html>
    <html>
      <head></head>
      <body>
        ${ReactDOMServer.renderToStaticMarkup(emailTemplate)}
      </body>
    </html>
  `;
    return htmlString;
  }
  const Forget = () => {
    localStorage.setItem("userInfo", null);
    setFormData({
      Date: "",
      Fname: "",
      Lname: "",
      JobTitle: "",
      Company: "",
      Email: "",
      Country: "",
      Phone: "",
      ID: "",
      FollowUp: "",
      DocumentName: "",
    });
    setSavedData(null);
    setShowHint(true);
  };
  return (
    <div
      className="Outsource Product"
      style={{
        fontFamily: Data.Font ? Data.Font : "",
        color: Data.Color ? Data.Color : "",
      }}
    >
      <div className="LeftSide">
        {Data.OverViewBody != " <p><br></p>" &&
          Data.OverViewBody != "<p><br></p>" && (
            <div
              className="OverView"
              dangerouslySetInnerHTML={{ __html: Data.OverViewBody }}
            ></div>
          )}
      </div>

      <div className="RightSide">
        {Data.HighlightsBody != "<p><br></p>" &&
          Data.HighlightsBody != " <p><br></p>" && (
            <div
              className="Highlights"
              dangerouslySetInnerHTML={{ __html: Data.HighlightsBody }}
            ></div>
          )}

        {Data.Pricing.length != 0 && (
          <div className="pricing">
            <h2 style={{ fontFamily: Data.Font ? Data.Font : "" }}>
              Pricing Information
            </h2>
            <DataTable
              className="Table animate__animated animate__fadeIn"
              style={{ animationDelay: ".4s" }}
              theme="light"
              highlightOnHover
              columns={columns}
              data={data}
            />
          </div>
        )}
        {!Data.SoldBy && !Data.Fulfillment ? null : (
          <div className="SellerData">
            {Data.SoldBy && (
              <div>
                <span>Sold by</span>
                {Data.SoldBy}
              </div>
            )}
            {Data.Fulfillment && (
              <div>
                <span>Fulfillment method</span>
                {Data.Fulfillment}
              </div>
            )}
          </div>
        )}

        {Data.documents.length != 0 && (
          <div
            className="Additional"
            style={{ fontFamily: Data.Font ? Data.Font : "" }}
          >
            <h2 style={{ fontFamily: Data.Font ? Data.Font : "" }}>
              Additional Resources
            </h2>
            <p>Thank you for your interest in {webName}</p>
            <span>
              Fill the below form and we will send the document to your email
            </span>
            {SavedData && (
              <div className="button-wrapper">
                <button className="Submit" onClick={ReplaceData}>
                  Load Your Data?
                </button>
                <button className="Submit" onClick={Forget}>
                  Forget me?
                </button>
              </div>
            )}
            {showHint && (
              <div className="Hint">
                <p>your local data has been deleted</p>
                <p>
                  to erase your data from our servers please contact us on{" "}
                  <a href={`Tel:${Email}`}>{Email}</a>
                </p>
                <button
                  className="Submit"
                  onClick={() => {
                    setShowHint(false);
                  }}
                >
                  Okay
                </button>
              </div>
            )}
            <form>
              <Input
                required
                type="Text"
                name="Fname"
                label="First name:"
                value={formData.Fname}
                onChange={handleFormChange}
              />

              <Input
                required
                type="Text"
                name="Lname"
                label="Last name:"
                value={formData.Lname}
                onChange={handleFormChange}
              />

              <Input
                required
                type="Text"
                name="JobTitle"
                label="Job title:"
                value={formData.JobTitle}
                onChange={handleFormChange}
              />

              <Input
                required
                type="Text"
                name="Company"
                label="Company:"
                value={formData.Company}
                onChange={handleFormChange}
              />

              <Input
                type="Text"
                name="Phone"
                label="Contact Phone (optional):"
                placeholder="Contact Phone (optional)"
                value={formData.Phone}
                onChange={handleFormChange}
              />

              <Input
                required
                type="email"
                name="Email"
                id="Email"
                label="Professional email:"
                placeholder="Professional email"
                value={formData.Email}
                onChange={handleFormChange}
              />
              <Select
                value={formData.Country}
                onChange={handleCountryChange}
                options={countries}
                label="Country:"
                className="Select"
                required
                isSearchable={true}
              />
              <div className="formItem " id="FollowUp">
                <Select
                  value={formData.FollowUp}
                  onChange={handleFollowupChange}
                  required
                  className="Select"
                  options={[
                    { label: "Yes", value: true },
                    { label: "No", value: false },
                  ]}
                  placeholder="Do you want a follow up?"
                />
              </div>
              <div className="formItem " id="Document">
                <Select
                  value={formData.DocumentName}
                  onChange={handleDocChange}
                  required
                  className="Select"
                  isSearchable={true}
                  options={documents}
                  placeholder="Select the desired document"
                />
              </div>
              <span id="disclaimer">
                By submitting my information, I agree to the realedgeAssociates
                Privacy Policy and Terms and Conditions.
              </span>
              <button
                className="Submit"
                onClick={validateForm}
                disabled={sendingEmail ? true : false}
              >
                Send The Document
              </button>
            </form>
          </div>
        )}
        {Data.SupportBody != "<p><br></p>" && (
          <div
            className="Support"
            style={{ fontFamily: Data.Font ? Data.Font : "" }}
            dangerouslySetInnerHTML={{ __html: Data.SupportBody }}
          ></div>
        )}
      </div>
    </div>
  );
};

export default Template7;
