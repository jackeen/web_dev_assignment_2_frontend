import React from 'react';
import DashBoardLayout from "./DashBoardLayout.tsx";
import {Container, ListGroup} from "react-bootstrap";
import Roles from "../Roles.ts";
import LectureHome from "./LectureHome.tsx";
import StudentHome from "./StudentHome.tsx";


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
    let role = localStorage.getItem("role");
    let mainContent = <HomeMain/>

    switch (role) {
        case Roles.Lecture:
            mainContent = <LectureHome/>
            break;
        case Roles.Student:
            mainContent = <StudentHome/>
            break
    }

    return (
        <DashBoardLayout>
            {mainContent}
        </DashBoardLayout>
    )
}

export default Home