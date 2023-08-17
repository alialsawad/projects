import React, { useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../UserContext/UserContext";
import { useNavigate } from "react-router-dom";
import "./login.css";
export default function LoginUser() {
  const navigate = useNavigate();
  const { setUser, setDP, setEmail, user, setUserDB } = useContext(UserContext);

  async function handleResponse(response) {
    await axios
      .post(
        "/api/login",
        {
          token: response.credential,
        },
        { withCredentials: true }
      )
      .then((response) => {
        setUser(response.data.name);
        setDP(response.data.dp);
        setEmail(response.data.email);
        setUserDB(response.data.db_user);
        navigate("/");
      });
  }

  useEffect(() => {
    /* global google */

    const timer = setTimeout(() => {
      if (!user) {
        try {
          google.accounts.id.prompt();
          google.accounts.id.initialize({
            client_id:
              "940115325651-pspsivds9smpj1d2jk8ae273adav9rvm.apps.googleusercontent.com",
            callback: handleResponse,
          });

          google.accounts.id.renderButton(document.getElementById("signIn"), {
            theme: "outline",
            size: "large",
          });
        } catch {}
      }
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return <span id="signIn"></span>;
}
