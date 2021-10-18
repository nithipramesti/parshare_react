import photo from '../assets/images/defaultPP.jpeg';
import '../assets/styles/profile.css'
import Axios from "axios";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { API_URL } from "../data/API";
import { editProfileAction, editProfilePict } from "../redux/actions/user";

function Profile(props){
    
    const authReducer = useSelector((state) => state.authReducer)

    const dispatch = useDispatch();

    let [inputProfile, setInputProfile] = useState({
        id_user : authReducer.id_user,
        fullname: authReducer.fullname,
        gender: authReducer.gender,
        birthdate: authReducer.birthdate,
        address: authReducer.address,
        picture_link : authReducer.picture_link
    });

    let [errors, setErrors] = useState({})

    
    let [isSubmitting, setIsSubmitting] = useState(false)

    let [isSubmittedPhoto, setIsSubmittedPhoto] = useState(false)
    
    let [resMessage, setResMessage] = useState({ success: false, error: "" })

    
    const inputHandler = (e) => {
    
    const { name, value } = e.target
    setInputProfile({ ...inputProfile, [name]: value })

    
    if (resMessage.error) {
        setResMessage({ ...resMessage, error: "" })
    }
    }
    
    const validateInfo = (values) => {
    let errors = {};
    
    if (!values.fullname) {
        errors.fullname = "Cannot be empty"
    }

    if (!values.gender) {
        errors.gender = "Cannot be empty"
    }

    if (!values.birthdate) {
        errors.birthdate = "Cannot be empty"
    }

    if (!values.address) {
        errors.address = "Cannot be empty"
    }

    return errors;
    };
    
    const submitHandler = (e) => {
        console.log(inputProfile)
        e.preventDefault()        

        setErrors(validateInfo(inputProfile))
        setIsSubmitting(true)
    };

    const inputImageHandler = (e) => {
        if(e.target.files[0]){
          setInputProfile({ ...inputProfile, picture_link: e.target.files[0] })
          let preview = document.getElementById("preview")
          preview.src = URL.createObjectURL(e.target.files[0])
        }
      }
    const addProfilePict = () => {
        if(inputProfile.picture_link){
            editProfilePict(dispatch,inputProfile,setInputProfile,resMessage,setResMessage)
        }else{
            setResMessage({
                success : false,
                error : "Empty Photo"
            })
        }
    }
    

    useEffect(() => {
        console.log(authReducer)
        if (Object.keys(errors).length === 0 && isSubmitting) {
          editProfileAction(
            dispatch,
            inputProfile,
            setInputProfile,
            resMessage,
            setResMessage
          );
        }
      }, [errors])


    if (authReducer.role !== "user") {
        return <Redirect to="/" />
      } else {
        return(
            <div className="container container-top">
                <div className="container container-left">
                    <h2>Account Settings</h2>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-3 container-left">
                            <div className="d-flex flex-column">
                                <div className="container">
                                    {authReducer.picture_link ? (
                                        <img src={`${API_URL}/${authReducer.picture_link}`} width="200px" height="200px" id="preview" style={{display: "inline-block"}}></img>
                                    ) : <img src={photo} id="preview" width="200px" height="200px" style={{display: "inline-block"}}></img>
                                    }
                                    <div className="mt-3 d-flex justify-content-center align-item-center">
                                        <input
                                        type="file"
                                        className="btn"
                                        name="picture_link"
                                        onChange={inputImageHandler}
                                        required
                                        />
                                    </div>
                                    <div className="d-flex justify-content-center align-item-center">
                                        <button onClick={addProfilePict} className="btn btn-primary">Upload Photo</button>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="d-flex flex-column">
                                <div>
                                    <div>
                                        <h4>Edit Profile</h4>
                                        {resMessage.success && (
                                            <div className="alert alert-success" role="alert">
                                            Success
                                            </div>
                                        )}
                                        {resMessage.error && (
                                            <div className="alert alert-danger" style={{height:"40px"}} role="alert">
                                            {resMessage.error}
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-3">
                                        <form onSubmit={submitHandler} noValidate>
                                            <div className="mb-3">
                                                <label htmlFor="inputFullName" className="form-label">
                                                    Full Name
                                                </label>
                                                <input
                                                    id="inputFullName"
                                                    type="text"
                                                    className={`form-control ${
                                                        errors.fullname ? `is-invalid` : null
                                                    }`}
                                                    placeholder="Full Name"
                                                    name="fullname"
                                                    value={inputProfile.fullname}
                                                    // required
                                                    onChange={inputHandler}
                                                />
                                                {errors.fullname && (
                                                    <div className="text-danger">{errors.fullname}</div>
                                                )}
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="inputGender" className="form-label">
                                                    Gender
                                                </label>
                                                <select 
                                                id="inputGender" 
                                                className={`form-control ${
                                                    errors.gender ? `is-invalid` : null
                                                }`}
                                                name="gender"
                                                onChange={inputHandler}
                                                value={inputProfile.gender}
                                                >
                                                    <option value="">All</option>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                </select>
                                                {errors.gender && (
                                                    <div className="text-danger">{errors.gender}</div>
                                                )}
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="inputBirthDate" className="form-label">
                                                    Birthdate
                                                </label>
                                                <input
                                                    id="inputBirthDate"
                                                    type="date"
                                                    className={`form-control ${
                                                        errors.birthdate ? `is-invalid` : null
                                                    }`}
                                                    name="birthdate"
                                                    value={inputProfile.birthdate}
                                                    // required
                                                    onChange={inputHandler}
                                                />
                                                {errors.birthdate && (
                                                    <div className="text-danger">{errors.birthdate}</div>
                                                )}
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="inputAddress" className="form-label">
                                                    Address
                                                </label>
                                                <input
                                                    id="inputAddress"
                                                    type="text"
                                                    className={`form-control ${
                                                        errors.address ? `is-invalid` : null
                                                    }`}
                                                    placeholder="Address"
                                                    name="address"
                                                    value={inputProfile.address}
                                                    // required
                                                    onChange={inputHandler}
                                                />
                                                {errors.address && (
                                                    <div className="text-danger">{errors.address}</div>
                                                )}
                                            </div>
                                            <div className="mb-4"></div>
                                                <input
                                                type="submit"
                                                value="Save Changes"
                                                className="btn btn-primary py-2 mb-3"
                                            />
                                        </form>
                                    </div>
                                </div>
                                <div>
                                    {/* Change Password */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        )
    }
}

export default Profile;