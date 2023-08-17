import { useState, useEffect, useRef, useContext } from "react";
import "./JobBoard.css";
import Buttons from "../Buttons/Buttons";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "../UserContext/UserContext";

function JobBoard(props) {
  const [currentJobs, setCurrentJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [selectValue, setSelectValue] = useState("All categories");
  const [usa, setUSA] = useState(false);
  const [ww, setWW] = useState(false);
  const [others, setOthers] = useState(false);
  const [all, setAll] = useState(true);
  const rangePrev = useRef();
  const rangeNext = useRef();
  const jobBoardLink = useRef("");
  const location = useLocation();
  const prevPage = () => {
    if (rangePrev.current <= 0) return;
    rangePrev.current -= 10;
    rangeNext.current -= 10;
    setCurrentJobs(filteredJobs.slice(rangePrev.current, rangeNext.current));
  };
  const nextPage = () => {
    if (rangeNext.current >= filteredJobs.length) return;
    rangeNext.current += 10;
    rangePrev.current += 10;
    setCurrentJobs(filteredJobs.slice(rangePrev.current, rangeNext.current));
  };

  useEffect(() => {
    setFilteredJobs(props.data);
    rangePrev.current = 0;
    rangeNext.current = 11;
  }, [props.data]);

  const selectHandler = (e) => {
    setSelectValue(e.target.value);
  };
  const inputHandler = (e) => {
    setInputValue(e.target.value);
  };
  const checkBoxHandler = (e) => {
    if (e.target.id === "USA") {
      setAll(false);
      setUSA(true);
      setWW(false);
      setOthers(false);
    }

    if (e.target.id === "Worldwide") {
      setUSA(false);
      setAll(false);
      setWW(true);
      setOthers(false);
    }
    if (e.target.id === "Others") {
      setUSA(false);
      setWW(false);
      setAll(false);
      setOthers(true);
    }
    if (e.target.id === "All") {
      setUSA(false);
      setWW(false);
      setAll(true);
      setOthers(false);
    }
  };

  useEffect(() => {
    if (inputValue.length > 0 && selectValue === "All categories") {
      if (usa) {
        setFilteredJobs(
          props.data.filter(function (job) {
            if (
              (job.fields.title
                .toLowerCase()
                .includes(inputValue.toLowerCase()) &&
                job.fields.candidate_required_location.toLowerCase() ===
                  "usa only") ||
              (job.fields.title
                .toLowerCase()
                .includes(inputValue.toLowerCase()) &&
                job.fields.candidate_required_location.toLowerCase() ===
                  "worldwide")
            ) {
              return true;
            } else return false;
          })
        );
      } else if (ww) {
        setFilteredJobs(
          props.data.filter(function (job) {
            if (
              job.fields.title
                .toLowerCase()
                .includes(inputValue.toLowerCase()) &&
              job.fields.candidate_required_location.toLowerCase() ===
                "worldwide"
            ) {
              return true;
            } else return false;
          })
        );
      } else if (others) {
        setFilteredJobs(
          props.data.filter(function (job) {
            if (
              job.fields.title
                .toLowerCase()
                .includes(inputValue.toLowerCase()) &&
              job.fields.candidate_required_location.toLowerCase() !==
                "usa only"
            ) {
              return true;
            } else return false;
          })
        );
      } else {
        setFilteredJobs(
          props.data.filter(function (job) {
            if (
              job.fields.title.toLowerCase().includes(inputValue.toLowerCase())
            ) {
              return true;
            } else return false;
          })
        );
      }
    } else if (inputValue.length > 0 && selectValue !== "All categories") {
      if (usa) {
        setFilteredJobs(
          props.data.filter(function (job) {
            if (
              (job.fields.title
                .toLowerCase()
                .includes(inputValue.toLowerCase()) &&
                job.fields.category.includes(selectValue) &&
                job.fields.candidate_required_location.toLowerCase() ===
                  "usa only") ||
              (job.fields.title
                .toLowerCase()
                .includes(inputValue.toLowerCase()) &&
                job.fields.category.includes(selectValue) &&
                job.fields.candidate_required_location.toLowerCase() ===
                  "worldwide")
            ) {
              return true;
            } else return false;
          })
        );
      } else if (ww) {
        setFilteredJobs(
          props.data.filter(function (job) {
            if (
              job.fields.title
                .toLowerCase()
                .includes(inputValue.toLowerCase()) &&
              job.fields.category.includes(selectValue) &&
              job.fields.candidate_required_location.toLowerCase() ===
                "worldwide"
            ) {
              return true;
            } else return false;
          })
        );
      } else if (others) {
        setFilteredJobs(
          props.data.filter(function (job) {
            if (
              job.fields.title
                .toLowerCase()
                .includes(inputValue.toLowerCase()) &&
              job.fields.category.includes(selectValue) &&
              job.fields.candidate_required_location.toLowerCase() !==
                "usa only"
            ) {
              return true;
            } else return false;
          })
        );
      } else {
        setFilteredJobs(
          props.data.filter(function (job) {
            if (
              job.fields.title
                .toLowerCase()
                .includes(inputValue.toLowerCase()) &&
              job.fields.category.includes(selectValue)
            ) {
              return true;
            } else return false;
          })
        );
      }
    } else if (!inputValue.length && selectValue !== "All categories") {
      if (usa) {
        setFilteredJobs(
          props.data.filter(function (job) {
            if (
              job.fields.category.includes(selectValue) &&
              job.fields.candidate_required_location.toLowerCase() ===
                "usa only"
            ) {
              return true;
            } else return false;
          })
        );
      } else if (ww) {
        setFilteredJobs(
          props.data.filter(function (job) {
            if (
              job.fields.category.includes(selectValue) &&
              job.fields.candidate_required_location.toLowerCase() ===
                "worldwide"
            ) {
              return true;
            } else return false;
          })
        );
      } else if (others) {
        setFilteredJobs(
          props.data.filter(function (job) {
            if (
              job.fields.category.includes(selectValue) &&
              job.fields.candidate_required_location.toLowerCase() !==
                "usa only"
            ) {
              return true;
            } else return false;
          })
        );
      } else {
        setFilteredJobs(
          props.data.filter(function (job) {
            if (job.fields.category.includes(selectValue)) {
              return true;
            } else return false;
          })
        );
      }
    } else if (usa || ww || others) {
      if (usa) {
        setFilteredJobs(
          props.data.filter(function (job) {
            if (
              job.fields.candidate_required_location.toLowerCase() ===
                "usa only" ||
              job.fields.candidate_required_location.toLowerCase() ===
                "worldwide"
            ) {
              return true;
            } else return false;
          })
        );
      } else if (ww) {
        setFilteredJobs(
          props.data.filter(function (job) {
            if (
              job.fields.candidate_required_location.toLowerCase() ===
              "worldwide"
            ) {
              return true;
            } else return false;
          })
        );
      } else if (others) {
        setFilteredJobs(
          props.data.filter(function (job) {
            if (
              job.fields.candidate_required_location.toLowerCase() !==
              "usa only"
            ) {
              return true;
            } else return false;
          })
        );
      } else {
        setFilteredJobs(props.data);
      }
    }
  }, [inputValue, selectValue, usa, ww, others, all]);
  const { email } = useContext(UserContext);

  useEffect(() => {
    function manageJobBoard() {
      if (!email) {
        if (location.pathname.includes("/remotive")) {
          jobBoardLink.current = "logout-remotive";
        } else {
          jobBoardLink.current = "logout-remo";
        }
      } else {
        if (location.pathname.includes("/remotive")) {
          jobBoardLink.current = "job-board-main-container-remotive";
        } else {
          jobBoardLink.current = "job-board-main-container-remo";
        }
      }
      setCurrentJobs(filteredJobs.slice(0, 11));
    }
    manageJobBoard();
  }, [filteredJobs, location.pathname, email]);

  const months = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div id={jobBoardLink.current}>
      <h1>Job Board</h1>
      <div id="search-box">
        <input onChange={inputHandler} type="text" name="search" required />
        <select onChange={selectHandler} name="category">
          <option defaultValue value="All categories">
            All Categories
          </option>
          <option value="Software Development">Software Development</option>
          <option value="Customer Service">Customer Service</option>
          <option value="Design">Design</option>
          <option value="Marketing">Marketing</option>
          <option value="Sales">Sales</option>
          <option value="Product">Product</option>
          <option value="Business">Business</option>
          <option value="Data">Data</option>
          <option value="DevOps / Sysadmin">DevOps / Sysadmin</option>
          <option value="Finance / Legal">Finance / Legal</option>
          <option value="Human Resources">Human Resources</option>
          <option value="QA">Quality Assurance</option>
          <option value="Writing">Writing</option>
          <option value="All others">All Others</option>
        </select>
      </div>
      <div id="radio">
        <input
          type="radio"
          id="USA"
          name="location"
          onChange={checkBoxHandler}
          label="USA"
        />
        <input
          type="radio"
          id="Worldwide"
          name="location"
          onChange={checkBoxHandler}
          label="Worldwide"
        />
        <input
          type="radio"
          id="Others"
          name="location"
          onChange={checkBoxHandler}
          label="Others"
        />
        <input
          type="radio"
          id="All"
          name="location"
          onChange={checkBoxHandler}
          label="All"
        />
      </div>
      {currentJobs.length > 0 ? (
        <ul className="jobBoard-list">
          <Buttons
            prev={prevPage}
            next={nextPage}
            prevPage={rangePrev.current}
            nextPage={rangeNext.current}
            maxRange={filteredJobs.length}
          />
          {currentJobs.map((job) => (
            <li className="job-listing" key={job.pk}>
              <div className="job-company">{job.fields.company_name}</div>

              <div className="job-title">{job.fields.title}</div>
              <div className="details-tags">
                {job.fields.job_salary ? (
                  <div className="job-salary">${job.fields.job_salary}</div>
                ) : null}
                <div className="job-time">
                  {months[new Date(job.fields.publication_date).getMonth()]}
                </div>
              </div>

              {job.fields.application_url ? (
                <a
                  className="job-application"
                  href={job.fields.application_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  View Job
                </a>
              ) : (
                <Link className="job-application" to={`/job-post/${job.pk}`}>
                  View Post
                </Link>
              )}

              <div className="job-tags">
                {job.fields.job_type ? (
                  <div className="job-type">
                    {job.fields.job_type.replace("_", " ")}
                  </div>
                ) : null}
                <div className="job-location">
                  {job.fields.candidate_required_location}
                </div>

                <div className="job-category">{job.fields.category}</div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="jobBoard-list">
          <li className="null">No Jobs found!</li>
        </ul>
      )}
    </div>
  );
}

export default JobBoard;
