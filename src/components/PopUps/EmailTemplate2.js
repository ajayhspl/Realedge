import React from "react";

const EmailTemplate2 = ({ formData, EmailHeader }) => {
  const emailTemplateStyles = {
    margin: 0,
    padding: 0,
    WebkitTextSizeAdjust: "100%",
    backgroundColor: "#e7e7e7",
    color: "#000000",
  };

  const tableStyles = {
    borderCollapse: "collapse",
    tableLayout: "fixed",
    borderSpacing: 0,
    verticalAlign: "top",
    minWidth: "320px",
    margin: "0 auto",
    backgroundColor: "#e7e7e7",
    width: "100%",
  };

  const tdStyles = {
    wordBreak: "break-word",
    borderCollapse: "collapse !important",
    verticalAlign: "top",
  };

  const uRowContainerStyles = {
    padding: "0px",
    backgroundColor: "transparent",
  };

  const uRowStyles = {
    margin: "0 auto",
    minWidth: "320px",
    maxWidth: "500px",
    overflowWrap: "break-word",
    wordWrap: "break-word",
    wordBreak: "break-word",
    backgroundColor: "transparent",
  };

  const uColStyles = {
    maxWidth: "320px",
    minWidth: "500px",
    display: "table-cell",
    verticalAlign: "top",
  };

  const h1Styles = {
    margin: "0px",
    lineHeight: "140%",
    textAlign: "center",
    wordWrap: "break-word",
    fontFamily: "'Rubik', sans-serif",
    fontSize: "24px",
    fontWeight: 400,
  };

  const pStyles = {
    fontSize: "14px",
    lineHeight: "140%",
    textAlign: "left",
    wordWrap: "break-word",
  };

  return (
    <html>
      <head>
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="x-apple-disable-message-reformatting" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <title></title>

        <link
          href="https://fonts.googleapis.com/css?family=Rubik:400,700&display=swap"
          rel="stylesheet"
          type="text/css"
        />
      </head>
      <body style={emailTemplateStyles}>
        <table style={tableStyles}>
          <tbody>
            <tr style={{ verticalAlign: "top" }}>
              <td style={tdStyles}>
                <div className="u-row-container" style={uRowContainerStyles}>
                  <div className="u-row" style={uRowStyles}>
                    <div style={tableStyles}>
                      <div className="u-col u-col-100" style={uColStyles}>
                        <div
                          style={{ height: "100%", width: "100% !important" }}
                        >
                          <table
                            style={{
                              fontFamily: "arial, helvetica, sans-serif",
                            }}
                            role="presentation"
                            width="100%"
                            border="0"
                          >
                            <tbody>
                              <tr>
                                <td
                                  style={{
                                    overflowWrap: "break-word",
                                    wordBreak: "break-word",
                                    padding: "10px",
                                    fontFamily: "arial, helvetica, sans-serif",
                                  }}
                                  align="left"
                                >
                                  <table width="100%" border="0">
                                    <tr>
                                      <td
                                        style={{
                                          padding: "0px",
                                          paddingLeft: "0px",
                                        }}
                                        align="center"
                                      >
                                        <img
                                          align="center"
                                          border="0"
                                          src="https://firebasestorage.googleapis.com/v0/b/harptec-e2239.appspot.com/o/customization%2FGeneral%2FLogo?alt=media&token=5a8d592b-e626-42aa-a501-72b388eb8382"
                                          alt="Logo"
                                          title=""
                                          style={{
                                            outline: "none",
                                            textDecoration: "none",
                                            msInterpolationMode: "bicubic",
                                            clear: "both",
                                            display: "inline-block !important",
                                            border: "none",
                                            height: "auto",
                                            float: "none",
                                            width: "100%",
                                            maxWidth: "231px",
                                          }}
                                          width="231"
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
                <div className="u-row-container" style={uRowContainerStyles}>
                  <div className="u-row" style={uRowStyles}>
                    <div style={tableStyles}>
                      <div className="u-col u-col-100" style={uColStyles}>
                        <div
                          style={{
                            height: "100%",
                            width: "100% !important",
                            borderRadius: "0px",
                            WebkitBorderRadius: "0px",
                            MozBorderRadius: "0px",
                          }}
                        >
                          <table
                            style={{
                              fontFamily: "arial, helvetica, sans-serif",
                            }}
                            role="presentation"
                            width="100%"
                            border="0"
                          >
                            <tbody>
                              <tr>
                                <td
                                  style={{
                                    overflowWrap: "break-word",
                                    wordBreak: "break-word",
                                    padding: "10px",
                                    fontFamily: "arial, helvetica, sans-serif",
                                  }}
                                  align="left"
                                >
                                  <h1 style={h1Styles}>{EmailHeader}</h1>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="u-row-container" style={uRowContainerStyles}>
                  <div className="u-row" style={uRowStyles}>
                    <div style={tableStyles}>
                      <div className="u-col u-col-50" style={uColStyles}>
                        <div
                          style={{
                            height: "100%",
                            width: "100% !important",
                            borderRadius: "0px",
                            WebkitBorderRadius: "0px",
                            MozBorderRadius: "0px",
                          }}
                        >
                          <table
                            style={{
                              fontFamily: "arial, helvetica, sans-serif",
                            }}
                            role="presentation"
                            width="100%"
                            border="0"
                          >
                            <tbody>
                              <tr>
                                <td
                                  style={{
                                    overflowWrap: "break-word",
                                    wordBreak: "break-word",
                                    padding: "10px",
                                    fontFamily: "arial, helvetica, sans-serif",
                                  }}
                                  align="left"
                                >
                                  <div style={pStyles}>
                                    <p style={{ lineHeight: "140%" }}>
                                      Full Name:{formData.Fname}{" "}
                                      {formData.Lname}
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
                <div className="u-row-container" style={uRowContainerStyles}>
                  <div className="u-row" style={uRowStyles}>
                    <div style={tableStyles}>
                      <div className="u-col u-col-50" style={uColStyles}>
                        <div
                          style={{
                            height: "100%",
                            width: "100% !important",
                            borderRadius: "0px",
                            WebkitBorderRadius: "0px",
                            MozBorderRadius: "0px",
                          }}
                        >
                          <table
                            style={{
                              fontFamily: "arial, helvetica, sans-serif",
                            }}
                            role="presentation"
                            width="100%"
                            border="0"
                          >
                            <tbody>
                              <tr>
                                <td
                                  style={{
                                    overflowWrap: "break-word",
                                    wordBreak: "break-word",
                                    padding: "10px",
                                    fontFamily: "arial, helvetica, sans-serif",
                                  }}
                                  align="left"
                                >
                                  <div style={pStyles}>
                                    <p style={{ lineHeight: "140%" }}>
                                      Contact phone:{formData.Phone}
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

                <div className="u-row-container" style={uRowContainerStyles}>
                  <div className="u-row" style={uRowStyles}>
                    <div style={tableStyles}>
                      <div
                        className="u-col u-col-100"
                        style={{
                          maxWidth: "320px",
                          minWidth: "500px",
                          display: "table-cell",
                          verticalAlign: "top",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: "100% !important",
                            borderRadius: "0px",
                            WebkitBorderRadius: "0px",
                            MozBorderRadius: "0px",
                          }}
                        >
                          <table
                            style={{
                              fontFamily: "arial, helvetica, sans-serif",
                            }}
                            role="presentation"
                            width="100%"
                            border="0"
                          >
                            <tbody>
                              <tr>
                                <td
                                  style={{
                                    overflowWrap: "break-word",
                                    wordBreak: "break-word",
                                    padding: "10px",
                                    fontFamily: "arial, helvetica, sans-serif",
                                  }}
                                  align="left"
                                >
                                  <div
                                    style={{
                                      fontSize: "14px",
                                      lineHeight: "140%",
                                      textAlign: "left",
                                      wordWrap: "break-word",
                                    }}
                                  >
                                    <p style={{ lineHeight: "140%" }}>
                                      Email: {formData.Email}
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

                <div className="u-row-container" style={uRowContainerStyles}>
                  <div className="u-row" style={uRowStyles}>
                    <div style={tableStyles}>
                      <div
                        className="u-col u-col-100"
                        style={{
                          maxWidth: "320px",
                          minWidth: "500px",
                          display: "table-cell",
                          verticalAlign: "top",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: "100% !important",
                            borderRadius: "0px",
                            WebkitBorderRadius: "0px",
                            MozBorderRadius: "0px",
                          }}
                        >
                          <table
                            style={{
                              fontFamily: "arial, helvetica, sans-serif",
                            }}
                            role="presentation"
                            width="100%"
                            border="0"
                          >
                            <tbody>
                              <tr>
                                <td
                                  style={{
                                    overflowWrap: "break-word",
                                    wordBreak: "break-word",
                                    padding: "10px",
                                    fontFamily: "arial, helvetica, sans-serif",
                                  }}
                                  align="left"
                                >
                                  <div
                                    style={{
                                      fontSize: "14px",
                                      lineHeight: "140%",
                                      textAlign: "left",
                                      wordWrap: "break-word",
                                    }}
                                  >
                                    <p style={{ lineHeight: "140%" }}>
                                      requested File:
                                      {formData.DocumentName.label}
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
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
};

export default EmailTemplate2;
