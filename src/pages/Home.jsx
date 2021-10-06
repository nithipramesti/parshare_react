import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Home() {
  //Global state
  const authReducer = useSelector((state) => state.authReducer);

  let username = authReducer.username;
  return (
    <div>
      <h1>Home Page</h1>
      <p>Hi, {username}</p>
      <Link to="/test">Test Page</Link>
    </div>
  );
}

export default Home;
