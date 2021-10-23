import "../assets/styles/login.css";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Redirect } from "react-router-dom";

import { LoginAction } from "../redux/actions/user";

function Login() {
  //Global state
  const authReducer = useSelector((state) => state.authReducer);

  //Dispatch
  const dispatch = useDispatch();

  //State for input values
  let [inputValues, setInputValues] = useState({
    email: "",
    password: "",
  });

  //State for handling validation error
  let [errors, setErrors] = useState({});

  //State to indicate wether form is submitting or not
  let [isSubmitting, setIsSubmitting] = useState(false);

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

    //email valdiation
    if (!values.email) {
      errors.email = "Please insert your email";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Email is invalid";
    }

    //password validation
    if (!values.password) {
      errors.password = "Please insert your password";
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
      //Login action
      LoginAction(
        dispatch,
        inputValues,
        setInputValues,
        resMessage,
        setResMessage
      );
    }
  }, [errors]);

  if (authReducer.role === "user") {
    //if role is 'user', redirect to home page
    return <Redirect to="/" />;
  }else if(authReducer.role === "admin") {
    return <Redirect to="/admin/products" />;
  } else {
    return (
      <div className="login container-fluid">
        <div className="row">
          <div className="col col-left"></div>
          <div className="col col-right d-flex flex-column justify-content-center">
            <div className="container-login container d-flex flex-column align-items-center">
              <h1 className="mb-5 fw-bold">Login</h1>
              {resMessage.error && (
                <div className="alert alert-danger" role="alert">
                  {resMessage.error}
                </div>
              )}
              <form onSubmit={submitHandler} noValidate>
                <div className="mb-3">
                  <label htmlFor="form-email" className="form-label">
                    Email
                  </label>
                  <input
                    id="form-email"
                    type="email"
                    className={`form-control ${
                      errors.email ? `is-invalid` : null
                    }`}
                    placeholder="Email"
                    name="email"
                    value={inputValues.email}
                    onChange={inputHandler}
                    required
                  />
                  {errors.email && (
                    <div className="text-danger">{errors.email}</div>
                  )}
                </div>
                <div className="mb-2">
                  <label htmlFor="form-password" className="form-label">
                    Password
                  </label>
                  <input
                    id="form-password"
                    type="password"
                    className={`form-control ${
                      errors.password ? `is-invalid` : null
                    }`}
                    placeholder="Password"
                    name="password"
                    value={inputValues.password}
                    onChange={inputHandler}
                    required
                  />
                  {errors.password && (
                    <div className="text-danger">
                      Please enter your password
                    </div>
                  )}
                </div>
                <div className="mb-3 text-end">
                  <Link className="link-primary text-end" to="/forgot-password">
                    Forgot Password
                  </Link>
                </div>
                <div className="mb-4 container-fluid p-0"></div>
                <input
                  type="submit"
                  value="Login"
                  className="btn btn-primary py-2 container-fluid mb-3"
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
