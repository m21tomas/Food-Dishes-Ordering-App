import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import apiEndpoint from "../06Services/endpoint";
import Pagination from "../07CommonComponents/Pagination";
import defaultImage from "../../images/defaultImg.jpg";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';

const UserHomeContainer = () => {

    const history = useHistory();

    const [canteens, setCanteens] = useState({
        canteenWithAnImage: [],
        pageSize: 12,
        currentPage: 1,
        totalPages: 0,
        totalElements: 0,
        numberOfElements: 0
    })
    const canteenSearchRef = useRef();

    const emptyList = useRef(false);

    useEffect(() => {
        let page = canteens.currentPage - 1;
        if (page < 0) page = 0;

        axios.get(`${apiEndpoint}/api/istaigos/allCenteensPage?page=${page}&size=${canteens.pageSize}`)
            .then(response => {
                setCanteens((canteens) => ({
                    ...canteens,
                    canteenWithAnImage: response.data.content,
                    totalPages: response.data.totalPages,
                    totalElements: response.data.totalElements,
                    numberOfElements: response.data.numberOfElements,
                    currentPage: response.data.number + 1
                }));
                response.data.content.length === 0 ? emptyList.current = true : emptyList.current = false;
                //console.log(JSON.stringify(response.data));
            })
            .catch((err) => { console.log(JSON.stringify(err.response.data)) });
    }, [canteens.currentPage, canteens.pageSize])

    function handleWidthOverHeight (image) {
        var base64string = `data:image/*;base64,${image}`;
        var img = document.createElement("img");
        img.setAttribute("src", base64string);

        return img.width / img.height >= 1
    }

    const handlePageChange = (page) => {
        setCanteens({
            ...canteens,
            currentPage: page
        });
    };

    const [searchOption, setSearchOption] = useState('name');
    const [closeSearchBtn, setCloseSearchBtn] = useState(false);
    const handleSearchOption = (e) => {
        setSearchOption(e.target.value);
    }

    function handleSearch(e) {
        e.preventDefault()
        //alert(searchOption + ' ' + canteenSearchRef.current.value)

        if (searchOption === "name" && canteenSearchRef.current.value.length !== 0) {
            let name = canteenSearchRef.current.value;
            let page = canteens.currentPage - 1;
            if (page < 0) page = 0;
            setCloseSearchBtn(true);
            axios.get(`${apiEndpoint}/api/istaigos/canteen/name/page/${name}?page=${page}&size=${canteens.pageSize}`)
                .then(response => {
                    setCanteens((canteens) => ({
                        ...canteens,
                        canteenWithAnImage: response.data.content,
                        totalPages: response.data.totalPages,
                        totalElements: response.data.totalElements,
                        numberOfElements: response.data.numberOfElements,
                        currentPage: response.data.number + 1,
                    }));
                    //console.log(JSON.stringify(response.data));
                })
                .catch((err) => { console.log(JSON.stringify(err.response.data)) });
        }
        else if (searchOption === "address"  && canteenSearchRef.current.value.length !== 0) {
            let address = canteenSearchRef.current.value;
            let page = canteens.currentPage - 1;
            if (page < 0) page = 0;
            setCloseSearchBtn(true);
            axios.get(`${apiEndpoint}/api/istaigos/canteen/address/page/${address}?page=${page}&size=${canteens.pageSize}`)
                .then(response => {
                    setCanteens((canteens) => ({
                        ...canteens,
                        canteenWithAnImage: response.data.content,
                        totalPages: response.data.totalPages,
                        totalElements: response.data.totalElements,
                        numberOfElements: response.data.numberOfElements,
                        currentPage: response.data.number + 1,
                    }));
                    //console.log(JSON.stringify(response.data));
                })
                .catch((err) => { console.log(JSON.stringify(err.response.data)) });
        }
        else {
            setCloseSearchBtn(false);
            setCanteens({
                ...canteens,
                currentPage: 0
            })
        }
    }

    function handleCloseSearch (e){
        e.preventDefault();
        canteenSearchRef.current.value = "";
        setCloseSearchBtn(false);
        setCanteens({
            ...canteens,
            currentPage: 0
        })
    }

    function handleCanteenButtonClick (e, id){
        e.preventDefault();
        history.push(`/canteen/${id}`);
    }

    // function handleImageInfo () {
    // //     <img ref={this.imgRef} src=
    // //    'https://media.geeksforgeeks.org/wp-content/uploads/20200617121258/gfg-image2-300x177.png' alt='gfg' />
    //     let width = {imgRef.current.clientWidth};
    //     let height = {imgRef.current.clientHeight};
        
    // }

    return (
        <React.Fragment>
            <div className="container">
                <div className="row">
                    <div className="py-3 col-12 col-sm-12 col-md-12 col-lg-12">
                        <h2>Maitinimo įstaigų sąrašas:</h2>
                        <div className="row" style={{ paddingLeft: '12px' }}>
                            <Form.Control
                                type="search"
                                placeholder={searchOption === "name" ? "Įvesti pavadinimą" : "Įvesti adresą"}
                                ref={canteenSearchRef}
                                className="form-control me-2"
                                aria-label="Search"
                                style={{ width: '500px' }}
                            />
                            <Button onClick={(e) => handleSearch(e)} variant="outline-success" style={{ width: '70px'}}>Search</Button>
                            { closeSearchBtn ? <Button onClick={(e) => handleCloseSearch(e)} variant="outline-dark" style={{ padding: '0px', width: '110px', marginLeft: '8px' }}> Close Search</Button> : <></>}
                        </div>

                        <Table style={{ width: '340px' }}>
                            <tbody>
                                <tr>
                                    <td style={{ width: '130px', padding: '0px', textAlign: 'right', border: 'none' }}>
                                        <p>Paieškos kriterijus: </p>
                                    </td>
                                    <td style={{ width: '210px', padding: '0px', textAlign: 'left', border: 'none' }}>
                                        <input style={{ marginLeft: '11px', verticalAlign: '-5%' }} type="radio" value="name" name="searchOption" id="name"
                                            onChange={(e) => handleSearchOption(e)} checked={searchOption === "name" ? true : false} />
                                        <label style={{ marginLeft: '3px' }} htmlFor="name">Pavadinimas</label>
                                        <input style={{ marginLeft: '11px', verticalAlign: '-5%' }} type="radio" value="address" name="searchOption" id="address"
                                            onChange={(e) => handleSearchOption(e)} />
                                        <label style={{ marginLeft: '3px' }} htmlFor="address">Adresas</label>
                                    </td>
                                </tr>
                            </tbody>
                        </Table>

                        <div className="row">


                            {
                                canteens.canteenWithAnImage.length === 0 ? emptyList.current ? <h3>Empty</h3>
                                    :<h3>Loading cards...</h3> 
                                    :
                                    canteens.canteenWithAnImage.map(item =>
                                        <div key={item.id} className="flex col-lg-3 col-md-6 pt-3">
                                            <div className='text-center' style={{ border: "2px solid black"}}>
                                                <div className={ handleWidthOverHeight(item.image) ? "wrapper wrWidth" : "wrapper wrHeight"}>
                                                    <img src={item.image !== null ? `data:image/*;base64,${item.image}`
                                                        : defaultImage}
                                                        className="card-img-top"
                                                        alt="Failed To Load">
                                                    </img>
                                                </div>

                                                <div className="card-body" style={{ backgroundColor: '#eeeeee' }}>
                                                    <h5 className="card-title text-align-center">{item.name}</h5>
                                                    <p className="card-text text-align-center" style={{ marginBottom: '8px' }} >{item.address}</p>
                                                    {/* <p className="card-text text-align-center">{item.menus.length} meniu</p> */}
                                                    <Button variant="primary" onClick={(e) => handleCanteenButtonClick(e, item.id)} >Peržiūrėti</Button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                            }

                        </div>
                        {canteens.totalPages > 1 && (
                            <div className="d-flex justify-content-center py-3">
                                <Pagination
                                    itemClass="page-item"
                                    linkClass="page-link"
                                    currentPage={canteens.currentPage}
                                    pageSize={canteens.pageSize}
                                    itemsCount={canteens.totalElements}
                                    pageRangeDisplayed={15}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        )}
                    </div>

                </div>

            </div>
        </React.Fragment>

    );
}

export default UserHomeContainer