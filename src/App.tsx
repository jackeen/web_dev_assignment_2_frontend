import React from 'react';
import {Routes, Route, BrowserRouter} from "react-router-dom";
import Login from "./components/Login.tsx";

import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import Home from "./components/Home.tsx";
import ROUTES from "./routes.ts";
import Lectures from "./components/Lectures.tsx";

interface AppProps {
}

const App: React.FC<AppProps> = (_) => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={ROUTES.HOME} element={<Home/>} />
                <Route path={ROUTES.LOGIN} element={<Login/>} />
                <Route path={ROUTES.LECTURES} element={<Lectures/>} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;