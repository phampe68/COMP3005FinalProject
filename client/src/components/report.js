import React from 'react';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
function SalesData({ data }) {


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

export default SalesData;
/*
export default function Report(props) {
    let data = props.data;
    console.log(data);

    return (
        <Paper >
            <TableContainer >
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Sales</TableCell>
                            <TableCell>Expenditures</TableCell>
                            <TableCell>Sales per Genre</TableCell>
                            <TableCell>Sales per Author</TableCell>
                            <TableCell>Sales per Publisher</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>{data.sales}</TableCell>
                            <TableCell>{data.expenditures}</TableCell>
                            <TableCell>
                                {Object.entries(data.salesPerGenre).map(([genre, sales]) => (
                                    <div key={genre}>{`${genre}: ${sales}`}</div>
                                ))}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>)
}


*/