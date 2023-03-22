import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import AdminCanteenContext from "../06Services/AdminCanteenContext";
//import EditDishes from './ChangeMenuNameOrDeleteIt';
import apiEndpoint from "../06Services/endpoint";
import EditMenu from './AddNewMenuAndListIt';
import validateField from '../07CommonComponents/ValidateCanteenFields';
import axios from 'axios';
import CanteenViewByAdminForUser from './CanteenViewByAdminForUser';
import NewDishes from './NewDishes';

const AdminAddMenu = () => {
    const { canteenState } = React.useContext(AdminCanteenContext);
    // const { setCanteenState } = React.useContext(AdminCanteenContext);
    // const history = useHistory();
    const [chosenMenuId, setChosenMenuId] = useState(null);
    const [canteensList, setCanteensList] = useState([]);
    const history = useHistory();

    const [canteenFullData, setCanteenFullData] = useState({
        id: '',
        name: '',
        address: '',
        image: '',
        menus: [],
        menuName: ''
    })

    const [editButton, setEditButton] = useState({
        editId: false,
        editName: false,
        editAddress: false,
        editMenu: false
    })

    const [editCanteenData, setEditCanteenData] = useState({
        editId: '',
        editName: '',
        editAddress: '',
        editImage: '',
        editFile: ''
    })

    const [menuData, setMenuData] = useState({
        menuName: '',
        editMenuName: '',
        dishName: '',
        description: '',
    });

    const [infoValid, setInfoValid] = useState({
        menuName: true,
        editMenuName: true,
        editId: true,
        editName: true,
        editAddress: true,
        editImage: true,
        dishName: true,
        description: true,
    });

    const handleChange = (event) => {
        validateField(event, infoValid, setInfoValid);
        setMenuData({
            ...menuData,
            [event.target.name]: event.target.value,
        });
    };

    const handleEditCanteenChange = (event) => {
        validateField(event, infoValid, setInfoValid);
        setEditCanteenData({
            ...editCanteenData,
            [event.target.name]: event.target.value,
        });
    };

    useEffect(() => {
        // console.log("The faPenToSquare is: \n", faPenToSquare)
        console.log("useEffect context canteenState output: ", canteenState)
        canteenState.map(item =>
            setCanteenFullData(canteenFullData => ({
                ...canteenFullData,
                id: item.id,
                name: item.name,
                address: item.address,
                image: item.image,
                menus: item.menus,
                menuName: item.menus.length !== 0 ? item.menus[0].name : null
            }))
        )
        getAllEntities()
    }, [canteenState])

    function getAllEntities() {
        axios.get(`${apiEndpoint}/api/istaigos/allCenteens`)
            .then(response => {
                console.log("GET ALL CANTEENS STATUS: ", response.status);
                console.log("GET ALL CANTEENS DATA: \n", response.data);
                setCanteensList(response.data);
            })
            .catch(err => {
                console.error(err.response.data);
            });
    }

    function checkAllFields() {
        let allOk = false;
        if (
            menuData.menuName.length > 0 && infoValid.menuName
        ) {
            allOk = true;
        }
        return allOk;
    }

    const [buttonChangeColorOnMenuSend, setButtonChangeColorOnMenuSend] = useState(0);

    const handleMenuSubmit = (event) => {
        event.preventDefault();
        // let id = null;
        // canteenState.map(item => id = item.id);
        let data = {
            canteenId: canteenFullData.id,
            name: menuData.menuName
        }
        //console.log("Menu Submit json canteen id: %d", data.canteenId)
        axios.post(`${apiEndpoint}/api/menu/new`, data)
            .then(response => {
                setButtonChangeColorOnMenuSend(response.status);
                setButtonMenuSendColorBack(100, 190, response.status);
                if (response.status === 201) {
                    console.log(response.data)
                    getCanteenEntity(data.canteenId);
                }
            })
            .catch(err => {
                setButtonChangeColorOnMenuSend(err.request.status);
                setButtonMenuSendColorBack(100, 190, err.request.status);
                console.error(err.response.data);
            });
    }

    function setButtonMenuSendColorBack(min, max, status) {
        min = Math.ceil(min);
        max = Math.floor(max);
        let waitTime = Math.floor(Math.random() * (max - min + 1)) + min;
        setTimeout(() => {
            setButtonChangeColorOnMenuSend(0);
            if (status === 201) { setMenuData({ ...menuData, menuName: '' }) }
        }
            , waitTime);
    }

    const getCanteenEntity = async (id) => {
        console.log("Starting getCanteenEntity with id: ", id)

        try {
            const request = await axios.get(`${apiEndpoint}/api/istaigos/canteen/${id}`);

            const data = request.data;

            console.log("response.data: ", data)

            setCanteenFullData({
                ...canteenFullData,
                id: data.id,
                name: data.name,
                address: data.address,
                image: data.image,
                menus: data.menus,
                menuName: data.menus.length !== 0 ? data.menus[0].name : "-"
            })

            const newArray = canteensList.map(item => {
                if (item.id === id) {
                    return data;
                } else {
                    return item;
                }
            })
            setCanteensList(newArray);
        }

        catch (error) {
            console.error(error);
        }
    }

    function handleDeleteCanteenMenu(event, canteenId, menuId) {
        event.preventDefault();
        axios.delete(`${apiEndpoint}/api/menu/delete/${canteenId}/${menuId}`)
            .then(response => {
                if (response.status === 200) {
                    console.log(response.data);
                    getCanteenEntity(canteenFullData.id);
                    setChosenMenuId(null);
                }
            })
            .catch(err => {
                console.error(err.response.data)
            });
    }

    const [canteenDataEditButtonColorReset, setCanteenDataEditButtonColorReset] = useState(0);

    function handleSendEditedCanteenData(e, object) {
        e.preventDefault();
        //alert(edited);
        let id = canteenFullData.id;
        axios.put(`${apiEndpoint}/api/istaigos/canteen/update/${id}`, object)
            .then(response => {
                setCanteenDataEditButtonColorReset(response.status);
                canteenEditButtonColorResetTime(150, 240, response.status)
                if (response.status === 200) {
                    console.log("Response message: ", response.data);
                    if (object.id !== null) { id = object.id };
                    getCanteenEntity(id);
                }
            })
            .catch(err => {
                setCanteenDataEditButtonColorReset(err.request.status);
                canteenEditButtonColorResetTime(150, 240, err.request.status)
                console.error(err.response.data);
            });
    }

    function canteenEditButtonColorResetTime(min, max, status) {
        min = Math.ceil(min);
        max = Math.floor(max);
        let waitTime = Math.floor(Math.random() * (max - min + 1)) + min;
        setTimeout(() => {
            setCanteenDataEditButtonColorReset(0);
            if (status === 200) {
                setEditButton({
                    ...editButton,
                    editId: false,
                    editName: false,
                    editAddress: false,
                    editMenu: false
                })
            }
        }
            , waitTime);
    }

    function editWhat() {
        if (editButton.editId === true) {
            return <div><h4>Editing ID...</h4></div>
        } else if (editButton.editName === true) {
            return <div><h4>Editing name...</h4></div>
        } else if (editButton.editAddress === true) {
            return <div><h4>Editing address...</h4></div>
        } else if (editButton.editMenu === true) {
            return <EditMenu fullData={canteenFullData}
                getCanteenEntity={getCanteenEntity}
                chosenId={chosenMenuId}
                editButton={editButton}
                menuData={menuData}
                setMenuData={setMenuData}
                handleChange={handleChange}
                handleMenuSubmit={handleMenuSubmit}
                infoValid={infoValid}
                validateField={validateField}
                checkAllFields={checkAllFields}
                setChosenMenuId={setChosenMenuId}
                buttonChangeColorOnMenuSend={buttonChangeColorOnMenuSend}
                handleDeleteCanteenMenu={handleDeleteCanteenMenu}
            />
        }
        else {
            return <div><h4>Nothing</h4></div>
        }
    }

    function handleChangeCanteen(event) {
        setChosenMenuId(null);
        setEditButton({
            ...editButton,
            editId: false,
            editName: false,
            editAddress: false,
            editMenu: false
        })
        canteensList.filter((canteen) => canteen.id === event.target.value * 1).map(item => {
            setCanteenFullData({
                ...canteenFullData,
                id: item.id,
                name: item.name,
                address: item.address,
                image: item.image,
                menus: item.menus,
                menuName: item.menus.length !== 0 ? item.menus[0].name : null
            })
            return null;
        })
    }

    function printCurrentMenuValue() {
        let menuName = undefined;
        canteenFullData.menus.filter(item => item.id === chosenMenuId).map(item => menuName = item.name);
        return menuName;
    }

    return (
        <div className="container pt-4">
            <div className="row">
                <div className="col-sm-9 col-md-6 col-lg-9">
                    <div className='row'>
                        <h3 className='cant-drop'>Redaguoti maitinimo įstaigą:</h3>
                        <select value={canteenFullData.id} onChange={(e) => handleChangeCanteen(e)}
                            name="canteens_dropdown" className='cant-drop drplist'>
                            {
                                // TypeError: o.map is not a function
                                // at py (AdminAddMenu.jsx:320:77)
                                canteensList.size > 0 ? null : canteensList.map(item =>
                                    <option key={item.id} value={item.id}>{item.name}</option>
                                )
                                
                            }
                        </select>
                        <button className="editDishBack" onClick={() => history.push("/canteen")}>Atgal</button>
                    </div>
                    {/* <table>
                        <tbody>
                            <tr>
                                <td style={{ width: '388.83px' }}>
                                    <h3 className='cant-drop'>Redaguoti maitinimo įstaigą:</h3>
                                </td>
                                <td style={{ width: '220px', verticalAlign: 'top'}}>
                                    <select value={canteenFullData.id} onChange={(e) => handleChangeCanteen(e)}
                                        name="canteens_dropdown" className='cant-drop drplist'>
                                        {
                                            canteensList.map(item =>
                                                <option key={item.id} value={item.id}>{item.name}</option>
                                            )
                                        }
                                    </select>
                                </td>
                                <td style={{ width: '246.17px', float: 'right'}}>
                                    <button className="editDishBack" onClick={() => history.push("/canteen")}>Atgal</button>
                                </td>
                            </tr>
                        </tbody>
                    </table> */}

                    <table className="table">
                        <thead>
                            <tr style={{ height: '30px' }}>
                                <th style={{ width: '25%' }}>Įmonės kodas<span>&nbsp;</span> {editButton.editId ?
                                    <button id='btnEditId'
                                        className='editEntityFieldActivated'
                                        onClick={() => setEditButton({
                                            ...editButton,
                                            editId: false,
                                            editName: false,
                                            editAddress: false,
                                            editMenu: false
                                        })}><FontAwesomeIcon icon={faPenToSquare} /></button>
                                    :
                                    <button id='btnEditId'
                                        className='editEntityField'
                                        onClick={() => {
                                            setEditButton({
                                                ...editButton,
                                                editId: true,
                                                editName: false,
                                                editAddress: false,
                                                editMenu: false
                                            });
                                            setEditCanteenData({ ...editCanteenData, editId: canteenFullData.id })
                                            setInfoValid({ ...infoValid, editId: true })
                                        }}><FontAwesomeIcon icon={faPenToSquare} /></button>
                                }

                                </th>
                                <th style={{ width: '25%' }}>Pavadinimas<span>&nbsp;</span> {editButton.editName ?
                                    <button id='btnEditName'
                                        className='editEntityFieldActivated'
                                        onClick={() => setEditButton({
                                            ...editButton,
                                            editId: false,
                                            editName: false,
                                            editAddress: false,
                                            editMenu: false
                                        })}><FontAwesomeIcon icon={faPenToSquare} /></button>
                                    :
                                    <button id='btnEditName'
                                        className='editEntityField'
                                        onClick={() => {
                                            setEditButton({
                                                ...editButton,
                                                editId: false,
                                                editName: true,
                                                editAddress: false,
                                                editMenu: false
                                            });
                                            setEditCanteenData({ ...editCanteenData, editName: canteenFullData.name })
                                            setInfoValid({ ...infoValid, editName: true })
                                        }}><FontAwesomeIcon icon={faPenToSquare} /></button>
                                }

                                </th>
                                <th style={{ width: '25%' }}>Adresas<span>&nbsp;</span> {editButton.editAddress ?
                                    <button id='btnEditAddress'
                                        className='editEntityFieldActivated'
                                        onClick={() => setEditButton({
                                            ...editButton,
                                            editId: false,
                                            editName: false,
                                            editAddress: false,
                                            editMenu: false
                                        })}><FontAwesomeIcon icon={faPenToSquare} /></button>
                                    :
                                    <button id='btnEditAddress'
                                        className='editEntityField'
                                        onClick={() => {
                                            setEditButton({
                                                ...editButton,
                                                editId: false,
                                                editName: false,
                                                editAddress: true,
                                                editMenu: false
                                            });
                                            setEditCanteenData({ ...editCanteenData, editAddress: canteenFullData.address })
                                            setInfoValid({ ...infoValid, editAddress: true })
                                        }}><FontAwesomeIcon icon={faPenToSquare} /></button>
                                }

                                </th>
                                <th style={{ width: '25%' }}>Meniu<span>&nbsp;</span> {editButton.editMenu ?
                                    <button id='btnEditMenu'
                                        className='editEntityFieldActivated'
                                        onClick={() => setEditButton({
                                            ...editButton,
                                            editId: false,
                                            editName: false,
                                            editAddress: false,
                                            editMenu: false
                                        })}><FontAwesomeIcon icon={faPenToSquare} /></button>
                                    :
                                    <button id='btnEditMenu'
                                        className='editEntityField'
                                        onClick={() => setEditButton({
                                            ...editButton,
                                            editId: false,
                                            editName: false,
                                            editAddress: false,
                                            editMenu: true
                                        })}><FontAwesomeIcon icon={faPenToSquare} /></button>
                                }
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                <tr>
                                    <td>
                                        {
                                            editButton.editId ?
                                                <> <input
                                                    type="text"
                                                    className="canteenEditField"
                                                    name="editId"
                                                    id="id_editId"
                                                    value={editCanteenData.editId}
                                                    onChange={handleEditCanteenChange}
                                                    onInvalid={validateField}
                                                    style={
                                                        editCanteenData.editId.length > 0 ? infoValid.editId ? { border: "1px solid lightgray" }
                                                            : { border: "2px solid red" }
                                                            : { border: "1px solid lightgray" }
                                                    }
                                                    required
                                                    pattern="^\d{9}$"
                                                    maxLength={9}
                                                    data-toggle="tooltip"
                                                    data-placement="top"
                                                    title="Įveskite įstaigos kodą"
                                                    data-for='editId'
                                                    data-tip='tooltip'
                                                />
                                                    <button
                                                        className={
                                                            editCanteenData.editId !== '' ? canteenDataEditButtonColorReset === 0 ? infoValid.editId ?
                                                                "editEnterData" :
                                                                "editEnterData FalseData" :
                                                                canteenDataEditButtonColorReset === 200 ? "editEnterData borderGreen" :
                                                                    "editEnterData borderRed" :
                                                                "editEnterData"
                                                        }
                                                        onClick={(e) => {
                                                            console.log("editId: ", editCanteenData.editId, ", length: ", editCanteenData.editId.length)
                                                            if (infoValid.editId) {
                                                                const object = {
                                                                    id: editCanteenData.editId,
                                                                    name: null,
                                                                    address: null
                                                                }
                                                                handleSendEditedCanteenData(e, object)
                                                            } else {
                                                                setEditCanteenData({ ...editCanteenData, editId: '' })
                                                            }
                                                        }}
                                                        id="btnEditMenuEnter1"
                                                        disabled={editCanteenData.editId.length === 0}
                                                    >
                                                        {
                                                            editCanteenData.editId.length > 0 ?
                                                                infoValid.editId ? <FontAwesomeIcon icon={faCheck} /> :
                                                                    <FontAwesomeIcon icon={faXmark} /> :
                                                                <FontAwesomeIcon icon={faCheck} />
                                                        }
                                                    </button>
                                                </>
                                                :
                                                canteenFullData.id
                                        }
                                    </td>
                                    <td>
                                        {
                                            editButton.editName ?
                                                <> <input
                                                    type="text"
                                                    className="canteenEditField"
                                                    name="editName"
                                                    id="id_editName"
                                                    value={editCanteenData.editName}
                                                    onChange={handleEditCanteenChange}
                                                    onInvalid={validateField}
                                                    style={
                                                        editCanteenData.editName.length > 0 ? infoValid.editName ? { border: "1px solid lightgray" }
                                                            : { border: "2px solid red" }
                                                            : { border: "1px solid lightgray" }
                                                    }
                                                    required
                                                    pattern="^[A-ZĄ-Ž]{1}[\S\s]{1,}$"
                                                    // maxLength={64}
                                                    data-toggle="tooltip"
                                                    data-placement="top"
                                                    title="Įveskite pavadinimą"
                                                    data-for='editName'
                                                    data-tip='tooltip'
                                                />
                                                    <button
                                                        className={
                                                            editCanteenData.editName.length > 0 ? canteenDataEditButtonColorReset === 0 ? infoValid.editName ?
                                                                "editEnterData" :
                                                                "editEnterData FalseData" :
                                                                canteenDataEditButtonColorReset === 200 ? "editEnterData borderGreen" :
                                                                    "editEnterData borderRed" :
                                                                "editEnterData"
                                                        }
                                                        onClick={(e) => {
                                                            if (infoValid.editName) {
                                                                const object = {
                                                                    id: null,
                                                                    name: editCanteenData.editName,
                                                                    address: null
                                                                }
                                                                handleSendEditedCanteenData(e, object)
                                                            } else {
                                                                setEditCanteenData({ ...editCanteenData, editName: '' })
                                                            }
                                                        }}
                                                        id="btnEditMenuEnter2"
                                                        disabled={editCanteenData.editName.length === 0}
                                                    >
                                                        {
                                                            editCanteenData.editName.length > 0 ?
                                                                infoValid.editName ? <FontAwesomeIcon icon={faCheck} /> :
                                                                    <FontAwesomeIcon icon={faXmark} /> :
                                                                <FontAwesomeIcon icon={faCheck} />
                                                        }
                                                    </button>
                                                </>
                                                :
                                                canteenFullData.name
                                        }
                                    </td>
                                    <td>
                                        {
                                            editButton.editAddress ?
                                                <> <input
                                                    type="text"
                                                    className="canteenEditField"
                                                    name="editAddress"
                                                    id="id_editAddress"
                                                    value={editCanteenData.editAddress}
                                                    onChange={handleEditCanteenChange}
                                                    onInvalid={validateField}
                                                    style={
                                                        editCanteenData.editAddress.length > 0 ? infoValid.editAddress ? { border: "1px solid lightgray" }
                                                            : { border: "2px solid red" }
                                                            : { border: "1px solid lightgray" }
                                                    }
                                                    required
                                                    pattern="^[A-ZĄ-Ž]{1}[\S\s]{1,64}$"
                                                    maxLength={64}
                                                    data-toggle="tooltip"
                                                    data-placement="top"
                                                    title="Įveskite adresą"
                                                    data-for='editAddress'
                                                    data-tip='tooltip'
                                                />
                                                    <button
                                                        className={
                                                            editCanteenData.editAddress.length > 0 ? canteenDataEditButtonColorReset === 0 ? infoValid.editAddress ?
                                                                "editEnterData" :
                                                                "editEnterData FalseData" :
                                                                canteenDataEditButtonColorReset === 200 ? "editEnterData borderGreen" :
                                                                    "editEnterData borderRed" :
                                                                "editEnterData"
                                                        }
                                                        onClick={(e) => {
                                                            if (infoValid.editAddress) {
                                                                const object = {
                                                                    id: null,
                                                                    name: null,
                                                                    address: editCanteenData.editAddress
                                                                }
                                                                handleSendEditedCanteenData(e, object)
                                                            } else {
                                                                setEditCanteenData({ ...editCanteenData, editAddress: '' })
                                                            }
                                                        }}
                                                        id="btnEditMenuEnter3"
                                                        disabled={editCanteenData.editAddress.length === 0}
                                                    >
                                                        {
                                                            editCanteenData.editAddress.length > 0 ?
                                                                infoValid.editAddress ? <FontAwesomeIcon icon={faCheck} /> :
                                                                    <FontAwesomeIcon icon={faXmark} /> :
                                                                <FontAwesomeIcon icon={faCheck} />
                                                        }
                                                    </button>
                                                </>
                                                :
                                                canteenFullData.address
                                        }
                                    </td>
                                    <td>{canteenFullData.menus.length !== 0 ? canteenFullData.menus[0].name : "-"}
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                    <div className='row'>
                        {editWhat()}
                        {chosenMenuId !== null && editButton.editMenu === true ?
                            <NewDishes fullData={canteenFullData} chosenId={chosenMenuId} menuData={menuData} setMenuData={setMenuData}
                                handleChange={handleChange} infoValid={infoValid} printCurrentMenuValue={printCurrentMenuValue}
                                getCanteenEntity={getCanteenEntity}
                            />
                            : <span>&nbsp;</span>
                        }
                    </div>
                </div>

                <CanteenViewByAdminForUser
                    canteenFullData={canteenFullData}
                    editCanteenData={editCanteenData}
                    setEditCanteenData={setEditCanteenData}
                    getCanteenEntity={getCanteenEntity}
                />
            </div>
        </div>

    );
}

export default AdminAddMenu;