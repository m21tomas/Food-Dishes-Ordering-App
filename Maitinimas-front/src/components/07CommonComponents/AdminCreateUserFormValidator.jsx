//Validator for Administrator for new User creation fields inputs validation. For warning messages in span fields.

const AdminCreateUserFormValidator = (e, infoValid, infoWarning) => {
  switch (e.target.name) {
    case "username":
      if (e.target.validity.patternMismatch) {
        infoValid.username = false;
        infoWarning.username = "Neteisingas vartotojo vardo formatas";
      } else {
        infoValid.username = true;
        infoWarning.username = "";
      }
      return infoValid.username;

    case "password":
      if (e.target.validity.patternMismatch) {
        infoValid.password = false;
        infoWarning.password = "Neteisingas slaptažodžio formatas";
      } else {
        infoValid.password = true;
        infoWarning.password = "";
      }
      return infoValid.password;

    case "email":
      if (e.target.validity.patternMismatch) {
        infoValid.email = false;
        infoWarning.email = "Neteisingas el. pašto formatas";
      } else {
        infoValid.email = true;
        infoWarning.email = "";
      }
      return infoValid.email;

    default:
      return infoValid({
        ...infoValid,
        [e.target.name]: true,
      });
  }
};
export default AdminCreateUserFormValidator;
