import * as React from 'react';
import { useState, useEffect } from 'react';
import { Button, TextField } from '@mui/material';
import axios from 'axios';
import CartCard from "../components/cartCard";
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';



/*
Page that lets you search books and shows a bunch of books 
*/
function Checkout() {
    let cardList = [];
    //TODO: make a query here to get cart and calculate total
    let total = 0;
    const [cart, setCart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [address, setAddress] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [cardHolderName, setCardHolderName] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvc, setCvc] = useState("");

    const [currCard, setCurrCard] = useState("");
    const [cardsList, setCardsList] = useState([]);

    const userID = localStorage.getItem("user");

    useEffect(() => {

        
        axios.get(`http://localhost:5000/selections/` + userID).then(res => {
            setCart(res.data);
            let temp = 0;
            for (let selection of res.data) {
                temp += selection.quantity * selection.book.price;
            }
            setTotalPrice(temp);
        });

        axios.get(`http://localhost:5000/usercards/` + userID).then(res => {
            setCardsList(res.data);
        });

    }, []);


    const addCard = () => {
        if ( !cardNumber || !cardHolderName || !expiryDate || !cvc) {
            return;
        }

        axios.post(`http://localhost:5000/usercards`, {
            userID, cardHolderName, cardNumber, expiryDate, securityCode: cvc
        }).then(res => {

            
            setAddress("");
            setCardNumber("");
            setCardHolderName("");
            setExpiryDate("");
            setCvc("");
            axios.get(`http://localhost:5000/usercards/` + userID).then(res => {
                setCardsList(res.data);
            });

        });
    }
    const completeOrder = () => {

    }

    return (
        <div style={{ display: "flex", padding: "2%", width: "100%", flexDirection: "column" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>

                <h1>Checkout Page</h1>

                <div>
                    <h2>Cart</h2>
                    <Grid style={{ marginTop: "5px", width: "100%", paddingBottom: "2%", alignItems: "center" }} container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                        {cart ? cart.map((selection, index) => (

                            <Grid item xs={2} sm={4} md={4} key={index}>
                                <CartCard selection={selection} index={index} setCart={setCart} setTotalPrice={setTotalPrice} />
                            </Grid>
                        )) : null}
                    </Grid>
                    <h2>Total Price ${totalPrice}</h2>
                </div>
                <h2>Add Billing and Shipping Information:</h2>
                <div style={{ marginBottom: "2%" }}>
                    <TextField onChange={(e) => setAddress(e.target.value)} id="txtAddress" label="Enter Address" variant="outlined" width sx={{ width: 300, marginRight: 4 }} />
                </div>
                <Autocomplete
                    disablePortal
                    options={cardsList.map(x => x.cardnumber)}
                    sx={{ width: 300, marginRight: 2 }}
                    renderInput={(params) => <TextField {...params} label="Select Card"

                    />}
                    onChange={(event, value) => setCurrCard(value)}
                />

                <h2>No Card? Add a card here: </h2>
                <div>

                    <TextField onChange={(e) => setCardNumber(e.target.value)} label="Card Number" variant="outlined" width sx={{ width: 300, marginRight: 4 }} />
                    <TextField onChange={(e) => setCardHolderName(e.target.value)} label="Card Holder Name" variant="outlined" width sx={{ width: 300, marginRight: 4 }} />
                    <TextField onChange={(e) => setExpiryDate(e.target.value )} label="Card Expiry Date" variant="outlined" width sx={{ width: 300, marginRight: 4 }} />
                    <TextField onChange={(e) => setCvc(e.target.value)} label="Card CVC" variant="outlined" width sx={{ width: 300, marginRight: 4 }} />
                </div>

                <Button variant='contained' onClick={addCard} style={{ width: "20%", margin: "30px 0 0 0" }}>
                    Add Card
                </Button>
                <div>
                    <h2>Total: ${total}</h2>
                </div>

                <div style={{ display: "flex", alignItems: "center" }}>
                    <Button onClick={completeOrder} variant="outlined" style={{ minHeight: '80px' }}> Complete Order </Button>
                </div>
            </div>
        </div>
    )


}

export default Checkout;