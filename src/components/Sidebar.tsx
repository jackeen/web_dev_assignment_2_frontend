import React from "react";
import {Nav} from "react-bootstrap";
import ROUTES from "../routes.ts";


const Sidebar: React.FC = () => {
    return (
        <Nav className="w-100 border-2 border-gray-200">
            <div>
                <Nav.Link href={ROUTES.HOME}>Home</Nav.Link>
                <Nav.Link href={ROUTES.LECTURES}>Lectures</Nav.Link>
                <Nav.Link href={ROUTES.STUDENTS}>Students</Nav.Link>
                <Nav.Link href={ROUTES.SEMESTERS}>Semesters</Nav.Link>
                <Nav.Link href={ROUTES.COURSES}>Courses</Nav.Link>
                <Nav.Link href="">Classes</Nav.Link>
            </div>
        </Nav>
    )
}

export default Sidebar;