import React, { useEffect, useState } from "react";
import axios from "axios";
import JobBoard from "../../JobBoard/JobBoard";

const FETCH_JOBS_URL = "api/get-jobs/remo";
export default function RemoJobBoard() {
  const [jobs, setJobs] = useState([]);
  useEffect(() => {
    axios.get(FETCH_JOBS_URL).then((response) => setJobs(response.data));
  }, []);
  return <JobBoard data={jobs} />;
}
