
import * as React from 'react';
import { useState, useEffect } from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function ModeSelect() {
    let navigate = useNavigate();

    const [usersList, setUserList] = useState([]);
    const [currUser, setCurrUser] = useState();

    useEffect(() => {
        axios.get(`http://localhost:5000/users/`).then(res => {
            setUserList(res.data);
        });
    }, []);



    const [fName, setFName] = useState("");
    const [lName, setLName] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const addUser = () => {


        if (fName === "" || lName === "" || email === "" || phoneNumber === "") {
            alert("Missing Fields");
            return;
        } else if (usersList.filter(x => x.email == email).length > 0) {
            alert("User already exists")
            return;
        }


        axios.post('http://localhost:5000/users', {
            fName: fName,
            lName: lName,
            address: address,
            email: email,
            phoneNumber, phoneNumber
        })
            .then(function (response) {
                setFName("");
                setLName("");
                setEmail("");
                setPhoneNumber("");
                navigate("/userHome");

            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const goToUserHome = () => {
        if (!currUser) {
            alert("No user selected.");
            return;
        }

        alert("go to user: " + currUser);
        localStorage.setItem('user', currUser)
        navigate("/userHome");
    }


    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                <h2>If Admin, select Admin</h2>
                <Button variant="contained" href="/admin">Admin</Button>
            </div>


            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", marginBottom: "3%" }}>

                <h2>Pick a user, then press GO:</h2>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={usersList.map(x => x.userid + '')}
                        sx={{ width: 300, marginRight: 2 }}
                        renderInput={(params) => <TextField {...params} label="User Select"

                        />}
                        onChange={(event, value) => setCurrUser(value)}

                    />
                    <Button variant="contained" onClick={goToUserHome}>GO</Button>
                </div>

                <h2>Can't see your user? Add a user here! (no password needed) </h2>

                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                    <TextField id="txtAddUser" label="First Name" variant="outlined" width sx={{ width: 300, marginRight: 2 }}
                        onChange={(e) => setFName(e.target.value)}
                    />
                    <TextField id="txtAddUser" label="Last Name" variant="outlined" width sx={{ width: 300, marginRight: 2 }}
                        onChange={(e) => setLName(e.target.value)}
                    />
                    <TextField id="txtAddUser" label="Address" variant="outlined" width sx={{ width: 300, marginRight: 2 }}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <TextField id="txtAddUser" label="Email Address" variant="outlined" width sx={{ width: 300, marginRight: 2 }}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField id="txtAddUser" label="Phone Number" variant="outlined" width sx={{ width: 300, marginRight: 2 }}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />

                    <Button variant="contained" onClick={addUser}>Add User</Button>
                </div>
            </div>
        </div >
    )
}

export default ModeSelect;