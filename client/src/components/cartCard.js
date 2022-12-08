import * as React from 'react';

import { Button } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import axios from 'axios';


const CartCard = (props) => {
    let book = props.selection.book;
    const removeFromCart = (e) => {
        axios.delete('http://localhost:5000/selections/' + localStorage.getItem("user") + "/" + book.isbn)
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    return (
        <Card sx={{ minWidth: 275, borderColor: "primary.main" }}>
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {"ISBN: " + book.isbn}
                </Typography>
                <Typography variant="h5" component="div">
                    {book.name}
                </Typography>
   
                <Typography variant="body1" color="yellow">

                    {"Quantity: " + props.selection.quantity}
                </Typography>
                <Typography variant="body1" color="yellow">

                    {"Price: $" + book.price}
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