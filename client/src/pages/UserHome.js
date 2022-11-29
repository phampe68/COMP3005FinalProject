import * as React from 'react';
import { useState } from 'react';

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




/*
Page that lets you search books and shows a bunch of books 
*/
function UserHome() {
    const [searchField, setSearchField] = useState("");
    const [searchBy, setSearchBy] = useState(""); //which field to saerch by (ISBN, name, author name, publisher)

    const [currGenre, setCurrGenre] = useState("");
    const [genres, setGenres] = useState([]);
    const [cart, setCart] = useState([]); // list of ISBNs of user cart

    const [selectedBookCards, setSelectedBookCards] = useState({});

    const [booksFound, setBooksFound] = useState([
        {
            ISBN: 123456,
            name: "Harry Potter",
            authorName: "JK Rowling",
            publisherName: "Penguin",
            genres: ["Magic", "Adventure", "Mystery"],
            price: 20
        },
        {
            ISBN: 123456,
            name: "Harry Potter",
            authorName: "JK Rowling",
            publisherName: "Penguin",
            genres: ["Magic", "Adventure", "Mystery"],
            price: 20

        },
        {
            ISBN: 123456,
            name: "Harry Potter",
            authorName: "JK Rowling",
            publisherName: "Penguin",
            genres: ["Magic", "Adventure", "Mystery"],
            price: 20

        },
        {
            ISBN: 123456,
            name: "Harry Potter",
            authorName: "JK Rowling",
            publisherName: "Penguin",
            genres: ["Magic", "Adventure", "Mystery"],
            price: 20
        },
    ]);

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

        const addToCart = (e) => {
            //TODO: index book cards
            // TODO: make post request to add to cart by sending all ISBNs and current user
            setCart([...cart, props.book.ISBN]);


        }
        return (
            <Card sx={{ minWidth: 275 }}>
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
                </CardContent>
                <CardActions>
                    <Button size="small" onClick={addToCart} >Add to Cart</Button>
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



            <Grid style={{ marginTop: "5px", width: "100%", paddingBottom: "2%", alignItems: "center" }} container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
       

                {booksFound.map((book, index) => (
                    
                    <Grid item xs={2} sm={4} md={4} key={index}>
                        <BookCard book={book} index={index} />
                    </Grid>
                ))}
            </Grid>
        </div>
    )


}

export default UserHome;