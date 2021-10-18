import "../assets/styles/navbar.css";
import logo from "../assets/images/Logo.png";
import logoWhite from "../assets/images/Logo-white.png";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";

import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutAction } from "../redux/actions/user";

function Navigation() {
  //Get global state data
  const authReducer = useSelector((state) => state.authReducer);
  const cartReducer = useSelector((state) => state.cartReducer);

  //Get dispatch
  const dispatch = useDispatch();

  //Log out user
  const onBtnLogout = () => {
    logoutAction(dispatch);
  };

  //Function to render nav links for logged USER
  const renderNavUser = () => {
    return (
      <Nav className="justify-content-end">
        <Link to="/user/cart" className="nav-link">
          <i className="bi bi-cart3 icon-cart">
            {cartReducer.cart_qty !== 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cartReducer.cart_qty}
                <span className="visually-hidden">cart items</span>
              </span>
            )}
          </i>
        </Link>
        <NavDropdown
          title={
            <>
              <i className="bi bi-person-circle icon-account"></i>
              <span>{authReducer.username}</span>
            </>
          }
          id="basic-nav-dropdown"
        >
          <NavDropdown.Item href="#action/3.2">
            <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
              Transactions
            </Link>
          </NavDropdown.Item>
          <NavDropdown.Item>
            <Link to="/profile" style={{ color: "inherit", textDecoration: "none" }}>
              Account Setting
            </Link>
          </NavDropdown.Item>
          <NavDropdown.Item>
            <Link
              to="/change-password"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              Change Password
            </Link>
          </NavDropdown.Item>

          <NavDropdown.Divider />
          <NavDropdown.Item onClick={onBtnLogout}>Log Out</NavDropdown.Item>
        </NavDropdown>
      </Nav>
    );
  };

  //Function to render nav links for ADMIN
  const renderNavAdmin = () => {
    return (
      <Nav className="justify-content-end">
        <Link to="/" className="nav-link">
          Parcels
        </Link>
        <Link to="/" className="nav-link">
          Products
        </Link>
        <Link to="/" className="nav-link">
          Transactions
        </Link>
        <Link to="/" className="nav-link">
          Stats
        </Link>
        <Link to="/" className="nav-link" onClick={onBtnLogout}>
          Log Out
        </Link>
      </Nav>
    );
  };

  //Function to render nav links for GUEST (not log in)
  const renderNavNon = () => {
    return (
      <Nav className="justify-content-end">
        <Link to="/register" className="nav-link">
          Register
        </Link>
        <Link to="/login" className="nav-link">
          Login
        </Link>
      </Nav>
    );
  };

  //Get path name
  const pathName = useLocation().pathname;

  return (
    <Navbar>
      <Container>
        <Navbar.Brand>
          <Link to="/">
            {pathName === "/login" || pathName === "/register" ? (
              <img src={logoWhite} id="logo" alt="Logo Parshare" />
            ) : (
              <img src={logo} id="logo" alt="Logo Parshare" />
            )}
          </Link>
        </Navbar.Brand>
        {authReducer.username
          ? authReducer.role === "user"
            ? renderNavUser()
            : renderNavAdmin()
          : pathName === "/login" || pathName === "/register"
          ? null
          : renderNavNon()}
      </Container>
    </Navbar>
  );
}

export default Navigation;
