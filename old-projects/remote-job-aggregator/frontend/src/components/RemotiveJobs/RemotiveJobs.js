import React, { useState, useEffect } from "react";
import JobBoard from "../JobBoard/JobBoard";
import axios from "axios";

const JOBS_URL = "/api/get-jobs/remotive";
export default function RemotiveJobs() {
  const [jobs, setJobs] = useState([]);
  useEffect(() => {
    axios.get(JOBS_URL).then((res) => {
      setJobs(res.data);
    });
  }, []);
  return <JobBoard data={jobs} />;
}
