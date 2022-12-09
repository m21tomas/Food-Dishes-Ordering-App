import React, { Component } from "react";
import axios from "axios";

import Pagination from "../07CommonComponents/Pagination";

import apiEndpoint from "../06Services/endpoint";
import "../../App.css";

import UserListTable from "./UserListTable";

export class UserListContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      naudotojai: [],
      pageSize: 10,
      currentPage: 1,
      totalPages: 0,
      totalElements: 0,
      numberOfElements: 0
     // passwordResetRequests: [],
    };
  }
  componentDidMount() {
    this.getUserInfo(this.state.currentPage);
  }

  getUserInfo(currentPage) {
    const { pageSize } = this.state;
    let page = currentPage - 1;

    if (page < 0) page = 0;

    var uri = `${apiEndpoint}/api/users/admin/allusers?page=${page}&size=${pageSize}`;

    // axios
    //   .get(`${apiEndpoint}/passwordresetrequests/getAllRequests`)
    //   .then((response) => {
    //     this.setState({
    //       ...this.state,
    //       passwordResetRequests: response.data,
    //     });
    //   })
    //   .catch(() => {});

    axios
      .get(uri)
      .then((response) => {
        this.setState({
          naudotojai: this.mapToViewModel(
            response.data.content
            // this.state.passwordResetRequests
          ),
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements,
          numberOfElements: response.data.numberOfElements,
          currentPage: response.data.number + 1,
        });
      })
      .catch(() => {});
  }

  // checkIfUserIsRequestingPassword(UID, passList) {
  //   return passList.some((element) => element.userId === UID);
  // }

  mapToViewModel(data) { //mapToViewModel(data, passList) {
    const naudotojai = data.map((user) => ({
      id: user.userId,
      username: user.username,
      role: user.role
      // isRequestingPasswordReset: this.checkIfUserIsRequestingPassword(
      //   user.userId,
      //   passList
      // ),
    }));

    return naudotojai;
  }

  handleDelete = (item) => {
    const username = item.username;

    const { currentPage, numberOfElements } = this.state;
        const page = numberOfElements === 1 ? currentPage - 1 : currentPage;

        axios.delete(`${apiEndpoint}/api/users/admin/delete/${username}`)
          .then((response) => {
            console.log(response.data[0])
            this.getUserInfo(page);
          })
          .catch(() => {});
  };

  // handleRestorePassword = (item) => {
  //   const username = item.username;

  //   swal({
  //     text: "Ar tikrai norite atkurti pirminį slaptažodį?",
  //     buttons: ["Ne", "Taip"],
  //     dangerMode: true,
  //   }).then((actionConfirmed) => {
  //     if (actionConfirmed) {
  //       http
  //         .put(`${apiEndpoint}/api/users/admin/password/${username}`)
  //         .then((response) => {
  //           const { currentPage, numberOfElements } = this.state;
  //           const page = numberOfElements === 1 ? currentPage - 1 : currentPage;
  //           this.getUserInfo(page);
  //           swal({
  //             text: response.data,
  //             button: "Gerai",
  //           });
  //         })
  //         .catch(() => {});
  //     }
  //   });
  // };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
    this.getUserInfo(page);
  };

  render() {
    const { naudotojai } = this.state;
    let count = 0;

    if (naudotojai !== undefined) count = naudotojai.length;

    if (count === 0)
      return (
        <div className="container pt-5">
          <h6 className="pt-5">Naudotojų sąrašas tuščias.</h6>
        </div>
      );

    const { totalPages } = this.state;

    return (
      <React.Fragment>
        <UserListTable
          naudotojai={naudotojai}
          onDelete={this.handleDelete}
         // onRestorePassword={this.handleRestorePassword}
        />

        {totalPages > 1 && (
          <div className="d-flex justify-content-center">
            <Pagination
              itemClass="page-item"
              linkClass="page-link"
              currentPage={this.state.currentPage}
              pageSize={this.state.pageSize}
              itemsCount={this.state.totalElements}
              pageRangeDisplayed={15}
              onPageChange={this.handlePageChange.bind(this)}
            />
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default UserListContainer;
