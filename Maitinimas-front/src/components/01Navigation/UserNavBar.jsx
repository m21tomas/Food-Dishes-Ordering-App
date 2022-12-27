import React, { useState, useEffect } from "react";

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Table from 'react-bootstrap/Table';
import AuthContext from "../06Services/AuthContext";
import CartContext from "../06Services/CartContext";
import axios from "axios";
import apiEndpoint from "../06Services/endpoint";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";


import logo from "../../images/maist2.png";
import "../../App.css";

import LogoutContainer from "./LogoutContainer";

function UserNavBar(props) {
    const { state } = React.useContext(AuthContext);
    const {cartState} = React.useContext(CartContext);

    const[itemsInCart, setItemsInCart] = useState(0);

    useEffect(() => {
        axios.get(`${apiEndpoint}/api/cart/getCart`)
             .then(response => {
                //console.log(JSON.stringify(response.data));
                response.data.map((item) => {
                    if(item.cartItemId == null){
                        setItemsInCart(null);
                        console.log("Items in cart: null")
                    }
                    else {
                        setItemsInCart(response.data.length);
                        console.log("Items in cart: "+response.data.length)
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
    }, [cartState])

    return (
        <>
            <Navbar bg="light" expand="lg">

                <Navbar.Brand href={"/home"}><img
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
            </Navbar>
            <div>{props.children}</div>
        </>
    );
}

export default UserNavBar;
