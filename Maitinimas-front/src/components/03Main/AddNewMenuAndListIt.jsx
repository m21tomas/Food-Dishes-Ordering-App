import React, { useState } from 'react';
import ReactTooltip from 'react-tooltip-rc';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { faCheck, faXmark, faPlus } from "@fortawesome/free-solid-svg-icons";
import EditDishes from './ChangeMenuNameOrDeleteIt';


function EditMenu({ fullData, getCanteenEntity, chosenId, editButton, menuData, setMenuData,
    handleChange, handleMenuSubmit, infoValid, ValidateField, checkAllFields,
    setChosenMenuId, buttonChangeColorOnMenuSend, handleDeleteCanteenMenu }) {

    const [openMenuAdd, setOpenMenuAdd] = useState(false);

    function showDishes(id) {
        setChosenMenuId(null);
        let min = Math.ceil(10);
        let max = Math.floor(150);
        let waitTime = Math.floor(Math.random() * (max - min + 1)) + min;
        setTimeout(() => setChosenMenuId(id), waitTime);
    }



    return (
        <>
            <div className="col-sm-3 col-md-3 col-lg-3 py-3" style={{ backgroundColor: '#eeeeee', height: '600px' }}>

                <div>
                    <DropdownButton
                        className='MenuDropdown'
                        autoClose={true}
                        align={{ lg: 'start' }}
                        key="grey"
                        menuVariant='dark'
                        variant='secondary'
                        title="Menu list"
                        id={`menu-list-dropdown`}
                    >
                        {fullData.menus.map(item => <Dropdown.Item key={item.id}
                            onClick={() => showDishes(item.id)}
                        >{item.name}</Dropdown.Item>)}
                    </DropdownButton>
                </div>

                <form>

                    <Button
                        className='mt-2'
                        variant="outline-dark"
                        onClick={() => setOpenMenuAdd(!openMenuAdd)}
                        aria-controls="example-collapse-text"
                        aria-expanded={openMenuAdd}
                        title="Įvesti naują meniu pavadinimą"
                    >
                        <FontAwesomeIcon icon={faPlus} /> Meniu
                    </Button>
                    <Collapse in={openMenuAdd}>
                        <div className="form-group pt-2" style={{ position: 'relative' }}>
                            <label htmlFor="name">
                                Meniu pavadinimas <span className="fieldRequired">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="menuName"
                                id="id_name"
                                value={menuData.menuName}
                                onChange={handleChange}
                                onInvalid={ValidateField}
                                style={
                                    menuData.menuName.length > 0 ? infoValid.menuName ? { border: "1px solid lightgray", width: "95%" }
                                        : { border: "2px solid red", width: "95%" }
                                        : { border: "1px solid lightgray", width: "95%" }
                                }
                                required
                                pattern="^[A-ZĄ-Ž]{1}[\S\s]{1,64}$"
                                maxLength={64}
                                data-toggle="tooltip"
                                data-placement="top"
                                title="Įveskite meniu pavadinimą"
                                data-for='name'
                                data-tip='tooltip'
                            />
                            {menuData.menuName.length === 0 || infoValid.menuName ? <></> :
                                <ReactTooltip id='name' effect='solid' place='bottom' type='warning' globalEventOff="click">
                                    <b>Meniu pavadinimas turi prasidėti didžiąja raide, būti nuo 2 iki 64 simbolių ir negali prasidėti tarpu</b>
                                </ReactTooltip>}
                            {menuData.menuName.length > 0 ? infoValid.menuName ? <span className="menuAddApproveIcon"><FontAwesomeIcon icon={faCheck} /></span>
                                : <span className="menuAddWarningIcon"><FontAwesomeIcon icon={faXmark} /></span>
                                : <span className="menuAddApproveIcon"></span>}
                            <div className='row'>
                                <button
                                    onClick={() => { setMenuData({ ...menuData, menuName: '' }) }}
                                    className="menuDelete"
                                    id="btnCleanNewMenuName"
                                >
                                    Valyti
                                </button>
                                <button
                                    className={
                                        buttonChangeColorOnMenuSend !== 0 ? buttonChangeColorOnMenuSend === 201 ?
                                            "menu-enter menu-enter-green" :
                                            "menu-enter menu-enter-red" :
                                            "menu-enter"
                                    }
                                    onClick={handleMenuSubmit}
                                    id="btnCheckCanteenField"
                                    disabled={!checkAllFields()}
                                >
                                    Įvesti
                                </button>
                            </div>

                        </div>
                    </Collapse>
                </form>



                {
                    chosenId !== null && editButton.editMenu === true ?
                        <>
                            <EditDishes fullData={fullData}
                                getCanteenEntity={getCanteenEntity}
                                chosenId={chosenId}
                                menuData={menuData}
                                setMenuData={setMenuData}
                                handleChange={handleChange}
                                infoValid={infoValid}
                                validateField={ValidateField}
                                handleDeleteCanteenMenu={handleDeleteCanteenMenu}
                            />

                        </>
                        : <span>&nbsp;</span>
                }
            </div>

        </>

    )
}

export default EditMenu