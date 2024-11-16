import React from "react";
import {Container, Nav, Navbar, NavDropdown} from "react-bootstrap";

const Toolbar: React.FC = () => {
    return (
        <Navbar expand="lg" className="shadow-sm mb-3">
            <Container fluid>
                <Navbar.Brand href="#">Attendance Dashboard System</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <NavDropdown title="Account" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#profile">Profile</NavDropdown.Item>
                            <NavDropdown.Item href="#settings">Settings</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#logout">Logout</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Toolbar;