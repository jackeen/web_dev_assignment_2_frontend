import React from "react";
import {Button, Container, Navbar} from "react-bootstrap";
import {logout} from "../AuthContext.tsx";
import {useNavigate} from "react-router-dom";
import ROUTES from "../routes.ts";

const Toolbar: React.FC = () => {

    const navigate = useNavigate();

    function logoutFun() {
        logout(()=>{
            navigate(ROUTES.LOGIN);
        });
    }

    return (
        <Navbar expand="lg" className="shadow-sm mb-3">
            <Container fluid>
                <Navbar.Brand href="#">Attendance Dashboard System</Navbar.Brand>
                <Navbar.Text></Navbar.Text>
                <Button variant={'outline-primary'} size={'sm'} onClick={logoutFun}>Logout</Button>
            </Container>
        </Navbar>
    )
}

export default Toolbar;