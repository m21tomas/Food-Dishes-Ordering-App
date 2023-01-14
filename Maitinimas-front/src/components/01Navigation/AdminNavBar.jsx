import React, { useState, useEffect } from "react";
import axios from "axios";
import apiEndpoint from "../06Services/endpoint";
import { NavLink } from "react-router-dom";

import logo from "../../images/maist2.png";
import "../../App.css";

import LogoutContainer from "./LogoutContainer";

function Navigation(props) {

  const [orders, setOrders] = useState(0);

  useEffect(() => {
    axios.get(`${apiEndpoint}/api/order/getAllOrders`)
      .then((response) => {
        //console.log("Admin - Overall orders: " + JSON.stringify(response.data))
        setOrders(response.data.length)
      })
      .catch((err) => {
        console.log(err.response.data)
      })
  }, [])

  return (
    <div className="pb-4">
      <nav className="navbar navbar-expand-md py-4 navbar-light bg-light">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to={"/home"}>
            <img
              className="nav-img"
              src={logo}
              alt="logotipas"
              loading="lazy"
            />
          </NavLink>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mynav1">
              <li className="nav-item me-2">
                <NavLink
                  className="nav-link nav1"
                  activeClassName="current"

                  id="navAdminCanteensList"
                  to={"/canteen"}
                >
                  Maitinimo įstaigos
                </NavLink>
              </li>

              <li className="nav-item me-2">
                <NavLink
                  className="nav-link nav1"
                  activeClassName="current"

                  id="navAdminUserList"
                  to={"/users"}
                >
                  Naudotojai
                </NavLink>
              </li>

              {
                orders > 0 ?
                  <li className="nav-item me-2">
                    <NavLink
                      className="nav-link nav1"
                      activeClassName="current"
                      id="navAdminOrdersList"
                      to={"/allOrders"}
                    >
                      Užsakymai
                    </NavLink>
                  </li>
                  : <></>
              }

              <li className="nav-item nav-item ms-2" style={{ position: "absolute", right: "20px" }}>
                <LogoutContainer />
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div>{props.children}</div>
    </div>
  );
}

export default Navigation;
