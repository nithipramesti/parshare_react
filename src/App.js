import "./App.css";
import "bootstrap/dist/css/bootstrap.css";

import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { KeepLoginAction, CheckStorageAction } from "./redux/actions/user";

//Import pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Test from "./pages/Test";
import ForgotPassword from "./pages/ForgotPassword";
import Navigation from "./components/Navigation";
import VerificationPage from "./pages/VerificationPage";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/ChangePassword";

function App() {
  //Get global state data
  const authReducer = useSelector((state) => state.authReducer);

  //Get user token
  const userLocalStorage = localStorage.getItem("token_parshare");

  //Dispatch
  const dispatch = useDispatch();

  //Check token
  useEffect(() => {
    if (userLocalStorage) {
      //If token exist, keep user logged in (decode token and save loginData to global state)
      KeepLoginAction(dispatch, userLocalStorage);
    } else {
      //If token not exist, set checkStorage in global state to 'true'
      CheckStorageAction(dispatch);
    }
  }, []);

  if (authReducer.storageIsChecked) {
    //App will be rendered only after finish checking local storage (checkStorage: 'true' in global state)
    return (
      <BrowserRouter>
        <Navigation />
        <Switch>
          <Route component={Login} path="/login" />
          <Route component={Register} path="/register" />
          <Route component={VerificationPage} path="/authentication/:token" />
          <Route component={ForgotPassword} path="/forgot-password" />
          <Route component={ResetPassword} path="/reset-password/:token" />
          <Route component={ChangePassword} path="/change-password/" />
          <Route component={Home} path="/" exact />
        </Switch>
      </BrowserRouter>
    );
  } else {
    return <div>Loading data...</div>; //if local storage not checked yet (checkStorage: 'false' in global state)
  }
}

export default App;
