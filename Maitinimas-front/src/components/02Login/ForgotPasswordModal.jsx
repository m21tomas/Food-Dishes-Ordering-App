import React, { useState, useEffect, useRef } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Table from 'react-bootstrap/Table';
import TypingRegistrationValidator from "../07CommonComponents/TypingRegistrationValidator";
import ReactTooltip from 'react-tooltip-rc';
import apiEndpoint from "../06Services/endpoint";
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';

const ForgotPasswordModal = ({ forgotModal, setForgotModal }) => {

    const [expiredCaptcha, setExpiredCapture] = useState(false);
    const [regStatus, setRegStatus] = useState("");
    const [submitDisableed, setSubmitDisabled] = useState(false);
    const [regStatusColor, setRegStatusColor] = useState("");
    const [userName, setUserName] = useState("");
    const [newPassword, setNewPassword] = useState(false);
    const passwordShown = false;
    const usernameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const recaptchaRef = React.createRef();

    useEffect(() => {
        expiredCaptcha ? recaptchaRef.current.reset() : <></>
        setExpiredCapture(false)
    }, [expiredCaptcha])

    const handleFieldChange = (event) => {
        const target = event.target;

        TypingRegistrationValidator(event, infoValid, setInfoValid, infoWarning, setInfoWarning);

        setRegStatus("");

        setSubmitVerification({
            ...submitVerification,
            [target.name]: false
        })

    }

    const [submitVerification, setSubmitVerification] = useState({
        username: false,
        password: false,
        email: false
    });

    const [infoValid, setInfoValid] = useState({
        username: true,
        password: true,
        email: true
    });

    const [infoWarning, setInfoWarning] = useState({
        username: "",
        password: "",
        email: ""
    });

    const authentificationModalClose = () => {
        setInfoValid({
            ...infoValid,
            username: true,
            password: true,
            email: true
        })
        setInfoWarning({
            ...infoWarning,
            username: "",
            password: "",
            email: ""
        })
        setForgotModal(false);
        setRegStatus("");
        setSubmitDisabled(false);
        setExpiredCapture(true);
    }

    const newPassportModalClose = () => {
        setInfoValid({
            ...infoValid,
            username: true,
            password: true,
            email: true
        })
        setInfoWarning({
            ...infoWarning,
            username: "",
            password: "",
            email: ""
        })
        setNewPassword(false);
        setRegStatus("");
        setSubmitDisabled(false);
    }

    function check3Validation() {
        return (infoValid.username && infoValid.password && infoValid.email)
    }

    const handlePasswordAccept = async (event) => {
        event.preventDefault();
        setSubmitVerification({
            ...submitVerification,
            password: passwordRef.current.value.length !== 0 ? true : false
        })
        const recaptchaValue = recaptchaRef.current.getValue();

        let recaptchaDTO = {
            captchaResponse: recaptchaValue
        };

        let reCaptchaResponse = await axios.post(`${apiEndpoint}/api/verify`, recaptchaDTO);

        if (passwordRef.current.value.length === 0 &&
             check3Validation()
        ) {
            setRegStatusColor("rgb(134, 37, 37)");
            setRegStatus("Įveskite naują slaptažodį!");
            setExpiredCapture(true);
        }
        else if (!check3Validation()) {
            setRegStatusColor("rgb(134, 37, 37)");
            if (!infoValid.password) setRegStatus(infoWarning.password);
            setExpiredCapture(true);
        }
        else if (!reCaptchaResponse.data) {
            setRegStatusColor("rgb(220, 70, 0)");
            setRegStatus("Turite patvirtinti, kad jūs ne robotas");
            setExpiredCapture(true);
        }
        else if (
            check3Validation() && reCaptchaResponse.data &&
            passwordRef.current.value.length !== 0
        ) {
            axios.post(`${apiEndpoint}/userChangePassword`, {
                username: userName,
                password: passwordRef.current.value
            })
                .then(response => {
                    console.log(response.data)
                    if (response.status === 200) {
                        setRegStatusColor("green");
                        setRegStatus(response.data);
                        setSubmitDisabled(true);
                    }
                })
                .catch(err => {
                    console.error(err.response.data);
                    setRegStatusColor("rgb(134, 37, 37)");
                    setRegStatus(err.response.data);
                });
        }
    }

    const handleAccept = async (event) => {
        event.preventDefault();
        setSubmitVerification({
            ...submitVerification,
            username: usernameRef.current.value.length !== 0 ? true : false,
            email: emailRef.current.value.length !== 0 ? true : false
        })
        const recaptchaValue = recaptchaRef.current.getValue();
        //console.log("recaptchaValue:\n" + recaptchaValue);

        let recaptchaDTO = {
            captchaResponse: recaptchaValue
        };

        let response = await axios.post(`${apiEndpoint}/api/verify`, recaptchaDTO)
        //console.log(response.data)

        if ((usernameRef.current.value.length === 0 ||
            emailRef.current.value.length === 0) &&
            check3Validation()
        ) {
            setRegStatusColor("rgb(134, 37, 37)");
            setRegStatus("Visi laukai privalo būti užpildyti");
            setExpiredCapture(true);
        }
        else if (!check3Validation()) {
            setRegStatusColor("rgb(134, 37, 37)");
            // infoValid.username && infoValid.password && infoValid.email
            if (!infoValid.username) setRegStatus(infoWarning.username); else
                if (!infoValid.email) setRegStatus(infoWarning.email);
            setExpiredCapture(true);
        }
        else if (!response.data) {
            setRegStatusColor("rgb(220, 70, 0)");
            setRegStatus("Turite patvirtinti, kad jūs ne robotas");
            setExpiredCapture(true);
        }
        else if (
            check3Validation() && response.data &&
            usernameRef.current.value.length !== 0 &&
            emailRef.current.value.length !== 0
        ) {
            axios.post(`${apiEndpoint}/userAuthentification`, {
                username: usernameRef.current.value,
                email: emailRef.current.value
            })
                .then(response => {
                    console.log(response.data)
                    if (response.status === 200) {
                        setRegStatusColor("green");
                        setUserName(usernameRef.current.value);
                        if (response.data) {
                            authentificationModalClose();
                            setRegStatus("Authentification - True");
                            setNewPassword(true);
                        }
                    }
                })
                .catch(err => {
                    console.error(err.response.data);
                    setRegStatusColor("rgb(134, 37, 37)");
                    setRegStatus(err.response.data);
                });
        }
    }

    return (
        <>
            <Modal show={forgotModal} onHide={authentificationModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Vartotojo autentifikacija</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <label htmlFor="txtUsername">
                            Vartotojo vardas <span className="fieldRequired">*</span>
                        </label>
                        <Table>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '0px', width: '95%', textAlign: 'center', verticalAlign: 'middle', borderBottom: 'none' }}>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="txtUsername"
                                            name="username"
                                            ref={usernameRef}
                                            style={submitVerification.username ? infoValid.username
                                                ? { border: "1px solid lightgray" }
                                                : { border: "2px solid red" }
                                                : { border: "1px solid lightgray" }}
                                            onChange={(e) => handleFieldChange(e)}
                                            data-toggle="tooltip"
                                            data-placement="top"
                                            required
                                            pattern="^[A-Za-z]{1}[\w-]{5,29}$"
                                            maxLength={30}
                                            data-for='username'
                                            data-tip='tooltip' />
                                        {submitVerification.username && (<span className="adm_warningmsg new_user_register">{infoWarning.username}</span>)}
                                        {(submitVerification.username && !infoValid.username) &&
                                            (<ReactTooltip id='username' effect='solid' place='bottom' type='warning'>
                                                <b>Vartotojo vardas turi būti 6-30 simbolių ilgio, turėti raidinius ir skaitinius simbolius, brūkšnius ir pabraukimus. Pirmasis simbolis - raidinis.</b>
                                            </ReactTooltip>)}
                                    </td>
                                    <td style={{ padding: '0px', width: '5%', textAlign: 'right', verticalAlign: 'middle', borderBottom: 'none' }}>
                                        {infoValid.username || !submitVerification.username ? <></> :
                                            <button id='btnDeleteUsername'
                                                className='deleteDish'
                                                onClick={() => {
                                                    usernameRef.current.value = "";
                                                    setInfoValid({
                                                        ...infoValid,
                                                        username: true,
                                                    });
                                                    setInfoWarning({
                                                        ...infoWarning,
                                                        username: "",
                                                    });
                                                    setSubmitVerification({
                                                        ...submitVerification,
                                                        username: false
                                                    });
                                                    setRegStatus("");
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faXmark} />
                                            </button>}
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                    <div className="form-group mt-2">
                        <label htmlFor="txtEmail" className="mb-2">
                            Elektroninio pašto adresas <span className="fieldRequired">*</span>
                        </label>
                        <Table>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '0px', width: '95%', textAlign: 'center', verticalAlign: 'middle', borderBottom: 'none' }}>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="txtEmail"
                                            name="email"
                                            ref={emailRef}
                                            style={submitVerification.email ? infoValid.email
                                                ? { border: "1px solid lightgray" }
                                                : { border: "2px solid red" }
                                                : { border: "1px solid lightgray" }}
                                            onChange={(e) => handleFieldChange(e)}
                                            pattern="[\w]+@[\w]+\.[a-z]{2,4}"
                                            maxLength={128}
                                            data-for='email'
                                            data-tip='tooltip' />
                                        {submitVerification.email && (<span className="adm_warningmsg new_user_register">{infoWarning.email}</span>)}
                                        {(submitVerification.email && !infoValid.email) &&
                                            (<ReactTooltip id='email' effect='solid' place='bottom' type='warning'>
                                                <b>Elektroninis paštas turi savo atitinkamą formatą. Tarp username ir domeno turi būti @, o po domeno .lt ar .com ir t.t.</b>
                                            </ReactTooltip>)}
                                    </td>
                                    <td style={{ padding: '0px', width: '5%', textAlign: 'right', verticalAlign: 'middle', borderBottom: 'none' }}>
                                        {infoValid.email || !submitVerification.email ? <></> :
                                            <button id='btnDeleteEmail'
                                                className='deleteDish'
                                                onClick={() => {
                                                    emailRef.current.value = "";
                                                    setInfoValid({
                                                        ...infoValid,
                                                        email: true,
                                                    });
                                                    setInfoWarning({
                                                        ...infoWarning,
                                                        email: "",
                                                    });
                                                    setSubmitVerification({
                                                        ...submitVerification,
                                                        email: false
                                                    });
                                                    setRegStatus("");
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faXmark} />
                                            </button>}
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                    <label htmlFor="recaptcha" className="mb-2">
                        Patvirtinkite:
                    </label>
                    <ReCAPTCHA
                        ref={recaptchaRef}
                        size="normal"
                        sitekey={`${process.env.REACT_APP_SITE_KEY}`}
                        onExpired={() => setExpiredCapture(true)} />
                </Modal.Body>

                <Table>
                    <tbody>
                        <tr>
                            <td style={{ paddingLeft: "17px", width: "21%", borderBottom: "none" }}>
                                <Button className="btn btn-secondary" onClick={(e) => authentificationModalClose(e)}>
                                    Atšaukti
                                </Button>
                            </td>
                            <td style={{ color: `${regStatusColor}`, width: "51%", borderBottom: "none", textAlign: 'center', verticalAlign: 'middle' }}>
                                {regStatus}
                            </td>
                            <td style={{ width: "28%", borderBottom: "none" }}>
                                <Button type="submit" className="btn btn-primary" onClick={(e) => handleAccept(e)} disabled={submitDisableed}>
                                    Patvirtinti
                                </Button>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Modal>

            <Modal show={newPassword} onHide={newPassportModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Naujas slaptažodis</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <label htmlFor="txtPassword" className="mb-2">
                            Naujas slaptažodis <span className="fieldRequired">*</span>
                        </label>
                        <Table>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '0px', width: '95%', textAlign: 'center', verticalAlign: 'middle', borderBottom: 'none' }}>
                                        <input
                                            type={passwordShown ? "text" : "password"}
                                            className="form-control"
                                            id="txtPassword"
                                            name="password"
                                            ref={passwordRef}
                                            style={
                                                submitVerification.password ? infoValid.password
                                                    ? { border: "1px solid lightgray" }
                                                    : { border: "2px solid red" }
                                                    : { border: "1px solid lightgray" }
                                            }
                                            onChange={(e) => handleFieldChange(e)}
                                            required
                                            pattern="(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$"
                                            maxLength={255}
                                            data-for='password'
                                            data-tip='tooltip'
                                        />
                                        {submitVerification.password && (<span className="adm_warningmsg new_user_register">{infoWarning.password}</span>)}
                                        {
                                            (submitVerification.password && !infoValid.password) &&
                                            (<ReactTooltip id='password' effect='solid' place='bottom' type='warning'>
                                                <b>Slaptažodis turi būti ne mažiau 8 simbolių ilgio, turėti bent vieną didžiąją ir mažąją raides ir bent vieną skaičių.</b>
                                            </ReactTooltip>)
                                        }
                                    </td>
                                    <td style={{ padding: '0px', width: '5%', textAlign: 'right', verticalAlign: 'middle', borderBottom: 'none' }}>
                                        {
                                            infoValid.password || !submitVerification.password ? <></> :
                                                <button id='btnDeletePassword'
                                                    className='deleteDish'
                                                    onClick={() => {
                                                        passwordRef.current.value = "";
                                                        setInfoValid({
                                                            ...infoValid,
                                                            password: true,
                                                        });
                                                        setInfoWarning({
                                                            ...infoWarning,
                                                            password: "",
                                                        });
                                                        setSubmitVerification({
                                                            ...submitVerification,
                                                            password: false
                                                        });
                                                        setRegStatus("");
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faXmark} />
                                                </button>
                                        }
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                    <label htmlFor="recaptcha" className="mb-2">
                        Patvirtinkite:
                    </label>
                    <ReCAPTCHA
                        ref={recaptchaRef}
                        size="normal"
                        sitekey={`${process.env.REACT_APP_SITE_KEY}`}
                        onExpired={() => setExpiredCapture(true)} />
                </Modal.Body>
                <Table>
                    <tbody>
                        <tr>
                            <td style={{ paddingLeft: "17px", width: "21%", borderBottom: "none" }}>
                                <Button className="btn btn-secondary" onClick={(e) => newPassportModalClose(e)}>
                                    Atšaukti
                                </Button>
                            </td>
                            <td style={{ color: `${regStatusColor}`, width: "51%", borderBottom: "none", textAlign: 'center', verticalAlign: 'middle' }}>
                                {regStatus}
                            </td>
                            <td style={{ width: "28%", borderBottom: "none" }}>
                                <Button type="submit" className="btn btn-primary" onClick={(e) => handlePasswordAccept(e)} disabled={submitDisableed}>
                                    Patvirtinti
                                </Button>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Modal>
        </>
    )
}

export default ForgotPasswordModal