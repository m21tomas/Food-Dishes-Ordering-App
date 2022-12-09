import React, { Component } from 'react';
import AdminCreateUser from './AdminCreateUser';
import UserListContainer from './UserListContainer';
import '../../App.css';

export class AdminContainer extends Component {

    render() {
        return (
            <div>
                {/* <h1>Admino konteineris</h1> */}
                <div className="container pt-4">
                    <div className="row ">
                        <div className="bg-light pb-3 col-12 col-sm-12 col-md-12 col-lg-3">
                            <AdminCreateUser />
                        </div>
                        <div className="col-12 col-sm-12 col-md-12 col-lg-9 pt-1">
                            <UserListContainer />
                        </div>
                    </div>
                </div>    
            </div>
        )
    }
}

export default AdminContainer
