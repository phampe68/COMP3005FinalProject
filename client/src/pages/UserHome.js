import * as React from 'react';
import { useState, useEffect } from 'react';

import { Button, TextField } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';


/*
Page that shows a bunch of books 
*/
function UserHome() {
    const [searchField, setSearchField] = useState("");
    const [searchBy, setSearchBy] = useState(""); //which field to saerch by (ISBN, name, author name, publisher)

    const [currGenre, setCurrGenre] = useState("");
    const [genres, setGenres] = useState([]);

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
        // TODO: make search query with genres and search field value
        let query = searchBy + "=" + searchField
        alert("executing search for: " + query);
    }

    return (
        <div>
            <div style={{ display: "flex", paddingLeft: '2%', flexDirection: "column" }}>

                <h1>User Home Page</h1>
                <h2>Search Books</h2>

                <div style={{ display: "flex", padding: "0 0 0 2%" }}>

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

                <div style={{ display: "flex", padding: "4% 0 0 2%", alignItems: "center" }}>
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

                <div>
                    <Button variant="contained" style={{ maxHeight: '40px', marginLeft: "10px" }} onClick={executeSearch}> Search </Button>
                </div>
            </div>


        </div>
    )


}

export default UserHome;