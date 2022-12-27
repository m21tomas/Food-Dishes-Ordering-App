import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import ReactTooltip from 'react-tooltip-rc';
import apiEndpoint from "../06Services/endpoint";
import axios from 'axios';
import icon_spinner from "../../images/loader.svg";
import handleNewImageURLChange from '../07CommonComponents/HandleNewImageURLChange';
import getMimetype from '../07CommonComponents/GetMimeType';
// import '../../App.css';

function AddNewCanteen({ canteensObj, setCanteensObj }) {

    const [duomenys, setDuomenys] = useState({
        id: '',
        name: '',
        address: '',
        image: '',
        file: ''
    });

    // function checkAllFields() {
    //     let allOk = false;
    //     if (
    //         duomenys.id.length > 0 && infoValid.id &&
    //         duomenys.name.length > 0 && infoValid.name &&
    //         duomenys.address.length > 0 && infoValid.address
    //     ) {
    //         allOk = true;
    //     }
    //     return allOk;
    // }

    function checkAllFields() {
        let allOk = false;

        if (duomenys.image.length > 0 || duomenys.file !== '') {
            if (
                (duomenys.id.length > 0 && infoValid.id &&
                duomenys.name.length > 0 && infoValid.name &&
                duomenys.address.length > 0 && infoValid.address &&
                
                    infoValid.image && urlLinkValid) || 
                    (duomenys.file.type && duomenys.file.type.indexOf('image') !== -1)
                
            ) {
                allOk = true;
            }
        }
        else {
            if (
                duomenys.id.length > 0 && infoValid.id &&
                duomenys.name.length > 0 && infoValid.name &&
                duomenys.address.length > 0 && infoValid.address
            ) {
                allOk = true;
            }
        }
        return allOk;
    }

    const [diskImagePreview, setDiskImagePreview] = useState(null);
    const [urlLinkValid, setUrlLinkValid] = useState(false);
    const [blobPromise, setBlobPromise] = useState(null);

    const [infoValid, setInfoValid] = useState({
        id: true,
        name: true,
        address: true,
        image: true
    });

    const [image, setImage] = useState({
        disk: false,
        linkUrl: false
    })

    const handleChange = (event) => {
        validateField(event);
        setDuomenys({
            ...duomenys,
            [event.target.name]: event.target.value,
        });
    };

    // setup the package variables
    // const express = require('express');
    // const axios = require('axios');
    // const bodyParser = require('body-parser');
    // const cors = require('cors');
    // const CircularJSON = require('circular-json');

    // initialize the app
    // const app = express();

    const [imageLoading, setImageLoading] = useState(null);
    const handleUrlChange = async (event) => {

        handleNewImageURLChange(
            event,
            duomenys,
            setDuomenys,
            validateField,
            setImageLoading,
            setUrlLinkValid,
            setBlobPromise
        ) 
    };

    const validateField = (event) => {
        const target = event.target;

        if (target.validity.valueMissing) {
            target.setCustomValidity("Būtina užpildyti šį laukelį");
        } else
            if (target.validity.patternMismatch) {
                if (target.id === "id_name") {
                    target.setCustomValidity(
                        "Pavadinimas turi prasidėti didžiąja raide, būti nuo 2 iki 64 simbolių ir negali prasidėti tarpu"
                    );
                    setInfoValid({ ...infoValid, name: false });
                } else if (target.id === "id_id") {
                    target.setCustomValidity(
                        "Įstaigos kodą sudaro 9 skaitmenys"
                    );
                    setInfoValid({ ...infoValid, id: false });
                } else if (target.id === "id_address") {
                    target.setCustomValidity(
                        "Adresas turi prasidėti didžiąja raide, būti nuo 2 iki 64 simbolių ir negali prasidėti tarpu"
                    );
                    setInfoValid({ ...infoValid, address: false });
                }
                else if (target.id === "imageUrl") {
                    target.setCustomValidity(
                        "Netinkamas URL formatas. Turi prasidėti 'https://', o pasibaigti '*.jpg|*.png|*.gif|*.svg|*.ico|'  "
                    );
                    setInfoValid({ ...infoValid, image: false });
                }
                return false;
            } else {
                if (target.id === "id_name") {
                    target.setCustomValidity("");
                    setInfoValid({ ...infoValid, name: true });
                } else if (target.id === "id_id") {
                    target.setCustomValidity("");
                    setInfoValid({ ...infoValid, id: true });
                } else if (target.id === "id_address") {
                    target.setCustomValidity("");
                    setInfoValid({ ...infoValid, address: true });
                }
                else if (target.id === "imageUrl") {
                    target.setCustomValidity("");
                    setInfoValid({ ...infoValid, image: true });
                }
                return true;
            }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // function handleSubmit (event) {  
        console.log("duomenys.file ", duomenys.file);
        console.log("duomenys.image ", duomenys.image);
        if (duomenys.file !== '' || duomenys.image !== '') {
            let formData = new FormData();
            let jsonBodyData = {
                id: duomenys.id,
                name: duomenys.name,
                address: duomenys.address
            }
            formData.append('jsonBodyData',
                new Blob([JSON.stringify(jsonBodyData)], {
                    type: 'application/json'
                }));
            if (image.disk) {
                formData.append('file', duomenys.file);
                sendNewCanteenWithImage(formData);
            }
            else if (image.linkUrl && urlLinkValid) {
                let current = new Date();
                let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
                let cTime = current.getHours() + "-" + current.getMinutes() + "-" + current.getSeconds();
                let dateTime = cDate + "--" + cTime;

                let binaryFileType = undefined;
                let hex = undefined;
                const bytesArray = [];
                var file = undefined;
                var fileName = '';

                const blob = blobPromise.slice(0, 4);
                blob.arrayBuffer()
                    .then(buf => new Uint8Array(buf))
                    .then(bytes => {
                        bytes.forEach((byte) => {
                            bytesArray.push(byte.toString(16))
                        })
                        hex = bytesArray.join('').toUpperCase();
                        binaryFileType = getMimetype(hex);
                        let ext = undefined;
                        if (binaryFileType.split('/').pop() === "x-icon") {
                            ext = "ico"
                        }else {
                            ext = binaryFileType.split('/').pop()
                        }
                        fileName = "Internet-Image-" + dateTime + "." + ext;
                        console.log("fileName: ", fileName, " blob type: ", blobPromise.type, " binaryFileType: ", binaryFileType)
                        file = new File([blobPromise], fileName, {
                            type: binaryFileType
                        });
                        formData.append('file', file);
                        sendNewCanteenWithImage(formData);
                    })
            }
        } else {
            let jsonBodyData = {
                id: duomenys.id,
                name: duomenys.name,
                address: duomenys.address
            }

            axios.post(`${apiEndpoint}/api/istaigos/canteen/new`, jsonBodyData)
                .then(response => {
                    console.log('Status', response.status)
                    if (response.status === 201) {
                        setCanteensObj({ ...canteensObj, totalElements: canteensObj.totalElements + 1 })
                        setDuomenys({
                            ...duomenys,
                            id: '',
                            name: '',
                            address: '',
                            image: '',
                            file: ''
                        })
                        setImage({
                            ...image,
                            disk: false,
                            linkUrl: false
                        });
                    }
                })
                //  .then(response => {if(response.status === 201){history.push("/canteen")}})
                .catch(err => {
                    console.error(err.data)
                });
        }


        // fetch(`${apiEndpoint}/api/istaigos/canteenwithimage/new`, {
        //     method: 'POST',
        //     credentials: 'include',
        //     headers: { 'Content-Type': 'multipart/form-data; charset=UTF-8' },
        //     mode: 'cors',
        //     body: formData
        // })
        //     .then(response => {
        //         console.log("jsonBodyData: " + response.text())
        //         console.log('Status', response.status)
        //         return response.text()
        //     })
        //     .catch(err => {
        //         console.log("jsonBodyData: " + JSON.stringify(jsonBodyData))
        //         console.error(err.response.data)
        //     });

    };

    function sendNewCanteenWithImage(data) {
        axios.post(`${apiEndpoint}/api/istaigos/canteenwithimage/new`, data)
            .then(response => {
                console.log(response.data)
                if (response.status === 201) {
                    setCanteensObj({ ...canteensObj, totalElements: canteensObj.totalElements + 1 })
                    setDuomenys({
                        ...duomenys,
                        id: '',
                        name: '',
                        address: '',
                        image: '',
                        file: ''
                    })
                    setImage({
                        ...image,
                        disk: false,
                        linkUrl: false
                    });
                    setDiskImagePreview(null);
                    setUrlLinkValid(false);
                    setInfoValid({ ...infoValid, image: false });
                }
            })
            .catch(err => {
                console.error(err.response.data);
            });
    }

    function setStatesTakingImage(event) {
        if (event.target.id === "disk") {
            setInfoValid({ ...infoValid, image: false });
            //setDuomenys({ ...duomenys, paveiksliukas: '' });
            setImage({
                ...image,
                [event.target.id]: true,
                linkUrl: false
            });
        }
        else if (event.target.id === "linkUrl") {
            setInfoValid({ ...infoValid, image: true });
            setDiskImagePreview(null);
            setDuomenys({
                ...duomenys,
                file: ''
            });
            setImage({
                ...image,
                [event.target.id]: true,
                disk: false
            });
        }
    }

    function takeFile() {
        return (
            <div className="mb-3" style={{ position: 'relative', width: '109%' }}>
                <input onChange={(event) => handleDiskImageUpload(event)} accept="image/*" className="form-control mt-2"
                    type="file" id="formFile" style={
                        duomenys.file !== '' ? duomenys.file.type && duomenys.file.type.indexOf('image') !== -1 ? { border: "1px solid lightgray", marginLeft: "-24px" }
                            : { border: "2px solid red", marginLeft: "-24px" }
                            : { border: "1px solid lightgray", marginLeft: "-24px" }
                    } />
                {
                    duomenys.file !== '' ? duomenys.file.type && duomenys.file.type.indexOf('image') !== -1 ? <span className="imageapprovemsg"><FontAwesomeIcon icon={faCheck} /></span>
                        : <span className="imagewarningmsg"><FontAwesomeIcon icon={faXmark} /></span>
                        : <span className="imageapprovemsg"></span>
                }
            </div>
        );
    }

    const handleDiskImageUpload = (event) => {
        const theFile = event.target.files[0];
        if (theFile !== undefined) {
            setDuomenys({
                ...duomenys,
                file: theFile
            })
            if (theFile.type.indexOf('image') !== -1) {
                setDiskImagePreview(URL.createObjectURL(theFile))
                console.log("theFile: is image: " + (theFile.type));
            }
            else {
                setDiskImagePreview(null);
            }
        }
        // console.log("theFile: " + theFile + "\ndata: " + duomenys.file);
    }

    function takeUrl() {
        return (
            <>
                <div className="form-group" style={{ position: 'relative', width: '109%' }}>
                    <input
                        type="text"
                        className="form-control mt-2"
                        name="image"
                        id="imageUrl"
                        value={duomenys.image}
                        onChange={handleUrlChange}
                        onInvalid={validateField}
                        style={
                            duomenys.image.length > 0 ? infoValid.image ? urlLinkValid ? { border: "1px solid lightgray", marginLeft: "-24px" }
                                : { border: "1px solid lightgray", marginLeft: "-24px" }
                                : { border: "2px solid red", marginLeft: "-24px" }
                                : { border: "1px solid lightgray", marginLeft: "-24px" }
                        }
                        pattern="^https?:\/\/+.+$"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Įveskite maitinimo įstaigos nuotraukos URL nuorodą"
                        data-for='image'
                        data-tip='tooltip'
                    />
                    {duomenys.image.length === 0 || infoValid.image ? <></> :
                        <ReactTooltip id='image' effect='solid' place='bottom' type='warning'>
                            <b>Netinkamas URL formatas. Turi prasidėti 'https://', o pasibaigti '*.jpg|*.png|*.gif|*.svg|*.ico|'</b>
                        </ReactTooltip>}
                    {duomenys.image.length > 0 ? infoValid.image ? urlLinkValid ? <span className="imageapprovemsg"><FontAwesomeIcon icon={faCheck} /></span>
                        : imageLoading === null ? <img className='spinner' src={icon_spinner} alt="Loading…" />
                        : <span className="imageUploadWarning"><FontAwesomeIcon icon={faXmark} /></span>
                        : <span className="imagewarningmsg"><FontAwesomeIcon icon={faXmark} /></span>
                        : <span className="imageapprovemsg"></span>
                    }

                </div>
            </>
        )

    }

    function showImagePreview() {
        if (image.disk && diskImagePreview !== null) {
            return (
                <div className="card mt-2" style={{ width: "100%" }}>
                    <img src={diskImagePreview} className="card-img-top" alt="Disk" />
                </div>
            )
        }
        else if (image.linkUrl && urlLinkValid && infoValid.image && duomenys.image.length > 0)
            return (
                <div className="card mt-2" style={{ width: "100%" }}>
                    <a href={duomenys.image} target="_blank" rel="noopener noreferrer">
                        <img src={duomenys.image} className="card-img-top" alt="URL" />
                    </a>
                </div>
            )
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h6 className="py-3">
                    <b>Pridėti naują maitinimo įstaigą:</b>
                </h6>
                <div className="form-group" style={{ position: 'relative', width: '95%' }}>
                    <label htmlFor="name">
                        Pavadinimas <span className="fieldRequired">*</span>
                    </label>
                    <input
                        type="text"
                        className="form-control mt-2"
                        name="name"
                        id="id_name"
                        value={duomenys.name}
                        onChange={handleChange}
                        onInvalid={validateField}
                        style={
                            duomenys.name.length > 0 ? infoValid.name ? { border: "1px solid lightgray" }
                                : { border: "2px solid red" }
                                : { border: "1px solid lightgray" }
                        }
                        required
                        pattern="^[A-ZĄ-Ž]{1}[\S\s]{1,64}$"
                        maxLength={64}
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Įveskite maitinimo įstaigos pavadinimą"
                        data-for='name'
                        data-tip='tooltip'
                    />
                    {duomenys.name.length === 0 || infoValid.name ? <></> :
                        <ReactTooltip id='name' effect='solid' place='bottom' type='warning'>
                            <b>Pavadinimas turi prasidėti didžiąja raide, būti nuo 2 iki 64 simbolių ir negali prasidėti tarpu</b>
                        </ReactTooltip>}
                    {duomenys.name.length > 0 ? infoValid.name ? <span className="approvemsg"><FontAwesomeIcon icon={faCheck} /></span>
                        : <span className="warningmsg"><FontAwesomeIcon icon={faXmark} /></span>
                        : <span className="approvemsg"></span>}
                    <br></br>
                </div>
                <div className="form-group" style={{ position: 'relative', width: '95%' }}>
                    <label htmlFor="name">
                        Įmonės kodas <span className="fieldRequired">*</span>
                    </label>
                    <input
                        type="text"
                        className="form-control mt-2"
                        name="id"
                        id="id_id"
                        value={duomenys.id}
                        onChange={handleChange}
                        onInvalid={validateField}
                        style={
                            duomenys.id.length > 0 ? infoValid.id ? { border: "1px solid lightgray" }
                                : { border: "2px solid red" }
                                : { border: "1px solid lightgray" }
                        }
                        required
                        pattern="^\d{9}$"
                        maxLength={9}
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Įveskite įstaigos kodą"
                        data-for='id'
                        data-tip='tooltip'
                    />
                    {duomenys.id.length === 0 || infoValid.id ? <></> :
                        <ReactTooltip id='id' effect='solid' place='bottom' type='warning'>
                            <b>Įstaigos kodą sudaro 9 skaitmenys</b>
                        </ReactTooltip>}
                    {duomenys.id.length > 0 ? infoValid.id ? <span className="approvemsg"><FontAwesomeIcon icon={faCheck} /></span>
                        : <span className="warningmsg"><FontAwesomeIcon icon={faXmark} /></span>
                        : <span className="approvemsg"></span>}
                    <br />
                </div>
                <div className="form-group" style={{ position: 'relative', width: '95%' }}>
                    <label htmlFor="name">
                        Adresas <span className="fieldRequired">*</span>
                    </label>
                    <input
                        type="text"
                        className="form-control mt-2"
                        name="address"
                        id="id_address"
                        value={duomenys.address}
                        onChange={handleChange}
                        onInvalid={validateField}
                        style={
                            duomenys.address.length > 0 ? infoValid.address ? { border: "1px solid lightgray" }
                                : { border: "2px solid red" }
                                : { border: "1px solid lightgray" }
                        }
                        required
                        pattern="^[A-ZĄ-Ž]{1}[\S\s]{1,64}$"
                        maxLength={64}
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Įveskite adresą"
                        data-for='address'
                        data-tip='tooltip'
                    />
                    {duomenys.address.length === 0 || infoValid.address ? <></> :
                        <ReactTooltip id='address' effect='solid' place='bottom' type='warning'>
                            <b>Adresas turi prasidėti didžiąja raide, būti nuo 2 iki 64 simbolių ir negali prasidėti tarpu</b>
                        </ReactTooltip>}
                    {duomenys.address.length > 0 ? infoValid.address ? <span className="approvemsg"><FontAwesomeIcon icon={faCheck} /></span>
                        : <span className="warningmsg"><FontAwesomeIcon icon={faXmark} /></span>
                        : <span className="approvemsg"></span>}
                    <br></br>
                </div>
                <div className="form-group" style={{ position: 'relative', width: '95%' }}>
                    <label htmlFor="flexRadioDefault">
                        Pridėkite maitinimo įstaigos nuotrauką:
                    </label>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="takeImage" id="disk"
                            checked={image.disk}
                            onChange={(e) => setStatesTakingImage(e)}
                        />
                        <label className="form-check-label" htmlFor="disk">
                            Pasirinkti nuotrauką iš disko...
                        </label>
                        {
                            image.disk ? takeFile() : <span>&nbsp;</span>
                        }
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="takeImage" id="linkUrl"
                            checked={image.linkUrl}
                            onChange={(e) => setStatesTakingImage(e)}
                        />
                        <label className="form-check-label" htmlFor="linkUrl">
                            Paimti nuotrauką iš nuorodos...
                        </label>
                        {
                            image.linkUrl ? takeUrl() : <span>&nbsp;</span>
                        }
                    </div>
                </div>
                <div>
                    {
                        image.disk ? showImagePreview() : <span>&nbsp;</span>
                    }
                    {
                        image.linkUrl ? showImagePreview() : <span>&nbsp;</span>
                    }
                </div>
                {/* duomenys.file.type && duomenys.file.type.indexOf('image') !== -1 */}
                <button
                    type="submit"
                    className="btn btn-primary form-group float-end mt-2"
                    id="btnSaveKindergarten"
                    disabled={!checkAllFields()}
                >
                    Submit
                </button>
            </form>
        </div>
    );


}

export default AddNewCanteen;