import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";

import "../../App.css";

import apiEndpoint from "../06Services/endpoint";

import inputValidator from "../07CommonComponents/AdminCreateUserFormInputValidity";
import AdminCreateUserFormValidator from "../07CommonComponents/AdminCreateUserFormValidator";

class AdminCreateUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      role: "ADMIN",
      username: "",
      password: "",
      email: ""
    };
  }

  infoValid = {
    username: true,
    password: true,
    email: true
  };

  infoWarning = {
    username: "",
    password: "",
    email: ""
  };

  checkSubmit() {
    // let allOk = false;
    // if(this.state.username.length > 0 && this.infoValid.username &&
    //    this.state.password.length > 0 && this.infoValid.password ){
    //     allOk = true;
    //    }
    // return allOk;
    return true;
  };

  resetState = () => {
    this.setState({
      username: "",
      password: "",
      email: ""
    });

    this.infoValid = {
      username: true,
      password: true,
      email: true
    };

    this.infoWarning = {
      username: "",
      password: "",
      email: ""
    };
  };

  roleDropdownOnChange(event) {
    event.preventDefault();
    this.setState({
      role: event.target.value,
    });
    this.resetState();
  }

  handleChange(event) {
    const target = event.target;
    AdminCreateUserFormValidator(event, this.infoValid, this.infoWarning);
    inputValidator(event);
    this.setState({
      [target.name]: target.value,
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    // event.stopPropagation();
    axios
      .post(`${apiEndpoint}/api/users/admin/createuser`, {
        role: this.state.role,
        email: this.state.email,
        username: this.state.username,
        password: this.state.password
      })
      .then((response) => {
        console.log(response);
        if(response.status === 201){
             this.props.history.push("/");
            // this.props.history("/admin");
        }
      })
      .catch((error) => {
        console.log(error.data);
        alert({
          text: error.data
        });
      })
      // .then(() => {
      //   alert("Naujas naudotojas buvo sėkmingai sukurtas." )
      //   .then(() => {
      //     alert("Naujas naudotojas buvo sėkmingai sukurtas." )
      //     console.log("Naujas naudotojas buvo sėkmingai sukurtas.")
      //     this.props.history.push("/new");
      //     this.props.history.replace("/admin");
      //   });
      // })
  };

  render() {
    return (
      <div className="form">
        <h6 className="py-3">
          <b>Naujo naudotojo sukūrimas</b>
        </h6>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group mt-2 mb-3">
            <label htmlFor="role-selector" className="mb-2">
              Naudotojo rolė:
            </label>
            <select
              name="role-selector"
              id="selRole"
              className="form-control"
              value={this.state.role}
              onChange={(e) => this.roleDropdownOnChange(e)}
            >
              <option value="ADMIN">Administratorius</option>
              <option value="USER">Klientas</option>
            </select>
          </div>
          <div className="form-group mb-3">
            <label htmlFor="txtEmail" className="mb-2">
              El. paštas
            </label>
            <input
              type="text"
              className="form-control"
              id="txtEmail"
              name="email"
              value={this.state.email}
              style={
                this.infoValid.email
                  ? { border: "1px solid lightgray" }
                  : { border: "2px solid red" }
              }
              onChange={(e) => this.handleChange(e)}
              onInvalid={(e) => inputValidator(e)}
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}"
              maxLength={128}
            />
            <span className="adm_warningmsg">{this.infoWarning.email}</span>
            <div className="form-group mt-2">
              <label htmlFor="txtUsername" className="mb-2">
                Naudotojo vardas <span className="fieldRequired">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="txtUsername"
                name="username"
                value={this.state.username}
                style={
                  this.infoValid.username
                    ? { border: "1px solid lightgray" }
                    : { border: "2px solid red" }
                }
                onChange={(e) => this.handleChange(e)}
                onInvalid={(e) => inputValidator(e)}
                required
                pattern="^[A-Za-z0-9\-_]{5,29}$"
                maxLength={30}
              />
              <span className="adm_warningmsg">{this.infoWarning.username}</span>
            </div>
            <div className="form-group mt-2">
              <label htmlFor="txtPassword" className="mb-2">
                Slaptažodis <span className="fieldRequired">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="txtPassword"
                name="password"
                value={this.state.password}
                style={
                  this.infoValid.password
                    ? { border: "1px solid lightgray" }
                    : { border: "2px solid red" }
                }
                onChange={(e) => this.handleChange(e)}
                onInvalid={(e) => inputValidator(e)}
                required
                pattern="(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$"
              />
              <span className="adm_warningmsg">{this.infoWarning.password}</span>
            </div>

          </div>

          <h6 className="py-3">
            <b>Naudotojo prisijungimai</b>
          </h6>

          <div className="row">
            <div className="col-12">
              <p>
                <b>Naudotojo vardas</b>
              </p>
            </div>
            <div className="col-12">
              <p>{this.state.username}</p>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <p>
                <b>Slaptažodis</b>
              </p>
            </div>
            <div className="col-12">
              <p>{this.state.password}</p>
            </div>
          </div>
          <div className="row justify-content-between">
            <button
              className="btn btn-outline-danger col-3 ms-3"
              onClick={this.resetState}
              id="btnClean"
            >
              Išvalyti
            </button>
            <button
              type="submit"
              className="btn btn-primary col-3 me-3"
              id="btnCreate"
              disabled={!(this.state.username.length > 0 && this.infoValid.username &&
                          this.state.password.length > 0 && this.infoValid.password )}
            >
              Sukurti
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default withRouter(AdminCreateUser);
