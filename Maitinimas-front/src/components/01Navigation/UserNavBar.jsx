import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
// import Nav from 'react-bootstrap/Nav';
// import Navbar from 'react-bootstrap/Navbar';
import Table from 'react-bootstrap/Table';
import AuthContext from "../06Services/AuthContext";
import CartContext from "../06Services/CartContext";
import axios from "axios";
import apiEndpoint from "../06Services/endpoint";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";

import logo from "../../images/maist2.png";
import "../../App.css";

import LogoutContainer from "./LogoutContainer";

function UserNavBar(props) {
    const { state } = React.useContext(AuthContext);
    const { cartState } = React.useContext(CartContext);
    const history = useHistory();

    const [itemsInCart, setItemsInCart] = useState(0);

    useEffect(() => {
        axios.get(`${apiEndpoint}/api/cart/getCart`)
            .then(response => {
                //console.log(JSON.stringify(response.data));
                console.log("Items in cart: " + response.data.length)
                console.log("user: " + state.username)
                console.log("cartState: " + cartState)
                response.data.map((item) => {
                    if (item.cartItemId == null) {
                        setItemsInCart(null);
                        console.log("Items in cart: null")
                    }
                    else {
                        setItemsInCart(response.data.length);

                    }
                    return null;
                })
            })
            .catch(error => {
                error.response.data.map(item => {
                    setItemsInCart(null);
                    console.log(item.serviceResponse)
                    return null;
                })
            });
    }, [cartState, state.username])

    return (
        <>
            {/* <Navbar bg="light" expand="lg">

                <Navbar.Brand href={ "/home"}><img
                    className="ps-3 nav-img"
                    src={logo}
                    alt="logotipas"
                    loading="lazy" /></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href={"/home"}>Home</Nav.Link>
                        
                    </Nav>
                    <div className="pe-3"><h6>{state.username}</h6></div>
                    <div className="pe-3">
                    <Table>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '0px', textAlign: 'center' ,border: 'none' }}>
                                        <p style={{marginBottom: '-3px'}}>{itemsInCart}</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '0px',  textAlign: 'center', border: 'none' }}>
                                        <FontAwesomeIcon style={ itemsInCart==null ? { verticalAlign: '-40%'} :
                                                                                     { verticalAlign: '10%'}}
                                         icon={faShoppingCart} />
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                        
                    </div>
                    <div className="pe-4"><LogoutContainer /></div>
                </Navbar.Collapse>
            </Navbar> */}
            
            <nav className="navbar navbar-expand-md navbar-light bg-light">
                <div className="container-fluid">
                    <NavLink className="navbar-brand" to={"/home"}>
                        <img
                            className="ps-3 nav-img"
                            src={logo}
                            alt="logotipas"
                            loading="lazy"
                        />
                    </NavLink>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mynav1">
                            <li className="nav-item me-2">
                                <NavLink
                                    className="nav-link"
                                    id="navAdminUserList"
                                    to={"/Home"}
                                >
                                    Home
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                        <div className="pe-3"><h6>{state.username}</h6></div>
                    <div className="pe-3">
                    <Table>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '0px', textAlign: 'center' ,border: 'none' }}>
                                        <button
                                            id='btnCheckCart'
                                            className='editEntityField'
                                            onClick={() => history.push("/cartContainer")}
                                        >
                                            <p style={{marginBottom: '-3px'}}>{itemsInCart}</p>
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '0px',  textAlign: 'center', border: 'none' }}>
                                        <button
                                            id='btnCheckCart'
                                            className='editEntityField'
                                            onClick={() => history.push("/cartContainer")}
                                        >
                                            <FontAwesomeIcon style={ itemsInCart==null ? { verticalAlign: '-40%'} :
                                                                                     { verticalAlign: '10%'}}
                                                icon={faShoppingCart} />
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                    <div className="pe-4"><LogoutContainer /></div>
                </div>
            </nav>
            <div>{props.children}</div>
        </>
    );
}

export default UserNavBar;
