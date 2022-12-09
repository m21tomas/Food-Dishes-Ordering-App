

const validateField = (event, infoValid, setInfoValid) => {
    const target = event.target;

    if (target.id === "id_newDishDescription" || target.id === "id_newEditDishDescription") {
        if (!event.target.value.match(/^[A-ZĄ-Ž\d]{1}[\S\s]{1,}$/)) {
            target.setCustomValidity(
                "Patiekalo pavadinimas turi prasidėti didžiąja raide arba skaičiumi, būti nuo 2 iki 2000 simbolių ir negali prasidėti tarpu"
            );
            if (target.id === "id_newDishDescription"){
                setInfoValid({ ...infoValid, description: false });
            }
            else if (target.id === "id_newEditDishDescription"){
                setInfoValid({ ...infoValid, editDescription: false });
            }
           
        }
        else {
            target.setCustomValidity("");
            if (target.id === "id_newDishDescription"){
                setInfoValid({ ...infoValid, description: true });
            }
            else if (target.id === "id_newEditDishDescription"){
                setInfoValid({ ...infoValid, editDescription: true });
            }
        }
    }

    if (target.validity.valueMissing) {
        target.setCustomValidity("Būtina užpildyti šį laukelį");
    } else
        if (target.validity.patternMismatch) {
            if (target.id === "id_name") {
                target.setCustomValidity(
                    "Pavadinimas turi prasidėti didžiąja raide, būti nuo 2 iki 64 simbolių ir negali prasidėti tarpu"
                );
                setInfoValid({ ...infoValid, menuName: false });
            }
            else if (target.id === "id_editMenuName") {
                target.setCustomValidity(
                    "Pavadinimas turi prasidėti didžiąja raide, būti nuo 2 iki 64 simbolių ir negali prasidėti tarpu"
                );
                setInfoValid({ ...infoValid, editMenuName: false });
            }
            else if (target.id === "id_dishName") {
                target.setCustomValidity(
                    "Pavadinimas turi prasidėti didžiąja raide, būti nuo 2 iki 64 simbolių ir negali prasidėti tarpu"
                );
                setInfoValid({ ...infoValid, dishName: false });
            }
            else if (target.id === "id_editDishName") {
                target.setCustomValidity(
                    "Pavadinimas turi prasidėti didžiąja raide, būti nuo 2 iki 64 simbolių ir negali prasidėti tarpu"
                );
                setInfoValid({ ...infoValid, editDishName: false });
            }
            else if (target.id === "id_editId") {
                target.setCustomValidity(
                    "Įstaigos kodą sudaro 9 skaitmenys"
                );
                setInfoValid({ ...infoValid, editId: false });
            }
            else if (target.id === "id_editName") {
                target.setCustomValidity(
                    "Pavadinimas turi prasidėti didžiąja raide, būti nuo 2 iki 64 simbolių ir negali prasidėti tarpu"
                );
                setInfoValid({ ...infoValid, editName: false });
            }
            else if (target.id === "id_editAddress") {
                target.setCustomValidity(
                    "Adresas turi prasidėti didžiąja raide, būti nuo 2 iki 64 simbolių ir negali prasidėti tarpu"
                );
                setInfoValid({ ...infoValid, editAddress: false });
            }
            return false;
        } else {
            if (target.id === "id_name") {
                target.setCustomValidity("");
                setInfoValid({ ...infoValid, menuName: true });
            }
            else if (target.id === "id_editMenuName") {
                target.setCustomValidity("");
                setInfoValid({ ...infoValid, editMenuName: true });
            }
            else if (target.id === "id_dishName") {
                target.setCustomValidity("");
                setInfoValid({ ...infoValid, dishName: true });
            }
            else if (target.id === "id_editDishName") {
                target.setCustomValidity("");
                setInfoValid({ ...infoValid, editDishName: true });
            }
            else if (target.id === "id_editId") {
                target.setCustomValidity("");
                setInfoValid({ ...infoValid, editId: true });
            }
            else if (target.id === "id_editName") {
                target.setCustomValidity("");
                setInfoValid({ ...infoValid, editName: true });
            }
            else if (target.id === "id_editAddress") {
                target.setCustomValidity("");
                setInfoValid({ ...infoValid, editAddress: true });
            }
            return true;
        }
};

export default validateField