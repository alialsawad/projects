import React, { useState, useEffect, useContext } from "react";

import "./Profile.css";
import axios from "axios";
import ProfileMarkdown from "./ProfileMarkdown/ProfileMarkdown";
import { useParams } from "react-router-dom";
import { UserContext } from "../UserContext/UserContext";

export default function Profile() {
  const { id } = useParams();
  const { email, userDB } = useContext(UserContext);

  const POSTIMAGE_URL = `/api/skills`;
  const REMOVE_URL = `/api/removeImage`;
  const IMAGE_URL = `/api/images/${id}`;
  const [images, setImages] = useState([]);
  const [postImage, setPostImage] = useState(null);
  const [imageName, setImageName] = useState(false);
  const [uploadImage, setUploadImage] = useState(false);
  const [refreshImages, setRefreshImages] = useState(false);
  const [imageToRemove, setImageToRemove] = useState(null);

  async function handlePostImage(e) {
    e.preventDefault();
    setUploadImage(false);

    const form_data = new FormData();
    form_data.append("image", postImage);
    form_data.append("owner", userDB);
    form_data.append("imageName", imageName);
    try {
      const response = await axios({
        method: "POST",
        url: POSTIMAGE_URL,
        data: form_data,
        xsrfCookieName: "csrftoken",
        xsrfHeaderName: "X-CSRFTOKEN",
        withCredentials: true,
      });
      setRefreshImages(!refreshImages);
    } catch (err) {}
  }

  async function getImages() {
    try {
      const response = await axios.get(IMAGE_URL);
      setImages(response.data);
    } catch (err) {}
  }
  useEffect(() => {
    getImages();
  }, [refreshImages, IMAGE_URL]);

  const triggerPrompt = (event) => {
    if (imageToRemove !== null) {
      const promptDiv = document.getElementById(
        imageToRemove + "delete-prompt"
      );
      const imageDiv = document.getElementById(imageToRemove);
      promptDiv.style.display = "none";
      imageDiv.style.display = "flex";
      promptDiv.classList.remove("remove-prompt");
      promptDiv.classList.add("hidden-prompt");
    }
    setImageToRemove(event.currentTarget.id);
    const promptDiv = document.getElementById(
      event.currentTarget.id + "delete-prompt"
    );
    const imageDiv = document.getElementById(event.currentTarget.id);
    promptDiv.style.display = "flex";
    imageDiv.style.display = "none";
    promptDiv.classList.add("remove-prompt");
    promptDiv.classList.remove("hidden-prompt");
  };

  const removeImage = () => {
    const user = id;
    axios
      .get(`${REMOVE_URL}/${imageToRemove}/${user}`)
      .then((response) => setImages(response?.data))
      .then(() => {
        setImageToRemove(null);
      });
  };
  const cancelPrompt = (e) => {
    const promptDiv = e.currentTarget.parentNode;
    const imageDiv = document.getElementById(imageToRemove);
    promptDiv.style.display = "none";
    imageDiv.style.display = "flex";
    promptDiv.classList.remove("remove-prompt");
    promptDiv.classList.add("hidden-prompt");
    setImageToRemove(null);
  };
  const showSkills = () => {
    const button = document.getElementById("skills-button");
    const skills = document.querySelector(".container");
    if (button.innerText == "View Skills") {
      skills.style.display = "flex";
      skills.style.opacity = "1";
      button.innerText = "X";
    } else {
      skills.style.display = "none";
      button.innerText = "View Skills";
    }
  };
  return (
    <>
      <ProfileMarkdown />
      <button id="skills-button" onClick={showSkills}>
        View Skills
      </button>
      <div className="container">
        {email === id && (
          <div className="wrapper">
            {!uploadImage && email === id && (
              <div className="file-upload choose">
                <input
                  type="file"
                  name="file"
                  id="image"
                  onChange={(e) => {
                    setPostImage(e.target.files[0]);
                    setUploadImage(true);
                    setImageName(e.target.files[0].name);
                  }}
                />
              </div>
            )}
            {uploadImage && email === id && (
              <form onSubmit={handlePostImage}>
                <div className="file-upload confirm">
                  <input type="submit" />
                </div>
              </form>
            )}
          </div>
        )}
        {images.map((image) => {
          return (
            <div key={image.pk} className="card">
              <div
                className="card-inner"
                onClick={email === id ? triggerPrompt : null}
                id={image.pk}
              >
                <img
                  className="skill-image hover"
                  src={`http://127.0.0.1:8000/${image["fields"]["image"]}`}
                  alt="gallery"
                />
              </div>
              {email === id && (
                <div className="hidden-prompt" id={image.pk + "delete-prompt"}>
                  <button onClick={removeImage} className="confirm-delete">
                    <svg
                      style={{ color: `white` }}
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-trash"
                      viewBox="0 0 16 16"
                    >
                      {" "}
                      <path
                        d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"
                        fill="white"
                      ></path>{" "}
                      <path
                        fillRule="evenodd"
                        d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                        fill="white"
                      ></path>{" "}
                    </svg>
                  </button>
                  <button onClick={cancelPrompt} className="cancel-delete">
                    <svg
                      style={{ color: `white` }}
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-x-circle"
                      viewBox="0 0 16 16"
                    >
                      {" "}
                      <path
                        d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
                        fill="white"
                      ></path>{" "}
                      <path
                        d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
                        fill="white"
                      ></path>{" "}
                    </svg>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
