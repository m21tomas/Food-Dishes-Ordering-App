import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";
import apiEndpoint from "../06Services/endpoint";
import CartContext from "../06Services/CartContext";
import defaultImage from "../../images/defaultImg.jpg";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

function ChosenCanteen() {
    const params = useParams();
    const [canteen, setCanteen] = useState([]);
    const {cartState, setCartState} = React.useContext(CartContext);

    useEffect(() => {
        axios.get(`${apiEndpoint}/api/istaigos/canteen/${params.id}`)
            .then(response => {
                setCanteen((canteen) => ({
                    ...canteen,
                    id: response.data.id,
                    name: response.data.name,
                    address: response.data.address,
                    image: response.data.image,
                   // Cannot read properties of undefined (reading 'map') at ChosenCanteen.jsx:27:48
                    menus: response.data.menus.map(menuItem => ({
                        id: menuItem.id,
                        name: menuItem.name,
                        dishes: menuItem.dishes.map(dishItem => ({
                            id: dishItem.id,
                            name: dishItem.name,
                            description: dishItem.description,
                            quantity: 1,
                            inputFocus: false
                        }))
                    }))
                }));
                //setCanteen(response.data);
                //console.log(JSON.stringify(response.data))
            })
            .catch((err) => { console.log(JSON.stringify(err.response.data)) });
    }, [params.id])

    const handleDishQuantityChange = (e, menuIndex, dishIndex, focusStatus) => {
        e.preventDefault();
        const changedCanteenDishQuantityMenusArray = canteen.menus.map((menusItem, mIndex) => {
            if (mIndex === menuIndex) {
                return {
                    id: menusItem.id,
                    name: menusItem.name,
                    dishes: menusItem.dishes.map((dishItem, dIndex) => {
                        if (dIndex === dishIndex) {
                            function changeQuantity() {
                                if (e.target.id !== "quantity-control-input") {
                                    if (e.target.id === "quantity-control-plus") return dishItem.quantity += 1;
                                    else if (dishItem.quantity > 1) return dishItem.quantity -= 1;
                                    else return dishItem.quantity;
                                }
                                else {
                                    var res = e.target.value;
                                        if(!focusStatus) {
                                            res = res.replace(/\D/g, "");
                                            res = res*1;
                                            if(res === 0) res = 1;
                                        }
                                    return res;
                                }
                            }
                            return {
                                id: dishItem.id,
                                name: dishItem.name,
                                description: dishItem.description,
                                quantity: changeQuantity(),
                                inputFocus: focusStatus ? true : false
                                // https://codesandbox.io/s/pensive-wood-7g04dc
                                // https://codesandbox.io/s/serene-neco-v7h33u
                                // https://codesandbox.io/s/friendly-wu-8sc3d3
                                // https://codesandbox.io/s/friendly-wu-8sc3d3-bad-example001-8sc3d3
                                // https://codesandbox.io/s/friendly-wu-9sc4d4-good-example-forked-cld9ic
                            }
                        }
                        else { return dishItem }
                    })
                }
            }
            else { return menusItem }
        })
        setCanteen({
            ...canteen,
            menus: changedCanteenDishQuantityMenusArray
        })
    }

    function handleAddDishToCart (menuId, dishId, quantity){

        const dishToCartRequestDTO = {
            menuId: menuId,
            dishId: dishId,
            quantity: quantity
        }

        axios.post(`${apiEndpoint}/api/cart/add`, dishToCartRequestDTO)
             .then(response => {
                console.log(JSON.stringify(response.data));
                setCartState(cartState+1);
             })
             .catch((err) => { console.log(err.response.data.serverResponse) });
    }

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="wrapper wrHeight" style={{ height: '512px' }}>
                        <img src={canteen.image !== null ? `data:image/*;base64,${canteen.image}`
                            : defaultImage}
                            alt="Failed To Load" />
                    </div>
                </div>
                <div className="row">
                    <h3 style={{ textAlign: 'center', paddingTop: '16px' }}>{canteen.name}</h3>
                    <h5 style={{ textAlign: 'center', paddingTop: '8px', marginBottom: '24px' }}>{canteen.address}</h5>
                </div>
                <div className="row">
                    {
                        canteen.menus === undefined ? null :
                            canteen.menus.map((menusItem, menuIndex) =>
                                <React.Fragment key={menuIndex}>
                                    <h4 key={menuIndex} style={{ textAlign: 'center', paddingTop: '16px' }}>{menusItem.name}</h4>
                                    <div style={menusItem.dishes.length !== null ? menusItem.dishes.length > 3 ?
                                        { height: '400px', overflowY: 'scroll' } : null
                                        : null
                                    }
                                    >
                                        <Table striped>
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th style={{ width: '15%' }}>Pavadinimas</th>
                                                    <th style={{ width: '60%' }}>Aprašymas</th>
                                                    <th style={{ width: '7%', textAlign: 'center', verticalAlign: 'middle' }}>
                                                        Į krepšelį
                                                    </th>
                                                    <th style={{ width: '139px', textAlign: 'center', verticalAlign: 'middle' }}>Kiekis</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    menusItem.dishes.map((dish, dishIndex) =>
                                                        <tr key={dishIndex}>
                                                            <td>{dishIndex + 1}</td>
                                                            <td>{dish.name}</td>
                                                            <td>{dish.description}</td>
                                                            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                                                <Button onClick={() => handleAddDishToCart(menusItem.id, dish.id, dish.quantity)}
                                                                    style={{ width: '60px', height: '29px' }}
                                                                    variant="outline-danger"
                                                                >
                                                                    <FontAwesomeIcon icon={faShoppingCart} style={{ textAlign: 'center', verticalAlign: '5%' }} />
                                                                </Button>

                                                            </td>
                                                            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                                                <Button size="sm"
                                                                    className="quantity-control minus"
                                                                    variant="outline-secondary"
                                                                    id="quantity-control-minus"
                                                                    onClick={(e) => handleDishQuantityChange(e, menuIndex, dishIndex, false)}
                                                                >
                                                                    -
                                                                </Button>
                                                                <input className="text-center"
                                                                    type="text"
                                                                    style={{ maxWidth: '62px', fontSize: '0.9rem' }}
                                                                    value={ dish.inputFocus ? dish.quantity : dish.quantity+ " vnt."}
                                                                    id="quantity-control-input"
                                                                    onChange={(e) => handleDishQuantityChange(e, menuIndex, dishIndex, true)}
                                                                    onBlur={(e) => handleDishQuantityChange(e, menuIndex, dishIndex, false)}
                                                                />
                                                                <Button size="sm"
                                                                    className="quantity-control plus"
                                                                    variant="outline-secondary"
                                                                    id="quantity-control-plus"
                                                                    onClick={(e) => handleDishQuantityChange(e, menuIndex, dishIndex, false)}
                                                                >
                                                                    +
                                                                </Button>
                                                            </td>

                                                        </tr>
                                                    )
                                                }
                                            </tbody>
                                        </Table>

                                    </div>

                                </React.Fragment>
                            )
                    }
                </div>
            </div>



        </>
    )
}

export default ChosenCanteen
