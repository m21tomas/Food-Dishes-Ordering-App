import React, { Component } from 'react';

import '../../App.css';

import Table from '../07CommonComponents/Table';
//import Modal from '../08CommonComponents/Modal';

class UserListTable extends Component {

    columns = [
        {                              
            key: 'username',
            path: 'username',
            label: 'Naudotojo vardas',
            content: naudotojas => <span>{naudotojas.username}</span>
        },
        {            
            key: 'role',
            path: 'role',
            label: 'Naudotojo rolė',
            content: naudotojas => <span>{naudotojas.role === "ADMIN" ? "Administratorius" : "Klientas"}</span>
        }, 
        // {            
        //     key: 'update',
        //     label: 'Pirminis slaptažodis',
        //     content: naudotojas => {
        //         if(naudotojas.isRequestingPasswordReset) {
        //             return (
        //             <div className="d-grid">   
        //                 <button onClick={() => this.props.onRestorePassword(naudotojas)} 
        //                 id="btnRestoreUserPassword" className="btn btn-secondary btn-sm"><b>Atkurti</b></button>
        //             </div>
        //             )
        //         }
        //         else {
        //             return (
        //                 <div className="d-grid">
        //                     <button onClick={() => this.props.onRestorePassword(naudotojas)} 
        //                     id="btnRestoreUserPassword" className="btn btn-outline-primary btn-sm">Atkurti</button>
        //                 </div>
        //             )
        //         }
        //     }
        // },
  
        {            
            key: 'delete',
            label: 'Ištrinti naudotoją',
            content: naudotojas => 
                <div className="d-grid">
                    <button onClick={() => this.props.onDelete(naudotojas)} 
                     id="btnDeleteUser" className="btn btn-outline-danger btn-sm">Ištrinti</button>
                </div>
           
        }
   
    ]


    render() {
        const { naudotojai } = this.props;
        return (
            <Table
                columns={this.columns}
                data={naudotojai}

            />
        );
    }
}


export default UserListTable;