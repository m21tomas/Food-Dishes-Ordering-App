import React, { useState, useEffect } from "react";
import AuthContext from "../06Services/AuthContext";
import Table from 'react-bootstrap/Table';
import axios from "axios";
import apiEndpoint from "../06Services/endpoint";
import Button from 'react-bootstrap/Button';
import OrderReviewModal from "../04Admin/OrderReviewModal";

const OrderContainer = () => {
    const { state } = React.useContext(AuthContext);

    const [ordersData, setOrdersData] = useState(0);

    useEffect(() => {
        axios.get(`${apiEndpoint}/api/order/getUserOrder`)
            .then((response) => {
                if (response.status === 200) {
                    setOrdersData(response.data)
                    console.log("user: " + state.username);
                    console.log("Number of orders: " + response.data.length)
                    console.log(JSON.stringify(response.data))
                }
            })
            .catch((err) => {
                console.log(err.response.data)
            });
    }, [state.username])

    const [orderReviewModal, setOrderReviewModal] = useState(false);
    const [orderReviewData, setOrderReviewData] = useState(0)

    const handleReviewModal = (item) => {
        setOrderReviewModal(true);
        setOrderReviewData(item);
    }

    return (
        <div className="container">
            <div className="row">
                <h3>Užsakymai:</h3>
            </div>
            <div className="row">
                <Table striped bordered style={{ width: '50%' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '5%', textAlign: 'center', verticalAlign: 'middle' }}>#</th>
                            <th style={{ width: '30%', textAlign: 'center', verticalAlign: 'middle' }}>Pavadinimas</th>
                            <th style={{ width: '35%', textAlign: 'center', verticalAlign: 'middle' }}>Data</th>
                            <th style={{ width: '15%', textAlign: 'center', verticalAlign: 'middle' }}>Peržiūrėti</th>
                            <th style={{ width: '15%', textAlign: 'center', verticalAlign: 'middle' }}>Būsena</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ordersData.length ?
                            ordersData.map((item, index) => (
                                <tr key={index}>
                                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{index + 1}</td>
                                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{item.orderName}</td>
                                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{item.submitedAt.substring(0, item.submitedAt.indexOf("T")) + " - " +
                                        item.submitedAt.substring(item.submitedAt.indexOf("T") + 1, item.submitedAt.indexOf("."))}</td>
                                    <td style={{ paddingTop: '0px', paddingBottom: '0px', textAlign: 'center', verticalAlign: 'middle' }}>
                                    <Button style={{padding: '0px 3px',height: '30px'}} variant="outline-primary" onClick={() => handleReviewModal(item)}>
                                                Peržiūrėti
                                    </Button>
                                    </td>
                                    <td className={item.status === "SUBMIT" ? "justOrder orderSubmitted" :
                                        item.status === "APPROVED" ? "justOrder orderApproved" :
                                            item.status === "WITHDRAWN" ? "justOrder orderRejected" :
                                                "justOrder"}>
                                        {item.status === "SUBMIT" ? <span>Pateiktas</span> :
                                            item.status === "APPROVED" ? <span>Patvirtintas</span> :
                                                item.status === "WITHDRAWN" ? <span>Atšauktas</span> :
                                                    <span>default</span>}
                                    </td>
                                </tr>
                            ))
                            : null}
                    </tbody>
                </Table>
            </div>
            <OrderReviewModal orderReviewModal={orderReviewModal} setOrderReviewModal={setOrderReviewModal}
                orderReviewData={orderReviewData} />
        </div>
    );
}

export default OrderContainer