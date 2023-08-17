import axios from "axios";
import React, { useRef, useState, useEffect, useContext } from "react";
import ReactMarkdown from "react-markdown";
import "./ProfileMarkdown.css";
import remarkGfm from "remark-gfm";
import { useParams } from "react-router-dom";

import { UserContext } from "../../UserContext/UserContext";

export default function ProfileMarkdown() {
  const { id } = useParams();
  const { email } = useContext(UserContext);
  const MARKDOWN_URL = `/api/profile-markdown/${id}`;
  const SAVED_MARKDOWN_URL = `/api/saved-markdown/${id}`;
  const [changedText, setChangedText] = useState(false);
  const [markdown, setMarkdown] = useState("");
  const inputHandler = (e) => {
    setMarkdown(e.target.value);
    setChangedText(!changedText);
  };

  const editHandler = () => {
    document.getElementById("edit-view").style.display = "block";
    document.getElementById("main-view").style.display = "none";
    window.scrollTo(0, document.body.scrollHeight);
    const textarea = document.getElementById("editor-textarea");
    const end = textarea.value.length;
    textarea.setSelectionRange(end, end);
    textarea.focus();
  };
  const saveHandler = () => {
    document.getElementById("edit-view").style.display = "none";
    document.getElementById("main-view").style.display = "block";
    axios
      .post(MARKDOWN_URL, {
        text: markdown,
      })
      .then((response) => {
        setMarkdown(response.data);
      });
  };

  useEffect(() => {
    axios.get(SAVED_MARKDOWN_URL).then((response) => {
      setMarkdown(response.data);
    });
  }, [SAVED_MARKDOWN_URL]);

  return (
    <div id="profile-markdown">
      <div id="main-view">
        <div className="markdown-text">
          {email == id && (
            <button onClick={editHandler} id="edit-button">
              Edit
            </button>
          )}
          <ReactMarkdown remarkPlugins={[remarkGfm]} children={markdown} />
        </div>
      </div>
      {email == id && (
        <div id="edit-view">
          <div className="markdown-text">
            {changedText ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]} children={markdown} />
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]} children={markdown} />
            )}
          </div>
          <div id="edit-text-save">
            <textarea
              id="editor-textarea"
              defaultValue={markdown}
              onChange={inputHandler}
            />
            <button id="save-button" onClick={saveHandler}>
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
