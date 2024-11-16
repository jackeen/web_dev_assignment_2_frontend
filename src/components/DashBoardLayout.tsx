import React, {ReactNode} from 'react';
import {Col, Container, Row} from "react-bootstrap";
import Toolbar from "./Toolbar.tsx";
import Sidebar from "./Sidebar.tsx";

interface LayoutProp {
    children: ReactNode;
}

const DashBoardLayout: React.FC<LayoutProp> = ({children}) => {
    return (
        <Container fluid={true}>
            <Row>
                <Toolbar/>
            </Row>
            <Row>
                <Col lg={2}>
                    <Sidebar/>
                </Col>
                <Col lg={true}>
                    {children}
                </Col>
            </Row>

        </Container>
    )
}

export default DashBoardLayout