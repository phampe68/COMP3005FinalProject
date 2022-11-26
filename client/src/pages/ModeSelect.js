
import * as React from 'react';
import { useState } from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

function ModeSelect() {
    // TODO: get usersList from backend
    let usersList = ['root',
        'admin',
        'test',
        'guest',
        'info',
        'adm',
        'mysql',
        'user',
        'administrator',
        'oracle',
        'ftp',
        'pi',
        'puppet',
        'ansible',
        'ec2-user',
        'vagrant',
        'azureuser'];

    const [currUser, setCurrUser] = useState("");
    
    
    
    
    const [currUserAdd, setCurrUserAdd] = useState("");

    const addUser = () => {
        if (currUserAdd == "") {
            alert("Add User field is empty");
            return;
        } else if (usersList.includes(currUserAdd)) {
            alert("User already exists")
            return;
        }
        
        // TODO: register user endpoint on currUserAdd
        alert("userAdded: " + currUserAdd);
    }

    const goToUserHome = () => {
        if (currUser == "" || !currUser ) {
            alert("No user selected.");
            return;
        }
        alert ("go to user: " + currUser);

        //TODO: set current user (cookie? db?)
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
                        options={usersList}
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