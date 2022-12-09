
const NewUserRegistrationValidation = (registerState, infoValid, setInfoValid, infoWarning, setInfoWarning) => {

    if (!registerState.username.match(/^[A-Za-z]{1}[\w-]{5,29}$/)) {
        setInfoValid({
            ...infoValid,
            username: false
        })
        setInfoWarning({
            ...infoWarning,
            username: "Neteisingas vartotojo vardo formatas"
        })
    } else {
        setInfoValid({
            ...infoValid,
            username: true
        })
        setInfoWarning({
            ...infoWarning,
            username: ""
        })
    }
    return infoValid;
    if (!registerState.password.match(/(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)) {
        setInfoValid({
            ...infoValid,
            password: false
        })
        setInfoWarning({
            ...infoWarning,
            password: "Neteisingas slaptažodžio formatas"
        })
    } else {
        setInfoValid({
            ...infoValid,
            password: true
        })
        setInfoWarning({
            ...infoWarning,
            password: ""
        })
    }
    return infoValid;
    if (!registerState.email.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}/)) {
        setInfoValid({
            ...infoValid,
            email: false
        })
        setInfoWarning({
            ...infoWarning,
            email: "Neteisingas el. pašto formatas"
        })
    } else {
        setInfoValid({
            ...infoValid,
            email: true
        })
        setInfoWarning({
            ...infoWarning,
            email: ""
        })
    }

    return infoValid;
}

export default NewUserRegistrationValidation