import React from 'react';
import DashBoardLayout from "./DashBoardLayout.tsx";
import {Container, ListGroup} from "react-bootstrap";


const HomeMain: React.FC = () => {
    return (
        <Container>
            <ListGroup as='ol' numbered={true}>
                <ListGroup.Item>Create students</ListGroup.Item>
                <ListGroup.Item>Create lectures</ListGroup.Item>
                <ListGroup.Item>Create courses</ListGroup.Item>
                <ListGroup.Item>Create semesters</ListGroup.Item>
                <ListGroup.Item>Create classes</ListGroup.Item>
                <ListGroup.Item>Assign lecture and students for classes</ListGroup.Item>
            </ListGroup>
        </Container>
    )
}

const Home: React.FC = () => {
    return (
        <DashBoardLayout>
            <HomeMain />
        </DashBoardLayout>
    )
}

export default Home