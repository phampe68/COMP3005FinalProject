import * as React from 'react';
import { useState, useEffect } from 'react';

import { Button, TextField } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useNavigate } from "react-router-dom";
import OrderCard from '../components/orderCard';
import axios from 'axios';
import ButtonGroup from '@mui/material/ButtonGroup';


const CartCard = (props) => {

    const removeFromCart = (e) => {

        /*
        axios.delete('http://localhost:5000/selections', {
            userID: user,
            isbn: props.book.isbn,
            quantity: quantity,
        })
            .then(function (response) {
                setQuantity(0);
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
            */
    }

    return (
        <Card sx={{ minWidth: 275, borderColor: "primary.main" }}>
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {"ISBN: " + props.book.isbn}
                </Typography>
                <Typography variant="h5" component="div">
                    {props.book.name}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {props.book.authorName + ", " + props.book.publisherName}
                </Typography>
                <Typography variant="body1" color="yellow">

                    {"Price: $" + props.book.price}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={removeFromCart} variant="outlined" >
                    <Typography variant="body1" component="div" color='error'>
                        {"Remove from cart"}
                    </Typography>
                </Button>
            </CardActions>
        </Card>
    )
}

export default CartCard;