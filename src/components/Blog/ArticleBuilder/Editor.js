/* eslint-disable no-debugger */
import React, { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { UPLOADPHOTO, DELETEPHOTO } from "../../../server";
import { generate as GenerateID } from "shortid";
import { CreateToast } from "../../../App";

const MyEditor = ({
  handlePostBodyChange,
  SetUpdated,
  ArticleID,
  Content,
  updatePhotoList,
}) => {
  const [imageContainer, setImageContainer] = useState([]);
  const [editorHtml, setEditorHtml] = useState(Content ? Content : "");
  const quillRef = useRef(null);
  useEffect(() => {
    const editor = quillRef.current.getEditor();
    const toolbar = editor.getModule("toolbar");
    toolbar.addHandler("image", handleImageUpload);
    editor.on("text-change", () => {
      SetUpdated(false);
      setEditorHtml(editor.root.innerHTML);
    });
  }, []);

  const SaveArticle = (e) => {
    CreateToast("Article saved you can now upload/update it", "success");

    SetUpdated(true);
    e.preventDefault();
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = editorHtml;

    // Filter the img elements with the src attribute
    const imgElements = Array.from(tempDiv.querySelectorAll("img[src]"));

    // Extract the src attribute values
    const srcValues = imgElements.map((img, index) => ({
      id: index,
      url: img.getAttribute("src"),
    }));
    const filteredArray = imageContainer.filter(
      (storageObj) =>
        !srcValues.some((editorObj) => editorObj.url === storageObj.url)
    );
    let TempImgContainer = imageContainer;
    filteredArray.forEach((DeletedPhoto) => {
      TempImgContainer = imageContainer.filter((OldPhoto) => {
        return OldPhoto.id !== DeletedPhoto.id;
      });
      setImageContainer(TempImgContainer);
      DELETEPHOTO(`Blog/${ArticleID}/${DeletedPhoto.id}`);
    });
    updatePhotoList(TempImgContainer);
  };
  const handleImageUpload = async () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      let PhotoID = GenerateID();
      try {
        const imageUrl = await UPLOADPHOTO(
          `Blog/${ArticleID}/${PhotoID}`,
          file
        );
        setImageContainer((prev) => {
          return [...prev, { id: PhotoID, url: imageUrl }];
        });
        const editor = quillRef.current.getEditor();
        const range = editor.getSelection();
        editor.insertEmbed(range.index, "image", imageUrl, "user");
        editor.insertText(range.index + 1, "\n", "user");
        editor.formatText(range.index + 1, 1, { link: imageUrl }, "user");
        editor.setSelection(range.index + 2, "silent");
      } catch (error) {
        CreateToast("Image upload/update error", "error");
      }
    };
  };

  const handleChange = (html) => {
    setEditorHtml(html);
    handlePostBodyChange(html);
  };

  return (
    <div className="Editor-wrapper" id="Editor">
      <div
        className="Preview"
        dangerouslySetInnerHTML={{ __html: editorHtml }}
      ></div>
      <h3>Live Preview:</h3>
      <button
        onClick={() => {
          SaveArticle(event);
        }}
        className="Button"
      >
        Save
      </button>
      <ReactQuill
        modules={{
          toolbar: {
            container: "#toolbar",
          },
        }}
        ref={quillRef}
        theme="snow"
        onChange={handleChange}
        value={editorHtml}
      />
      <div id="toolbar">
        <select className="ql-header" defaultValue="">
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          <option value="4">Heading 4</option>
          <option value="5">Heading 5</option>
          <option value="6">Heading 6</option>
          <option value="">Normal</option>
        </select>
        <select className="ql-size">
          <option defaultValue="small"></option>
          <option value="normal"></option>
          <option value="large"></option>
          <option value="huge"></option>
        </select>
        <button className="ql-bold">Bold</button>
        <button className="ql-italic">Italic</button>
        <button className="ql-underline">Underline</button>
        <button className="ql-strike">strike</button>
        <button className="ql-blockquote">blockquote</button>
        <button className="ql-clean">clean</button>
        <button className="ql-list" value="ordered"></button>
        <button className="ql-list" value="bullet"></button>
        <select className="ql-align">
          <option defaultValue=""></option>
          <option value="center"></option>
          <option value="right"></option>
          <option value="justify"></option>
        </select>
        <button className="ql-link">Link</button>
        <button className="ql-image">Upload Image</button>
      </div>
    </div>
  );
};

export default MyEditor;
