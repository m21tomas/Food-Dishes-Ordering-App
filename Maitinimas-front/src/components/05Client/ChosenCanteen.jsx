import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";
import apiEndpoint from "../06Services/endpoint";
import defaultImage from "../../images/defaultImg.jpg";
import Table from 'react-bootstrap/Table';

function ChosenCanteen() {
    const params = useParams();
    const [canteen, setCanteen] = useState([]);

    useEffect(() => {
        axios.get(`${apiEndpoint}/api/istaigos/canteen/${params.id}`)
            .then(response => {
                setCanteen(response.data);
                //console.log(JSON.stringify(response.data))
            })
            .catch((err) => { console.log(JSON.stringify(err.response.data)) });
    }, [params.id])

    return (
        <>
            <div className="container">
                <h3>New Canteen {params.id}</h3>
                <div className="row">
                    <div className="wrapper wrHeight" style={{ height: '512px' }}>
                        <img src={canteen.image !== null ? `data:image/*;base64,${canteen.image}`
                            : defaultImage}
                            alt="Failed To Load" />
                    </div>
                </div>
                <div className="row">
                    <h3 style={{ textAlign: 'center', paddingTop: '16px' }}>{canteen.name}</h3>
                    <h5 style={{ textAlign: 'center', paddingTop: '8px', marginBottom: '24px' }}>{canteen.address}</h5>
                </div>
                <div className="row">
                    {
                        canteen.menus === undefined ? null :
                        canteen.menus.map((menusItem, index) => 
                            <React.Fragment key={index}>
                                <h4 key={index} style={{ textAlign: 'center', paddingTop: '16px' }}>{menusItem.name}</h4>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Name</th>
                                            <th>Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            menusItem.dishes.map((dish, index) =>
                                                <tr key={index}>
                                                    <td>{index+1}</td>
                                                    <td>{dish.name}</td>
                                                    <td>{dish.description}</td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </Table>
                            </React.Fragment>
                        )
                    }
                </div>
            </div>



        </>
    )
}

export default ChosenCanteen
