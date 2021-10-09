import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

function Test() {
  //Global state
  const authReducer = useSelector((state) => state.authReducer);

  //dispatch
  const dispatch = useDispatch();

  //action
  const logoutAction = () => {
    localStorage.removeItem("token_parshare");

    dispatch({
      type: "USER_LOGOUT",
    });
  };

  let username = authReducer.username;
  return (
    <div>
      <h1>Test Page</h1>
      <p>Hi, {username}</p>
      <a onClick={logoutAction}>Log Out</a>
    </div>
  );
}

export default Test;
