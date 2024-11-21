import React, {useState} from "react";
import {Card, Nav} from "react-bootstrap";
import ROUTES from "../routes.ts";


const Sidebar: React.FC = () => {

    const [activeKey, setActiveKey] = useState(location.pathname);
    function handleSelect(key: string|null) {
        if (key) {
            setActiveKey(key);
        }
    }

    return (
        <Card className="mb-3">
            <Nav
                activeKey={activeKey}
                variant="pills"
                onSelect={handleSelect}
            >
                <div className="w-100 p-3">
                    <Nav.Link eventKey={ROUTES.HOME} href={ROUTES.HOME}>Home</Nav.Link>
                    <Nav.Link eventKey={ROUTES.LECTURES} href={ROUTES.LECTURES}>Lectures</Nav.Link>
                    <Nav.Link eventKey={ROUTES.STUDENTS} href={ROUTES.STUDENTS}>Students</Nav.Link>
                    <Nav.Link eventKey={ROUTES.SEMESTERS} href={ROUTES.SEMESTERS}>Semesters</Nav.Link>
                    <Nav.Link eventKey={ROUTES.COURSES} href={ROUTES.COURSES}>Courses</Nav.Link>
                    <Nav.Link eventKey={ROUTES.CLASSES} href={ROUTES.CLASSES}>Classes</Nav.Link>
                </div>
            </Nav>
        </Card>
    )
}

export default Sidebar;