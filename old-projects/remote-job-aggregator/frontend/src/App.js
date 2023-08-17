import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import Login from "./components/Login/Login";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "./components/UserContext/UserContext";
import Profile from "./components/Profile/Profile";
import PostJob from "./components/Remo/PostJob/PostJob";
import ViewJob from "./components/Remo/ViewJob/ViewJob";
import RemoJobBoard from "./components/Remo/RemoJobBoard/RemoJobBoard";
import RemotiveJobs from "./components/RemotiveJobs/RemotiveJobs";
import JobListingPage from "./components/JobListingPage/JobListingPage";
import JobApplicantsList from "./components/JobListingPage/JobApplicantsList/JobApplicantsList";

function App() {
  const [user, setUser] = useState(null);
  const [dp, setDP] = useState(null);
  const [email, setEmail] = useState(null);
  const [userDB, setUserDB] = useState(null);

  useEffect(() => {
    axios.get("/api/user-auth").then((response) => {
      setUser(response.data["name"]);
      setEmail(response.data["email"]);
      setDP(response.data["dp"]);
      setUserDB(response.data["db_user"]);
    });
  }, []);
  return (
    <>
      <UserContext.Provider
        value={{ user, setUser, dp, setDP, email, setEmail, userDB, setUserDB }}
      >
        <NavBar />
        <Routes>
          <Route path="/" element={<RemoJobBoard />} />
          <Route path="/remotive" element={<RemotiveJobs />} />
          <Route path="/login" element={<Login />} />
          <Route exact path="/profile/:id" element={<Profile />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/remo" element={<RemoJobBoard />} />

          <Route exact path="/job-post/:id" element={<ViewJob />} />
          <Route path="/job-posts" element={<JobListingPage />} />
          <Route exact path="/applicants/:id" element={<JobApplicantsList />} />
        </Routes>
      </UserContext.Provider>
    </>
  );
}

export default App;
