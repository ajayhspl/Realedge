import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import "./ContactPopup.css";
import Phone from "../../../assets/phone.png";
import Email from "../../../assets/mail.png";
import { GETCOLLECTION, SENDMAIL } from "../../../server";
import ContactEmailTemplate from "./ContactEmailTemplate";
function ContactPopUp(props) {
  const [email, setEmail] = useState("");
  const [webName, setWebName] = useState("");
  const [Data, setData] = useState({
    Phone: "",
    Email: "",
    ProjectContactDescription: "",
    ProjectContactTitle: "",
    ContactDescription: "",
    ContactTitle: "",
    PriceContactDescription: "",
    PriceContactTitle: "",
    DefaultPriceContactTitle: "",
    JobRequestDescription: "",
    JobRequestTitle: "",
    DefaultJobContactTitle: "",
  });
  const [formType, setFormType] = useState("");
  const [formValues, setFormValues] = useState({
    Fname: "",
    Lname: "",
    Number: "",
    Email: "",
    Subject: "",
    Message: "",
    JobOffering: {
      JobTitle: "",
      Experience: "",
      Qualification: "",
      NoticePeriod: "",
      CurrentEmployer: "",
      ExpectedCTCPerMonth: "",
      CurrentCTCPerMonth: "",
    },
    ProjectDiscuss: {
      ProjectType: "",
    },
  });
  const handleFormInput = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "JobTitle":
        setFormValues((prev) => {
          return {
            ...prev,
            JobOffering: { ...prev.JobOffering, [name]: value },
          };
        });
        break;
      case "Experience":
        setFormValues((prev) => {
          return {
            ...prev,
            JobOffering: { ...prev.JobOffering, [name]: value },
          };
        });
        break;
      case "Qualification":
        setFormValues((prev) => {
          return {
            ...prev,
            JobOffering: { ...prev.JobOffering, [name]: value },
          };
        });
        break;
      case "NoticePeriod":
        setFormValues((prev) => {
          return {
            ...prev,
            JobOffering: { ...prev.JobOffering, [name]: value },
          };
        });
        break;
      case "CurrentEmployer":
        setFormValues((prev) => {
          return {
            ...prev,
            JobOffering: { ...prev.JobOffering, [name]: value },
          };
        });
        break;
      case "ExpectedCTCPerMonth":
        setFormValues((prev) => {
          return {
            ...prev,
            JobOffering: { ...prev.JobOffering, [name]: value },
          };
        });
        break;
      case "CurrentCTCPerMonth":
        setFormValues((prev) => {
          return {
            ...prev,
            JobOffering: { ...prev.JobOffering, [name]: value },
          };
        });
        break;
      case "ProjectType":
        setFormValues((prev) => {
          return {
            ...prev,
            ProjectDiscuss: { ...prev.ProjectDiscuss, [name]: value },
          };
        });
        break;

      default:
        setFormValues((prev) => {
          return { ...prev, [name]: value };
        });
        break;
    }
  };
  useEffect(() => {
    const FetchEmail = async () => {
      const res = await GETCOLLECTION("customization");
      setEmail(res[2].Email);
      setWebName(res[2].WebsiteName);
      setData({
        Email: res[0].FooterData.Email,
        Phone: res[0].FooterData.Phone,
        ProjectContactDescription: res[2].NavBarContactDescription,
        ProjectContactTitle: res[2].NavBarContactTitle,
        ContactDescription: res[2].HeaderContactDescription,
        ContactTitle: res[2].HeaderContactTitle,
        PriceContactDescription: res[2].PriceContactDescription,
        PriceContactTitle: res[2].PriceContactTitle,
        DefaultPriceContactTitle: res[2].DefaultPriceContactTitle,

        JobRequestDescription: res[2].JobRequestDescription,
        JobRequestTitle: res[2].JobRequestTitle,
        DefaultJobContactTitle: res[2].DefaultJobContactTitle,
      });
    };
    FetchEmail();
  }, []);
  const [width, setWidth] = useState(window.innerWidth);
  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const FormTypes = {
    Contact: {
      type: "Contact",
      title: Data?.ContactTitle,
      Description: Data?.ContactDescription,
      ExtraProperties: {},
    },
    Price: {
      type: "Price",
      title: Data.DefaultPriceContactTitle
        ? `Select our ${props.Name} plan`
        : Data.PriceContactTitle,
      Description: Data?.PriceContactDescription,
      ExtraProperties: {},
    },
    ProjectDiscuss: {
      type: "ProjectDiscuss",
      title: Data?.ProjectContactTitle,
      Description: Data?.ProjectContactDescription,
      ExtraProperties: { ProjectType: true },
    },
    JobOffering: {
      type: "JobOffering",
      title: Data.DefaultJobContactTitle
        ? `Apply For ${props.JobTitle}`
        : Data.JobRequestTitle,
      Description: Data.JobRequestDescription,

      ExtraProperties: {
        Experience: true,
        Qualification: true,
        CurrentEmployer: true,
        CurrentCTCPerMonth: true,
        ExpectedCTCPerMonth: true,
        NoticePeriod: true,
        JobTitle: true,
      },
    },
  };

  useEffect(() => {
    switch (props.type) {
      case "Contact":
        setFormType(FormTypes.Contact);
        break;
      case "Project":
        setFormType(FormTypes.ProjectDiscuss);
        break;
      case "Price":
        setFormType(FormTypes.Price);
        break;
      case "Job":
        setFormType(FormTypes.JobOffering);
        break;
      default:
        break;
    }
  }, [Data]);
  const sendEmail = async (e) => {
    e.preventDefault();
    switch (formType.type) {
      case "JobOffering":
        await SENDMAIL(
          ContactEmailTemplate,
          email,
          webName,
          "Job Request Email",
          formValues,
          `Job Request: ${formValues.Subject}`
        );
        break;
      case "ProjectDiscuss":
        await SENDMAIL(
          ContactEmailTemplate,
          email,
          webName,
          "Project Discuss Email",
          formValues,
          `Project Discuss : ${formValues.Subject}`
        );
        break;
      case "Price":
        await SENDMAIL(
          ContactEmailTemplate,
          email,
          webName,
          "Price plan request Email",
          formValues,
          `Price Plan request : ${formValues.Subject}`
        );
        break;
      case "Contact":
        await SENDMAIL(
          ContactEmailTemplate,
          email,
          webName,
          "Contact Request Email",
          formValues,
          `Contact Request : ${formValues.Subject}`
        );
        break;

      default:
        break;
    }
  };
  return (
    <Modal
      className={props.className}
      show={props.show}
      onHide={props.handleClose}
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <>
          <div className={`Form-wrapper ${width < 1000 ? "small" : ""}`}>
            <h2>{formType?.title}</h2>
            <form className="ContactForm">
              <input
                id="Fname"
                required
                type="text"
                name="Fname"
                placeholder="First Name"
                value={formValues.Fname}
                onChange={handleFormInput}
              />
              <input
                required
                type="text"
                name="Lname"
                placeholder="Last Name"
                id="Lname"
                value={formValues.Lname}
                onChange={handleFormInput}
              />
              <input
                required
                type="email"
                name="Email"
                placeholder="Email"
                id="Email"
                value={formValues.Email}
                onChange={handleFormInput}
              />
              <input
                required
                type="number"
                name="Number"
                placeholder="Contact Number"
                id="number"
                value={formValues.Number}
                onChange={handleFormInput}
              />
              {formType.ExtraProperties?.ProjectType && (
                <input
                  required
                  type="text"
                  name="ProjectType"
                  placeholder="Project Type"
                  id="ProjectType"
                  value={formValues.ProjectDiscuss.ProjectType}
                  onChange={handleFormInput}
                />
              )}
              {formType.ExtraProperties?.JobTitle && (
                <input
                  required
                  type="text"
                  name="JobTitle"
                  placeholder="Job Title"
                  id="Job Title"
                  value={formValues.JobOffering.JobTitle}
                  onChange={handleFormInput}
                />
              )}
              {formType.ExtraProperties?.Experience && (
                <input
                  required
                  type="text"
                  name="Experience"
                  placeholder="Experience"
                  id="Experience"
                  value={formValues.JobOffering.Experience}
                  onChange={handleFormInput}
                />
              )}
              {formType.ExtraProperties?.Qualification && (
                <input
                  required
                  type="text"
                  name="Qualification"
                  placeholder="qualification"
                  id="Qualification"
                  value={formValues.JobOffering.Qualification}
                  onChange={handleFormInput}
                />
              )}
              {formType.ExtraProperties?.NoticePeriod && (
                <input
                  required
                  type="text"
                  name="NoticePeriod"
                  placeholder="NoticePeriod"
                  id="NoticePeriod"
                  value={formValues.JobOffering.NoticePeriod}
                  onChange={handleFormInput}
                />
              )}
              {formType.ExtraProperties?.CurrentEmployer && (
                <input
                  required
                  type="text"
                  name="CurrentEmployer"
                  placeholder="Current Employer"
                  id="CurrentEmployer"
                  value={formValues.JobOffering.CurrentEmployer}
                  onChange={handleFormInput}
                />
              )}
              {formType.ExtraProperties?.ExpectedCTCPerMonth && (
                <input
                  required
                  type="text"
                  name="ExpectedCTCPerMonth"
                  placeholder="Expected CTC Per Month"
                  id="ExpectedCTCPerMonth"
                  value={formValues.JobOffering.ExpectedCTCPerMonth}
                  onChange={handleFormInput}
                />
              )}
              {formType.ExtraProperties?.CurrentCTCPerMonth && (
                <input
                  required
                  type="text"
                  name="CurrentCTCPerMonth"
                  placeholder="Current CTC Per Month"
                  id="CurrentCTCPerMonth"
                  value={formValues.JobOffering.CurrentCTCPerMonth}
                  onChange={handleFormInput}
                />
              )}
              <input
                required
                type="text"
                name="Subject"
                placeholder="Subject"
                id="Subject"
                value={formValues.Subject}
                onChange={handleFormInput}
              />
              <textarea
                required
                type="text"
                name="Message"
                placeholder="Message"
                id="Message"
                value={formValues.Message}
                onChange={handleFormInput}
              />
              <button onClick={sendEmail}>Send</button>
            </form>
          </div>
          {width > 1000 ? (
            <div className="SidePanel">
              <div className="section">
                <h2>{formType?.Description}</h2>
              </div>
              <div className="section">
                <h5>Contact Us</h5>
                <div className="ContactInfo">
                  <a href={`tel:${Data.Phone}`}>
                    <img src={Phone} /> {Data.Phone}
                  </a>
                  <a href={`mailto:${Data.Email}`}>
                    <img src={Email} /> {Data.Email}
                  </a>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </>
      </Modal.Body>
    </Modal>
  );
}

export default ContactPopUp;
/*
  import MyModal from "../components/Modal";

  const [showModal, setShowModal] = React.useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handlePrimaryAction =  () => {};
  
                <button onClick={handleShowModal}>delete Account</button>
                <MyModal
                  show={showModal}
                  handleClose={handleCloseModal}
                  //title="MODAL TITLE"
                 // primaryButtonText="MODAL TEXT"
                  handlePrimaryAction={handlePrimaryAction}
                >
                  <>
                    //MODAL CONTENT
                  </>
                </MyModal>
                 */
