import Axios from "axios";

import { API_URL } from "../../data/API";

//LOGIN
export const LoginAction = (
  dispatch,
  inputValues,
  setInputValues,
  resMessage,
  setResMessage
) => {
  //Send request to backend
  Axios.post(`${API_URL}/users/login`, {
    email: inputValues.email,
    password: inputValues.password,
  })
    .then((res) => {
      if (res.data.errMessage) {
        setResMessage({ ...resMessage, error: res.data.errMessage });
      } else {
        //delete password user
        delete res.data.dataLogin.password;

        //Save token to local storage -- keep user login
        localStorage.setItem("token_parshare", res.data.token);

        //Set global state
        dispatch({
          type: "USER_LOGIN",
          payload: res.data.dataLogin,
        });

        console.log(
          `User '${res.data.dataLogin.username}' successfully logged in`
        );

        //Reset form input (controlled form)
        setInputValues({ email: "", password: "" });
      }
    })
    .catch((err) =>
      setResMessage({
        ...resMessage,
        error: "Server error, please try again later",
      })
    );
};

//KEEP LOGIN
export const KeepLoginAction = (dispatch, userLocalStorage) => {
  Axios.post(
    "http://localhost:2200/users/keep-login",
    {},
    {
      headers: {
        Authorization: `Bearer ${userLocalStorage}`,
      },
    }
  )
    .then((res) => {
      //delete password user
      delete res.data.dataLogin.password;

      //Save token to local storage -- keep user login
      localStorage.setItem("token_parshare", res.data.token);

      //Set global state
      dispatch({
        type: "USER_LOGIN",
        payload: res.data.dataLogin,
      });

      console.log(
        `Data from token matches the database, keep user '${res.data.dataLogin.username}' logged in`
      );
    })
    .catch((err) => console.log(err));
};

//CHECK LOCAL STORAGE
export const CheckStorageAction = (dispatch) => {
  dispatch({
    type: "CHECK_STORAGE",
  });
};

export const logoutAction = (dispatch) => {
  localStorage.removeItem("token_parshare");

  dispatch({
    type: "USER_LOGOUT",
  });
};
