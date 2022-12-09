import React, { useState } from 'react';
import AddNewCanteen from './AddNewCanteen';
import CanteensTable from './CanteensTable';
import '../../App.css';

const CanteenContainer = () => {

    const [canteensObj, setCanteensObj] = useState({
        canteensArray: [],
        pageSize: 10,
        currentPage: 1,
        totalPages: 0,
        totalElements: 0,
        numberOfElements: 0,
        deleteItemIndex: 0
    })

    return (
        <div className="container pt-3">
            <div className="row ">
                <div className="bg-light pb-3 col-12 col-sm-12 col-md-12 col-lg-3">
                    <AddNewCanteen canteensObj={canteensObj} setCanteensObj={setCanteensObj} />
                </div>
                <div className="col-12 col-sm-12 col-md-12 col-lg-9 pt-1">
                    <CanteensTable canteensObj={canteensObj} setCanteensObj={setCanteensObj} />
                </div>
            </div>
        </div>
    )
}

export default CanteenContainer;