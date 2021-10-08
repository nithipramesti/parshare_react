import "../assets/styles/login.css";
import React,{useState} from "react";
import Axios from "axios";
import {API_URL} from '../data/API';
import {useHistory} from 'react-router-dom'

const Register = () => {
    let history = useHistory()
    const [registerForm,setRegisterForm] = useState({
        email : "",
        username : "",
        password : "",
        confirmPassword : "",
        message : "",
        success : "",
        errors : ""
    })

    const inputHandler = (event) => {
        const value = event.target.value;
        const name = event.target.name;

        setRegisterForm({
            ...registerForm,
            [name] : value
        })
    }

    const handleValidation = () => {
        let errorInput = {}
        let formIsValid = true
    
        //Name
        //check empty input
        if (!registerForm["username"]) {
          formIsValid = false
          errorInput["username"] = "Cannot be empty";
        }
    
        //Email
        //check empty input
        if (!registerForm["email"]) {
          formIsValid = false
          errorInput["email"] = "Cannot be empty"
        }
        //check format email
        if (typeof registerForm["email"] !== "undefined") {
          let lastAtPos = registerForm["email"].lastIndexOf("@")
          let lastDotPos = registerForm["email"].lastIndexOf(".")
    
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
            errorInput["email"] = "Email is not valid"
          }
        }

        //password
        //check empty input
        if (!registerForm["password"]) {
            formIsValid = false
            errorInput["password"] = "Cannot be empty"
        }

        //check rules password
        if (typeof registerForm["password"] !== "undefined") {
            if (!registerForm["password"].match("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}")) {
                formIsValid = false
                errorInput["password"] = "Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters";
            }
        }

        //confirmation password
        //check empty input
        if (!registerForm["confirmPassword"]) {
            formIsValid = false
            errorInput["confirmPassword"] = "Cannot be empty"
        }

        //compare with original password
        if (typeof registerForm["confirmPassword"] !== "undefined") {
            if(registerForm['password'] !== registerForm['confirmPassword']){
                formIsValid = false
                errorInput["confirmPassword"] = "The password and confirmation password do not match."
            }
        }
        

        setRegisterForm({
            ...registerForm,
            errors : errorInput
        })
        return formIsValid
      }

    const registerHandler = () => {
        if (handleValidation()) {
            Axios.post(`${API_URL}/users/register`,{
                email : registerForm.email,
                username : registerForm.username,
                password : registerForm.password,
            })
            .then((res) => {
                setRegisterForm({
                    ...registerForm,
                    message : res.data.message,
                    success : res.data.success,
                    email : "",
                    username : "",
                    password : "",
                    confirmPassword : "",
                })
                // alert("Register Success!, please check your email")
                if(res.data.success===true){
                    setTimeout(() => history.push('/'), 3000);
                }
            })
            .catch(() => {
                alert("Register Failed!")
            })
        }
    }

    return (
        <div className="login container-fluid">
            <div className="row">
                <div className="col col-left"></div>
                <div className="col col-right d-flex flex-column justify-content-center">
                <div className="container d-flex flex-column align-items-center">
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
                        <label htmlFor="inputEmail" className="form-label">Email address</label>
                        <input
                        name="email"
                        onChange={inputHandler}
                        type="email"
                        className="form-control"
                        placeholder="Email" 
                        id="inputEmail"
                        value={registerForm.email}
                        required
                        />
                        <span style={{ color: "red" }}>{registerForm.errors['email']}</span>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="inputUsername" className="form-label">Username</label>
                        <input
                        name="username"
                        onChange={inputHandler}
                        type="text"
                        className="form-control"
                        placeholder="Username"
                        id="inputUsername"
                        value={registerForm.username}
                        required
                        />
                        <span style={{ color: "red" }}>{registerForm.errors['username']}</span>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="inputPassword" className="form-label">Password</label>
                        <input
                        name="password"
                        onChange={inputHandler}
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        id="inputPassword"
                        value={registerForm.password}
                        required
                        />
                        <span style={{ color: "red"}}>{registerForm.errors['password']}</span>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="inputConfirmPassword" className="form-label">Confirm Password</label>
                        <input
                        name="confirmPassword"
                        onChange={inputHandler}
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        id="inputConfirmPassword"
                        value={registerForm.confirmPassword}
                        required
                        />
                        <span style={{ color: "red" }}>{registerForm.errors['confirmPassword']}</span>
                    </div>
                    <div className="mt-4 mb-2 container-fluid p-0">
                        <button
                        onClick={registerHandler}
                        type="button"
                        className="btn btn-primary container-fluid"
                        id="registerBtn"
                        >Register
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
}

export default Register;
