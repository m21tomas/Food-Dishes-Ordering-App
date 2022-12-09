import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactTooltip from 'react-tooltip-rc';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import Table from 'react-bootstrap/Table';
import apiEndpoint from "../06Services/endpoint";
import validateField from '../07CommonComponents/ValidateCanteenFields';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPenToSquare, faXmark, faCheck } from "@fortawesome/free-solid-svg-icons";

function NewDishes({ fullData, chosenId, menuData, setMenuData, handleChange,
    infoValid, printCurrentMenuValue, getCanteenEntity }) {

    const [openNewDish, setOpenNewDish] = useState(false)
    const [buttonChangeColorOnDishSend, setButtonChangeColorOnDishSend] = useState(0);
    const [editTableDishes, setEditTableDishes] = useState([]);
    const [deleteIndex, setDeleteIndex] = useState(null);


    useEffect(() => {
        const menu = fullData.menus.filter((menu) => menu.id === chosenId);

        if (menu[0].dishes.length >= editTableDishes.length) {
            const dishes = menu[0].dishes.map((dish, index) => ({
                id: dish.id,
                name: dish.name,
                description: dish.description,
                editField: editTableDishes.length !== 0 && index < editTableDishes.length ? editTableDishes.at(index).editField : false,
                editDishName: editTableDishes.length !== 0 && index < editTableDishes.length ? editTableDishes.at(index).editDishName : '',
                editDescription: editTableDishes.length !== 0 && index < editTableDishes.length ? editTableDishes.at(index).editDescription : '',
                infoValid_dishName: editTableDishes.length !== 0 && index < editTableDishes.length ? editTableDishes.at(index).infoValid_dishName : true,
                infoValid_description: editTableDishes.length !== 0 && index < editTableDishes.length ? editTableDishes.at(index).infoValid_description : true,
                buttonDishEditRecolor: 0
            }));
            console.log(dishes);
            setEditTableDishes(dishes);
        }
        else {
            const dishes2 = menu[0].dishes.map((dish, index) => ({
                id: dish.id,
                name: dish.name,
                description: dish.description,
                editField: index < deleteIndex ? editTableDishes.at(index).editField : editTableDishes.at(index + 1).editField,
                editDishName: index < deleteIndex ? editTableDishes.at(index).editDishName : editTableDishes.at(index + 1).editDishName,
                editDescription: index < deleteIndex ? editTableDishes.at(index).editDescription : editTableDishes.at(index + 1).editDescription,
                infoValid_dishName: index < deleteIndex ? editTableDishes.at(index).infoValid_dishName : editTableDishes.at(index + 1).infoValid_dishName,
                infoValid_description: index < deleteIndex ? editTableDishes.at(index).infoValid_description : editTableDishes.at(index + 1).infoValid_description,
                buttonDishEditRecolor: 0
            }));
            console.log(dishes2);
            setEditTableDishes(dishes2);
            setDeleteIndex(null);
        }
    }, [fullData])

    const handleDishEdit = (event, index) => {
        let changedDishName = undefined;
        let changedDescription = undefined;
        let validity_DishName = undefined;
        let validity_Description = undefined;
        const changedEditTableDishes = editTableDishes.map((dish, i) => {
            if (i === index) {
                if (event.target.name === "editDishName") {
                    changedDishName = event.target.value;
                    changedDescription = dish.editDescription;
                    if (event.target.validity.valueMissing) {
                        event.target.setCustomValidity("Būtina užpildyti šį laukelį");
                    }
                    else if (event.target.validity.patternMismatch) {
                        event.target.setCustomValidity(
                            "Pavadinimas turi prasidėti didžiąja raide, būti nuo 2 iki 64 simbolių ir negali prasidėti tarpu"
                        );
                        validity_DishName = false;
                        validity_Description = dish.infoValid_description;
                    }
                    else {
                        event.target.setCustomValidity("");
                        validity_DishName = true;
                        validity_Description = dish.infoValid_description;
                    }
                } else if (event.target.name === "editDescription") {
                    changedDishName = dish.editDishName;
                    changedDescription = event.target.value;
                    if (event.target.value.match(/^[A-ZĄ-Ž]{1}[\S\s]{1,}$/) ||
                        event.target.value === '') {
                        event.target.setCustomValidity("");
                        validity_Description = true;
                        validity_DishName = dish.infoValid_dishName;
                    }
                    else {
                        event.target.setCustomValidity(
                            "Patiekalo pavadinimas turi prasidėti didžiąja raide, būti nuo 2 iki 255 simbolių ir negali prasidėti tarpu"
                        );
                        validity_Description = false;
                        validity_DishName = dish.infoValid_dishName;
                    }
                }
                return {
                    id: dish.id,
                    name: dish.name,
                    description: dish.description,
                    editField: true,
                    editDishName: changedDishName,
                    editDescription: changedDescription,
                    infoValid_dishName: validity_DishName,
                    infoValid_description: validity_Description,
                    buttonDishEditRecolor: 0
                };
            } else {
                return dish;
            }
        });
        setEditTableDishes(changedEditTableDishes);
    }

    const handleDishSend = (event) => {
        event.preventDefault();

        let dishDTO = {
            name: menuData.dishName,
            description: menuData.description
        }

        axios.put(`${apiEndpoint}/api/menu/addDishForMenu/${chosenId}`, dishDTO)
            .then(response => {
                setButtonChangeColorOnDishSend(response.status);
                setButtonDishSendColorBack(150, 240, response.status);
                if (response.status === 201) {
                    console.log(response.data)
                    getCanteenEntity(fullData.id);
                }
            })
            .catch(err => {
                setButtonChangeColorOnDishSend(err.request.status);
                setButtonDishSendColorBack(150, 240, err.request.status);
                console.error(err.response.data);
            });
    }

    function setButtonDishSendColorBack(min, max, status) {
        min = Math.ceil(min);
        max = Math.floor(max);
        let waitTime = Math.floor(Math.random() * (max - min + 1)) + min;
        setTimeout(() => {
            setButtonChangeColorOnDishSend(0);
            if (status === 201) {
                setMenuData({ ...menuData, dishName: '', description: '' })
            }
        }
            , waitTime);
    }

    function handleDishEditSend(event, index) {
        event.preventDefault();

        let dishWithIdDTO = undefined;

        editTableDishes.map((dish, i) => {
            if (i === index) {
                dishWithIdDTO = {
                    id: dish.id,
                    name: dish.editDishName,
                    description: dish.editDescription
                };
            }
        });

        axios.put(`${apiEndpoint}/api/menu/changeDishInTheMenu/${chosenId}`, dishWithIdDTO)
            .then(response => {
                handleEditDishSendButtonRecolor(response.status, index);
                setButtonEditDishSendColorBack(150, 240, response.status, index);
                if (response.status === 200) {
                    console.log(response.data)
                }
            })
            .catch(err => {
                handleEditDishSendButtonRecolor(err.request.status, index);
                setButtonEditDishSendColorBack(150, 240, err.request.status, index);
                console.error(err.response.data);
            });
    }

    function setButtonEditDishSendColorBack(min, max, status, index) {
        min = Math.ceil(min);
        max = Math.floor(max);
        let waitTime = Math.floor(Math.random() * (max - min + 1)) + min;
        setTimeout(() => {
            handleEditDishSendButtonRecolor(0, index);
            if (status === 200) {
                handleEditDish(index, false)
                getCanteenEntity(fullData.id);
            }
        }
            , waitTime);
    }

    function handleEditDishSendButtonRecolor(code, index) {
        const changedEditTableDishes = editTableDishes.map((dish, i) => {
            if (i === index) {
                return {
                    id: dish.id,
                    name: dish.name,
                    description: dish.description,
                    editField: dish.editField,
                    editDishName: dish.name,
                    editDescription: dish.description,
                    infoValid_dishName: dish.infoValid_dishName,
                    infoValid_description: dish.infoValid_description,
                    buttonDishEditRecolor: code
                };
            } else {
                return dish;
            }
        });
        setEditTableDishes(changedEditTableDishes);
    }

    function handleEditDish(index, status) {
        const changedEditTableDishes = editTableDishes.map((dish, i) => {
            if (i === index) {
                return {
                    id: dish.id,
                    name: dish.name,
                    description: dish.description,
                    editField: status,
                    editDishName: dish.name,
                    editDescription: dish.description,
                    infoValid_dishName: true,
                    infoValid_description: true,
                    buttonDishEditRecolor: 0
                };
            } else {
                return dish;
            }
        });
        setEditTableDishes(changedEditTableDishes);
    }

    function handleDeleteDishSend(event, index, dishId) {
        event.preventDefault();
        let deletedDishName = undefined;
        editTableDishes.map((dish, i) => {
            if (i === index) {
                deletedDishName = dish.name;
            }
        });

        axios.delete(`${apiEndpoint}/api/menu/removeDishFromMenu/${chosenId}/${dishId}`)
            .then(response => {
                if (response.status === 200) {
                    getCanteenEntity(fullData.id);
                    console.log("\"" + deletedDishName + "\" ištrintas")
                }
            })
            .catch(err => {
                console.error("\"" + deletedDishName + "\" neištrintas !!");
                console.error(err.response);
            });
    }

    function exampleTable() {
        return (
            <div className='mt-3' style={{ height: '300px', overflowY: 'scroll' }}>
                {/* {editTableDishes.length == 0 ? null : <p>Testing</p>} */}
                <Table striped bordered >
                    <thead>
                        <tr>
                            <th style={{ width: '5%', textAlign: 'center' }}>#</th>
                            <th style={{ width: '30%' }}>Pavadinimas</th>
                            <th style={{ width: '55%' }}>Aprašymas</th>
                            <th style={{ width: '5%', textAlign: 'center', verticalAlign: 'middle' }}><FontAwesomeIcon icon={faPenToSquare} /></th>
                            <th style={{ width: '5%', textAlign: 'center', verticalAlign: 'middle' }}><FontAwesomeIcon icon={faXmark} /></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            editTableDishes.length ?
                                editTableDishes.map((item, index) => (
                                    <tr key={index}>
                                        <td style={{ textAlign: "center" }}>{index + 1}</td>
                                        <td>
                                            {
                                                item.editField ?
                                                    <input
                                                        type="text"
                                                        className={
                                                            item.editDishName.length > 0 ? item.infoValid_dishName ?
                                                                "AppropriateBorder"
                                                                : "ValidationErrorBorder"
                                                                : "AppropriateBorder"
                                                        }
                                                        style={{ width: '100%' }}
                                                        name="editDishName"
                                                        id="id_editDishName"
                                                        value={item.editDishName}
                                                        onChange={(e) => handleDishEdit(e, index)}
                                                        required
                                                        pattern="^[A-ZĄ-Ž]{1}[\S\s]{1,64}$"
                                                        maxLength={64}
                                                        data-toggle="tooltip"
                                                        data-placement="top"
                                                        title="Įveskite patiekalo pavadinimą"
                                                        data-for='editDishName'
                                                        data-tip='tooltip'
                                                    />
                                                    :
                                                    item.name
                                            }
                                            {
                                                item.editDishName.length === 0 || item.infoValid_dishName ? <></> :
                                                    <ReactTooltip id='editDishName' effect='solid' place='bottom' type='warning' globalEventOff="click">
                                                        <b>Patiekalo pavadinimas turi prasidėti didžiąja raide, būti nuo 2 iki 64 simbolių ir negali prasidėti tarpu</b>
                                                    </ReactTooltip>
                                            }
                                        </td>
                                        <td>
                                            {
                                                item.editField ?
                                                    <textarea
                                                        className={
                                                            item.editDescription.length > 0 ? item.infoValid_description ?
                                                                "AppropriateBorder"
                                                                : "ValidationErrorBorder"
                                                                : "AppropriateBorder"
                                                        }
                                                        style={{ width: '100%' }}
                                                        id="editDishDescription"
                                                        rows="2"
                                                        name='editDescription'
                                                        value={item.editDescription}
                                                        onChange={(e) => handleDishEdit(e, index)}
                                                        maxLength={255}
                                                        data-for='editDishDescription'
                                                        data-tip='tooltip'
                                                    >
                                                    </textarea>
                                                    :
                                                    item.description
                                            }
                                            {
                                                item.editDescription.length === 0 || item.infoValid_description ? <></> :
                                                    <ReactTooltip id='editDishDescription' effect='solid' place='bottom' type='warning' globalEventOff="click">
                                                        <b>Patiekalo aprašymas turi prasidėti didžiąja raide, būti nuo 2 iki 255 simbolių ir negali prasidėti tarpu</b>
                                                    </ReactTooltip>
                                            }
                                        </td>
                                        <td style={{ textAlign: "center" }}>
                                            {
                                                item.editField ?
                                                    <button
                                                        className={
                                                            item.buttonDishEditRecolor > 0 ? item.buttonDishEditRecolor === 200 ?
                                                                "editDishData borderGreen"
                                                                : "editDishDataBorderRed"
                                                                : "editDishData"
                                                        }
                                                        onClick={(e) => handleDishEditSend(e, index)}
                                                        id="btnSendEditDish"
                                                        disabled={!item.infoValid_dishName || !item.infoValid_description}
                                                    >
                                                        {
                                                            <FontAwesomeIcon icon={faCheck} />
                                                        }
                                                    </button>
                                                    :
                                                    <button id='btnEditDish'
                                                        className='editEntityField'
                                                        onClick={() => handleEditDish(index, true)}
                                                    >
                                                        <FontAwesomeIcon icon={faPenToSquare} />
                                                    </button>
                                            }
                                        </td>
                                        <td style={{ textAlign: "center" }}>
                                            {
                                                item.editField ?
                                                    <button id='btnEditDish'
                                                        className='editEntityFieldActivated'
                                                        onClick={() => handleEditDish(index, false)}
                                                    >
                                                        <FontAwesomeIcon icon={faPenToSquare} />
                                                    </button>
                                                    :
                                                    <button id='btnDeleteDish'
                                                        className='deleteDish'
                                                        onClick={(e) => {
                                                            setDeleteIndex(index);
                                                            handleDeleteDishSend(e, index, item.id)
                                                        }}
                                                    >
                                                        <FontAwesomeIcon icon={faXmark} />
                                                    </button>
                                            }
                                        </td>
                                    </tr>
                                ))
                                : null
                        }
                    </tbody>
                </Table>
            </div>
        )
    }

    return (
        <>
            <div className="col-sm-3 col-md-3 col-lg-9" style={{ backgroundColor: '#fafafa' }}>
                <h3 style={{ textAlign: 'center' }}>{printCurrentMenuValue()}</h3>
                <Button
                    variant="outline-dark"
                    onClick={() => setOpenNewDish(!openNewDish)}
                    aria-controls="example-collapse-text"
                    aria-expanded={openNewDish}
                    title="Įvesti naują patiekalo pavadinimą"
                >
                    <FontAwesomeIcon icon={faPlus} /> Patiekalas
                </Button>
                <Collapse in={openNewDish}>
                    <div className="form-group pt-2">
                        <label htmlFor="name">
                            Patiekalo pavadinimas <span className="fieldRequired">*</span>
                        </label>
                        <br />
                        <div className='row'>
                            <input
                                type="text"
                                className={
                                    menuData.dishName.length > 0 ? infoValid.dishName ? "AppropriateBorder NewDishField"
                                        : "ValidationErrorBorder NewDishField"
                                        : "AppropriateBorder NewDishField"
                                }
                                name="dishName"
                                id="id_dishName"
                                value={menuData.dishName}
                                onChange={handleChange}
                                onInvalid={validateField}
                                required
                                pattern="^[A-ZĄ-Ž]{1}[\S\s]{1,64}$"
                                maxLength={64}
                                title="Įveskite patiekalo pavadinimą"
                                data-for='dishName'
                                data-tip='tooltip'
                            />
                            {
                                menuData.dishName.length === 0 || infoValid.dishName ? <></> :
                                    <ReactTooltip id='dishName' effect='solid' place='bottom' type='warning' globalEventOff="click">
                                        <b>Patiekalo pavadinimas turi prasidėti didžiąja raide, būti nuo 2 iki 64 simbolių ir negali prasidėti tarpu</b>
                                    </ReactTooltip>
                            }
                            <button
                                className={
                                    buttonChangeColorOnDishSend !== 0 ? buttonChangeColorOnDishSend === 201 ?
                                        "menuEdit menuEdit-green AddNewDishesMargins" :
                                        "menuEdit menuEdit-red AddNewDishesMargins" :
                                        "menuEdit AddNewDishesMargins"
                                }
                                //className='menuEdit AddNewDishesMargins'
                                onClick={(e) => handleDishSend(e)}
                                id="btnCheckCanteenField"
                                disabled={!(infoValid.dishName && infoValid.description && menuData.dishName.length > 0)}
                            >
                                Įvesti
                            </button>
                        </div>
                        <div>
                            <label htmlFor="NewDishDescription" className="form-label">Aprašymas</label>
                            <textarea
                                className={
                                    menuData.description.length > 0 ? infoValid.description ? "form-control AppropriateBorder"
                                        : "form-control ValidationErrorBorder"
                                        : "form-control AppropriateBorder"
                                }
                                style={{width: '54%'}}
                                id="id_newDishDescription"
                                rows="3"
                                name='description'
                                value={menuData.description}
                                onChange={handleChange}
                                maxLength={2000}
                                data-for='description'
                                data-tip='tooltip'
                            >
                            </textarea>
                            {
                                menuData.description.length === 0 || infoValid.description ? <></> :
                                    <ReactTooltip id='description' effect='solid' place='bottom' type='warning' globalEventOff="click">
                                        <b>Patiekalo pavadinimas turi prasidėti didžiąja raide arba skaičiumi, būti nuo 2 iki 2000 simbolių ir negali prasidėti tarpu</b>
                                    </ReactTooltip>
                            }
                        </div>
                    </div>
                </Collapse>
                {/* <br /> */}
                {exampleTable()}

            </div>
        </>
    )

}

export default NewDishes