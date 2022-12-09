//For Administrator create user form input fields custom validity
function AdminCreateUserFormInputValidity(event) {
  const target = event.target;

  if (target.validity.valueMissing) {
    target.setCustomValidity(target.placeholder + " yra privalomas laukelis");
  } 
  else if (target.name === "email") {
      if (target.validity.patternMismatch) {
        target.setCustomValidity("Neteisingas el. pašto formatas");
      } else {
        target.setCustomValidity("");
      }
  }  
  else if (target.id === "txtPassword" ||
           target.id === "txtNewPassword" ||
           target.id === "txtNewPasswordRepeat") {
      if (target.validity.patternMismatch) {
        target.setCustomValidity(
          "Slaptažodis turi būti ne mažiau 8 simbolių ilgio, turėti bent vieną didžiąją ir mažąją raides ir bent vieną skaičių."
        );
      } else {
        target.setCustomValidity("");
      }
  } 
  else if (target.id === "txtUsername") {
    if (target.validity.patternMismatch) {
      target.setCustomValidity(
        "Vartotojo vardas turi būti 6-30 simbolių ilgio, turėti raidinius ir skaitinius simbolius, brūkšnius ir pabraukimus. Pirmasis simbolis - raidinis."
      );
    } else {
      target.setCustomValidity("");
    }
  }
  else if (target.id === "txtOldPassword") {
      target.setCustomValidity("");
  }
  
}

export default AdminCreateUserFormInputValidity;
