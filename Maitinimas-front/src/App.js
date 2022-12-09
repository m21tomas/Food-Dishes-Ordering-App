import React, { useEffect, useReducer, useState } from "react";
import { useLocation, Link } from 'react-router-dom';
import { Switch, Route, Redirect } from "react-router-dom";
import AuthContext from './components/06Services/AuthContext';
import AdminCanteenContext from './components/06Services/AdminCanteenContext';
import apiEndpoint from './components/06Services/endpoint';
import CommonErrorHandler from './components/06Services/CommonErrorHandler';
import Login from './components/02Login/LoginContainer';
import Admin from './components/04Admin/AdminContainer';
import CanteenContainer from './components/03Main/CanteenContainer';
import AdminNavBar from './components/01Navigation/AdminNavBar';
import NotFound from "./components/02Login/NotFound";
import AdminAddMenu from "./components/03Main/AdminAddMenu";

import './App.css';
import axios from "axios";

var initState = {
  isAuthenticated: null,
  username: null,
  role: null,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        username: action.payload.username,
        role: action.payload.role,
        error: null,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        username: null,
        role: null,
        error: null,
      };
    case "ERROR":
      return {
        ...state,
        isAuthenticated: false,
        username: null,
        role: null,
        error: action.payload,
      };
    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, initState);
  const [canteenState, setCanteenState] = useState([]);

  useEffect(() => {
    if (state.isAuthenticated === null) {
      axios
        .get(`${apiEndpoint}/api/loggedUserRole`)
        .then((resp) => {
          dispatch({
            type: "LOGIN",
            payload: { role: resp.data },
          });
        })
        .catch((error) => {
          const unexpectedError =
            error.response &&
            error.response.status >= 400 &&
            error.response.status < 500;

          if (
            !unexpectedError ||
            (error.response && error.response.status === 404)
          ) {
            alert("Įvyko klaida, puslapis nurodytu adresu nepasiekiamas");
            dispatch({
              type: "ERROR",
            });
          } else
            dispatch({
              type: "ERROR",
              payload: error.response.status,
            });
        });
    }
  }, [state.isAuthenticated]);

  const location = useLocation();

  if (state.isAuthenticated) {

    switch (state.role) {
      case "ADMIN":
        return (
          <AuthContext.Provider value={{ state, dispatch }}>
            <AdminCanteenContext.Provider value={{ canteenState, setCanteenState }}>
              <CommonErrorHandler>
                <div className="container-fluid px-0">
                  <AdminNavBar>
                    <Switch>
                      <Route exact path="/" component={CanteenContainer} />
                      <Route exact path="/home" component={CanteenContainer} />

                      <Route exact path="/users" component={Admin} />

                      <Route exact path="/canteen" component={CanteenContainer} />

                      <Route exact path="/addMenu/:id" component={AdminAddMenu}/>

                      <Route path="*" component={NotFound} />
                    </Switch>
                  </AdminNavBar>
                </div>
              </CommonErrorHandler>
            </AdminCanteenContext.Provider>
          </AuthContext.Provider>
        );
      case "USER":
        return (
          <div><h1>Useris</h1></div>
        );
      default:
        return (
          <div className="container pt-5">
            <p className="ml-2">Puslapis adresu: {apiEndpoint}{location.pathname} nerastas</p>
            <Link to="/home" className="btn btn-primary ml-2">Pradinis</Link>
          </div>
        );
    }
  }
  else if (state.isAuthenticated === false) {
    return (
      <div>
        <AuthContext.Provider value={{ state, dispatch }}>
          <Switch>
            <Route exact path="/login" component={Login} />
            {/* <Route exact path="/createAccount" component={CreateUserForm} /> */}
            <Route path="*">
              <Redirect to="/login" />
            </Route>
          </Switch>
        </AuthContext.Provider>
      </div>
    );
  }

}

export default App;
