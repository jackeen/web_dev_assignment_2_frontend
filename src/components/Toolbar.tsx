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
            <Container fluid className="d-flex">
                <Navbar.Brand href={ROUTES.HOME}>Attendance System</Navbar.Brand>
                <Button variant={'outline-primary'} size={'sm'} onClick={logoutFun}>Logout</Button>
            </Container>
        </Navbar>
    )
}

export default Toolbar;