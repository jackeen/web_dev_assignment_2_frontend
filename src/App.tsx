import React from 'react';
import {Routes, Route, BrowserRouter} from "react-router-dom";
import Login from "./components/Login.tsx";

import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import Home from "./components/Home.tsx";
import ROUTES from "./routes.ts";
import Lectures from "./components/Lectures.tsx";
import Students from "./components/Students.tsx";
import Courses from "./components/Courses.tsx";
import Semesters from "./components/Semesters.tsx";
import Classes from "./components/Classes.tsx";

interface AppProps {
}

const App: React.FC<AppProps> = (_) => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={ROUTES.HOME} element={<Home/>} />
                <Route path={ROUTES.LOGIN} element={<Login/>} />
                <Route path={ROUTES.LECTURES} element={<Lectures/>} />
                <Route path={ROUTES.STUDENTS} element={<Students/>} />
                <Route path={ROUTES.COURSES} element={<Courses/>} />
                <Route path={ROUTES.SEMESTERS} element={<Semesters/>} />
                <Route path={ROUTES.CLASSES} element={<Classes/>} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;