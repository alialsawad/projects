import axios from "axios";
import React, { useRef, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext/UserContext";
import "./NavBar.css";
import { useNavigate, useLocation } from "react-router-dom";
import LoginUser from "../Login/Login";
import logout from "../../images/logout.png";
export default function NavBar() {
  const navigate = useNavigate();
  const flexRef = useRef(null);
  const location = useLocation();
  const { setUser, setDP, setEmail, email } = useContext(UserContext);

  const userProfile = useRef(null);

  const logoutHandler = () => {
    axios
      .get("/api/logout")
      .then((response) => {
        setUser(null);
        setDP(null);
        setEmail(null);
        userProfile.current = null;
      })
      .then(() => {
        navigate("/remotive");
      });
  };
  const divExpand = (event, variable = null) => {
    if (flexRef.current !== null) {
      const flexItem = document.querySelector(`.${flexRef.current}`);
      flexItem.style.flex = "0";
    }
    if (!variable) {
      const attr = event.target.getAttribute("data-nav");
      flexRef.current = attr;
      const flexItem = document.querySelector(`.${attr}`);
      flexItem.style.flex = "1";
    } else {
      const attr = variable;
      flexRef.current = attr;
      const flexItem = document.querySelector(`.${attr}`);
      flexItem.style.flex = "1";
    }
  };
  const clickLink = (event) => {
    const attr = event.target.getAttribute("data-nav");
    document.getElementById(`${attr}`).click();
  };
  useEffect(() => {
    function checkLocation() {
      axios
        .get("/api/user-auth")
        .then((response) => {
          userProfile.current = response.data["email"];
        })
        .then(() => {
          if (location.pathname.includes(`/profile`)) {
            divExpand(null, "profile-login-link");
          } else if (location.pathname.includes(`/post-job`)) {
            divExpand(null, "hire-link");
          } else if (location.pathname.includes(`/job-posts`)) {
            divExpand(null, "job-posts-link");
          } else if (location.pathname.includes(`/remotive`)) {
            divExpand(null, "remotive-jobs-link ");
          } else if (location.pathname.includes(`/applicants`)) {
            divExpand(null, "job-posts-link");
          } else if (
            location.pathname.includes(`/remo`) ||
            location.pathname === "/" ||
            location.pathname.includes(`/job-post`)
          ) {
            divExpand(null, "remo-jobs-link");
          }
        })
        .catch((err) => {
          if (location.pathname.includes(`/remotive`)) {
            divExpand(null, "remotive-jobs-link ");
          } else if (
            location.pathname.includes(`/remo`) ||
            location.pathname === "/" ||
            location.pathname.includes(`/job-post`)
          ) {
            divExpand(null, "remo-jobs-link");
          }
        });
    }
    checkLocation();
  }, [email, location.pathname, userProfile.current, logoutHandler]);
  return (
    <div id="navbar-container">
      {(email || userProfile.current) && (
        <div
          onClick={clickLink}
          data-nav="profile-login"
          className="profile-login-link"
        >
          {email && !userProfile.current && (
            <Link
              onClick={divExpand}
              data-nav="profile-login-link"
              id="profile-login"
              to={`/profile/${email}`}
            >
              Profile
            </Link>
          )}
          {!email && userProfile.current && (
            <Link
              onClick={divExpand}
              data-nav="profile-login-link"
              id="profile-login"
              to={`/profile/${userProfile.current}`}
            >
              Profile
            </Link>
          )}
          {email && userProfile.current && (
            <Link
              onClick={divExpand}
              data-nav="profile-login-link"
              id="profile-login"
              to={`/profile/${userProfile.current}`}
            >
              Profile
            </Link>
          )}

          {(email || userProfile.current) && (
            <img
              id="logout"
              onClick={logoutHandler}
              src={logout}
              alt="logout"
            />
          )}
        </div>
      )}
      {!email && !userProfile.current && (
        <div
          onClick={clickLink}
          data-nav="profile-login"
          className="profile-login-link-lg"
        >
          <Link data-nav="profile-login-link-lg" id="profile-login" to="/">
            <LoginUser />
          </Link>
        </div>
      )}
      {(email || userProfile.current) && (
        <div data-nav="hire" className="hire-link" onClick={clickLink}>
          <Link
            onClick={divExpand}
            data-nav="hire-link"
            id="hire"
            to="/post-job"
          >
            Hire
          </Link>
        </div>
      )}

      {(email || userProfile.current) && (
        <div
          data-nav="job-posts"
          className="job-posts-link"
          onClick={clickLink}
        >
          <Link
            onClick={divExpand}
            data-nav="job-posts-link"
            id="job-posts"
            to="/job-posts"
          >
            Posts
          </Link>
        </div>
      )}

      <div data-nav="remo-jobs" className="remo-jobs-link" onClick={clickLink}>
        <Link
          onClick={divExpand}
          data-nav="remo-jobs-link"
          id="remo-jobs"
          to="/remo"
        >
          Remo
        </Link>
      </div>

      <div
        data-nav="remotive-jobs"
        className="remotive-jobs-link"
        onClick={clickLink}
      >
        <Link
          onClick={divExpand}
          data-nav="remotive-jobs-link"
          id="remotive-jobs"
          to="/remotive"
        >
          Remotive
        </Link>
      </div>
    </div>
  );
}
