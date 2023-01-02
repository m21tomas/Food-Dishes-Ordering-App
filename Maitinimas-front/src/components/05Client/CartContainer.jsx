import { useState, useEffect, useRef } from "react";
import axios from "axios";
import apiEndpoint from "../06Services/endpoint";
import Table from 'react-bootstrap/Table';
import Pagination from "../07CommonComponents/Pagination";

const CartConatainer = () => {

    const [itemsInCart, setItemsInCart] = useState({
        cartItemsArray: [],
        pageSize: 10,
        currentPage: 1,
        totalPages: 0,
        totalElements: 0,
        numberOfElements: 0,
        deleteItemIndex: 0
    })
    let servMessage = useRef();

    useEffect(() => {
        let pageSize = itemsInCart.pageSize;
        let page = itemsInCart.currentPage - 1;

        if (page < 0) page = 0;

        axios.get(`${apiEndpoint}/api/cart/allCartItemsPage?page=${page}&size=${pageSize}`)
            .then((response) => {
                setItemsInCart((itemsInCart) => ({
                    ...itemsInCart,
                    cartItemsArray: response.data.content,
                    totalPages: response.data.totalPages,
                    totalElements: response.data.totalElements,
                    numberOfElements: response.data.numberOfElements,
                    currentPage: response.data.number + 1,
                    deleteItemIndex: 0
                }));
                console.log(JSON.stringify(response.data));
                console.log("Items in cart: " + response.data.content.length)
            })
            .catch((error) => {
                console.log(error.data)
                setItemsInCart((itemsInCart) => ({
                    ...itemsInCart,
                    cartItemsArray: error.response.data.content,
                    totalPages: error.response.data.totalPages,
                    totalElements: error.response.data.totalElements,
                    numberOfElements: error.response.data.numberOfElements,
                    currentPage: error.response.data.number + 1,
                    deleteItemIndex: 0
                }));
                if (error.response.data.context === null ||
                    error.response.data.context === undefined)
                    servMessage.current = "You don't have any dishes in your account."
            });
    }, [itemsInCart.currentPage, itemsInCart.deleteItemIndex, itemsInCart.pageSize])

    //     axios.get(`${apiEndpoint}/api/cart/allCartItemsPage?page=${page}&size=${pageSize}`)
    //         .then(response => {
    //             console.log(JSON.stringify(response.data));
    //             console.log("Items in cart: " + response.data.content.length)
    //             setItemsInCart(response.data.content);
    //         })
    //         .catch(error => {
    //             setItemsInCart(error.response.data.context);
    //             if(error.response.data.context === null ||
    //                 error.response.data.context === undefined )
    //             servMessage.current = "You don't have any dishes in your account."
    //         });
    // }, [itemsInCart.currentPage, itemsInCart.pageSize])

    const handlePageChange = (page) => {
        setItemsInCart({ ...itemsInCart, currentPage: page });
    };

    return (
        <div className="container">
            <h2>Jūsų krepšelio duomenys:</h2>
            <p style={{ fontSize: '18px', fontWeight: '400' }}>Galite pašalinti patiekalus arba pakeisti jų kiekį krepšelyje.</p>
            <div>
                {
                    itemsInCart.cartItemsArray.length === 1 && servMessage.current !== undefined ?
                        <h3>{servMessage.current}</h3>
                        :
                        <Table striped bordered style={{ width: '80%' }} >
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
                                {
                                    itemsInCart.cartItemsArray.length ?
                                        itemsInCart.cartItemsArray.map((item, index) => (
                                            <tr key={index}>
                                                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{(itemsInCart.currentPage-1)*10 +index + 1}</td>
                                                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{item.dishName}</td>
                                                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{item.dishDescription}</td>
                                                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>X</td>
                                                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{item.quantityInCart}</td>
                                            </tr>
                                        ))
                                        : null
                                }
                            </tbody>
                        </Table>
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