import React, {ReactNode} from 'react';
import {Col, Container, Row} from "react-bootstrap";
import Toolbar from "./Toolbar.tsx";
import Sidebar from "./Sidebar.tsx";
import Roles from "../Roles.ts";

interface LayoutProp {
    children: ReactNode;
}

const DashBoardLayout: React.FC<LayoutProp> = ({children}) => {

    // not use useAuth for it, avoid current problem for updating time gap
    let role = localStorage.getItem("role");
    let sidebar = <Col hidden={true}></Col>

    if (role === Roles.Admin.toString()) {
        sidebar = <Col lg={2}><Sidebar/></Col>
    }

    return (
        <Container fluid={true}>
            <Row>
                <Toolbar/>
            </Row>
            <Row>
                {sidebar}
                <Col lg={true}>
                    {children}
                </Col>
            </Row>

        </Container>
    )
}

export default DashBoardLayout