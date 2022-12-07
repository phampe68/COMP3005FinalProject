
import * as React from 'react';
import { useState, useEffect } from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function ModeSelect() {
    let navigate = useNavigate();

    const [usersList, setUserList] = useState([{ id: 1 }]);

    useEffect(() => {
        axios.get(`http://localhost:5000/users/`).then(res => {
            setUserList(res.data);
        });
    }, []); 



    const [currUser, setCurrUser] = useState("");




    const [currUserAdd, setCurrUserAdd] = useState("");

    const addUser = () => {
        if (currUserAdd === "") {
            alert("Add User field is empty");
            return;
        } else if (usersList.includes(currUserAdd)) {
            alert("User already exists")
            return;
        }

        // TODO: register user endpoint on currUserAdd
        alert("userAdded: " + currUserAdd);
        navigate("/userHome");
    }

    const goToUserHome = () => {
        if (!currUser) {
            alert("No user selected.");
            return;
        }

        alert("go to user: " + currUser);

        //TODO: set current user (cookie? db?)

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

                    <TextField id="txtAddUser" label="Enter Your Username" variant="outlined" width sx={{ width: 300, marginRight: 2 }}
                        onChange={(e) => setCurrUserAdd(e.target.value)}
                    />

                    <Button variant="contained" onClick={addUser}>Add User</Button>
                </div>
            </div>
        </div >
    )
}

export default ModeSelect;