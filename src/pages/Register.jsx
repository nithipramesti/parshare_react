import "../assets/styles/auth.css";
import React, { useState } from "react";
import Axios from "axios";
import { API_URL } from "../data/API";
import { useHistory } from "react-router-dom";

const Register = () => {
  let history = useHistory();
  const [registerForm, setRegisterForm] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    message: "",
    success: "",
    errors: "",
  });

  let [submitLoading, setSubmitLoading] = useState(false);

  //State for password visibility
  let [passwordVisible, setPasswordVisible] = useState({
    password: false,
    confirmPassword: false,
  });

  const inputHandler = (event) => {
    const value = event.target.value;
    const name = event.target.name;

    setRegisterForm({
      ...registerForm,
      [name]: value,
    });
  };

  const handleValidation = () => {
    let errorInput = {};
    let formIsValid = true;

    //Name
    //check empty input
    if (!registerForm["username"]) {
      formIsValid = false;
      errorInput["username"] = "Please insert your username";
    }

    //Email
    //check empty input
    if (!registerForm["email"]) {
      formIsValid = false;
      errorInput["email"] = "Please insert your email";
    }
    //check format email
    if (typeof registerForm["email"] !== "undefined") {
      let lastAtPos = registerForm["email"].lastIndexOf("@");
      let lastDotPos = registerForm["email"].lastIndexOf(".");

      if (
        !(
          lastAtPos < lastDotPos &&
          lastAtPos > 0 &&
          registerForm["email"].indexOf("@@") == -1 &&
          lastDotPos > 2 &&
          registerForm["email"].length - lastDotPos > 2
        )
      ) {
        formIsValid = false;
        errorInput["email"] = "Email is not valid";
      }
    }

    //password
    //check empty input
    if (!registerForm["password"]) {
      formIsValid = false;
      errorInput["password"] = "Please insert your password";
    }

    //check rules password
    if (typeof registerForm["password"] !== "undefined") {
      if (
        !registerForm["password"].match("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}")
      ) {
        formIsValid = false;
        errorInput["password"] =
          "Password must contain at least 8 characters, and a mix of numbers and uppercase & lowercase letters";
      }
    }

    //confirmation password
    //check empty input
    if (!registerForm["confirmPassword"]) {
      formIsValid = false;
      errorInput["confirmPassword"] = "Cannot be empty";
    }

    //compare with original password
    if (typeof registerForm["confirmPassword"] !== "undefined") {
      if (registerForm["password"] !== registerForm["confirmPassword"]) {
        formIsValid = false;
        errorInput["confirmPassword"] =
          "The password and confirmation password do not match";
      }
    }

    setRegisterForm({
      ...registerForm,
      errors: errorInput,
    });
    return formIsValid;
  };

  const registerHandler = () => {
    if (handleValidation()) {
      Axios.post(`${API_URL}/users/register`, {
        email: registerForm.email,
        username: registerForm.username,
        password: registerForm.password,
      })
        .then((res) => {
          setRegisterForm({
            ...registerForm,
            message: res.data.message,
            success: res.data.success,
            email: "",
            username: "",
            password: "",
            confirmPassword: "",
          });
          // alert("Register Success!, please check your email")
          if (res.data.success === true) {
            setTimeout(() => history.push("/"), 3000);
          }
        })
        .catch(() => {
          alert("Register Failed!");
        });
    }
  };

  return (
    <div className="login container-fluid">
      <div className="row">
        <div className="col col-left"></div>
        <div className="col col-right d-flex flex-column justify-content-center">
          <div className="container-register container d-flex flex-column align-items-center">
            <h1 className="mb-5 fw-bold">Register</h1>
            <form>
              {registerForm.success === true ? (
                <div className="alert alert-success text-center" role="alert">
                  {registerForm.message}
                </div>
              ) : null}
              {registerForm.success === false ? (
                <div className="alert alert-danger text-center" role="alert">
                  {registerForm.message}
                </div>
              ) : null}
              <div className="mb-3">
                <label htmlFor="inputEmail" className="form-label">
                  Email address
                </label>
                <input
                  name="email"
                  onChange={inputHandler}
                  type="email"
                  className={`form-control ${
                    registerForm.errors["email"] ? `input-invalid` : null
                  }`}
                  placeholder="Email"
                  id="inputEmail"
                  value={registerForm.email}
                  required
                />
                <span className="validation-alert" style={{ color: "red" }}>
                  {registerForm.errors["email"]}
                </span>
              </div>
              <div className="mb-3">
                <label htmlFor="inputUsername" className="form-label">
                  Username
                </label>
                <input
                  name="username"
                  onChange={inputHandler}
                  type="text"
                  className={`form-control ${
                    registerForm.errors["username"] ? `input-invalid` : null
                  }`}
                  placeholder="Username"
                  id="inputUsername"
                  value={registerForm.username}
                  required
                />
                <span className="validation-alert" style={{ color: "red" }}>
                  {registerForm.errors["username"]}
                </span>
              </div>
              <div className="mb-3">
                <label htmlFor="inputPassword" className="form-label">
                  Password
                </label>
                <div className="password-input-container d-flex align-items-center">
                  <input
                    name="password"
                    onChange={inputHandler}
                    type={passwordVisible.password ? `text` : `password`}
                    className={`form-control ${
                      registerForm.errors["password"] ? `input-invalid` : null
                    }`}
                    placeholder="Password"
                    id="inputPassword"
                    value={registerForm.password}
                    required
                  />
                  {!passwordVisible.password ? (
                    <svg
                      className="bi bi-eye eye-icon"
                      onClick={() =>
                        setPasswordVisible({
                          ...passwordVisible,
                          password: true,
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
                          password: false,
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
                {registerForm.errors["password"] ? (
                  <div className="validation-alert" style={{ color: "red" }}>
                    {registerForm.errors["password"]}
                  </div>
                ) : (
                  <div className="validation-alert text-muted">
                    {`Password must contain at least 8 characters, and a mix of numbers and uppercase & lowercase letters`}
                  </div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="inputConfirmPassword" className="form-label">
                  Confirm Password
                </label>
                <div className="password-input-container d-flex align-items-center">
                  <input
                    name="confirmPassword"
                    onChange={inputHandler}
                    type={passwordVisible.confirmPassword ? `text` : `password`}
                    className={`form-control ${
                      registerForm.errors["confirmPassword"]
                        ? `input-invalid`
                        : null
                    }`}
                    placeholder="Password"
                    id="inputConfirmPassword"
                    value={registerForm.confirmPassword}
                    required
                  />
                  {!passwordVisible.confirmPassword ? (
                    <svg
                      className="bi bi-eye eye-icon"
                      onClick={() =>
                        setPasswordVisible({
                          ...passwordVisible,
                          confirmPassword: true,
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
                          confirmPassword: false,
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
                <div className="validation-alert" style={{ color: "red" }}>
                  {registerForm.errors["confirmPassword"]}
                </div>
              </div>
              <div className="mt-4 mb-2 container-fluid p-0">
                <button
                  onClick={registerHandler}
                  type="button"
                  className="btn btn-primary container-fluid"
                  id="registerBtn"
                >
                  Register
                </button>
              </div>
            </form>
            <div className="mb-3 text-center">
              <p>
                Already have an account?{" "}
                <a href="/login" className="link-primary text-end">
                  Login here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
