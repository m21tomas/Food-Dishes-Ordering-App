import React from 'react';
import {useHistory} from 'react-router-dom';
import axios from 'axios';

import '../../App.css';
import apiEndpoint from '../06Services/endpoint';
import AuthContext from "../06Services/AuthContext";

export default function LogoutContainer() {

    const { dispatch } = React.useContext(AuthContext);
    const history = useHistory();

    const handleLogout = e => {
      axios.post(`${apiEndpoint}/logout`)
      .then(response => {
        console.log("Unauthenticating");
        localStorage.setItem("auth", "");
        dispatch({ 
          type: "LOGOUT"
        })
        history.push("/")
      })
      .catch(error => {
        //console.log("Error on logout", error);
      });        

    }

    return (
        <div>
            <button onClick={handleLogout} id="btnLogout" className="btn btn-outline-primary" >Atsijungti</button>
        </div>
    )
}
