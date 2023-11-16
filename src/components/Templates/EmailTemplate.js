import React from "react";

// Define the EmailTemplate component
function EmailTemplate({
  ContactEmail,
  Receiver,
  DocLink,
  Twitter,
  Facebook,
  LinkedIn,
  webName,
}) {
  return (
    <html>
      <head>
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="x-apple-disable-message-reformatting" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <title></title>

        <link
          href="https://fonts.googleapis.com/css?family=Open+Sans:400,700&display=swap"
          rel="stylesheet"
          type="text/css"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Rubik:400,700&display=swap"
          rel="stylesheet"
          type="text/css"
        />
        <style>
          {`       @media only screen and (min-width: 620px) {
        .u-row {
          width: 600px !important;
        }
        .u-row .u-col {
          vertical-align: top;
        }

        .u-row .u-col-100 {
          width: 600px !important;
        }
      }

      @media (max-width: 620px) {
        .u-row-container {
          max-width: 100% !important;
          padding-left: 0px !important;
          padding-right: 0px !important;
        }
        .u-row .u-col {
          min-width: 320px !important;
          max-width: 100% !important;
          display: block !important;
        }
        .u-row {
          width: 100% !important;
        }
        .u-col {
          width: 100% !important;
        }
        .u-col > div {
          margin: 0 auto;
        }
      }
      body {
        margin: 0;
        padding: 0;
      }

      table,
      tr,
      td {
        vertical-align: top;
        border-collapse: collapse;
      }

      p {
        margin: 0;
      }

      .ie-container table,
      .mso-container table {
        table-layout: fixed;
      }

      * {
        line-height: inherit;
      }

      a[x-apple-data-detectors="true"] {
        color: inherit !important;
        text-decoration: none !important;
      }

      table,
      td {
        color: #000000;
      }
      #u_body a {
        color: #0000ee;
        text-decoration: underline;
      }
      @media (max-width: 480px) {
        #u_content_image_1 .v-src-width {
          width: auto !important;
        }
        #u_content_image_1 .v-src-max-width {
          max-width: 25% !important;
        }
        #u_content_text_3 .v-container-padding-padding {
          padding: 10px 20px 20px !important;
        }
        #u_content_button_1 .v-size-width {
          width: 65% !important;
        }
        #u_content_text_4 .v-container-padding-padding {
          padding: 60px 20px !important;
        }
        #u_content_heading_2 .v-container-padding-padding {
          padding: 30px 10px 0px !important;
        }
        #u_content_heading_2 .v-text-align {
          text-align: center !important;
        }
        #u_content_social_1 .v-container-padding-padding {
          padding: 10px 10px 10px 98px !important;
        }
      }`}
        </style>
      </head>

      <body
        className="clean-body u_body"
        style={{
          margin: 0,
          padding: 0,
          WebkitTextSizeAdjust: "100%",
          backgroundColor: "#000000",
          color: "#000000",
        }}
      >
        <table
          id="u_body"
          style={{
            borderCollapse: "collapse",
            tableLayout: "fixed",
            borderSpacing: 0,
            verticalAlign: "top",
            minWidth: "320px",
            margin: "0 auto",
            backgroundColor: "#000000",
            width: "100%",
          }}
          cellPadding="0"
          cellSpacing="0"
        >
          <tbody>
            <tr style={{ verticalAlign: "top" }}>
              <td
                style={{
                  wordBreak: "break-word",
                  borderCollapse: "collapse !important",
                  verticalAlign: "top",
                }}
              >
                <div
                  className="u-row-container"
                  style={{
                    padding: "0px",
                    backgroundColor: "transparent",
                  }}
                >
                  <div
                    className="u-row"
                    style={{
                      margin: "0 auto",
                      minWidth: "320px",
                      maxWidth: "600px",
                      overflowWrap: "break-word",
                      wordWrap: "break-word",
                      wordBreak: "break-word",
                      backgroundColor: "transparent",
                    }}
                  >
                    <div
                      style={{
                        borderCollapse: "collapse",
                        display: "table",
                        width: "100%",
                        height: "100%",
                        backgroundColor: "transparent",
                      }}
                    >
                      <div
                        className="u-col u-col-100"
                        style={{
                          maxWidth: "320px",
                          minWidth: "600px",
                          display: "table-cell",
                          verticalAlign: "top",
                        }}
                      >
                        <div
                          style={{
                            backgroundColor: "#ffffff",
                            height: "100%",
                            width: "100% !important",
                          }}
                        >
                          <div
                            style={{
                              boxSizing: "border-box",
                              height: "100%",
                              padding: "0px",
                              borderTop: "0px solid transparent",
                              borderLeft: "0px solid transparent",
                              borderRight: "0px solid transparent",
                              borderBottom: "0px solid transparent",
                            }}
                          >
                            <table
                              id="u_content_image_1"
                              style={{
                                fontFamily: "'Open Sans', sans-serif",
                              }}
                              role="presentation"
                              cellPadding="0"
                              cellSpacing="0"
                              width="100%"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    className="v-container-padding-padding"
                                    style={{
                                      overflowWrap: "break-word",
                                      wordBreak: "break-word",
                                      padding: "43px 10px",
                                      fontFamily: "'Open Sans', sans-serif",
                                    }}
                                    align="left"
                                  >
                                    <table
                                      width="100%"
                                      cellPadding="0"
                                      cellSpacing="0"
                                      border="0"
                                    >
                                      <tr>
                                        <td
                                          className="v-text-align"
                                          style={{
                                            paddingRight: "0px",
                                            paddingLeft: "0px",
                                          }}
                                          align="center"
                                        >
                                          <img
                                            align="center"
                                            border="0"
                                            src="https://firebasestorage.googleapis.com/v0/b/harptec-e2239.appspot.com/o/customization%2FGeneral%2FLogo?alt=media&token=5a8d592b-e626-42aa-a501-72b388eb8382"
                                            alt="Logo"
                                            title="Logo"
                                            style={{
                                              outline: "none",
                                              textDecoration: "none",
                                              msInterpolationMode: "bicubic",
                                              clear: "both",
                                              display:
                                                "inline-block !important",
                                              border: "none",
                                              height: "auto",
                                              float: "none",
                                              width: "47%",
                                              maxWidth: "272.6px",
                                            }}
                                            width="272.6"
                                            className="v-src-width v-src-max-width"
                                          />
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="u-row-container"
                  style={{
                    padding: "0px",
                    backgroundColor: "transparent",
                  }}
                >
                  <div
                    className="u-row"
                    style={{
                      margin: "0 auto",
                      minWidth: "320px",
                      maxWidth: "600px",
                      overflowWrap: "break-word",
                      wordWrap: "break-word",
                      wordBreak: "break-word",
                      backgroundColor: "transparent",
                    }}
                  >
                    <div
                      style={{
                        borderCollapse: "collapse",
                        display: "table",
                        width: "100%",
                        height: "100%",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center top",
                        backgroundColor: "transparent",
                      }}
                    >
                      <div
                        className="u-col u-col-100"
                        style={{
                          maxWidth: "320px",
                          minWidth: "600px",
                          display: "table-cell",
                          verticalAlign: "top",
                        }}
                      >
                        <div
                          style={{
                            backgroundColor: "#020d1c",
                            height: "100%",
                            width: "100% !important",
                            borderRadius: "0px",
                            WebkitBorderRadius: "0px",
                            MozBorderRadius: "0px",
                          }}
                        >
                          <div
                            style={{
                              boxSizing: "border-box",
                              height: "100%",
                              padding: "0px",
                              borderTop: "0px solid transparent",
                              borderLeft: "0px solid transparent",
                              borderRight: "0px solid transparent",
                              borderBottom: "0px solid transparent",
                              borderRadius: "0px",
                              WebkitBorderRadius: "0px",
                              MozBorderRadius: "0px",
                            }}
                          >
                            <table
                              style={{
                                fontFamily: "'Open Sans', sans-serif",
                              }}
                              role="presentation"
                              cellPadding="0"
                              cellSpacing="0"
                              width="100%"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    className="v-container-padding-padding"
                                    style={{
                                      overflowWrap: "break-word",
                                      wordBreak: "break-word",
                                      padding: "60px 10px 10px",
                                      fontFamily: "'Open Sans', sans-serif",
                                    }}
                                    align="left"
                                  >
                                    <div
                                      className="v-text-align"
                                      style={{
                                        fontSize: "14px",
                                        color: "#ffffff",
                                        lineHeight: "170%",
                                        textAlign: "center",
                                        wordWrap: "break-word",
                                      }}
                                    >
                                      <p
                                        style={{
                                          fontSize: "14px",
                                          lineHeight: "170%",
                                        }}
                                      >
                                        <span
                                          style={{
                                            fontSize: "20px",
                                            lineHeight: "34px",
                                          }}
                                        >
                                          <strong>
                                            <span
                                              style={{
                                                lineHeight: "34px",
                                                fontSize: "20px",
                                                color: "white",
                                              }}
                                            >
                                              Hi {Receiver},
                                            </span>
                                          </strong>
                                        </span>
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table
                              id="u_content_text_3"
                              style={{
                                fontFamily: "'Open Sans', sans-serif",
                                width: "100%",
                                border: "0",
                              }}
                              role="presentation"
                              cellPadding="0"
                              cellSpacing="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    className="v-container-padding-padding"
                                    style={{
                                      overflowWrap: "break-word",
                                      wordBreak: "break-word",
                                      padding: "10px 100px 20px",
                                      fontFamily: "'Open Sans', sans-serif",
                                    }}
                                    align="left"
                                  >
                                    <div
                                      className="v-text-align"
                                      style={{
                                        fontSize: "14px",
                                        color: "#ffffff",
                                        lineHeight: "170%",
                                        textAlign: "center",
                                        wordWrap: "break-word",
                                      }}
                                    >
                                      <p style={{ lineHeight: "170%" }}>
                                        <span
                                          style={{
                                            fontSize: "16px",
                                            lineHeight: "27.2px",
                                            color: "white",
                                          }}
                                        >
                                          Thank you for your interest in{" "}
                                          {webName}.
                                          <br />
                                          Please find the needed download link
                                          down below
                                        </span>
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>

                            <table
                              id="u_content_button_1"
                              style={{ fontFamily: "'Open Sans', sans-serif" }}
                              role="presentation"
                              cellPadding="0"
                              cellSpacing="0"
                              width="100%"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    className="v-container-padding-padding"
                                    style={{
                                      overflowWrap: "break-word",
                                      wordBreak: "break-word",
                                      padding: "10px",
                                      fontFamily: "'Open Sans', sans-serif",
                                    }}
                                    align="left"
                                  >
                                    <div
                                      className="v-text-align"
                                      style={{
                                        width: "fit-content",
                                        margin: "auto",
                                      }}
                                    >
                                      <button
                                        href={DocLink}
                                        target="_blank"
                                        className="v-button v-size-width"
                                        style={{
                                          boxSizing: "border-box",
                                          display: "block",
                                          textDecoration: "none",
                                          WebkitTextSizeAdjust: "none",
                                          textAlign: "center",
                                          color: "#000000",
                                          backgroundColor: "#ffffff",
                                          borderRadius: "4px",
                                          WebkitBorderRadius: "4px",
                                          MozBorderRadius: "4px",
                                          margin: "auto",
                                          maxWidth: "100%",
                                          overflowWrap: "break-word",
                                          wordBreak: "break-word",
                                          wordWrap: "break-word",
                                          fontSize: "14px",
                                          marginBottom: "20px",
                                        }}
                                        rel="noreferrer"
                                      >
                                        <span
                                          style={{
                                            display: "block",
                                            padding: "10px 20px",
                                            lineHeight: "120%",
                                          }}
                                        >
                                          <span
                                            style={{
                                              fontSize: "16px",
                                              lineHeight: "19.2px",
                                            }}
                                          >
                                            <strong>
                                              <span
                                                style={{
                                                  lineHeight: "19.2px",
                                                  fontSize: "16px",
                                                }}
                                              >
                                                Download File
                                              </span>
                                            </strong>
                                          </span>
                                        </span>
                                      </button>
                                      <div
                                        style={{
                                          margin: "auto",
                                          width: "fit-content",
                                          textAlign: "center",
                                          color: "white",
                                        }}
                                      >
                                        <span style={{ color: "white" }}>
                                          if the previous button doesn't work
                                          please click the following link
                                        </span>
                                        <br />
                                        <a
                                          style={{ color: "white" }}
                                          href={DocLink}
                                        >
                                          {DocLink}
                                        </a>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="u-row-container"
                  style={{ padding: "0px", backgroundColor: "transparent" }}
                >
                  <div
                    className="u-row"
                    style={{
                      margin: "0 auto",
                      minWidth: "320px",
                      maxWidth: "600px",
                      overflowWrap: "break-word",
                      wordWrap: "break-word",
                      wordBreak: "break-word",
                      backgroundColor: "transparent",
                    }}
                  >
                    <div
                      style={{
                        borderCollapse: "collapse",
                        display: "table",
                        width: "100%",
                        height: "100%",
                        backgroundColor: "transparent",
                      }}
                    >
                      <div
                        className="u-col u-col-100"
                        style={{
                          maxWidth: "320px",
                          minWidth: "600px",
                          display: "table-cell",
                          verticalAlign: "top",
                        }}
                      >
                        <div
                          style={{
                            backgroundColor: "#ffffff",
                            height: "100%",
                            width: "100% !important",
                            borderRadius: "0px",
                            WebkitBorderRadius: "0px",
                            MozBorderRadius: "0px",
                          }}
                        >
                          <div
                            style={{
                              boxSizing: "border-box",
                              height: "100%",
                              padding: "0px",
                              borderTop: "0px solid transparent",
                              borderLeft: "0px solid transparent",
                              borderRight: "0px solid transparent",
                              borderBottom: "0px solid transparent",
                              borderRadius: "0px",
                              WebkitBorderRadius: "0px",
                              MozBorderRadius: "0px",
                            }}
                          >
                            <table
                              id="u_content_text_4"
                              style={{ fontFamily: "'Open Sans', sans-serif" }}
                              role="presentation"
                              cellPadding="0"
                              cellSpacing="0"
                              width="100%"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    className="v-container-padding-padding"
                                    style={{
                                      overflowWrap: "break-word",
                                      wordBreak: "break-word",
                                      padding: "30px 80px",
                                      fontFamily: "'Open Sans', sans-serif",
                                    }}
                                    align="left"
                                  >
                                    <div
                                      className="v-text-align"
                                      style={{
                                        fontSize: "14px",
                                        color: "#000000",
                                        lineHeight: "170%",
                                        textAlign: "center",
                                        wordWrap: "break-word",
                                      }}
                                    >
                                      <p
                                        style={{
                                          fontSize: "14px",
                                          lineHeight: "170%",
                                        }}
                                      >
                                        Need help? Reach out to us on{" "}
                                        {ContactEmail}
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="u-row-container"
                  style={{ padding: "0px", backgroundColor: "transparent" }}
                >
                  <div
                    className="u-row"
                    style={{
                      margin: "0 auto",
                      minWidth: "320px",
                      maxWidth: "600px",
                      overflowWrap: "break-word",
                      wordWrap: "break-word",
                      wordBreak: "break-word",
                      backgroundColor: "transparent",
                    }}
                  >
                    <div
                      style={{
                        borderCollapse: "collapse",
                        display: "table",
                        width: "100%",
                        height: "100%",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center top",
                        backgroundColor: "transparent",
                      }}
                    >
                      <div
                        className="u-col u-col-100"
                        style={{
                          maxWidth: "320px",
                          minWidth: "600px",
                          display: "table-cell",
                          verticalAlign: "top",
                        }}
                      >
                        <div
                          style={{
                            backgroundColor: "#020d1c",
                            height: "100%",
                            width: "100% !important",
                            borderRadius: "0px",
                            WebkitBorderRadius: "0px",
                            MozBorderRadius: "0px",
                          }}
                        >
                          <div
                            style={{
                              boxSizing: "border-box",
                              height: "100%",
                              padding: "0px",
                              borderTop: "0px solid transparent",
                              borderLeft: "0px solid transparent",
                              borderRight: "0px solid transparent",
                              borderBottom: "0px solid transparent",
                              borderRadius: "0px",
                              WebkitBorderRadius: "0px",
                              MozBorderRadius: "0px",
                            }}
                          >
                            <table
                              id="u_content_heading_2"
                              style={{ fontFamily: "'Open Sans', sans-serif" }}
                              role="presentation"
                              cellPadding="0"
                              cellSpacing="0"
                              width="100%"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    className="v-container-padding-padding"
                                    style={{
                                      overflowWrap: "break-word",
                                      wordBreak: "break-word",
                                      padding: "30px 0px 0px 0px",
                                      fontFamily: "'Open Sans', sans-serif",
                                    }}
                                    align="left"
                                  >
                                    <h1
                                      className="v-text-align"
                                      style={{
                                        margin: "0px",
                                        color: "#ffffff",
                                        lineHeight: "140%",
                                        textAlign: "center",
                                        wordWrap: "break-word",
                                        fontFamily: "'Rubik', sans-serif",
                                        fontSize: "25px",
                                        fontWeight: "400",
                                      }}
                                    >
                                      <strong
                                        style={{ textTransform: "uppercase" }}
                                      >
                                        {webName}
                                      </strong>
                                    </h1>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table
                              id="u_content_social_1"
                              style={{ fontFamily: "'Open Sans', sans-serif" }}
                              role="presentation"
                              cellPadding="0"
                              cellSpacing="0"
                              width="100%"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    className="v-container-padding-padding"
                                    style={{
                                      overflowWrap: "break-word",
                                      wordBreak: "break-word",
                                      padding: "10px 0px 30px 0px",
                                      fontFamily: "'Open Sans', sans-serif",
                                    }}
                                    align="left"
                                  >
                                    <div
                                      style={{
                                        width: "fit-content",
                                        margin: "auto",
                                      }}
                                    >
                                      <div
                                        style={{
                                          display: "table",
                                          maxWidth: "140px",
                                        }}
                                      >
                                        <table
                                          align="left"
                                          border="0"
                                          cellSpacing="0"
                                          cellPadding="0"
                                          width="32"
                                          height="32"
                                          style={{
                                            width: "32px !important",
                                            height: "32px !important",
                                            display: "inline-block",
                                            borderCollapse: "collapse",
                                            tableLayout: "fixed",
                                            borderSpacing: "0",
                                            verticalAlign: "top",
                                            marginRight: "15px",
                                          }}
                                        >
                                          <tbody>
                                            <tr
                                              style={{ verticalAlign: "top" }}
                                            >
                                              <td
                                                align="left"
                                                valign="middle"
                                                style={{
                                                  wordBreak: "break-word",
                                                  borderCollapse:
                                                    "collapse !important",
                                                  verticalAlign: "top",
                                                }}
                                              >
                                                <a
                                                  href={Facebook}
                                                  title="Facebook"
                                                  target="_blank"
                                                  rel="noreferrer"
                                                >
                                                  <img
                                                    src="https://firebasestorage.googleapis.com/v0/b/realedge-f7346.appspot.com/o/customization%2FGeneral%2Ffacebook.png?alt=media&token=3ba7fcc9-0d30-41cd-be48-91bbabd419d3"
                                                    alt="Facebook"
                                                    title="Facebook"
                                                    width="32"
                                                    style={{
                                                      outline: "none",
                                                      textDecoration: "none",
                                                      msInterpolationMode:
                                                        "bicubic",
                                                      clear: "both",
                                                      display:
                                                        "block !important",
                                                      border: "none",
                                                      height: "auto",
                                                      float: "none",
                                                      maxWidth:
                                                        "32px !important",
                                                    }}
                                                  />
                                                </a>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                        <table
                                          align="left"
                                          border="0"
                                          cellSpacing="0"
                                          cellPadding="0"
                                          width="32"
                                          height="32"
                                          style={{
                                            width: "32px !important",
                                            height: "32px !important",
                                            display: "inline-block",
                                            borderCollapse: "collapse",
                                            tableLayout: "fixed",
                                            borderSpacing: "0",
                                            verticalAlign: "top",
                                            marginRight: "15px",
                                          }}
                                        >
                                          <tbody>
                                            <tr
                                              style={{ verticalAlign: "top" }}
                                            >
                                              <td
                                                align="left"
                                                valign="middle"
                                                style={{
                                                  wordBreak: "break-word",
                                                  borderCollapse:
                                                    "collapse !important",
                                                  verticalAlign: "top",
                                                }}
                                              >
                                                <a
                                                  title="Twitter"
                                                  href={Twitter}
                                                  target="_blank"
                                                  rel="noreferrer"
                                                >
                                                  <img
                                                    src="https://firebasestorage.googleapis.com/v0/b/realedge-f7346.appspot.com/o/customization%2FGeneral%2Ftwitter.png?alt=media&token=89068601-838f-4574-b2f2-611d05b382de"
                                                    alt="twitter"
                                                    title="twitter"
                                                    width="32"
                                                    style={{
                                                      outline: "none",
                                                      textDecoration: "none",
                                                      msInterpolationMode:
                                                        "bicubic",
                                                      clear: "both",
                                                      display:
                                                        "block !important",
                                                      border: "none",
                                                      height: "auto",
                                                      float: "none",
                                                      maxWidth:
                                                        "32px !important",
                                                    }}
                                                  />
                                                </a>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                        <table
                                          align="left"
                                          border="0"
                                          cellSpacing="0"
                                          cellPadding="0"
                                          width="32"
                                          height="32"
                                          style={{
                                            width: "32px !important",
                                            height: "32px !important",
                                            display: "inline-block",
                                            borderCollapse: "collapse",
                                            tableLayout: "fixed",
                                            borderSpacing: "0",
                                            verticalAlign: "top",
                                            marginRight: "0px",
                                          }}
                                        >
                                          <tbody>
                                            <tr
                                              style={{ verticalAlign: "top" }}
                                            >
                                              <td
                                                align="left"
                                                valign="middle"
                                                style={{
                                                  wordBreak: "break-word",
                                                  borderCollapse:
                                                    "collapse !important",
                                                  verticalAlign: "top",
                                                }}
                                              >
                                                <a
                                                  href={LinkedIn}
                                                  title="LinkedIn"
                                                  target="_blank"
                                                  rel="noreferrer"
                                                >
                                                  <img
                                                    src="https://firebasestorage.googleapis.com/v0/b/realedge-f7346.appspot.com/o/customization%2FGeneral%2Flinkedin.png?alt=media&token=aa550fa3-74d5-4335-80a1-cbb1a5399893"
                                                    alt="LinkedIn"
                                                    title="LinkedIn"
                                                    width="32"
                                                    style={{
                                                      outline: "none",
                                                      textDecoration: "none",
                                                      msInterpolationMode:
                                                        "bicubic",
                                                      clear: "both",
                                                      display:
                                                        "block !important",
                                                      border: "none",
                                                      height: "auto",
                                                      float: "none",
                                                      maxWidth:
                                                        "32px !important",
                                                    }}
                                                  />
                                                </a>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
}
export default EmailTemplate;
