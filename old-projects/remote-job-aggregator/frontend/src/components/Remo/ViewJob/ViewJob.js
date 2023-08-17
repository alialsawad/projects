import React, { useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ViewJob.css";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { UserContext } from "../../UserContext/UserContext";

export default function ViewJob(props) {
  const { email, userDB } = useContext(UserContext);
  const { id } = useParams();
  const [applicationBtn, setApplicationBtn] = useState(null);
  const [url, setUrl] = useState();
  const [jobUrl, setJobUrl] = useState();
  const [job, setJob] = useState(null);
  const [owner, setOwner] = useState(null);
  const [title, setTitle] = useState(null);
  const [companyName, setCompanyName] = useState(null);
  const [category, setCategory] = useState(null);
  const [skills, setSkills] = useState(null);
  const [type, setType] = useState(null);
  const [salary, setSalary] = useState(null);
  const [description, setDescription] = useState(null);
  const [location, setLocation] = useState(null);
  const [date, setDate] = useState(null);

  const JOB_URL = `/api/view-job/${id}`;

  const getUrl = () => {
    if (url !== `/api/view-job/${id}`) {
      setUrl(`/api/view-job/${id}`);
    }
  };

  useEffect(() => {
    getUrl();
    axios.get(JOB_URL).then((response) => {
      const data = response.data[0];
      setJob(data.id);
      setOwner(data.owner);
      setTitle(data.title);
      setCompanyName(data.company_name);
      setCategory(data.category);
      setSkills(data.skills);
      setType(data.type);
      setSalary(data.salary);
      setDescription(data.description);
      setLocation(data.location);
      setDate(new Date(data.date).toISOString().substring(0, 10));
    });
  }, [url]);

  const APPLICATION_URL = `/api/apply/${email}`;
  const applicationHandler = () => {
    axios.get(`${APPLICATION_URL}/${job}`).then((response) => {
      setApplicationBtn(true);
    });
  };
  const getJobUrl = () => {
    if (jobUrl !== `/api/check-applicant/${email}/${job}`) {
      setJobUrl(`/api/check-applicant/${email}/${job}`);
    }
  };

  const CHECK_APPLICANT_URL = `/api/check-applicant`;
  useEffect(() => {
    getJobUrl();
    axios.get(`${CHECK_APPLICANT_URL}/${email}/${job}`).then((response) => {
      setApplicationBtn(true);
    });
  }, [email, job]);

  return (
    <>
      <div id="job-listing-container">
        <div className="job-details-container">
          <div id="job-listing-publication-date">{date}</div>
          <h1>Company Name </h1>
          <div className="job-details-content-container">
            <p className="job-details-content">{companyName}</p>
            <div className="job-details-container">
              <h1>Job Title</h1>
              <div className="job-details-content-container">
                <p className="job-details-content">{title}</p>
                <small id="job-listing-category">{category}</small>

                <div className="job-details-container">
                  <h1>Required Location</h1>
                  <div className="job-details-content-container">
                    <p className="job-details-content">{location}</p>
                  </div>
                </div>
                <div className="job-details-container">
                  <h1>Skills</h1>
                  <div className="job-details-content-container">
                    <p className="job-details-content">{skills}</p>
                  </div>
                </div>
                <div className="job-details-container">
                  <h1>Job Type</h1>
                  <div className="job-details-content-container">
                    <p className="job-details-content">{type}</p>
                  </div>
                </div>
                {salary && (
                  <div className="job-details-container">
                    <h1>Salary</h1>
                    <div className="job-details-content-container">
                      <p className="job-details-content">${salary}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="job-details-container">
              <h1>Job Description</h1>
              <div className="job-details-content-container description">
                <p className="job-details-content">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    children={description}
                  />
                </p>
              </div>
              {owner !== userDB && (userDB || email) ? (
                applicationBtn ? (
                  <button
                    id="disabled-application-btn"
                    onClick={applicationHandler}
                    disabled
                  >
                    Application Sent!
                  </button>
                ) : (
                  <button
                    id="remo-application-btn"
                    onClick={applicationHandler}
                  >
                    Apply
                  </button>
                )
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
