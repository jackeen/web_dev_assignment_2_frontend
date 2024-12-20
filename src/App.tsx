import React, {useEffect, useState} from 'react';
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
import ProtectedRoute from "./ProtectedRoute.tsx";
import Roles from "./Roles.ts";
import {AuthProvider} from "./AuthContext.tsx";
import NotFound from "./components/NotFound.tsx";
import NotAuthorized from "./components/NotAuthorized.tsx";


interface AppProps {
}

const App: React.FC<AppProps> = (_) => {

    // theme change
    const [theme, setTheme] = useState('dark');

    function updateTheme(preferDarkMode: boolean) {
        const theme = preferDarkMode ? 'dark' : 'light';
        setTheme(theme);
        document.documentElement.setAttribute('data-bs-theme', theme);
    }

    function onThemeChange(e: MediaQueryListEvent) {
        updateTheme(e.matches);
    }

    useEffect(() => {
        console.log(theme);

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        updateTheme(mediaQuery.matches);
        mediaQuery.addEventListener('change', onThemeChange);

        // for unmounted component to clean the event
        return () => {
            mediaQuery.removeEventListener('change', onThemeChange);
        }

    }, []);

    // function toggleTheme() {
    //     if (theme === 'dark') {
    //         updateTheme(false);
    //     } else {
    //         updateTheme(true);
    //     }
    // }

    return (
        <AuthProvider>
        <BrowserRouter>
            <Routes>
                <Route path={ROUTES.LOGIN} element={<Login />} />
                <Route path={ROUTES.NOT_FOUND} element={<NotFound/>} />
                <Route path={ROUTES.NOT_AUTHORIZED} element={<NotAuthorized/>} />

                <Route path={ROUTES.HOME} element={
                    <ProtectedRoute allowedRoles={[Roles.Admin, Roles.Lecture, Roles.Student]}><Home/></ProtectedRoute>
                } />

                <Route path={ROUTES.LECTURES} element={
                    <ProtectedRoute allowedRoles={[Roles.Admin]}><Lectures/></ProtectedRoute>
                } />
                <Route path={ROUTES.STUDENTS} element={
                    <ProtectedRoute allowedRoles={[Roles.Admin]}><Students/></ProtectedRoute>
                } />
                <Route path={ROUTES.COURSES} element={
                    <ProtectedRoute allowedRoles={[Roles.Admin]}><Courses/></ProtectedRoute>
                } />
                <Route path={ROUTES.SEMESTERS} element={
                    <ProtectedRoute allowedRoles={[Roles.Admin]}><Semesters/></ProtectedRoute>
                } />
                <Route path={ROUTES.CLASSES} element={
                    <ProtectedRoute allowedRoles={[Roles.Admin]}><Classes/></ProtectedRoute>
                } />
            </Routes>
        </BrowserRouter>
        </AuthProvider>
    )
}

export default App;