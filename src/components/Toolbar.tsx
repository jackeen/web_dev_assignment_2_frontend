import React, {useState} from "react";
import {Button, Container, Navbar, Spinner} from "react-bootstrap";
import {logout} from "../AuthContext.tsx";
import {useNavigate} from "react-router-dom";
import ROUTES from "../routes.ts";

const Toolbar: React.FC = () => {

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    function logoutFun() {
        setLoading(true);
        logout(()=>{
            navigate(ROUTES.LOGIN);
            setLoading(true);
        });
    }

    return (
        <Navbar expand="lg" className="shadow-sm mb-3">
            <Container fluid className="d-flex">
                <Navbar.Brand href={ROUTES.HOME}>Attendance System</Navbar.Brand>
                <Button
                    disabled={loading}
                    onClick={logoutFun}
                    className="d-flex align-items-center justify-content-center gap-2"
                >
                    <Spinner
                        hidden={!loading}
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                    />
                    <span>Logout</span>
                </Button>
            </Container>
        </Navbar>
    )
}

export default Toolbar;