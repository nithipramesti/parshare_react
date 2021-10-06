import "../assets/styles/login.css";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";

import { LoginAction } from "../redux/actions/user";

function Login() {
  //Dispatch
  const dispatch = useDispatch();

  //Local state
  let [loginData, setLoginData] = useState({});
  let [errMessage, setErrMessage] = useState("");
  let [redirect, setRedirect] = useState(false);

  //Get data from html form, and save it to state 'loginData'
  const inputHandler = (event) => {
    const value = event.target.value;
    const name = event.target.name;
    setLoginData({ ...loginData, [name]: value });
  };

  //Login button
  const onBtnLogin = () => {
    //Login user & save token to local storage
    LoginAction(dispatch, loginData, setErrMessage);

    //Set redirect to 'true' (will redirect to home page)
    setRedirect(true);
  };

  if (redirect) {
    return <Redirect to="/" />; //redirect to homepage
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
                    className="form-control"
                    placeholder="Email"
                    name="email"
                    onChange={inputHandler}
                    required
                  />
                  <div class="invalid-feedback">
                    Please insert your username or password
                  </div>
                </div>
                <div className="mb-2">
                  <label htmlFor="form-password" className="form-label">
                    Password
                  </label>
                  <input
                    id="form-password"
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    name="password"
                    onChange={inputHandler}
                  />
                </div>
                <div className="mb-3 text-end">
                  <a href="#" className="link-primary text-end">
                    Forgot Password
                  </a>
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
