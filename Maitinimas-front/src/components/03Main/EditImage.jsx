import React, { useState } from 'react';
import apiEndpoint from "../06Services/endpoint";
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import ReactTooltip from 'react-tooltip-rc';
import getMimetype from '../07CommonComponents/GetMimeType';
import HandleEditUrlChange from '../07CommonComponents/HandleEditUrlChange';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark, faCaretSquareDown, faCaretSquareUp } from "@fortawesome/free-solid-svg-icons";
import icon_spinner from "../../images/loader.svg";

function EditImage({ editCanteenData, setEditCanteenData, editDiskImagePreview, setEditDiskImagePreview,
    chosen, setChosen, editUrlLinkValid, setEditUrlLinkValid, getCanteenEntity, canteenId }) {

    const [changeImage, setChangeImage] = useState(false);

    const [editUrlStringStatus, setEditUrlStringStatus] = useState(true);
    const [editBlob, setEditBlob] = useState(null);

    function handleEditImageChoose(event) {
        if (event.target.id === "editDisk") {
            setEditUrlStringStatus(false);
            setChosen({
                ...chosen,
                disk: true,
                linkUrl: false
            });
        }
        else if (event.target.id === "editLinkUrl") {
            setEditUrlStringStatus(true);
            setChosen({
                ...chosen,
                disk: false,
                linkUrl: true
            });
        }
    }

    function handleEditFile() {
        return (
            <div className="mb-3" style={{ position: 'relative', width: '109%', top: '5px' }}>
                <input onChange={(event) => handleEditDiskImageUpload(event)} accept="image/*" className="form-control mt-2"
                    type="file" id="formFile1" style={
                        editCanteenData.editFile !== '' ? editCanteenData.editFile.type && editCanteenData.editFile.type.indexOf('image') !== -1 ? { border: "1px solid lightgray", marginLeft: "-24px" }
                            : { border: "2px solid red", marginLeft: "-24px" }
                            : { border: "1px solid lightgray", marginLeft: "-24px" }
                    } />
                {
                    editCanteenData.editFile !== '' ? editCanteenData.editFile.type && editCanteenData.editFile.type.indexOf('image') !== -1 ? <span className="imageUploadApproved"><FontAwesomeIcon icon={faCheck} /></span>
                        : <span className="imageUploadWarning"><FontAwesomeIcon icon={faXmark} /></span>
                        : <span className="imageUploadApproved"></span>
                }
            </div>
        );
    }

    const handleEditDiskImageUpload = (event) => {
        const theFile = event.target.files[0];
        if (theFile !== undefined) {
            setEditCanteenData({
                ...editCanteenData,
                editFile: theFile
            })
            if (theFile.type.indexOf('image') !== -1) {
                setEditDiskImagePreview(URL.createObjectURL(theFile))
                console.log("Image file type: " + (theFile.type));
            }
            else {
                setEditDiskImagePreview(null);
            }
        }
    }

    const checkImageUrlString = (event) => {
        const target = event.target;

        if (target.validity.valueMissing) {
            target.setCustomValidity("Būtina užpildyti šį laukelį");
        } else
            if (target.validity.patternMismatch) {
                if (target.id === "editImageUrl") {
                    target.setCustomValidity(
                        "Netinkamas URL formatas. Turi prasidėti 'https://', o pasibaigti '*.jpg|*.png|*.gif|*.svg|*.ico|'  "
                    );
                    setEditUrlStringStatus(false)
                }
                return false;
            } else {
                if (target.id === "editImageUrl") {
                    target.setCustomValidity("");
                    setEditUrlStringStatus(true);
                }
                return true;
            }
    };

    const [imageLoading, setImageLoading] = useState(null);
    const handleEditUrlChange = (event) => {
        HandleEditUrlChange(
            event,
            editCanteenData,
            setEditCanteenData,
            checkImageUrlString,
            setImageLoading,
            setEditUrlLinkValid,
            setEditBlob
        )
    };

    const [imageEditColorReset, setImageEditColorReset] = useState(0);



    const handleImageEditSubmit = (event) => {
        event.preventDefault();
        let file = undefined;
        let formData = new FormData();
        console.log("canteen code for image change: ", canteenId)
        if (chosen.disk && editDiskImagePreview !== null) {
            file = editCanteenData.editFile
            formData.append('file', file);
            sendNewImage(canteenId, formData);
        } else
            if (chosen.linkUrl && editUrlLinkValid) {
                let current = new Date();
                let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
                let cTime = current.getHours() + "-" + current.getMinutes() + "-" + current.getSeconds();
                let dateTime = cDate + "--" + cTime;

                let binaryFileType = undefined;
                let hex = undefined;
                const bytesArray = [];
                var fileName = '';

                const blob = editBlob.slice(0, 4);
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
                        } else {
                            ext = binaryFileType.split('/').pop()
                        }
                        fileName = "Internet-Image" + "-" + dateTime + "." + ext;
                        console.log("fileName: ", fileName, " blob type: ", editBlob.type, " binaryFileType: ", binaryFileType)
                        file = new File([editBlob], fileName, {
                            type: binaryFileType
                        });
                        formData.append('file', file);
                        sendNewImage(canteenId, formData);
                    })
            }
    }

    function sendNewImage(id, data) {
        axios.put(`${apiEndpoint}/api/istaigos/canteen/updateImage/${id}`, data)
            .then(response => {
                setImageEditColorReset(response.status);
                menuEditColorResetTime(150, 240, response.status)
                if (response.status === 200) {
                    console.log("Response message: ", response.data);
                    getCanteenEntity(canteenId);
                }
            })
            .catch(err => {
                setImageEditColorReset(err.request.status);
                menuEditColorResetTime(150, 240, err.request.status)
                console.error(err.response.data);
            });
    }

    function menuEditColorResetTime(min, max, status) {
        min = Math.ceil(min);
        max = Math.floor(max);
        let waitTime = Math.floor(Math.random() * (max - min + 1)) + min;
        setTimeout(() => {
            setImageEditColorReset(0);
            if (status === 200) {
                setChosen({
                    ...chosen,
                    disk: false,
                    linkUrl: false
                })
                setEditDiskImagePreview(null);
                setEditUrlLinkValid(false);
                setEditCanteenData({
                    ...editCanteenData,
                    editImage: '',
                    editFile: ''
                })
            }
        }
            , waitTime);
    }

    function handleEditUrl() {
        return (
            <>
                <div className="form-group" style={{ position: 'relative', width: '109%', top: '5px' }}>
                    <input
                        type="text"
                        className="form-control"
                        name="editImage"
                        id="editImageUrl"
                        value={editCanteenData.editImage}
                        onChange={handleEditUrlChange}
                        onInvalid={checkImageUrlString}
                        style={
                            editCanteenData.editImage.length > 0 ? editUrlStringStatus && editUrlLinkValid ?
                                { border: "1px solid lightgray", marginLeft: "-24px" }
                                : { border: "2px solid red", marginLeft: "-24px" }
                                : { border: "1px solid lightgray", marginLeft: "-24px" }
                        }
                        pattern="^https?:\/\/+.+$"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Įveskite maitinimo įstaigos nuotraukos URL nuorodą"
                        data-for='editUrlImage'
                        data-tip='tooltip'
                    />
                    {editCanteenData.editImage.length === 0 || editUrlStringStatus ? <></> :
                        <ReactTooltip id='editUrlImage' effect='solid' place='bottom' type='warning'>
                            <b>Netinkamas URL formatas. Turi prasidėti 'https://', o pasibaigti '*.jpg|*.png|*.gif|*.svg|*.ico|'</b>
                        </ReactTooltip>}
                    {editCanteenData.editImage.length > 0 ? editUrlStringStatus ? editUrlLinkValid ? <span className="imageUploadApproved"><FontAwesomeIcon icon={faCheck} /></span>
                        : imageLoading === null ? <img className='spinner' src={icon_spinner} alt="Loading…" />
                            : <span className="imageUploadWarning"><FontAwesomeIcon icon={faXmark} /></span>
                        : <span className="imageUploadWarning"><FontAwesomeIcon icon={faXmark} /></span>
                        : <span className="imageUploadApproved"></span>
                    }

                </div>
            </>
        )
    }

    return (
        <>
            <Button
                className='mt-3 mb-3'
                variant="outline-dark"
                onClick={() => setChangeImage(!changeImage)}
                aria-controls="example-collapse-text"
                aria-expanded={changeImage}
                title="Keisti paveiskliuką"
            >
                Keisti paveiksliuką {changeImage ? <FontAwesomeIcon icon={faCaretSquareUp} /> :
                    <FontAwesomeIcon icon={faCaretSquareDown} />}
            </Button>
            <Collapse in={changeImage}>
                <div className="form-group mb-4" style={{ position: 'relative', width: '95%' }}>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="takeImage" id="editDisk"
                            checked={chosen.disk}
                            onChange={(e) => handleEditImageChoose(e)}
                        />
                        <label className="form-check-label" htmlFor="editDisk" style={{ float: 'left' }}>
                            Pasirinkti nuotrauką iš disko...
                        </label>
                        {
                            chosen.disk ? handleEditFile() : <></>
                        }
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="takeImage" id="editLinkUrl"
                            checked={chosen.linkUrl}
                            onChange={(e) => handleEditImageChoose(e)}
                        />
                        <label className="form-check-label" htmlFor="editLinkUrl" style={{ float: 'left' }}>
                            Paimti nuotrauką iš nuorodos...
                        </label>
                        {
                            chosen.linkUrl ? handleEditUrl() : <></>
                        }
                    </div>
                    <div className='row mt-2'>
                        <button
                            className="menuDelete imageDeselect"
                            onClick={() => {
                                setChosen({
                                    ...chosen,
                                    disk: false,
                                    linkUrl: false
                                })
                            }
                            }
                            disabled={!chosen.disk && !chosen.linkUrl}
                        >
                            Deselect
                        </button>
                        <button
                            className={
                                imageEditColorReset !== 0 ? imageEditColorReset === 200 ?
                                    "menuEdit imageEdit borderGreen" :
                                    "menuEdit imageEdit borderRed" :
                                    "menuEdit imageEdit"
                            }
                            disabled={!(chosen.disk && editDiskImagePreview) && !(chosen.linkUrl && editUrlLinkValid)}
                            onClick={(e) => handleImageEditSubmit(e)}
                        >
                            Keisti
                        </button>
                    </div>
                </div>
            </Collapse>
        </>
    )
}

export default EditImage