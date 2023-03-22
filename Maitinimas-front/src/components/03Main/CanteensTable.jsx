import React, { useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from "axios";
import AdminCanteenContext from "../06Services/AdminCanteenContext";
import Pagination from "../07CommonComponents/Pagination";
import apiEndpoint from "../06Services/endpoint";

function CanteensTable({canteensObj, setCanteensObj}) {

    const { setCanteenState } = React.useContext(AdminCanteenContext);

    useEffect(() => {
        let pageSize = canteensObj.pageSize;
        let page = canteensObj.currentPage - 1;

        if (page < 0) page = 0;

        var uri = `${apiEndpoint}/api/istaigos/allCenteensPage?page=${page}&size=${pageSize}`;

        axios.get(uri)
            .then((response) => {
                setCanteensObj((canteensObj) => ({
                    ...canteensObj,
                    canteensArray: response.data.content.map((canteen) => ({
                        id: canteen.id,
                        name: canteen.name,
                        address: canteen.address,
                        image: canteen.image,
                        //menu: canteen.menu.map((menuItem) => ({menuId: menuItem.id, menuName: menuItem.name}))
                        menus: canteen.menus
                    })),
                    totalPages: response.data.totalPages,
                    totalElements: response.data.totalElements,
                    numberOfElements: response.data.numberOfElements,
                    currentPage: response.data.number + 1,
                    deleteItemIndex: 0
                }));
               // console.log(response.data);
            })
            .catch((error) => { console.log(error.data) });
    }, [canteensObj.currentPage, canteensObj.deleteItemIndex, canteensObj.pageSize, canteensObj.totalElements, setCanteensObj])

    const handlePageChange = (page) => {
        setCanteensObj({ ...canteensObj, currentPage: page });
       // getCanteensData(page);
    };

    const handleDelete = (id) => {
        axios.delete(`${apiEndpoint}/api/istaigos/canteen/delete/${id}`)
            .then(() => {
                if(canteensObj.numberOfElements-1 === 0){
                    handlePageChange(canteensObj.currentPage-1)
                }
                else{setCanteensObj({ ...canteensObj, deleteItemIndex: id})}
                
            })
            .catch((error) => { console.log(error.data) });
    }

    const sendCanteenItem = (id) => {
        let menu = canteensObj.canteensArray.filter((canteen) => canteen.id === id);
        //alert("menu: " + menu.map(item => item.id))
        //console.log("canteensArray: " + JSON.stringify(menu))
        setCanteenState(menu);
      };

    return (
        <React.Fragment>
            <div>
                <h1>Maitinimo įstaigų sąrašas</h1>
            </div>
            <div className="table-responsive-md">
                <table className="table">
                    <thead>
                        <tr key='titlepav'>
                            <th scope="col">Įmonės kodas</th>
                            <th scope="col">Pavadinimas</th>
                            <th scope="col">Adresas</th>
                            <th scope="col">Meniu</th>
                            <th scope="col">Redaguoti</th>
                            <th scope="col">Ištrinti</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            canteensObj.canteensArray.map(item =>
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.address}</td>
                                    <td>{item.menus.length === 0 ?
                                        <p>No menus</p>
                                        :
                                        <p>{item.menus[0].name}</p>
                                        // item.menus.map((it, index) => <p key={it.id}>Index: {index}, Name: <b>{it.name}</b></p>)
                                        }
                                    </td> 
                                    <td>
                                    <Link
                                            className="text-decoration-none"
                                            onClick={() => sendCanteenItem(item.id)}
                                            to={`/addMenu/${item.id}`}
                                        >
                                            <button id="btnAddmenu" type='button'
                                             className="btn btn-outline-primary btn-sm btn-block">Redaguoti</button>
                                        </Link>
                                    </td>   
                                    <td>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            id="btnDeleteApplication"
                                            className="btn btn-outline-danger btn-sm btn-block"
                                        >
                                            Ištrinti
                                        </button>
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>

            {canteensObj.totalPages > 1 && (
                <div className="d-flex justify-content-center">
                    <Pagination
                        currentPage={canteensObj.currentPage}
                        pageSize={canteensObj.pageSize}
                        itemsCount={canteensObj.totalElements}
                        onPageChange={(e) => handlePageChange(e)}
                    />
                </div>
            )}
        </React.Fragment>


    );
}

export default CanteensTable