import React, { Component } from "react";
import "../../App.css";
// import http from "../10Services/httpService";
// import apiEndpoint from "../10Services/endpoint";
// import inputValidator from "../08CommonComponents/InputValidator";
// import swal from "sweetalert";
// import DownloaderContainer from "./DownloaderContainer";
// import ForgetMe from "./ForgetMe";
// import UpdateProfileFormValidator from "../08CommonComponents/UpdateProfileFormValidator";

export default class UpdateProfileFormContainer extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     role: "",
  //     name: "",
  //     surname: "",
  //     personalCode: "",
  //     address: "",
  //     city: "",
  //     phone: "",
  //     email: "",
  //     passwordUpdate: false,
  //     oldPassword: "",
  //     newPassword: "",
  //     newPasswordRepeat: "",
  //   };
  //   this.handleChange = this.handleChange.bind(this);
  //   this.handleSubmit = this.handleSubmit.bind(this);
  //   this.handleUpdatePasswordButton =
  //     this.handleUpdatePasswordButton.bind(this);
  //   this.handleUpdatePasswordSubmit =
  //     this.handleUpdatePasswordSubmit.bind(this);
  // }

  // infoValid = {
  //   name: true,
  //   surname: true,
  //   personalCode: true,
  //   address: true,
  //   city: true,
  //   phone: true,
  //   email: true,
  // };

  // infoWarning = {
  //   name: "",
  //   surname: "",
  //   personalCode: "",
  //   address: "",
  //   city: "",
  //   phone: "",
  //   email: "",
  // };

  // componentDidMount() {
  //   http
  //     .get(`${apiEndpoint}/api/users/user`)
  //     .then((response) => {
  //       if (response.data.role === "USER") {
  //         this.setState({
  //           role: response.data.role,
  //           name: response.data.name,
  //           surname: response.data.surname,
  //           personalCode: response.data.personalCode,
  //           address: response.data.address,
  //           city: response.data.city,
  //           phone: response.data.phone,
  //           email: response.data.email,
  //           username: response.data.username,
  //         });
  //       } else {
  //         this.setState({
  //           role: response.data.role,
  //           name: response.data.name,
  //           surname: response.data.surname,
  //           personalCode: response.data.personalCode,
  //           address: response.data.address,
  //           city: response.data.city,
  //           phone: response.data.phone,
  //           email: response.data.email,
  //           username: response.data.username,
  //         });
  //       }
  //     })
  //     .catch((error) => {
  //       //console.log(error);
  //       swal({
  //         text: "Įvyko klaida perduodant duomenis iš serverio.",
  //         button: "Gerai",
  //       });
  //     });
  // }

  // /** Update user info form */
  // drawUpdateForm(role) {
  //   /** Admin & Manager form */
  //   if (role !== "USER") {
  //     return (
  //       <div>
  //         <div className="form-group">
  //           <label htmlFor="txtName">
  //             Vardas <span className="fieldRequired">*</span>
  //           </label>
  //           <input
  //             type="text"
  //             id="txtName"
  //             name="name"
  //             placeholder="Vardas"
  //             className="form-control mt-2"
  //             value={this.state.name}
  //             style={
  //               this.infoValid.name
  //                 ? { border: "1px solid lightgray" }
  //                 : { border: "2px solid red" }
  //             }
  //             onChange={this.handleChange}
  //             onInvalid={(e) => inputValidator(e)}
  //             required
  //             pattern="[A-ZĄČĘĖĮŠŲŪŽ]{1}[a-zA-Zą-ž\s\-']+$"
  //             maxLength={32}
  //           />
  //           <span className="warningmsg">{this.infoWarning.name}</span>
  //         </div>
  //         <div className="form-group">
  //           <label htmlFor="txtSurname" className="marginTopSide">
  //             Pavardė <span className="fieldRequired">*</span>
  //           </label>
  //           <input
  //             type="text"
  //             id="txtSurname"
  //             name="surname"
  //             placeholder="Pavardė"
  //             className="form-control mt-2"
  //             value={this.state.surname}
  //             style={
  //               this.infoValid.surname
  //                 ? { border: "1px solid lightgray" }
  //                 : { border: "2px solid red" }
  //             }
  //             onChange={this.handleChange}
  //             onInvalid={(e) => inputValidator(e)}
  //             required
  //             pattern="[A-ZĄČĘĖĮŠŲŪŽ]{1}[a-zA-Zą-ž\s\-']+$"
  //             maxLength={32}
  //           />
  //           <span className="warningmsg">{this.infoWarning.surname}</span>
  //         </div>
  //         <div className="form-group">
  //           <label htmlFor="txtEmail" className="marginTopSide">
  //             El. paštas <span className="fieldRequired">*</span>
  //           </label>
  //           <input
  //             type="text"
  //             id="txtEmail"
  //             name="email"
  //             placeholder="El. paštas"
  //             className="form-control mt-2"
  //             value={this.state.email}
  //             style={
  //               this.infoValid.email
  //                 ? { border: "1px solid lightgray" }
  //                 : { border: "2px solid red" }
  //             }
  //             onChange={this.handleChange}
  //             onInvalid={(e) => inputValidator(e)}
  //             required
  //             pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}"
  //             maxLength={64}
  //           />
  //           <span className="warningmsg">{this.infoWarning.email}</span>
  //         </div>
  //       </div>
  //     );
  //   } else {
  //     /** User form */
  //     return (
  //       <div>
  //         <div className="form-group">
  //           <label htmlFor="txtName">
  //             Vardas <span className="fieldRequired">*</span>
  //           </label>
  //           <input
  //             type="text"
  //             id="txtName"
  //             name="name"
  //             placeholder="Vardas"
  //             className="form-control mt-2"
  //             value={this.state.name}
  //             style={
  //               this.infoValid.name
  //                 ? { border: "1px solid lightgray" }
  //                 : { border: "2px solid red" }
  //             }
  //             onChange={this.handleChange}
  //             onInvalid={(e) => inputValidator(e)}
  //             required
  //             pattern="[A-ZĄČĘĖĮŠŲŪŽ]{1}[a-zA-Zą-ž\s\-']+$"
  //             maxLength={32}
  //           />
  //           <span className="warningmsg">{this.infoWarning.name}</span>
  //         </div>
  //         <div className="form-group">
  //           <label htmlFor="txtSurname" className="marginTopSide">
  //             Pavardė <span className="fieldRequired">*</span>
  //           </label>
  //           <input
  //             type="text"
  //             id="txtSurname"
  //             name="surname"
  //             placeholder="Pavardė"
  //             className="form-control mt-2"
  //             value={this.state.surname}
  //             style={
  //               this.infoValid.surname
  //                 ? { border: "1px solid lightgray" }
  //                 : { border: "2px solid red" }
  //             }
  //             onChange={this.handleChange}
  //             onInvalid={(e) => inputValidator(e)}
  //             required
  //             pattern="[A-ZĄČĘĖĮŠŲŪŽ]{1}[a-zA-Zą-ž\s\-']+$"
  //             maxLength={32}
  //           />
  //           <span className="warningmsg">{this.infoWarning.surname}</span>
  //         </div>
  //         <div className="form-group">
  //           <label htmlFor="txtPersonalCode" className="marginTopSide">
  //             Asmens kodas <span className="fieldRequired">*</span>
  //           </label>
  //           <input
  //             type="text"
  //             id="txtPersonalCode"
  //             name="personalCode"
  //             placeholder="Asmens kodas"
  //             className="form-control mt-2"
  //             value={this.state.personalCode}
  //             style={
  //               this.infoValid.personalCode
  //                 ? { border: "1px solid lightgray" }
  //                 : { border: "2px solid red" }
  //             }
  //             onChange={this.handleChange}
  //             onInvalid={(e) => inputValidator(e)}
  //             required
  //             pattern="[0-9]{11}"
  //             maxLength={11}
  //           />
  //           <span className="warningmsg">{this.infoWarning.personalCode}</span>
  //         </div>
  //         <div className="form-group">
  //           <label htmlFor="txtTelNo" className="marginTopSide">
  //             Telefonas <span className="fieldRequired">*</span>
  //           </label>

  //           <input
  //             type="tel"
  //             className="form-control mt-2"
  //             id="txtTelNo"
  //             name="phone"
  //             value={this.state.phone}
  //             style={
  //               this.infoValid.phone
  //                 ? { border: "1px solid lightgray" }
  //                 : { border: "2px solid red" }
  //             }
  //             onChange={this.handleChange}
  //             onInvalid={(e) => inputValidator(e)}
  //             placeholder="+37012345678"
  //             required
  //             pattern="[+]{1}[370]{3}[0-9]{8}"
  //             maxLength={12}
  //           ></input>
  //           <span className="warningmsg">{this.infoWarning.phone}</span>
  //         </div>
  //         <div className="form-group">
  //           <label htmlFor="txtEmail" className="marginTopSide">
  //             El. paštas <span className="fieldRequired">*</span>
  //           </label>
  //           <input
  //             type="text"
  //             id="txtEmail"
  //             name="email"
  //             placeholder="El. paštas"
  //             className="form-control mt-2"
  //             value={this.state.email}
  //             style={
  //               this.infoValid.email
  //                 ? { border: "1px solid lightgray" }
  //                 : { border: "2px solid red" }
  //             }
  //             onChange={this.handleChange}
  //             onInvalid={(e) => inputValidator(e)}
  //             required
  //             maxLength={64}
  //             pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}"
  //           />
  //           <span className="warningmsg2">{this.infoWarning.email}</span>
  //         </div>

  //         <div className="form-group row">
  //           <div className="form- group col-8">
  //             <label htmlFor="txtAddress" className="marginTopSide">
  //               Adresas <span className="fieldRequired">*</span>
  //             </label>
  //             <input
  //               type="text"
  //               className="form-control mt-2"
  //               id="txtAddress"
  //               name="address"
  //               placeholder="Adresas"
  //               value={this.state.address}
  //               style={
  //                 this.infoValid.address
  //                   ? { border: "1px solid lightgray" }
  //                   : { border: "2px solid red" }
  //               }
  //               onChange={this.handleChange}
  //               onInvalid={(e) => inputValidator(e)}
  //               required
  //               pattern="[\s\dA-zÀ-ž-.]{5,64}"
  //               maxLength={128}
  //             />
  //             <span className="warningmsg">{this.infoWarning.address}</span>
  //           </div>

  //           <div className="form-group col-4">
  //             <label htmlFor="txtCity" className="marginTopSide">
  //               Miestas <span className="fieldRequired">*</span>
  //             </label>
  //             <input
  //               type="text"
  //               className="form-control mt-2"
  //               id="txtCity"
  //               name="city"
  //               placeholder="Miestas"
  //               onChange={this.handleChange}
  //               value={this.state.city}
  //               style={
  //                 this.infoValid.city
  //                   ? { border: "1px solid lightgray" }
  //                   : { border: "2px solid red" }
  //               }
  //               onInvalid={(e) => inputValidator(e)}
  //               pattern="[A-ZĄČĘĖĮŠŲŪŽ]{1}[a-zA-Zą-ž\s\-']+$"
  //               maxLength={32}
  //             />
  //             <span className="warningmsg">{this.infoWarning.city}</span>
  //           </div>
  //         </div>
  //       </div>
  //     );
  //   }
  // }

  // /** Change handler */

  // handleChange(e) {
  //   inputValidator(e);
    
  //   if(e.target.name+"" !== "oldPassword" && e.target.name+"" !== "newPassword" &&  e.target.name+"" !=="newPasswordRepeat" ) {
  //      UpdateProfileFormValidator(e, this.infoValid, this.infoWarning);
  //   }
  //   this.setState({
  //     [e.target.name]: e.target.value,
  //   });
  // }

  // /** Submit handler */

  // handleSubmit(e) {
  //   e.preventDefault();
  //   http
  //     .put(`${apiEndpoint}/api/users/update`, {
  //       address: this.state.address,
  //       city: this.state.city,
  //       email: this.state.email,
  //       name: this.state.name,
  //       password: this.state.password,
  //       personalCode: this.state.personalCode,
  //       phone: this.state.phone,
  //       role: this.state.role,
  //       surname: this.state.surname,
  //       username: this.state.username,
  //     })
  //     .then((response) => {
  //       swal({
  //         text: "Naudotojo duomenys buvo sėkmingai atnaujinti",
  //         button: "Gerai",
  //       });
  //     })
  //     .catch((error) => {
  //       swal({
  //         text: error.response.data,
  //         button: "Gerai",
  //       });
  //     });
  // }

  // /**Update password form */

  // drawUpdatePasswordForm() {
  //   if (this.state.passwordUpdate) {
  //     return (
  //       <div className="form">
  //         <form onSubmit={this.handleUpdatePasswordSubmit}>
  //           <div className="form-group">
  //             <label htmlFor="txtOldPassword">
  //               Senas slaptažodis <span className="fieldRequired">*</span>
  //             </label>
  //             <input
  //               type="password"
  //               id="txtOldPassword"
  //               name="oldPassword"
  //               className="form-control mt-2"
  //               value={this.state.oldPassword}
  //               onChange={this.handleChange}
  //               onInvalid={(e) => inputValidator(e)}
  //               required
  //             />
  //           </div>
  //           <div className="form-group mt-3">
  //             <label htmlFor="txtNewPassword">
  //               Įveskite naują slaptažodį{" "}
  //               <span className="fieldRequired">*</span>
  //             </label>
  //           </div>
  //           <div className="form-group mt-3">
  //             <input
  //               type="password"
  //               id="txtNewPassword"
  //               name="newPassword"
  //               className="form-control mt-2"
  //               value={this.state.newPassword}
  //               onChange={this.handleChange}
  //               onInvalid={(e) => inputValidator(e)}
  //               required
  //               pattern="(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$"
  //             />
  //           </div>
  //           <div className="form-group mt-3">
  //             <label htmlFor="txtRepeatNewPassword">
  //               Pakartokite naują slaptažodį{" "}
  //               <span className="fieldRequired">*</span>
  //             </label>
  //             <input
  //               type="password"
  //               id="txtNewPasswordRepeat"
  //               name="newPasswordRepeat"
  //               className="form-control mt-2"
  //               value={this.state.newPasswordRepeat}
  //               onChange={this.handleChange}
  //               onInvalid={(e) => inputValidator(e)}
  //               required
  //               pattern="(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$"
  //             />
  //             <p className="text-primary">
  //               Dėmesio! Slaptažodis turi būti ne mažiau 8 simbolių ilgio,
  //               turėti bent vieną didžiąją ir mažąją raides ir bent vieną
  //               skaičių.
  //             </p>
  //           </div>
  //           <div className=" form-group">
  //             <button type="submit" className="btn btn-primary mt-3">
  //               Išsaugoti
  //             </button>
  //           </div>
  //         </form>
  //       </div>
  //     );
  //   } else {
  //     return (
  //       <button
  //         className="btn btn-primary"
  //         onClick={this.handleUpdatePasswordButton}
  //       >
  //         Keisti
  //       </button>
  //     );
  //   }
  // }

  // /** Update password button handler */

  // handleUpdatePasswordButton() {
  //   this.setState({
  //     passwordUpdate: true,
  //   });
  // }

  // /** Update password submit handler */

  // handleUpdatePasswordSubmit(e) {
  //   e.preventDefault();
  //   if (this.state.newPassword !== this.state.newPasswordRepeat) {
  //     swal({
  //       text: "Slaptažodžiai nesutampa.",
  //       button: "Gerai",
  //     });
  //   } else {
  //     http
  //       .put(
  //         `${apiEndpoint}/api/users/updatepassword/${this.state.oldPassword}/${this.state.newPassword}`,
  //         {}
  //       )
  //       .then((response) => {
  //         swal({
  //           text: "Naudotojo slaptažodis atnaujintas sėkmingai",
  //           button: "Gerai",
  //         }).then(() => {
  //           this.setState({
  //             passwordUpdate: false,
  //             oldPassword: "",
  //             newPassword: "",
  //             newPasswordRepeat: "",
  //           });
  //         });
  //       })
  //       .catch((error) => {
  //         //console.log(error);
  //         swal({
  //           text: error.response.data,
  //           button: "Gerai",
  //         });
  //       });
  //   }
  // }

  render() {
   

    return (
      <div className="container pt-4">
        <h6 className="py-3">Admino profilis</h6>

        {/* <div className="row">
          <div className="form col-lg-7">
            <form onSubmit={this.handleSubmit}>
              {this.drawUpdateForm(this.state.role)}

              <button
                type="submit"
                id="btnSubmit"
                className="btn btn-primary marginTopSide"
              >
                Išsaugoti
              </button>
            </form>
          </div>
        </div>
        <div className="row">
          <div className="col-12 pt-3">
            <h6 className="py-3">
              <b>Naudotojo prisijungimo informacija</b>
            </h6>
          </div>

          <div className="col-3">
            <p>Naudotojo vardas</p>
          </div>
          <div className="col-9">
            <p>{this.state.username}</p>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <h6 className="py-3">
              <b>Keisti slaptažodį</b>
            </h6>
          </div>

          <div className="col-lg-7">{this.drawUpdatePasswordForm()}</div>
        </div>

        {currenUserRole === "USER" && (
          <div>
            <h6 className="pt-4">
              <b>Tvarkyti paskyrą</b>
            </h6>

            <div className="row">
              <div className="col-12">
                <DownloaderContainer />
              </div>

              <div className="col-12 py-3">
                <ForgetMe />
              </div>
            </div>
          </div>
        )} */}
      </div>
    );
  }
}
