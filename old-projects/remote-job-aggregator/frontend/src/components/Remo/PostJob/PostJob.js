import axios from "axios";
import React, { useContext, useState } from "react";
import PostForm from "./PostForm";
import { useNavigate } from "react-router-dom";
import "./PostJob.css";
import { UserContext } from "../../UserContext/UserContext";
import { v4 as uuidv4 } from "uuid";
const POST_URL = "api/post-job";
export default function PostJob() {
  const { userDB } = useContext(UserContext);

  const navigate = useNavigate();
  const submitHandler = (e) => {
    e.preventDefault();
    const data = {
      company_name: e.target.company_name.value,
      job_title: e.target.job_title.value,
      skills: e.target.skills.value,
      salary: e.target.salary.value,
      location: e.target.location.value,
      description: e.target.description.value,
      category: e.target.category.value,
      job_type: e.target.job_type.value,
      id: uuidv4(),
    };

    axios
      .post(`${POST_URL}/${userDB}`, { method: "POST", data })
      .then((response) => navigate(`/job-post/${response.data[0]["id"]}`));
  };
  return <PostForm submit={submitHandler} />;
}
