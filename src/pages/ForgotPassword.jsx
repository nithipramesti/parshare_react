import "../assets/styles/forgot-password.css";

import Axios from "axios";
import { useState } from "react";

import { API_URL } from "../data/API";

function ForgotPassword() {
  //Local state
  let [emailUser, setemailUser] = useState("");
  let [sendSuccess, setSendSuccess] = useState("");
  let [errMessage, setErrMessage] = useState("");
  let [formValid, setFormValid] = useState(true);

  //Function for onChange in input form
  const inputHandler = (event) => {
    //Clear form validation alert
    if (!formValid) setFormValid(true); //resetting only when the form invalid before

    //Clear success alert
    if (sendSuccess) setSendSuccess("");

    //Clear error/failed alert
    if (errMessage) setErrMessage("");

    //Save input form data to state
    setemailUser(event.target.value);
  };

  //Login button
  const onBtnSend = () => {
    if (emailUser) {
      //Send emailUser to backend in order to send change password link & token
      Axios.post(`${API_URL}/change-password/send-email`, {
        email: emailUser,
      })
        .then((res) => {
          if (res.data.errMessage) {
            setErrMessage(res.data.errMessage);
          } else {
            //show success alert
            setSendSuccess(res.data.message);

            //Reset form input (controlled form)
            setemailUser("");
          }
        })
        .catch((err) => {
          console.log(err);
          setErrMessage("Server error, please try again later");
        });
    } else {
      //If email form empty
      //set state to trigger rerender and show alert
      setFormValid(false);
    }
  };

  return (
    <div className="forgot-password">
      <div className="container container-forgot-password d-flex flex-column align-items-center">
        <h1 className="mb-5 fw-bold">Forgot Password</h1>
        <p className="info">
          Please enter your registered email address. You will receice a link to
          create a new password via email.
        </p>

        <form>
          <div className="mb-3">
            <label htmlFor="form-email" className="form-label">
              Email
            </label>
            <input
              id="form-email"
              type="text"
              className={`form-control ${!formValid ? `is-invalid` : null}`}
              placeholder="Email"
              name="email"
              value={emailUser}
              onChange={inputHandler}
              required
            />
            {!formValid ? (
              <div className="text-danger">Please enter your email</div>
            ) : null}
          </div>

          <div className="mb-4 container-fluid p-0"></div>
          <input
            type="button"
            value="Send"
            className="btn btn-primary btn-send py-2 container-fluid mb-3"
            onClick={onBtnSend}
          />
        </form>
        {sendSuccess ? (
          <div className="alert alert-success mt-3" role="alert">
            {sendSuccess}
          </div>
        ) : null}
        {errMessage ? (
          <div className="alert alert-danger mt-3" role="alert">
            {errMessage}
          </div>
        ) : null}

        <div className="mb-3 text-center"></div>
      </div>
    </div>
  );
}

export default ForgotPassword;
