import "./App.css";
import "bootstrap/dist/css/bootstrap.css";

import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { KeepLoginAction, CheckStorageAction } from "./redux/actions/user";

//Import pages
import Login from "./pages/Login";
import Home from "./pages/Home";
import Test from "./pages/Test";

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
      //If token exist, keep user logged in
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
        <Switch>
          <Route component={Login} path="/login" />
          <Route component={Test} path="/test" />
          <Route component={Home} path="/" />
        </Switch>
      </BrowserRouter>
    );
  } else {
    return <div>Loading data...</div>; //if local storage not checked yet (checkStorage: 'false' in global state)
  }
}

export default App;