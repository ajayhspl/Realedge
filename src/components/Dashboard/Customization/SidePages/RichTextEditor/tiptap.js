import { Color } from "@tiptap/extension-color";
import FontSize from "tiptap-extension-font-size";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useCallback, useState } from "react";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import {
  FaLink,
  FaLinkSlash,
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaParagraph,
  FaAlignCenter,
  FaAlignLeft,
  FaAlignRight,
  FaAlignJustify,
  FaListOl,
  FaQuoteLeft,
  FaListUl,
} from "react-icons/fa6";
import { FaUndo, FaRedo } from "react-icons/fa";

import { RiFormatClear } from "react-icons/ri";
import { MdHorizontalRule } from "react-icons/md";
import "./styles.css";

const MenuBar = () => {
  const fontSizes = [
    "8px",
    "9px",
    "10px",
    "12px",
    "14px",
    "16px",
    "20px",
    "24px",
    "32px",
    "42px",
    "54px",
    "68px",
    "84px",
    "98px",
  ];
  const textType = ["1", "2", "3", "4", "5", "6"];
  const [selectedFontSize, setSelectedFontSize] = useState("14px"); // Default font size
  const [selectedTextType, setSelectedTextType] = useState("1"); // Default text type
  const [selectedColor, setSelectedColor] = useState("#0000");

  const { editor } = useCurrentEditor();
  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();

      return;
    }

    // update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);
  if (!editor) {
    return null;
  }
  const handleColorChange = (color) => {
    editor.chain().focus().setColor(color).run();
    setSelectedColor(color);
  };
  const handleFontSizeChange = (event) => {
    const fontSize = event.target.value;
    editor.commands.setFontSize(fontSize);
    setSelectedFontSize(fontSize);
  };
  const handleTextTypeChange = (event) => {
    const textType = event.target.value;
    editor
      .chain()
      .focus()
      .toggleHeading({ level: parseInt(textType) })
      .run();
    setSelectedTextType(textType);
  };
  return (
    <div className="toolBar">
      <button
        onClick={setLink}
        className={editor.isActive("link") ? "is-active" : ""}
      >
        <FaLink />
      </button>
      <button
        onClick={() => editor.chain().focus().unsetLink().run()}
        disabled={!editor.isActive("link")}
      >
        <FaLinkSlash />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "is-active" : ""}
      >
        <FaBold />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "is-active" : ""}
      >
        <FaItalic />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive("underline") ? "is-active" : ""}
      >
        <FaUnderline />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? "is-active" : ""}
      >
        <FaStrikethrough />
      </button>

      <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
        <RiFormatClear />
      </button>
      <button onClick={() => editor.chain().focus().clearNodes().run()}>
        clear nodes
      </button>
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={editor.isActive("paragraph") ? "is-active" : ""}
      >
        <FaParagraph />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={editor.isActive({ textAlign: "left" }) ? "is-active" : ""}
      >
        <FaAlignLeft />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={editor.isActive({ textAlign: "center" }) ? "is-active" : ""}
      >
        <FaAlignCenter />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={editor.isActive({ textAlign: "right" }) ? "is-active" : ""}
      >
        <FaAlignRight />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        className={editor.isActive({ textAlign: "justify" }) ? "is-active" : ""}
      >
        <FaAlignJustify />
      </button>
      <button onClick={() => editor.chain().focus().unsetTextAlign().run()}>
        unsetTextAlign
      </button>
      <div className="text-type-dropdown">
        <select
          id="textTypeSelect"
          value={selectedTextType}
          onChange={handleTextTypeChange}
        >
          {textType.map((textType) => (
            <option key={textType} value={textType}>
              h{textType}
            </option>
          ))}
        </select>
      </div>
      <div className="font-size-dropdown">
        <select
          id="fontSizeSelect"
          value={selectedFontSize}
          onChange={handleFontSizeChange}
        >
          {fontSizes.map((fontSize) => (
            <option key={fontSize} value={fontSize}>
              {fontSize}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "is-active" : ""}
      >
        <FaListUl />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "is-active" : ""}
      >
        <FaListOl />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive("blockquote") ? "is-active" : ""}
      >
        <FaQuoteLeft />
      </button>
      <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <MdHorizontalRule />
      </button>
      <button onClick={() => editor.chain().focus().setHardBreak().run()}>
        empty line
      </button>

      <input
        className="colorPicker"
        type="color"
        value={selectedColor}
        onChange={(e) => handleColorChange(e.target.value)}
      />
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        <FaUndo />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        <FaRedo />
      </button>
    </div>
  );
};

const extensions = [
  Color.configure({}),
  TextStyle.configure({ types: [ListItem.name] }),
  FontSize.configure(), // Configure FontSize
  Underline,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Link.configure({
    protocols: ["ftp", "mailto"],
  }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
];

const TipTap = ({ setHTML, OldData, editorClassName }) => {
  return (
    <div className={editorClassName ? editorClassName : ""}>
      <div className="Editor">
        <EditorProvider
          slotBefore={<MenuBar />}
          extensions={extensions}
          content={OldData}
          editorProps={{
            attributes: {
              class: "output",
            },
          }}
          onUpdate={({ editor }) => {
            setHTML(editor.getHTML());
          }}
        ></EditorProvider>
      </div>
      <div
        className="Preview"
        dangerouslySetInnerHTML={{ __html: OldData }}
      ></div>
    </div>
  );
};

export default TipTap;
