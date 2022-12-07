
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import { Button, TextField } from '@mui/material';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useState, useEffect } from 'react';

import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import GenreItem from "../components/genreItem";

const booksFromGet = [
    {
        ISBN: 123456,
        name: "Harry Potter",
        authorName: "JK Rowling",
        publisherName: "Penguin",
        genres: ["Magic", "Adventure", "Mystery"],
        price: 20,
        stock: 10
    },
    {
        ISBN: 123457,
        name: "Harry Potter",
        authorName: "JK Rowling",
        publisherName: "Penguin",
        genres: ["Magic", "Adventure", "Mystery"],
        price: 20,
        stock: 10
    },
    {
        ISBN: 123458,
        name: "Harry Potter",
        authorName: "JK Rowling",
        publisherName: "Penguin",
        genres: ["Magic", "Adventure", "Mystery"],
        price: 20,
        stock: 10

    },
    {
        ISBN: 123459,
        name: "Harry Potter",
        authorName: "JK Rowling",
        publisherName: "Penguin",
        genres: ["Magic", "Adventure", "Mystery"],
        price: 20,
        stock: 10
    },
]

/*
Page that shows a bunch of books 
*/
function AdminHome() {
    const [bookOrders, setBookOrders] = useState(() => {
        let temp = {};
        for (let book of booksFromGet) {
            temp[book.ISBN] = 0;
        }
        return temp;
    }); // map ISBN -> quantity to order

    const addGenre = (e) => {
        if (!currGenre || genres.includes(currGenre)) return;
        setGenres([...genres, currGenre]);
    }

    const addBook = () => {

    }

    const [currGenre, setCurrGenre] = useState();

    const [ISBN, setISBN] = useState();
    const [name, setName] = useState();
    const [genres, setGenres] = useState([]);
    const [numberOfPages, setNumberOfPages] = useState();
    const [price, setPrice] = useState();
    const [commission, setCommission] = useState();
    const [stock, setStock] = useState();
    const [publisherID, setPublisherID] = useState();

    const placeOrder = () => {
        alert("PLACING ORDER");
    }

    function BookOrderCard(props) {

        const handleIncrement = (ISBN) => {
            bookOrders[ISBN] = bookOrders[ISBN] + 1;
            setBookOrders(bookOrders);

            console.log(bookOrders);
            setCount(count + 1);
        }

        const handleDecrement = (ISBN) => {
            if (bookOrders[ISBN] == 0) return;
            bookOrders[ISBN] = bookOrders[ISBN] - 1;
            setBookOrders(bookOrders);
            setCount(count - 1);
        }

        const [count, setCount] = useState(0);
        return (
            <div>
                <Card sx={{ minWidth: 275, borderColor: "primary.main" }}>
                    <CardContent>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            {"ISBN: " + props.book.ISBN}
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
                        <Typography variant="body1" color="teal">

                            {"Stock: " + props.book.stock}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button variant='outlined' color='error'>
                            Remove From Store
                        </Button>

                        <div style={{ marginLeft: "auto" }}>
                            <p>Order Quantity</p>

                            <ButtonGroup size="small" aria-label="small outlined button group" >
                                <Button onClick={() => { handleIncrement(props.book.ISBN) }}>+</Button>
                                <Button>{
                                    bookOrders[props.book.ISBN]
                                }</Button>
                                <Button onClick={() => { handleDecrement(props.book.ISBN) }}>-</Button>
                            </ButtonGroup>
                        </div>
                    </CardActions>
                </Card>
            </div>
        )
    }
    return <div style={{ display: "flex", flexDirection: "column", padding: "2%", alignItems: "center" }}>
        <h1>Admin Home Page</h1>


        <h2>Order new books</h2>
        <Grid style={{ marginTop: "5px", width: "100%", paddingBottom: "2%", alignItems: "center" }} container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            {booksFromGet.map((book, index) => (
                <Grid item xs={2} sm={4} md={4} key={index}>
                    <BookOrderCard book={book} index={index} />
                </Grid>
            ))}
        </Grid>

        <div>
            <Button variant='contained' onClick={placeOrder}>
                Place Order
            </Button>
        </div>

        <hr style={{ width: "100%", margin: "2%" }} />
        <h2> Add a new book </h2>

        <div>
            <TextField onChange={(e) => setISBN(e.target.value)} label="ISBN" variant="outlined" width sx={{ width: 300, marginRight: 4 }} />
            <TextField onChange={(e) => setName(e.target.value)} label="Name" variant="outlined" width sx={{ width: 300, marginRight: 4 }} />
            <TextField onChange={(e) => setNumberOfPages(e.target.value)} label="Number Of Pages" variant="outlined" width sx={{ width: 300, marginRight: 4 }} />
            <TextField onChange={(e) => setPrice(e.target.value)} label="Price" variant="outlined" width sx={{ width: 300, marginRight: 4 }} />

            <TextField onChange={(e) => setCommission(e.target.value)} label="Commission" variant="outlined" width sx={{ width: 300, marginRight: 4 }} />
            <TextField onChange={(e) => setStock(e.target.value)} label="Stock" variant="outlined" width sx={{ width: 300, marginRight: 4 }} />
            <TextField onChange={(e) => setPublisherID(e.target.value)} label="Publisher ID " variant="outlined" width sx={{ width: 300, marginRight: 4 }} />
        </div>

        {/* genre add*/}
        <h3> add genres</h3>
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
        
        <Button onClick={addBook} variant='contained' style={{minHeight: '50px', marginTop: "2%"}}>
            Add Book
        </Button>
    </div>
}

export default AdminHome;