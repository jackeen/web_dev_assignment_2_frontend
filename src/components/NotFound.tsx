import React from 'react';
import {Container} from "react-bootstrap";

const NotFound: React.FC = () => {
    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <div className="w-50 h-50 p-lg-5">
                <h1 className="border-bottom">Not Found</h1>
            </div>
        </Container>
    )
}

export default NotFound