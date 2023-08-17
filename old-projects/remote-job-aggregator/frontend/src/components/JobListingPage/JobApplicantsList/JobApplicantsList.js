import React, { useState, useEffect } from "react";
import "./JobApplicantsList.css";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
export default function JobApplicantsList() {
  const { id } = useParams();
  const [applicantsInfo, setApplicantsInfo] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const userInfo = [];
      const JOB_LISTING_URL = `/api/applicants/${id}`;
      const response = await axios.get(JOB_LISTING_URL);

      for (const applicant of response.data["usersInfo"]) {
        userInfo.push({
          images: JSON.parse(applicant[0]),
          applicantName: applicant[1],
          applicantDP: applicant[2],
          applicantEmail: applicant[3],
        });
      }

      setApplicantsInfo(userInfo);
    }
    fetchData();
  }, []);
  return (
    <div id="job-applicants-container">
      <h1>Applicants List</h1>

      {applicantsInfo.length > 0 &&
        applicantsInfo.map((applicant) => (
          <div className="applicants-inner-container">
            <div className="applicant-name-and-image">
              <img
                className="applicant-display-picture"
                src={applicant["applicantDP"]}
                alt="User"
              />
              <div className="applicant-name-div">
                {applicant["applicantName"]}
              </div>
            </div>
            <div className="images-container">
              {applicant["images"].map((image) => (
                <div className="applicant-stack-container">
                  <img
                    className="applicant-stack-images"
                    key={image.pk}
                    src={`http://127.0.0.1:8000/${image["fields"]["image"]}`}
                    alt="User Stack"
                  />
                </div>
              ))}
            </div>
            <Link to={`/profile/${applicant["applicantEmail"]}`}>
              <button
                className="applicant-profile-btn"
                key={applicant["applicantEmail"]}
              >
                View Profile
              </button>
            </Link>
          </div>
        ))}
      {applicantsInfo.length === 0 && <div>No applicants yet.</div>}
    </div>
  );
}
