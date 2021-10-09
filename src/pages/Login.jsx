import "../assets/styles/login.css";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Redirect } from "react-router-dom";

import { LoginAction } from "../redux/actions/user";

function Login() {
  //Global state
  const authReducer = useSelector((state) => state.authReducer);

  //Dispatch
  const dispatch = useDispatch();

  //Local state
  let [loginData, setLoginData] = useState({});
  let [errMessage, setErrMessage] = useState("");
  let [formValid, setFormValid] = useState({ email: true, password: true });

  //Function for onChange in input form
  const inputHandler = (event) => {
    //Clear form validation alert
    if (!(loginData.email && loginData.password)) {
      setFormValid({ email: true, password: true }); //resetting only when the form invalid before
    }

    //Save input form data to state
    const value = event.target.value;
    const name = event.target.name;
    setLoginData({ ...loginData, [name]: value });
  };

  //Login button
  const onBtnLogin = () => {
    if (loginData.email && loginData.password) {
      //Login user & save token to local storage (or get error message from BE)
      LoginAction(dispatch, loginData, setErrMessage);

      //Reset form input (controlled form)
      setLoginData({ email: "", password: "" });
    } else {
      //If there an empty form:

      //make new variables to not trigger state
      let email = true;
      let password = true;

      //if email form empty
      if (!loginData.email) {
        email = false;
      }

      //if password form empty
      if (!loginData.password) {
        password = false;
      }

      //set state to trigger rerender and show alert
      setFormValid({ email, password });
    }
  };

  if (authReducer.role === "user") {
    //if role is 'user', redirect to home page
    return <Redirect to="/" />;
  } else {
    return (
      <div className="login container-fluid">
        <div className="row">
          <div className="col col-left"></div>
          <div className="col col-right d-flex flex-column justify-content-center">
            <div className="container-login container d-flex flex-column align-items-center">
              <h1 className="mb-5 fw-bold">Login</h1>
              {errMessage && loginData.email && loginData.password ? (
                <div className="alert alert-danger" role="alert">
                  {errMessage}
                </div>
              ) : null}
              <form>
                <div className="mb-3">
                  <label htmlFor="form-email" className="form-label">
                    Email
                  </label>
                  <input
                    id="form-email"
                    type="text"
                    className={`form-control ${
                      !formValid.email ? `is-invalid` : null
                    }`}
                    placeholder="Email"
                    name="email"
                    value={loginData.email}
                    onChange={inputHandler}
                    required
                  />
                  {!formValid.email ? (
                    <div className="text-danger">Please enter your email</div>
                  ) : null}
                </div>
                <div className="mb-2">
                  <label htmlFor="form-password" className="form-label">
                    Password
                  </label>
                  <input
                    id="form-password"
                    type="password"
                    className={`form-control ${
                      !formValid.password ? `is-invalid` : null
                    }`}
                    placeholder="Password"
                    name="password"
                    value={loginData.password}
                    onChange={inputHandler}
                    required
                  />
                  {!formValid.password ? (
                    <div className="text-danger">
                      Please enter your password
                    </div>
                  ) : null}
                </div>
                <div className="mb-3 text-end">
                  <Link className="link-primary text-end" to="/forgot-password">
                    Forgot Password
                  </Link>
                </div>
                <div className="mb-4 container-fluid p-0"></div>
                <input
                  type="button"
                  value="Login"
                  className="btn btn-primary py-2 container-fluid mb-3"
                  onClick={onBtnLogin}
                />
              </form>

              <div className="mb-3 text-center">
                <p>
                  Don't have an account?{" "}
                  <a href="#" className="link-primary text-end">
                    Register here
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
