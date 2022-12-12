
const TypingRegistrationValidator = (e, infoValid, setInfoValid, infoWarning, setInfoWarning) => {
    switch (e.target.name) {
        case "username":
            if (e.target.validity.patternMismatch) {
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
            return infoValid.username;
        case "password":
            if (e.target.validity.patternMismatch) {
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
            return infoValid.password;
        case "email":
           // if (e.target.validity.patternMismatch) {
            //match(/^([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@([0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?(\.[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?)*|\[((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|IPv6:((((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){6}|::((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){5}|[0-9A-Fa-f]{0,4}::((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){4}|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):)?(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){3}|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,2}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){2}|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,3}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,4}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::)((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3})|(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3})|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,5}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3})|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,6}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::)|(?!IPv6:)[0-9A-Za-z-]*[0-9A-Za-z]:[!-Z^-~]+)])$/)
            // if (!e.target.value.match(/[\w]+@[\w]+\.[a-z]{2,4}/)) {
            if (e.target.validity.patternMismatch) {
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
            return infoValid.email;
        default:
            setInfoValid({
                ...infoValid,
                [e.target.name]: true
            })
            setInfoWarning({
                ...infoWarning,
                [e.target.name]: ""
            })
    }
};
export default TypingRegistrationValidator;