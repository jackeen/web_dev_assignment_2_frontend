import React, {createContext, useContext} from "react";
import {User} from "./model.ts";
import Roles from "./Roles.ts";
import axios from "axios";
import {API_HOST} from "../configure.ts";


interface AuthContextProps {
    isAuthenticated: boolean;
    user: User | null;
    role: Roles;
}
const AuthContext = createContext<AuthContextProps>({
    isAuthenticated: false,
    user: null,
    role: Roles.Guest,
});

interface AuthProviderProps {
    children: React.ReactNode;
}
const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {

    // This part cannot be in useEffect and state to manage,
    // because it will be delayed, which cannot be used in router,
    // the time gap will cause it not working.
    let isAuthenticated = false;
    let user: User | null = null;
    let role: Roles = Roles.Guest;

    const token = localStorage.getItem("token");
    if (token) {
        const userData = localStorage.getItem("user");
        const roleData = localStorage.getItem("role");
        if (userData) {
            user = JSON.parse(userData) as User;
            role = roleData as Roles;
            isAuthenticated = true;
        }
    }

    return (
        <AuthContext.Provider value={{isAuthenticated, user, role}}>
            {children}
        </AuthContext.Provider>
    )
};

const useAuth = (): AuthContextProps => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

const logout = (callback: ()=> void) => {
    axios.post(`${API_HOST}/api/logout/`,null, {
        headers: {
            "Authorization": `Token ${localStorage.getItem("token")}`,
        }
    }).then((_) => {
        callback();
    }).catch((err) => {
        alert(err.toString());
    })
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
};

export { AuthProvider, useAuth, logout };
