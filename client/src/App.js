import * as React from 'react';

import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AdminHome from "./pages/AdminHome";
import UserHome from "./pages/UserHome";
import ModeSelect from "./pages/ModeSelect";
import Checkout from "./pages/checkout";

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

function App() {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<ModeSelect />} />
                    <Route path='/admin' element={<AdminHome />} />
                    <Route path='/userHome' element={<UserHome />} />
                    <Route path='/checkout' element={<Checkout />} />
                 </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;