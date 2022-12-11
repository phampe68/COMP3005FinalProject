import React from 'react';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useState, useEffect } from 'react';


function Report( props ) {
    if (Object.keys(props.reportData).length === 0) return;

    let data = props.reportData;
    return (
        <div style={{ width: "100%", backgroundColor: "black" }}>
            <Typography variant="h3" gutterBottom>
                Sales Report
            </Typography>
            <List component="nav" aria-label="secondary mailbox folders">
                <ListItem>
                    <ListItemText primary="Total sales" secondary={data.sales} />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Total expenditures" secondary={data.expenditures} />
                </ListItem>
                <ListItem>
                    {data.salesPerGenre.map((genreSales, index) => (
                        <ListItemText
                            primary="Sales per genre"
                            secondary={`${genreSales.genre}: ${genreSales.sales}`}
                        />
                    ))}
                </ListItem>
                <ListItem>
                    {data.salesPerAuthor.map((authorSales, index) => (
                        <ListItemText
                            primary="Sales per author"
                            secondary={`${authorSales.author.fname} ${authorSales.author.lname}: ${authorSales.sales}`}
                        />
                    ))}

                </ListItem>
                <ListItem>
                    {data.salesPerPublisher.map((publisherSales, index) => (
                        <ListItemText
                            primary="Sales per publisher"
                            secondary={`${publisherSales.publisher.name}: ${publisherSales.sales}`}
                        />
                    ))}

                </ListItem>
            </List>
        </div>
    );


}

export default Report;
