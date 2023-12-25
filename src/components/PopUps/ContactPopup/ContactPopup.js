import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import "./ContactPopup.css";
import { MdOutlineEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { GETCOLLECTION, SENDMAIL } from "../../../server";
import ContactEmailTemplate from "./ContactEmailTemplate";
import Input from "../../Input/Input";
function ContactPopUp(props) {
  const [email, setEmail] = useState("");
  const [webName, setWebName] = useState("");
  const [formColor, setFormColor] = useState("");
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
      setFormColor(res[2].Colors.formsBackground);
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
              <Input
                label="First Name:"
                type="text"
                required={true}
                id="Fname"
                name="Fname"
                value={formValues.Fname}
                onChangeFunction={handleFormInput}
                customWidth="45%"
              />

              <Input
                label="Last Name:"
                type="text"
                required={true}
                id="Lname"
                name="Lname"
                value={formValues.Lname}
                onChangeFunction={handleFormInput}
                customWidth="45%"
              />

              <Input
                label="Email:"
                type="email"
                required={true}
                id="Email"
                name="Email"
                value={formValues.Email}
                onChangeFunction={handleFormInput}
              />

              <Input
                label="Contact Number:"
                type="number"
                required={true}
                id="Number"
                name="Number"
                value={formValues.Number}
                onChangeFunction={handleFormInput}
              />

              {formType.ExtraProperties?.ProjectType && (
                <Input
                  required
                  type="text"
                  name="ProjectType"
                  label="Project Type"
                  id="ProjectType"
                  value={formValues.ProjectDiscuss.ProjectType}
                  onChangeFunction={handleFormInput}
                />
              )}
              {formType.ExtraProperties?.JobTitle && (
                <Input
                  required
                  type="text"
                  name="JobTitle"
                  label="Job Title"
                  id="JobTitle"
                  value={formValues.JobOffering.JobTitle}
                  onChangeFunction={handleFormInput}
                  customWidth="100%"
                />
              )}

              {formType.ExtraProperties?.Experience && (
                <Input
                  required
                  type="text"
                  name="Experience"
                  label="Experience"
                  id="Experience"
                  value={formValues.JobOffering.Experience}
                  onChangeFunction={handleFormInput}
                  customWidth="45%"
                />
              )}

              {formType.ExtraProperties?.Qualification && (
                <Input
                  required
                  type="text"
                  name="Qualification"
                  label="Qualification"
                  id="Qualification"
                  value={formValues.JobOffering.Qualification}
                  onChangeFunction={handleFormInput}
                  customWidth="45%"
                />
              )}

              {formType.ExtraProperties?.NoticePeriod && (
                <Input
                  required
                  type="text"
                  name="NoticePeriod"
                  label="Notice Period"
                  id="NoticePeriod"
                  value={formValues.JobOffering.NoticePeriod}
                  onChangeFunction={handleFormInput}
                />
              )}

              {formType.ExtraProperties?.CurrentEmployer && (
                <Input
                  required
                  type="text"
                  name="CurrentEmployer"
                  label="Current Employer"
                  id="CurrentEmployer"
                  value={formValues.JobOffering.CurrentEmployer}
                  onChangeFunction={handleFormInput}
                />
              )}

              {formType.ExtraProperties?.ExpectedCTCPerMonth && (
                <Input
                  required
                  type="text"
                  name="ExpectedCTCPerMonth"
                  label="Expected CTC Per Month"
                  id="ExpectedCTCPerMonth"
                  value={formValues.JobOffering.ExpectedCTCPerMonth}
                  onChangeFunction={handleFormInput}
                  customWidth="45%"
                />
              )}

              {formType.ExtraProperties?.CurrentCTCPerMonth && (
                <Input
                  required
                  type="text"
                  name="CurrentCTCPerMonth"
                  label="Current CTC Per Month"
                  id="CurrentCTCPerMonth"
                  value={formValues.JobOffering.CurrentCTCPerMonth}
                  onChangeFunction={handleFormInput}
                  customWidth="45%"
                />
              )}

              <Input
                label="Subject:"
                type="text"
                required={true}
                id="Subject"
                name="Subject"
                value={formValues.Subject}
                onChangeFunction={handleFormInput}
              />

              <Input
                textarea={true}
                label="Message:"
                type="textarea"
                required={true}
                id="Message"
                name="Message"
                value={formValues.Message}
                onChangeFunction={handleFormInput}
              />

              <button onClick={sendEmail}>Send</button>
            </form>
          </div>
          {width > 1000 ? (
            <div className="SidePanel" style={{ backgroundColor: formColor }}>
              <div className="section">
                <h2>{formType?.Description}</h2>
              </div>
              <div className="section">
                <h5>Contact Us</h5>
                <div className="ContactInfo">
                  <a href={`tel:${Data.Phone}`}>
                    <FaPhoneAlt
                      style={{ fontSize: "1.2rem", color: "var(--icons)" }}
                    />
                    {Data.Phone}
                  </a>
                  <a href={`mailto:${Data.Email}`}>
                    <MdOutlineEmail
                      style={{ fontSize: "1.5rem", color: "var(--icons)" }}
                    />
                    {Data.Email}
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
