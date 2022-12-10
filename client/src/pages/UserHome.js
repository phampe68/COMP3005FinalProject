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
import CartCard from "../components/cartCard";

const myOrders = [
    {
        orderNumber: 1,
        shippingAddress: "100 example drive",
        courier: "FEDEX",
        deliveryStatus: "In transit",
        locationInTransit: "Toronto",
        time: "12/24/21"
    },
    {
        orderNumber: 1,
        shippingAddress: "100 example drive",
        courier: "FEDEX",
        deliveryStatus: "In transit",
        locationInTransit: "Toronto",
        time: "12/24/21"
    },
    {
        orderNumber: 1,
        shippingAddress: "100 example drive",
        courier: "FEDEX",
        deliveryStatus: "In transit",
        locationInTransit: "Toronto",
        time: "12/24/21"
    },

];


/*
Page that lets you search books and shows a bunch of books 
*/
function UserHome() {
    let navigate = useNavigate();

    const [user, setUser] = useState(localStorage.getItem("user"));
    const [searchField, setSearchField] = useState("");
    const [searchBy, setSearchBy] = useState(""); //which field to saerch by (ISBN, name, author name, publisher)
    const [currGenre, setCurrGenre] = useState("");
    const [genres, setGenres] = useState([]);
    const [booksFound, setBooksFound] = useState([]);
    const [cart, setCart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        axios.get(`http://localhost:5000/books/`).then(res => {
            setBooksFound(res.data);
        });

        setUser(localStorage.getItem("user"));

        axios.get(`http://localhost:5000/selections/` + user).then(res => {
            setCart(res.data);
            let temp = 0;
            for (let selection of res.data) {
                temp += selection.quantity * selection.book.price;
            }
            setTotalPrice(temp);
        });

    }, []);



    const addGenre = (e) => {
        if (!currGenre || genres.includes(currGenre)) return;
        setGenres([...genres, currGenre]);
    }

    const GenreItem = (props) => (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "5px", backgroundColor: "#002884", borderRadius: "5px" }}>
            {props.item}
        </div>
    )

    const executeSearch = () => {
        if (!searchBy) return;
        // TODO: make search query with genres and search field value
        let query = searchBy + "=" + searchField
        alert("executing search for: " + query);
    }

    const BookCard = (props) => {
        const [quantity, setQuantity] = useState(0);

        let book = props.book.book[0];
        let authors = props.book.authors;
        let genres = props.book.genres.map(x => x.genre);
        const handleIncrement = (ISBN) => {
            setQuantity(quantity + 1);
        }

        const handleDecrement = (ISBN) => {
            setQuantity(quantity - 1);

        }

        const addToCart = (e) => {
            if (quantity === 0) return;


            axios.post('http://localhost:5000/selections', {
                userID: user,
                isbn: book.isbn,
                quantity: quantity,
            })
                .then(function (response) {
                    setQuantity(0);
                    axios.get(`http://localhost:5000/selections/` + user).then(res => {
                        setCart(res.data);
                        let temp = 0;
                        for (let selection of res.data) {
                            temp += selection.quantity * selection.book.price;
                        }
                        setTotalPrice(temp);
                    });
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
                    <Typography variant="body" component="div">
                        {"Publisher: " + book.publisher.name}
                    </Typography> 
                    <Typography variant="h5" component="div">
                        Authors
                    </Typography>
                    {authors.map((author, index) => (
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            {author.fname + ", " + author.lname }
                        </Typography>
                    ))}
                    <Typography variant="h5" component="div">
                        Genres
                    </Typography>
                    {genres.map((genre, index) => (
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            {genre}
                        </Typography>
                    ))}
                    <Typography variant="body1" color="yellow">

                        {"Price: $" + book.price}
                    </Typography>
                </CardContent>
                <CardActions>
                    <ButtonGroup size="small" aria-label="small outlined button group" >
                        <Button onClick={() => { handleIncrement(book.isbn) }}>+</Button>
                        <Button>{
                            quantity
                        }</Button>
                        <Button onClick={() => { handleDecrement(book.isbn) }}>-</Button>
                    </ButtonGroup>
                    <Button size="small" onClick={addToCart} variant="outlined" >
                        <Typography variant="body1" component="div">
                            {"Add to cart"}
                        </Typography>
                    </Button>
                </CardActions>
            </Card>
        )
    }

    return (
        <div style={{ display: "flex", padding: "2%", width: "100%", flexDirection: "column" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>

                <h1>User Home Page</h1>
                {/* search section */}
                <h2>Search Books</h2>
                <div style={{ display: "flex" }}>

                    <TextField id="txtSearchBook" label="Enter Search Field" variant="outlined" width sx={{ width: 300, marginRight: 4 }}
                        onChange={(e) => setSearchField(e.target.value)}
                    />

                    <FormControl>
                        <FormLabel id="search-group-label">Search By: </FormLabel>
                        <RadioGroup
                            aria-labelledby="search-group-label"
                            defaultValue="ISBN"
                            name="search-group"
                            onChange={(e) => setSearchBy(e.target.value)}
                        >
                            <FormControlLabel value="ISBN" control={<Radio />} label="ISBN" />
                            <FormControlLabel value="name" control={<Radio />} label="name" />
                            <FormControlLabel value="author" control={<Radio />} label="author name" />
                            <FormControlLabel value="publisher" control={<Radio />} label="publisher name" />

                        </RadioGroup>
                    </FormControl>


                </div>

                {/* add genre section */}
                <div style={{ display: "flex", alignItems: "center" }}>
                    <TextField id="txtAddGenre" label="Enter Genre" variant="outlined" width sx={{ width: 300, marginRight: 4 }}
                        onChange={(e) => { setCurrGenre(e.target.value) }}
                    />
                    <Button variant="contained" style={{ maxHeight: '40px' }} onClick={addGenre}> Add Genre</Button>
                    <Button variant="contained" color="error" style={{ maxHeight: '40px', marginLeft: "10px" }} onClick={() => { setGenres([]) }}> Clear Genres</Button>

                </div>
                <Grid style={{ marginTop: "5px", width: "50%" }} container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    {genres.map((genre, index) => (
                        <Grid item xs={2} sm={4} md={4} key={index}>
                            <GenreItem item={genre} />
                        </Grid>
                    ))}
                </Grid>

                <div style={{ display: "flex", alignItems: "center", marginTop: "3%" }}>
                    <Button variant="contained" style={{ maxHeight: '40px' }} onClick={executeSearch}> Search </Button>
                </div>


            </div>

            <div>
                <h2> Orders </h2>
                <Grid style={{ marginTop: "5px", width: "50%" }} container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    {myOrders.map((order, index) => (
                        <Grid item xs={2} sm={4} md={4} key={index}>
                            <OrderCard order={order} />
                        </Grid>
                    ))}
                </Grid>



            </div>

            <div>
                <h2> Books: </h2>
                <Grid style={{ marginTop: "5px", width: "100%", paddingBottom: "2%", alignItems: "center" }} container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    {booksFound.map((book, index) => (

                        <Grid item xs={2} sm={4} md={4} key={index}>
                            <BookCard book={book} index={index} />
                        </Grid>
                    ))}
                </Grid>
            </div>

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


            <div style={{ display: "flex", alignItems: "center" }}>
                <Button onClick={() => { navigate('/checkout'); }} variant="outlined" style={{ minHeight: '80px' }}> Checkout </Button>
            </div>

        </div>
    )


}

export default UserHome;