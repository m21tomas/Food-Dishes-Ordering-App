import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import apiEndpoint from "../06Services/endpoint";
import Table from 'react-bootstrap/Table';
import Pagination from "../07CommonComponents/Pagination";
import CartContext from "../06Services/CartContext";
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const CartConatainer = () => {
    const { cartState, setCartState } = React.useContext(CartContext);

    const [itemsInCart, setItemsInCart] = useState({
        cartItemsArray: [],
        pageSize: 10,
        currentPage: 1,
        totalPages: 0,
        totalElements: 0,
        numberOfElements: 0
    })
    let servMessage = useRef();
    const [deleteItemIndex, setDeleteItemIndex] = useState(null);

    useEffect(() => {
        let pageSize = itemsInCart.pageSize;
        let page = itemsInCart.currentPage - 1;

        if (page < 0) page = 0;

        axios.get(`${apiEndpoint}/api/cart/allCartItemsPage?page=${page}&size=${pageSize}`)
            .then((response) => {
                setItemsInCart((itemsInCart) => ({
                    ...itemsInCart,
                    cartItemsArray: response.data.content.map(item => ({
                        cartItemId: item.cartItemId,
                        dishId: item.dishId,
                        dishName: item.dishName,
                        dishDescription: item.dishDescription,
                        quantityInCart: item.quantityInCart,
                        username: item.username,
                        serviceResponse: item.serviceResponse,
                        changeQuantity: false,
                        inputFocus: false
                    })),
                    totalPages: response.data.totalPages,
                    totalElements: response.data.totalElements,
                    numberOfElements: response.data.numberOfElements,
                    currentPage: response.data.number + 1
                }));
                console.log(JSON.stringify(response.data));
                console.log("Items in cart: " + response.data.content.length)
                if (response.data.totalElements === 0 ||
                    response.data.totalElements === undefined) {
                    console.log("servMessage: You don't have any dishes in your account.");
                    servMessage.current = "Jūsų krepšelis tuščias."
                }
                setDeleteItemIndex(null);
            })
            .catch((error) => {
                console.log(error.data)
                setItemsInCart((itemsInCart) => ({
                    ...itemsInCart,
                    cartItemsArray: error.response.data.content,
                    totalPages: error.response.data.totalPages,
                    totalElements: error.response.data.totalElements,
                    numberOfElements: error.response.data.numberOfElements,
                    currentPage: error.response.data.number + 1
                }));
                if (error.response.data.totalElements === 0) {
                    console.log("servMessage: You don't have any dishes in your account.");
                    servMessage.current = "Jūsų krepšelis tuščias."
                }

            });
    }, [itemsInCart.currentPage, deleteItemIndex, itemsInCart.pageSize])

    function handleDeleteCartDish(event, cartItemId) {
        event.preventDefault();
        let deletedDishName = undefined;
        itemsInCart.cartItemsArray.map((dish, i) => {
            if (dish.cartItemId === cartItemId) {
                deletedDishName = dish.dishName;
            }
            return null;
        });

        axios.delete(`${apiEndpoint}/api/cart/remove/${cartItemId}`)
            .then(response => {
                if (response.status === 200) {
                    setCartState(cartState + 1);
                    console.log("\"" + deletedDishName + "\" ištrintas")
                }
            })
            .catch(err => {
                console.error("\"" + deletedDishName + "\" neištrintas !!");
                console.error(err.response);
            });
    }

    const handlePageChange = (page) => {
        setItemsInCart({ ...itemsInCart, currentPage: page });
    };
    const remapWithQuantityChange = (getIndex, chStatus) => {

        setItemsInCart((itemsInCart) => ({
            ...itemsInCart,
            cartItemsArray: itemsInCart.cartItemsArray.map((item, index) => {
                if (index === getIndex) return {
                    cartItemId: item.cartItemId,
                    dishId: item.dishId,
                    dishName: item.dishName,
                    dishDescription: item.dishDescription,
                    quantityInCart: item.quantityInCart,
                    username: item.username,
                    serviceResponse: item.serviceResponse,
                    changeQuantity: chStatus,
                    inputFocus: item.inputFocus
                }
                else { return item }
            }),
            totalPages: itemsInCart.totalPages,
            totalElements: itemsInCart.totalElements,
            numberOfElements: itemsInCart.numberOfElements,
            currentPage: itemsInCart.currentPage
        }));
    }

    const handleDishQuantityChange = (e, getIndex, cartItemId, dishId, focusStatus) => {
        e.preventDefault();

        setItemsInCart((itemsInCart) => ({
            ...itemsInCart,
            cartItemsArray: itemsInCart.cartItemsArray.map((item, index) => {
                if (index === getIndex) {
                    function changeQuantity() {
                        var newQuantity = undefined;
                        if (e.target.id !== "quantity-control-input") {
                            if (e.target.id === "quantity-control-plus") newQuantity = item.quantityInCart + 1;
                            else if (item.quantityInCart > 1) newQuantity = item.quantityInCart - 1;
                            else newQuantity = item.quantityInCart;
                        }
                        else {
                            newQuantity = e.target.value;
                            if (!focusStatus) {
                                newQuantity = newQuantity.replace(/\D/g, "");
                                newQuantity = newQuantity * 1;
                                if (newQuantity === 0) newQuantity = 1;
                            }
                        }

                        axios.put(`${apiEndpoint}/api/cart/update`, {
                            menuId: cartItemId,
                            dishId: dishId,
                            quantity: newQuantity
                        }).then(response => {
                            console.log("Server: "+response.data.serviceResponse)
                        }).catch(err => {
                            console.log("Server error status: "+err.response.status)
                            console.log("Error message: "+err.response.data.serviceResponse)
                        })

                        return newQuantity;
                    }
                    return {
                        cartItemId: item.cartItemId,
                        dishId: item.dishId,
                        dishName: item.dishName,
                        dishDescription: item.dishDescription,
                        quantityInCart: changeQuantity(),
                        username: item.username,
                        serviceResponse: item.serviceResponse,
                        changeQuantity: item.changeQuantity,
                        inputFocus: focusStatus ? true : false
                    }
                }
                else { return item }
            }),
            totalPages: itemsInCart.totalPages,
            totalElements: itemsInCart.totalElements,
            numberOfElements: itemsInCart.numberOfElements,
            currentPage: itemsInCart.currentPage
        }));


    }

    return (
        <div className="container">
            <h2>Jūsų krepšelio duomenys:</h2>
            <div>
                {
                    itemsInCart.totalElements === 0 && servMessage.current !== undefined ?
                        <h3>{servMessage.current}</h3>
                        :
                        <>
                            <p style={{ marginBottom: '0px', fontSize: '18px', fontWeight: '400' }}>Galite pašalinti patiekalus arba pakeisti jų kiekį krepšelyje.</p>
                            <p style={{ fontSize: '16px', fontWeight: '400' }}>Kad pakeistumėte krepšelio prekės kiekį, užveskite pelės žymeklį ant lentelės langelio.</p>
                            <Table striped bordered style={{ width: '80%' }}>
                                <thead>
                                    <tr>
                                        <th style={{ width: '5%', textAlign: 'center', verticalAlign: 'middle' }}>#</th>
                                        <th style={{ width: '30%', textAlign: 'center', verticalAlign: 'middle' }}>Pavadinimas</th>
                                        <th style={{ width: '45%', textAlign: 'center', verticalAlign: 'middle' }}>Apibūdinimas</th>
                                        <th style={{ width: '5%', textAlign: 'center', verticalAlign: 'middle' }}>Ištrinti</th>
                                        <th style={{ width: '15%', textAlign: 'center', verticalAlign: 'middle' }}>Keisti kiekį</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itemsInCart.cartItemsArray.length ?
                                        itemsInCart.cartItemsArray.map((item, index) => (
                                            <tr key={index}>
                                                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{(itemsInCart.currentPage - 1) * 10 + index + 1}</td>
                                                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{item.dishName}</td>
                                                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{item.dishDescription}</td>
                                                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                                    <button id='btnDeleteDish'
                                                        className='deleteDish'
                                                        onClick={(e) => {
                                                            setDeleteItemIndex(index);
                                                            handleDeleteCartDish(e, item.cartItemId)
                                                        }}
                                                    >
                                                        <FontAwesomeIcon icon={faXmark} />
                                                    </button>
                                                </td>
                                                <td style={{ padding: '5px', textAlign: 'center', verticalAlign: 'middle' }}
                                                    onMouseEnter={() => remapWithQuantityChange(index, true)}
                                                    onMouseLeave={() => remapWithQuantityChange(index, false)}
                                                >
                                                    {
                                                        item.changeQuantity ?
                                                            <>  <Button size="sm"
                                                                className="quantity-control minus"
                                                                variant="outline-secondary"
                                                                id="quantity-control-minus"
                                                                onClick={(e) => handleDishQuantityChange(e, index, item.cartItemId, item.dishId, false)}
                                                            >
                                                                -
                                                            </Button>
                                                                <input className="text-center"
                                                                    type="text"
                                                                    style={{ maxWidth: '62px', fontSize: '0.9rem' }}
                                                                    value={item.inputFocus ? item.quantityInCart : item.quantityInCart + " vnt."}
                                                                    id="quantity-control-input"
                                                                    onChange={(e) => handleDishQuantityChange(e, index, item.cartItemId, item.dishId, true)}
                                                                    onBlur={(e) => handleDishQuantityChange(e, index, item.cartItemId, item.dishId, false)} />
                                                                <Button size="sm"
                                                                    className="quantity-control plus"
                                                                    variant="outline-secondary"
                                                                    id="quantity-control-plus"
                                                                    onClick={(e) => handleDishQuantityChange(e, index, item.cartItemId, item.dishId, false)}
                                                                >
                                                                    +
                                                                </Button>
                                                            </>
                                                            :
                                                            <span>{item.quantityInCart}</span>
                                                    }
                                                </td>
                                            </tr>
                                        ))
                                        : null}
                                </tbody>
                            </Table>
                        </>
                }
            </div>
            {itemsInCart.totalPages > 1 && (
                <div className="d-flex justify-content-center">
                    <Pagination
                        currentPage={itemsInCart.currentPage}
                        pageSize={itemsInCart.pageSize}
                        itemsCount={itemsInCart.totalElements}
                        onPageChange={(e) => handlePageChange(e)}
                    />
                </div>
            )}
        </div>
    )

}

export default CartConatainer