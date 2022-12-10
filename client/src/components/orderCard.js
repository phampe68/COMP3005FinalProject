
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const myOrders = [
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
Page that shows a bunch of books 
*/
function OrderCard(props) {
    return (
        <div>
            <Card sx={{ minWidth: 275, borderColor: "primary.main" }}>
                <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        {"Order number: " + props.order.ordernumber}
                    </Typography>
                    <Typography variant="h5" component="div">
                        {props.order.shippingaddress}
                    </Typography>
                    <Typography variant="body" component="div">
                        {props.order.courier}
                    </Typography>
                    <Typography variant="body" component="div">
                        {"Delivery status: " + props.order.deliverystatus}
                    </Typography>
                    <Typography variant="body" component="div">
                        {props.order.locationintransit}
                    </Typography>
                    <Typography variant="body" component="div">
                        {props.order.dtime}
                    </Typography>
                    
                    
               
                </CardContent>
               
            </Card>
        </div>
    )
}

export default OrderCard;