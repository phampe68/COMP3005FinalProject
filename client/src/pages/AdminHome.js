
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';


/*
Page that shows a bunch of books 
*/
function Home() {
    const registeredBooks = [123456, 123457, 123458];
    const [bookOrders, setBookOrders] = React.useState([]);

    function BookOrderCard(props) {
        
        return (
            <div>
                <Card sx={{ minWidth: 275, borderColor: "primary.main" }}>
                    <CardContent>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            {"ISBN : " + props.book.ISBN}
                        </Typography>
                        <Typography variant="h5" component="div">
                            {props.book.title}
                        </Typography>
                        <Typography variant="body" component="div">
                            {props.order.courier}
                        </Typography>
                        <Typography variant="body" component="div">
                            {props.order.deliveryStatus}
                        </Typography>
                        <Typography variant="body" component="div">
                            {props.order.locationInTransit}
                        </Typography>
                        <Typography variant="body" component="div">
                            {props.order.time}
                        </Typography>
                        
                        
                   
                    </CardContent>
                   
                </Card>
            </div>
        )
    }
    return <div style={{ display: "flex", flexDirection: "column", padding: "2%" }}>
        <h1>Admin Home Page</h1>
        

        <h2>Order new books</h2>

    </div>
}

export default Home;