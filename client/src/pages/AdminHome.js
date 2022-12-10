
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import { Button, TextField } from '@mui/material';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';

import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import GenreItem from "../components/genreItem";
import axios from 'axios';
import Report from '../components/report';

const data = {
    "sales": "299.98",
    "expenditures": "15.00",
    "salesPerGenre": [
        {
            "genre": "Fantastical",
            "sales": 299.98
        },
        {
            "genre": "Horror",
            "sales": 299.98
        },
        {
            "genre": "Action",
            "sales": 299.98
        }
    ],
    "salesPerAuthor": [
        {
            "author": {
                "authorid": 0,
                "fname": "Jolkien Rolkien Rolkien",
                "lname": "Tolkien"
            },
            "sales": 299.98
        }
    ],
    "salesPerPublisher": [
        {
            "publisher": {
                "publisherid": 0,
                "name": "Random Book Publishing Co.",
                "address": "734 Random Street",
                "email": "contact@rbps.com",
                "phonenumber": "0118 999 881 999 119 725 3"
            },
            "sales": "15.00"
        }
    ]
};
/*
Page that shows a bunch of books 
*/
function AdminHome() {
    const [genres, setGenres] = useState([]);
    const [currGenre, setCurrGenre] = useState();

    const [authors, setAuthors] = useState([]);
    const [currAuthor, setCurrAuthor] = useState([]); //stores author ID
    const [authorList, setAuthorList] = useState([]);

    const [currPublisher, setCurrPublisher] = useState("");
    const [publishersList, setPublihsersList] = useState([]);

    const [name, setName] = useState();
    const [numberOfPages, setNumberOfPages] = useState();
    const [price, setPrice] = useState();
    const [commission, setCommission] = useState();
    const [stock, setStock] = useState();
    const [booksFound, setBooksFound] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:5000/books/`).then(res => {
            setBooksFound(res.data);
            console.log("BOOKS FOUND: ", res.data);
            for (let book of res.data) {
                bookOrders[book.book[0].isbn] = 0;
            }

        });

        axios.get(`http://localhost:5000/authors/`).then(res => {
            setAuthorList(res.data);
        });

        axios.get(`http://localhost:5000/publishers/`).then(res => {
            setPublihsersList(res.data);
        });


    }, []);

    const [bookOrders, setBookOrders] = useState(() => {
        let temp = {};
        for (let book of booksFound) {
            temp[book.ISBN] = 0;
        }
        return temp;
    }); // map ISBN -> quantity to order


    //  AUTHORS
    const [authorFName, setAuthorFName] = useState("");
    const [authorLName, setAuthorLName] = useState("");

    // PUBLISERS
    const [publisherName, setPublisherName] = useState("");
    const [publisherAddress, setPublisherAddress] = useState("");
    const [publisherEmail, setPublisherEmail] = useState("");
    const [publisherPhoneNumber, setPublisherPhoneNumber] = useState("");
    const [publisherBankAccountNumber, setPublisherBankAccountNumber] = useState("");
    const addGenre = (e) => {
        if (!currGenre || genres.includes(currGenre)) return;
        setGenres([...genres, currGenre]);
    }

    const addBook = () => {

        let temp = currPublisher.split(":");
        let publisherID = temp[1];
        let authorIDsToAdd = [];
        for (let authorText of authors) {
            temp = authorText.split(":");
            authorIDsToAdd.push(temp[1]);
        }

        // only add book if all fields are full
        if (!name || !numberOfPages || !price || !commission || !stock || !publisherID || !authors || authorIDsToAdd.length === 0 || !publisherBankAccountNumber) return;

        axios.post('http://localhost:5000/books', {
            name: name,
            numberOfPages: numberOfPages,
            price: price,
            commission: commission,
            stock: stock,
            publisherID: publisherID,
            genres: genres,
            authors: authorIDsToAdd
        })
            .then(function (response) {
                // refresh
                axios.get(`http://localhost:5000/books/`).then(res => {
                    setBooksFound(res.data);
                    for (let book of res.data) {
                        bookOrders[book.book[0].isbn] = 0;
                    }
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    const addAuthor = () => {
        if (!authorFName || !authorLName) return;
        axios.post('http://localhost:5000/authors', {
            fName: authorFName,
            lName: authorLName
        }).then(() => {
            setAuthorFName("");
            setAuthorLName("");
            // refresh authors
            axios.get(`http://localhost:5000/authors/`).then(res => {
                setAuthorList(res.data);
            });

        })
            .catch(function (error) {
                console.log(error);
            });

    }


    const addPublisher = () => {
        if (!publisherName || !publisherAddress || !publisherEmail || !publisherPhoneNumber) return;
        axios.post('http://localhost:5000/publishers', {
            name: publisherName,
            address: publisherAddress,
            email: publisherEmail,
            phoneNumber: publisherPhoneNumber
        })
            .then(() => {
                setPublisherName("");
                setPublisherAddress("");
                setPublisherEmail("");
                setPublisherPhoneNumber("");

                axios.get(`http://localhost:5000/publishers/`).then(res => {
                    setPublihsersList(res.data);
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const addAuthorToBook = () => {
        if (!currAuthor || authors.includes(currAuthor)) return;
        setAuthors([...authors, currAuthor]);
    }


    const placeOrder = () => {
        axios.put('http://localhost:5000/books', bookOrders).then(() => {
            setBookOrders({});
            // refresh authors
            axios.get(`http://localhost:5000/books/`).then(res => {
                setBooksFound(res.data);
            });

        })
            .catch(function (error) {
                console.log(error);
            });

    }

    const removeFromStore = (ISBN) => {
        axios.delete("http://localhost:5000/books/" + ISBN).then(() => {
            axios.get(`http://localhost:5000/books/`).then(res => {
                setBooksFound(res.data);
                console.log(res.data);
                for (let book of res.data) {
                    bookOrders[book.book[0].isbn] = 0;
                }
            });
        }).catch((err) => {
            console.log(err);
        })
    }

    function BookOrderCard(props) {
        let book = props.book.book[0];

        let authors = props.book.authors;
        let genres = props.book.genres.map(x => x.genre);
        const [count, setCount] = useState(0);

        const handleIncrement = (ISBN) => {
            bookOrders[ISBN] = bookOrders[ISBN] ? bookOrders[ISBN] + 1 : 1;
            setBookOrders(bookOrders);
            setCount(bookOrders[ISBN]);
        }

        const handleDecrement = (ISBN) => {
            if (bookOrders[ISBN] === 0) return;
            bookOrders[ISBN] = bookOrders[ISBN] ? bookOrders[ISBN] - 1 : 0;
            setBookOrders(bookOrders);
            setCount(bookOrders[ISBN]);
        }

        return (
            <div>
                <Card sx={{ minWidth: 275, borderColor: "primary.main" }}>
                    <CardContent>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            {"ISBN: " + book.isbn}
                        </Typography>
                        <Typography variant="h5" component="div">
                            {book.name}
                        </Typography>

                        <Typography variant="body" component="div">
                            {"Publisher:" + book.publisher.name}
                        </Typography>
                        <Typography variant="h5" component="div">
                            Authors
                        </Typography>

                        {authors.map((author, index) => (
                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                {author.fname + ", " + author.lname}
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
                        <Typography variant="body1" color="teal">

                            {"Stock: " + book.stock}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button variant='outlined' color='error' onClick={() => { removeFromStore(book.isbn) }}>
                            Remove From Store
                        </Button>

                        <div style={{ marginLeft: "auto" }}>
                            <p>Order Quantity</p>

                            <ButtonGroup size="small" aria-label="small outlined button group" >
                                <Button onClick={() => { handleIncrement(book.isbn) }}>+</Button>
                                <Button>{
                                    bookOrders[book.isbn]
                                }</Button>
                                <Button onClick={() => { handleDecrement(book.isbn) }}>-</Button>
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
            {booksFound.map((book, index) => (
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

        {/* add author*/}
        <h3> add authors</h3>
        <div style={{ display: "flex", alignItems: "center" }}>
            <TextField label="first name" variant="outlined" width sx={{ width: 300, marginRight: 4 }}
                onChange={(e) => { setAuthorFName(e.target.value) }}
            />
            <TextField label="last name" variant="outlined" width sx={{ width: 300, marginRight: 4 }}
                onChange={(e) => { setAuthorLName(e.target.value) }}
            />
            <Button variant="contained" style={{ maxHeight: '40px' }} onClick={addAuthor}> Add Author</Button>
        </div>

        <hr style={{ width: "100%", margin: "2%" }} />

        {/* add publishers*/}
        <h3> add publishers</h3>
        <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
                <TextField id="txtAddPublisher" label="Name" variant="outlined" width sx={{ width: 300, marginRight: 2 }}
                    onChange={(e) => setPublisherName(e.target.value)}
                />

                <TextField id="txtAddPublisher" label="Address" variant="outlined" width sx={{ width: 300, marginRight: 2 }}
                    onChange={(e) => setPublisherAddress(e.target.value)}
                />
                <TextField id="txtAddPublisher" label="Email Address" variant="outlined" width sx={{ width: 300, marginRight: 2 }}
                    onChange={(e) => setPublisherEmail(e.target.value)}
                />
                <TextField id="txtAddPublisher" label="Phone Number" variant="outlined" width sx={{ width: 300, marginRight: 2 }}
                    onChange={(e) => setPublisherPhoneNumber(e.target.value)}
                />
                <TextField id="txtAddPublisher" label="Bank Account" variant="outlined" width sx={{ width: 300, marginRight: 2 }}
                    onChange={(e) => setPublisherBankAccountNumber(e.target.value)}
                />
                <Button variant="contained" style={{ maxHeight: '40px' }} onClick={addPublisher}> Add Publisher</Button>
            </div>
            <hr style={{ width: "100%", margin: "2%" }} />


        </div>

        <div style={{ display: "flex", alignItems: "center", flexDirection: "column", margin: "2%" }}>
            <h2> Add a new book </h2>

            {/* add genre section */}
            <h3> add genres</h3>
            <div style={{ display: "flex", alignItems: "center" }}>
                <TextField id="txtAddGenre" label="Enter Genre" variant="outlined" width sx={{ width: 300, marginRight: 4 }}
                    onChange={(e) => { setCurrGenre(e.target.value) }}
                />
                <Button variant="contained" style={{ maxHeight: '40px' }} onClick={addGenre}> Add Genre</Button>
                <Button variant="contained" color="error" style={{ maxHeight: '40px', marginLeft: "10px" }} onClick={() => { setGenres([]) }}> Clear Genres</Button>

            </div>

            <Grid style={{ margin: "15px", width: "50%" }} container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                {genres.map((x, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                        <GenreItem item={x} />
                    </Grid>
                ))}
            </Grid>

            {/* add authors section */}
            <h3> add authors to book</h3>
            <div style={{ display: "flex", alignItems: "center" }}>
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={authorList.map(x => x.fname + ', ' + x.lname + ":" + x.authorid)}
                    sx={{ width: 300, marginRight: 2 }}
                    renderInput={(params) => <TextField {...params} label="Select Authors"

                    />}
                    onChange={(event, value) => setCurrAuthor(value)}

                />
                <Button variant="contained" style={{ maxHeight: '40px' }} onClick={addAuthorToBook}> Add Author</Button>
                <Button variant="contained" color="error" style={{ maxHeight: '40px', marginLeft: "10px" }} onClick={() => { setAuthors([]) }}> Clear Authors</Button>

            </div>
            <Grid style={{ margin: "15px", width: "50%" }} container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                {authors.map((x, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                        <GenreItem item={x} />
                    </Grid>
                ))}
            </Grid>


            <div>
                <TextField onChange={(e) => setName(e.target.value)} label="Name" variant="outlined" width sx={{ width: 300, marginRight: 4 }} />
                <TextField onChange={(e) => setNumberOfPages(e.target.value)} label="Number Of Pages" variant="outlined" width sx={{ width: 300, marginRight: 4 }} />
                <TextField onChange={(e) => setPrice(e.target.value)} label="Price" variant="outlined" width sx={{ width: 300, marginRight: 4 }} />

                <TextField onChange={(e) => setCommission(e.target.value)} label="Commission" variant="outlined" width sx={{ width: 300, marginRight: 4 }} />
            </div>
            <div style={{ marginTop: "1%" }}>
                <TextField onChange={(e) => setStock(e.target.value)} label="Stock" variant="outlined" width sx={{ width: 300, marginRight: 4 }} />
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={publishersList.map(x => x.name + ":" + x.publisherid)}
                    sx={{ width: 300, marginTop: 2 }}
                    renderInput={(params) => <TextField {...params} label="Select Publisher"

                    />}
                    onChange={(event, value) => setCurrPublisher(value)}

                />
            </div>
            <Button onClick={addBook} variant='contained' style={{ minHeight: '50px', marginTop: "2%" }}>
                Add Book
            </Button>


        </div>
        <hr style={{ width: "100%", margin: "2%" }} />
        <div style={{ width: "80%" }}>
            <h1>Reports /</h1>
            <Button variant='contained'> Refresh Report </Button>
            <Report data={data} />
        </div>

    </div>
}

export default AdminHome;