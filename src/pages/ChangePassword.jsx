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

  //State to handling success/error message from backend
  let [resMessage, setResMessage] = useState({ success: "", error: "" });

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
    } else if (values.oldPassword.length < 6) {
      errors.oldPassword = "Your password should be 6 characters or more";
    }

    //new password validation
    if (!values.newPassword) {
      errors.newPassword = "Please insert your new password";
    } else if (values.newPassword.length < 6) {
      errors.newPassword = "Password needs to be 6 characters or more";
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
      //Send request to backend
      Axios.patch(`${API_URL}/change-password/change-password`, {
        userData: authReducer,
        oldPassword: inputValues.oldPassword,
        newPassword: inputValues.newPassword,
      })
        .then((res) => {
          if (res.data.errMessage) {
            setResMessage({ ...resMessage, error: res.data.errMessage });
          } else {
            setIsSubmitted(true);

            setResMessage({ ...resMessage, success: res.data.message });

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
              <input
                id="old-password"
                type="password"
                className={`form-control ${
                  errors.oldPassword ? `is-invalid` : null
                }`}
                placeholder="Old Password"
                name="oldPassword"
                value={inputValues.oldPassword}
                onChange={inputHandler}
                required
              />
              {errors.oldPassword && (
                <div className="text-danger">{errors.oldPassword}</div>
              )}
            </div>
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
