import * as React from 'react';
import { useState } from 'react';

import { Button, TextField } from '@mui/material';
import { useNavigate } from "react-router-dom";

const cart = [
    {
        ISBN: 123456,
        name: "Harry Potter",
        authorName: "JK Rowling",
        publisherName: "Penguin",
        genres: ["Magic", "Adventure", "Mystery"],
        price: 20
    },
    {
        ISBN: 123457,
        name: "Harry Potter",
        authorName: "JK Rowling",
        publisherName: "Penguin",
        genres: ["Magic", "Adventure", "Mystery"],
        price: 20

    },
    {
        ISBN: 123458,
        name: "Harry Potter",
        authorName: "JK Rowling",
        publisherName: "Penguin",
        genres: ["Magic", "Adventure", "Mystery"],
        price: 20

    },
    {
        ISBN: 123459,
        name: "Harry Potter",
        authorName: "JK Rowling",
        publisherName: "Penguin",
        genres: ["Magic", "Adventure", "Mystery"],
        price: 20
    },
]


/*
Page that lets you search books and shows a bunch of books 
*/
function Checkout() {
    let navigate = useNavigate();

    //TODO: make a query here to get cart and calculate total
    let total = 0; 
    const [address, setAddress] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [cardHolderName, setCardHolderName] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvc, setCvc] = useState("");

    return (
        <div style={{ display: "flex", padding: "2%", width: "100%", flexDirection: "column" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>

                <h1>Checkout Page</h1>

                <h2>Add Billing and Shipping Information:</h2>
                <div style={{marginBottom: "2%"}}>
                    <TextField onChange={(e) => setAddress(e.target.value)} id="txtAddress" label="Enter Address" variant="outlined" width sx={{ width: 300, marginRight: 4 }}/>
                </div>

                <div>
                    <TextField  onChange={(e) => setCardNumber(e.target.value)} label="Card Number" variant="outlined" width sx={{ width: 300, marginRight: 4 }} />
                    <TextField  onChange={(e) => setCardHolderName(e.target.value)} label="Card Holder Name" variant="outlined" width sx={{ width: 300, marginRight: 4 }}/>
                    <TextField  onChange={(e) => setExpiryDate(e.target.value)} label="Card Expiry Date" variant="outlined" width sx={{ width: 300, marginRight: 4 }}/>
                    <TextField  onChange={(e) => setCvc(e.target.value)} label="Card CVC" variant="outlined" width sx={{ width: 300, marginRight: 4 }}/>
                </div>

                <div>
                    <h2>Total: ${total}</h2>
                </div>

                <div style={{ display: "flex", alignItems: "center" }}>
                    <Button onClick={() => {navigate('/checkout');}} variant="outlined" style={{ minHeight: '80px' }}> Purchase </Button>
                </div>
            </div>
        </div>
    )


}

export default Checkout;