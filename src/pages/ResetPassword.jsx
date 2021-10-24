import "../assets/styles/reset-password.css";

import Axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../data/API";

function ResetPassword(props) {
  //State for input values
  let [inputValues, setInputValues] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  //State for handling validation error
  let [errors, setErrors] = useState({});

  //State to indicate wether form is submitting or not
  let [isSubmitting, setIsSubmitting] = useState(false);
  let [isSubmitted, setIsSubmitted] = useState(false);
  let [submitLoading, setSubmitLoading] = useState(false);

  //State to handling success/error message from backend
  let [resMessage, setResMessage] = useState({ success: "", error: "" });

  //State for save logged-user data
  let [userData, setUserData] = useState({});

  //Function for onChange in input form
  const inputHandler = (e) => {
    //Save input value to state
    const { name, value } = e.target;
    setInputValues({ ...inputValues, [name]: value });

    //Reset alert from backend
    if (resMessage.error) {
      setResMessage({ ...resMessage, error: "" });
    }
  };

  //Function to save validate info
  const validateInfo = (values) => {
    let errors = {};

    //new password validation
    if (!values.newPassword) {
      errors.newPassword = "Please insert your new password";
    } else if (
      !values.newPassword.match("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}")
    ) {
      errors.newPassword =
        "Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters";
    } else {
      delete errors.newPassword;
    }

    //confirm password validation
    if (!values.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (values.newPassword !== values.confirmPassword) {
      errors.confirmPassword = "Password do not match";
    } else {
      delete errors.confirmPassword;
    }

    return errors;
  };

  //Function when submitting form
  const submitHandler = (e) => {
    e.preventDefault();

    setErrors(validateInfo(inputValues)); //trigger state to display validation alert
    setIsSubmitting(true);
  };

  //Function
  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      setSubmitLoading(true);

      //Send request to backend
      Axios.patch(`${API_URL}/change-password/reset-password`, {
        userData: userData,
        newPassword: inputValues.newPassword,
      })
        .then((res) => {
          setSubmitLoading(false);

          if (res.data.errMessage) {
            setResMessage({ ...resMessage, error: res.data.errMessage });
          } else {
            setIsSubmitted(true);

            //Reset form input (controlled form)
            setInputValues({ newPassword: "", confirmPassword: "" });
          }
        })
        .catch((err) => {
          console.log(err);
          setResMessage({
            ...resMessage,
            error: "Server error, please try again later",
          });
        });
    }
  }, [errors]);

  useEffect(() => {
    //Send token to backend to decode token & get user data
    Axios.post(
      `${API_URL}/change-password/decode-token`,
      {},
      {
        headers: {
          Authorization: `Bearer ${props.match.params.token}`,
        },
      }
    )
      .then((res) => {
        console.log("Token is valid, username: ", res.data.userData.username);

        //Save user data
        setUserData(res.data.userData);
      })
      .catch((err) => {
        console.log(err);
        setResMessage({
          ...resMessage,
          error: "Server error, please try again later",
        });
      });
  }, []);

  return (
    <div className="reset-password container-fluid">
      <div className="container-reset-password container d-flex flex-column align-items-center">
        {!isSubmitted ? (
          <>
            <h1 className="mb-5 fw-bold">Reset Password</h1>
            {resMessage.error && (
              <div className="alert alert-danger" role="alert">
                {resMessage.error}
              </div>
            )}
            <form onSubmit={submitHandler} noValidate>
              <div className="mb-3">
                <label htmlFor="new-password" className="form-label">
                  New Password
                </label>
                <input
                  id="new-password"
                  type="password"
                  className={`form-control ${
                    errors.newPassword ? `is-invalid` : null
                  }`}
                  placeholder="New Password"
                  name="newPassword"
                  value={inputValues.newPassword}
                  onChange={inputHandler}
                  required
                />
                {errors.newPassword && (
                  <div className="text-danger">{errors.newPassword}</div>
                )}
              </div>
              <div className="mb-2">
                <label htmlFor="password-confirm" className="form-label">
                  Confirm Password
                </label>
                <input
                  id="password-confirm"
                  type="password"
                  className={`form-control ${
                    errors.confirmPassword ? `is-invalid` : null
                  }`}
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  value={inputValues.confirmPassword}
                  onChange={inputHandler}
                  required
                />
                {errors.confirmPassword && (
                  <div className="text-danger">{errors.confirmPassword}</div>
                )}
              </div>

              <div className="mb-4 container-fluid p-0"></div>
              <input
                type="submit"
                value="Reset Password"
                className="btn btn-primary py-2 container-fluid mb-3"
              />
            </form>
          </>
        ) : (
          <>
            {submitLoading && (
              <div
                className="alert alert-secondary mt-3 d-flex justify-content-center pt-3 pb-1"
                role="alert"
              >
                <div className="spinner-border me-1" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p>Submitting...</p>
              </div>
            )}
            <h2 className="fw-bold">Reset Password Success</h2>
            <Link to="/login">Click here to login</Link>
          </>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
