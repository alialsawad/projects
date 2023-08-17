import React, { useEffect, useState } from "react";
import "./JobListingPage.css";

import axios from "axios";
import { Link } from "react-router-dom";

export default function NotificationPage() {
  const [jobList, setJobList] = useState([]);
  async function getEmail() {
    const response = await axios.get("/api/user-auth");
    return response.data["db_user"];
  }
  useEffect(() => {
    async function fetchData() {
      const id = await getEmail();
      const JOB_LISTING_URL = `/api/get-job-list/${id}`;
      const response = await axios.get(JOB_LISTING_URL);
      setJobList(response.data);
    }
    fetchData();
  }, []);
  return (
    <div id="job-page-container">
      <h1>Job Listings</h1>
      <div className="job-list-section">
        <ul className="jobs-list">
          {jobList.map((job) => (
            <>
              <li className="job-info-container" key={job.pk}>
                <div className="job-listing-date">
                  {new Date(job["fields"]["publication_date"])
                    .toISOString()
                    .substring(0, 10)}
                </div>

                <div className="job-listing-title">
                  {job["fields"]["title"]}
                </div>
                <div className="job-listing-category">
                  {job["fields"]["category"]}
                </div>
                <div className="job-listing-type">
                  {job["fields"]["job_type"]}
                </div>

                {job["fields"]["candidate_required_location"] ? (
                  <div className="job-listing-location">
                    {job["fields"]["candidate_required_location"]}
                  </div>
                ) : (
                  <div className="job-listing-location">Undefined</div>
                )}
                <div className="job-listing-applicants">
                  <Link to={`/applicants/${job.pk}`}>
                    <button key={job.pk} className="view-applicants-btn">
                      View
                    </button>
                  </Link>
                  <div className="number-of-applicants">
                    {job["fields"]["applied_users"].length}
                  </div>
                </div>
              </li>
            </>
          ))}
        </ul>
      </div>
    </div>
  );
}
