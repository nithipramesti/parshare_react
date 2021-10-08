import "../assets/styles/login.css";
import React,{useState, useEffect} from "react";
import Axios from "axios";
import {API_URL} from '../data/API';
import {useHistory} from 'react-router-dom';

function Login (props) {
    let history = useHistory()

    const [verification, setVerification] = useState({
        message : "wait a minute...",
        success : false
    })

    useEffect(() => {
        Axios.patch(API_URL + `/users/verified`, {}, {
            headers: {
                'Authorization': `Bearer ${props.match.params.token}`
            }
        }).then(res => {
            setVerification({
                ...verification,
                message: 'Your Account Verified ✔',
                success: true
            })
            localStorage.setItem("token_parshare", res.data.token)
        }).catch((err) => {
            console.log(err)
            setVerification({
                ...verification,
                message: 'Your Account Not Verified'
            })
        })
    }, [])

    const onBtnHandler = () => {
        history.push('/')
    }

    return (
    <div className="login container-fluid">
        <div className="row">
        <div className="col col-left"></div>
        <div className="col col-right d-flex flex-column justify-content-center">
            <div className="container d-flex flex-column align-items-center">
            <h1 className="mb-5 fw-bold">Verification</h1>
            <div className="mb-3 text-center">
                <p style={{fontSize:"16px"}}>{verification.message}</p>
                {verification.success === true ? (
                    <button className="btn btn-primary" onClick={onBtnHandler}>Go To Homepage</button>
                ) : null}
            </div>
            </div>
        </div>
        </div>
    </div>
    )
}

export default Login;
