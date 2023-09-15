import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { logoutUser } from "../api/api/auth-endpoints";

export default class Navbar extends Component {
  render() {
    const logout = async () => {
      await logoutUser();
      this.props.setName('');
    }

    let menu;

    if (this.props.firstname === '' || !this.props.firstname) {
      menu = (
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link className="nav-link" to={'/sign-in'}>
              Login
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to={'/sign-up'}>
              Sign up
            </Link>
          </li>
        </ul>
      )
    } else {
      menu = (
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link className="nav-link" onClick={logout} to={'/sign-in'}>
              Logout
            </Link>
          </li>
        </ul>
      )
    }

    return (
      <nav className="navbar navbar-expand-lg navbar-light fixed-top">
          <div className="container">
            <Link className="navbar-brand" to={'/'}>
              Camagru
            </Link>
            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
              {menu}
            </div>
          </div>
        </nav>
    )
  }
}