import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactTooltip from 'react-tooltip-rc';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import apiEndpoint from "../06Services/endpoint";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark, faCaretSquareDown, faCaretSquareUp } from "@fortawesome/free-solid-svg-icons";

function EditDishes({ fullData, getCanteenEntity, chosenId, menuData, setMenuData, handleChange, infoValid, validateField, handleDeleteCanteenMenu }) {

    const [menuEditColorReset, setMenuEditColorReset] = useState(0);

    useEffect(() => {
        let menuName = undefined;
        fullData.menus.filter(item => item.id === chosenId).map(item => menuName = item.name);
        setMenuData({ ...menuData, editMenuName: menuName });
    }, []);

    function checkEditMenu() {
        return menuData.editMenuName.length > 0 && infoValid.editMenuName;
    }

    const [changeMenuTitle, setChangeMenuTitle] = useState(false);
    const [deleteMenu, setDeleteMenu] = useState(false);

    const handleMenuEditSubmit = (event) => {
        event.preventDefault();

        let update = {
            canteenId: fullData.id,
            name: menuData.editMenuName
        }

        axios.put(`${apiEndpoint}/api/menu/update/${chosenId}`, update)
            .then(response => {
                setMenuEditColorReset(response.status);
                menuEditColorResetTime(150, 240, response.status)
                if (response.status === 200) {
                    console.log("Response message: ", response.data);
                    console.log("Prior calling to getCanteenEntity parameter variable is: ", fullData.id);
                    getCanteenEntity(fullData.id);
                }
            })
            .catch(err => {
                setMenuEditColorReset(err.request.status);
                menuEditColorResetTime(150, 240, err.request.status)
                console.error(err.response.data);
            });
    }

    function menuEditColorResetTime(min, max, status) {
        min = Math.ceil(min);
        max = Math.floor(max);
        let waitTime = Math.floor(Math.random() * (max - min + 1)) + min;
        setTimeout(() => {
            setMenuEditColorReset(0);
            if (status === 200) { setMenuData({ ...menuData, editMenuName: '' }) }
        }
            , waitTime);
    }

    function printDeleteValue() {
        let menuName = undefined;
        fullData.menus.filter(item => item.id === chosenId).map(item => menuName = item.name);
        let str = 'Trinti ' + menuName;
        return str;
    }

    function printCurrentMenuValue() {
        let menuName = undefined;
        fullData.menus.filter(item => item.id === chosenId).map(item => menuName = item.name);
        return menuName;
    }

    return (
        <>
            <form onSubmit={handleMenuEditSubmit}>

                <Button
                    className='mt-3'
                    variant="outline-dark"
                    onClick={() => setChangeMenuTitle(!changeMenuTitle)}
                    aria-controls="example-collapse-text"
                    aria-expanded={changeMenuTitle}
                    title="Keisti meniu pavadinimą"
                >
                    Keisti meniu pavadinimą {changeMenuTitle ? <FontAwesomeIcon icon={faCaretSquareUp} /> :
                        <FontAwesomeIcon icon={faCaretSquareDown} />}
                </Button>

                <Collapse in={changeMenuTitle}>
                    <div className="form-group pt-2" >
                        <label htmlFor="menuNameEdit">
                            Meniu pavadinimas:
                        </label>
                        <input
                            type="text"
                            className={
                                menuData.editMenuName.length > 0 ? infoValid.editMenuName ? "form-control mt-2 AppropriateBorder ChangeMenuName"
                                    : "form-control mt-2 ValidationErrorBorder ChangeMenuName"
                                    : "form-control mt-2 AppropriateBorder ChangeMenuName"
                            }
                            name="editMenuName"
                            id="id_editMenuName"
                            value={menuData.editMenuName}
                            onChange={handleChange}
                            onInvalid={validateField}
                            pattern="^[A-ZĄ-Ž]{1}[\S\s]{1,64}$"
                            maxLength={64}
                            data-toggle="tooltip"
                            data-placement="top"
                            title="Įveskite meniu pavadinimą"
                            data-for='editMenuName'
                            data-tip='tooltip'
                        />
                        {menuData.editMenuName.length === 0 || infoValid.editMenuName ? <></> :
                            <ReactTooltip id='editMenuName' effect='solid' place='bottom' type='warning' globalEventOff="click">
                                <b>Meniu pavadinimas turi prasidėti didžiąja raide, būti nuo 2 iki 64 simbolių ir negali prasidėti tarpu</b>
                            </ReactTooltip>
                        }
                        {menuData.editMenuName.length > 0 ? infoValid.editMenuName ? <span className="editMenuAddApproveIcon"><FontAwesomeIcon icon={faCheck} /></span>
                            : <span className="editMenuAddWarningIcon"><FontAwesomeIcon icon={faXmark} /></span>
                            : <span className="editMenuAddApproveIcon">&nbsp;</span>}
                        <div className='row' style={{ marginTop: '-25px' }} >
                            <button
                                type="submit"
                                className={
                                    menuEditColorReset !== 0 ? menuEditColorReset === 200 ?
                                        "menuEdit MenuEditMargins menuEdit-green" :
                                        "menuEdit MenuEditMargins menuEdit-red" :
                                        "menuEdit MenuEditMargins"
                                }
                                id="btnChangeMenuName"
                                disabled={!checkEditMenu()}
                            >
                                Keisti
                            </button>
                        </div>
                    </div>
                </Collapse>
                <br />
                <Button
                    className='mt-3'
                    variant="outline-dark"
                    onClick={() => setDeleteMenu(!deleteMenu)}
                    aria-controls="delete-menu-control"
                    aria-expanded={deleteMenu}
                    title="Trinti Meniu"
                >
                    Trinti Meniu {deleteMenu ? <FontAwesomeIcon icon={faCaretSquareUp} /> :
                        <FontAwesomeIcon icon={faCaretSquareDown} />}
                </Button>
                <Collapse in={deleteMenu}>
                    <div className='pt-2'>
                        <p style={{ marginBottom: '0px' }}>Trinti meniu: <strong>{printCurrentMenuValue()}</strong></p>
                        <button
                            type="delete"
                            onClick={(e) => { handleDeleteCanteenMenu(e, fullData.id, chosenId) }}
                            className="menuDelete"
                            id="btnDeleteMenu"
                            data-toggle="tooltip"
                            title={printDeleteValue()}
                            style={{ marginLeft: '78px' }}
                        >
                            Trinti
                        </button>
                    </div>
                </Collapse>
            </form>
        </>

    );
}

export default EditDishes