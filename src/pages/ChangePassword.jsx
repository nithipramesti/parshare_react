import "../assets/styles/reset-password.css";

import Axios from "axios";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { API_URL } from "../data/API";

function ChangePassword(props) {
  //Global state
  const authReducer = useSelector((state) => state.authReducer);

  //State for input values
  let [inputValues, setInputValues] = useState({
    oldPassword: "",
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

  //State for password visibility
  let [passwordVisible, setPasswordVisible] = useState({
    old: false,
    new: false,
    confirm: false,
  });

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
    //old password validation
    if (!values.oldPassword) {
      errors.oldPassword = "Please insert your old password";
    }

    //new password validation
    if (!values.newPassword) {
      errors.newPassword = "Please insert your new password";
    } else if (
      !values.newPassword.match("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}")
    ) {
      errors.newPassword =
        "Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters";
    }

    //confirm password validation
    if (!values.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (values.newPassword !== values.confirmPassword) {
      errors.confirmPassword = "Password do not match";
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
      Axios.patch(`${API_URL}/change-password/change-password`, {
        userData: authReducer,
        oldPassword: inputValues.oldPassword,
        newPassword: inputValues.newPassword,
      })
        .then((res) => {
          setSubmitLoading(false);

          if (res.data.errMessage) {
            setResMessage({ ...resMessage, error: res.data.errMessage });
          } else {
            setIsSubmitted(true);

            setResMessage({ ...resMessage, success: res.data.message });

            //Save token to local storage -- keep user login
            localStorage.setItem("token_parshare", res.data.token);

            //Reset form input (controlled form)
            setInputValues({
              oldPassword: "",
              newPassword: "",
              confirmPassword: "",
            });
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

  if (authReducer.role !== "user") {
    //if role is not 'user', redirect to home page
    return <Redirect to="/" />;
  } else {
    return (
      <div className="reset-password container-fluid">
        <div className="container-reset-password container d-flex flex-column align-items-center">
          <h1 className="mb-5 fw-bold">Change Password</h1>
          {resMessage.error && (
            <div className="alert alert-danger" role="alert">
              {resMessage.error}
            </div>
          )}
          <form onSubmit={submitHandler} noValidate>
            <div className="mb-3">
              <label htmlFor="old-password" className="form-label">
                Old Password
              </label>
              <div className="password-input-container d-flex align-items-center">
                <input
                  id="old-password"
                  type={passwordVisible.old ? `text` : `password`}
                  className={`form-control ${
                    errors.oldPassword ? `input-invalid` : null
                  }`}
                  placeholder="Old Password"
                  name="oldPassword"
                  value={inputValues.oldPassword}
                  onChange={inputHandler}
                  required
                />
                {!passwordVisible.old ? (
                  <svg
                    className="bi bi-eye eye-icon"
                    onClick={() =>
                      setPasswordVisible({
                        ...passwordVisible,
                        old: true,
                      })
                    }
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                  </svg>
                ) : (
                  <svg
                    className="bi bi-eye-slash eye-icon"
                    onClick={() =>
                      setPasswordVisible({
                        ...passwordVisible,
                        old: false,
                      })
                    }
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" />
                    <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" />
                    <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z" />
                  </svg>
                )}
              </div>
              {errors.oldPassword && (
                <div className="validation-alert text-danger">
                  {errors.oldPassword}
                </div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="new-password" className="form-label">
                New Password
              </label>
              <div className="password-input-container d-flex align-items-center">
                <input
                  id="new-password"
                  type={passwordVisible.new ? `text` : `password`}
                  className={`form-control ${
                    errors.newPassword ? `input-invalid` : null
                  }`}
                  placeholder="New Password"
                  name="newPassword"
                  value={inputValues.newPassword}
                  onChange={inputHandler}
                  required
                />
                {!passwordVisible.new ? (
                  <svg
                    className="bi bi-eye eye-icon"
                    onClick={() =>
                      setPasswordVisible({
                        ...passwordVisible,
                        new: true,
                      })
                    }
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                  </svg>
                ) : (
                  <svg
                    className="bi bi-eye-slash eye-icon"
                    onClick={() =>
                      setPasswordVisible({
                        ...passwordVisible,
                        new: false,
                      })
                    }
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" />
                    <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" />
                    <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z" />
                  </svg>
                )}
              </div>
              {errors.newPassword ? (
                <div className="validation-alert text-danger">
                  {errors.newPassword}
                </div>
              ) : (
                <div className="validation-alert text-muted">
                  {`Password must contain at least 8 characters, and a mix of numbers and uppercase & lowercase letters`}
                </div>
              )}
            </div>
            <div className="mb-2">
              <label htmlFor="password-confirm" className="form-label">
                Confirm Password
              </label>
              <div className="password-input-container d-flex align-items-center">
                <input
                  id="password-confirm"
                  type={passwordVisible.confirm ? `text` : `password`}
                  className={`form-control ${
                    errors.confirmPassword ? `input-invalid` : null
                  }`}
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  value={inputValues.confirmPassword}
                  onChange={inputHandler}
                  required
                />
                {!passwordVisible.confirm ? (
                  <svg
                    className="bi bi-eye eye-icon"
                    onClick={() =>
                      setPasswordVisible({
                        ...passwordVisible,
                        confirm: true,
                      })
                    }
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                  </svg>
                ) : (
                  <svg
                    className="bi bi-eye-slash eye-icon"
                    onClick={() =>
                      setPasswordVisible({
                        ...passwordVisible,
                        confirm: false,
                      })
                    }
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" />
                    <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" />
                    <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z" />
                  </svg>
                )}
              </div>
              {errors.confirmPassword && (
                <div className="validation-alert text-danger">
                  {errors.confirmPassword}
                </div>
              )}
            </div>

            <div className="mb-4 container-fluid p-0"></div>
            <input
              type="submit"
              value="Reset Password"
              className="btn btn-primary py-2 container-fluid mb-3"
            />
          </form>
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
          {resMessage.success && (
            <div className="alert alert-success mt-3" role="alert">
              {resMessage.success}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default ChangePassword;
