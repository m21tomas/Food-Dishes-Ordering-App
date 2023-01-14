import React, { useState, useEffect } from "react";
import Pagination from "../07CommonComponents/Pagination";
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import axios from "axios";
import apiEndpoint from "../06Services/endpoint";
import OrderReviewModal from "./OrderReviewModal";
import Select from 'react-select';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

function OrdersContainer() {

    const [orders, setOrders] = useState({
        ordersArray: [],
        pageSize: 10,
        currentPage: 1,
        totalPages: 0,
        totalElements: 0,
        numberOfElements: 0
    })
    const [deleteOrder, setDeleteOrder] = useState(0);

    const [selectedOption, setSelectedOption] = useState(null);
    const orderStatusOptions = [
        { value: 'APPROVED', label: 'Patvirtintas' },
        { value: 'SUBMIT', label: 'Pateiktas' },
        { value: 'WITHDRAWN', label: 'Atšauktas' },
    ];

    useEffect(() => {
        let page = orders.currentPage - 1;
        if (page < 0) page = 0;

        axios.get(`${apiEndpoint}/api/order/getPageOfAllOrders?page=${page}&size=${orders.pageSize}`)
            .then(response => {
                setOrders((orders) => ({
                    ...orders,
                    ordersArray: response.data.content.map(ordersItem => ({
                        id: ordersItem.id,
                        items: ordersItem.items,
                        orderName: ordersItem.orderName,
                        status: ordersItem.status,
                        editStatus: false,
                        submitedAt: ordersItem.submitedAt,
                        username: ordersItem.username
                    })),
                    totalPages: response.data.totalPages,
                    totalElements: response.data.totalElements,
                    numberOfElements: response.data.numberOfElements,
                    currentPage: response.data.number + 1
                }));
                //console.log(JSON.stringify(response.data));
            })
            .catch((err) => { console.log(JSON.stringify(err.response.data)) });
    }, [orders.currentPage, orders.pageSize, deleteOrder])

    const [orderReviewModal, setOrderReviewModal] = useState(false);
    const [orderReviewData, setOrderReviewData] = useState(0)


    const handleReviewModal = (item) => {
        setOrderReviewModal(true);
        setOrderReviewData(item);
    }

    const handleDeleteOrder = (e, id) => {
        e.preventDefault();

        axios.delete(`${apiEndpoint}/api/order/deleteOrder/${id}`)
            .then((response) => {
                if (response.status === 200) {
                    console.log(response.data);
                    setDeleteOrder(deleteOrder + 1);
                }

            })
            .catch((err) => {
                console.log(err.response.data)
            })
    }

    function handleChangeOrderStatus(getIndex) {
        const newArray = orders.ordersArray.map((ordersItem, index) => {
            if (getIndex === index) {
                return {
                    id: ordersItem.id,
                    items: ordersItem.items,
                    orderName: ordersItem.orderName,
                    status: ordersItem.status,
                    editStatus: true,
                    submitedAt: ordersItem.submitedAt,
                    username: ordersItem.username
                }
            }
            else { return ordersItem }
        })
        setOrders({ ...orders, ordersArray: newArray })
    }

    function setOrderStatus(e, orderId) {
        //e.preventDefault();

        axios.post(`${apiEndpoint}/api/order/confirmOrder/${orderId}/${e.value}`)
            .then((response) => {
                if (response.status === 200) {
                    console.log(response.data)
                    setDeleteOrder(deleteOrder + 1);
                }
            })
            .catch((error) => {
                console.error(error.response.data);
            })
        //console.log("e=",e) 
        // const newArray = orders.ordersArray.map((ordersItem, index) => {
        //     if (getIndex === index) {
        //         return {
        //             id: ordersItem.id,
        //             items: ordersItem.items,
        //             orderName: ordersItem.orderName,
        //             status: e.value,
        //             editStatus: false,
        //             submitedAt: ordersItem.submitedAt,
        //             username: ordersItem.username
        //         }
        //     }
        //     else { return ordersItem }
        // })
        // setOrders({...orders, ordersArray: newArray})

    }

    return (
        <div className="container">
            <div className="row">
                <h3>Visi užsakymai:</h3>
            </div>
            <div className="row">
                <Table striped>
                    <thead>
                        <tr>
                            <th className="adminOrdersReview" style={{ width: '5%' }}>#</th>
                            <th className="adminOrdersReview" style={{ width: '20%' }}>Vartotojas</th>
                            <th className="adminOrdersReview" style={{ width: '20%' }}>Užsakymo pavadinimas</th>
                            <th className="adminOrdersReview" style={{ width: '25%' }}>Pateikimo data</th>
                            <th className="adminOrdersReview" style={{ width: '15%' }}>Būsena</th>
                            <th className="adminOrdersReview" style={{ width: '8%' }}>Peržiūrėti</th>
                            <th className="adminOrdersReview" style={{ width: '7%' }}>Ištrinti</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            orders.ordersArray.length ?
                                orders.ordersArray.map((item, index) => (
                                    <tr key={index}>
                                        <td className="adminOrdersReview">{index + 1}</td>
                                        <td className="adminOrdersReview">{item.username}</td>
                                        <td className="adminOrdersReview">{item.orderName}</td>
                                        <td className="adminOrdersReview">{item.submitedAt.substring(0, item.submitedAt.indexOf("T")) + " - " +
                                            item.submitedAt.substring(item.submitedAt.indexOf("T") + 1, item.submitedAt.indexOf("."))}</td>
                                        <td className={item.status === "SUBMIT" ? "adminOrdersReview submit" :
                                            item.status === "APPROVED" ? "adminOrdersReview approved" :
                                                item.status === "WITHDRAWN" ? "adminOrdersReview withdrawn" :
                                                    "adminOrdersReview"
                                        }
                                        >
                                            {
                                                item.editStatus ?
                                                    <Select
                                                        defaultValue={orderStatusOptions.filter(order => order.value === item.status)}
                                                        onChange={(e) => { setOrderStatus(e, item.id) }}
                                                        options={orderStatusOptions}
                                                    />
                                                    :
                                                    <React.Fragment>
                                                        {
                                                            orderStatusOptions.filter(order => order.value === item.status)
                                                                .map(filteredOrder => (
                                                                    filteredOrder.label
                                                                ))
                                                        }
                                                        <span>&nbsp;&nbsp;</span>
                                                        <button id='btnEditOrders'
                                                            className='editEntityField'
                                                            onClick={() => handleChangeOrderStatus(index)}><FontAwesomeIcon icon={faPenToSquare} />
                                                        </button>
                                                    </React.Fragment>
                                            }
                                        </td>
                                        <td className="adminOrdersReview">
                                            <Button variant="outline-primary" onClick={() => handleReviewModal(item)}>
                                                Peržiūrėti
                                            </Button>
                                        </td>
                                        <td className="adminOrdersReview">
                                            <Button variant="outline-danger" onClick={(e) => handleDeleteOrder(e, item.id)}>
                                                Ištrinti
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                                : null
                        }
                    </tbody>
                </Table>
            </div>
            <OrderReviewModal orderReviewModal={orderReviewModal} setOrderReviewModal={setOrderReviewModal}
                orderReviewData={orderReviewData} />
        </div>
    );
}

export default OrdersContainer