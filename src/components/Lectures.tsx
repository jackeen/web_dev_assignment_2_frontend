import React, {useEffect, useState} from "react";
import DashBoardLayout from "./DashBoardLayout.tsx";
import {Button, Card, Table} from "react-bootstrap";

import {Lecture} from "./model.ts";
import LectureForm from "./LectureForm.tsx";
import {API_HOST} from "../../configure.ts";


const Lectures: React.FC = () => {
    const [showForm, setShowForm] = useState(false);

    const [lectureList, setLectureList] = useState<Lecture[]>([]);
    const [loading, setLoading] = useState(false);

    // for edit form, which cannot use the common variable, must state
    const [currentData, setCurrentData] = useState<Lecture|undefined>(undefined);
    const [listChanging, setListChanging] = useState(0);

    useEffect(() => {
        setLoading(true);
        fetch(`${API_HOST}/api/lectures/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((res) => {
            setLoading(false);
            return res.json();
        }).then((json) => {
            if (json.success) {
                let data = json.data as Lecture[];
                setLectureList(data);
            } else {

            }
        });
    }, [listChanging]);

    function startEditForm(id?: number) {
        if (id !== undefined) {
            setCurrentData(lectureList.find((lecture) => lecture.id === id));
            setShowForm(true);
        }
    }
    function startNewForm() {
        setCurrentData(undefined);
        setShowForm(true);
    }

    function listUpdated() {
        setListChanging(Math.random());
    }

    function deleteLecture(id?: number) {
        if (id !== undefined) {
            if (!confirm("Are you sure you want to delete this lecture?")) {
                return;
            }
            setLoading(true);
            fetch(`${API_HOST}/api/lectures/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then((res) => {
                setLoading(false);
                if (res.status === 204) {
                    listUpdated()
                } else {
                    alert(res.statusText)
                }
            });
        }
    }

    return (
        <DashBoardLayout>
            <LectureForm
                isShown={showForm}
                currentData={currentData}
                closeModal={()=>{setShowForm(false)}}
                updated={listUpdated}
            />
            <Card>
                <Card.Header>Lectures</Card.Header>
                <Card.Body>
                    {/*<Card.Title></Card.Title>*/}
                    <Card.Text>
                        <Button onClick={startNewForm}>New Lecture</Button>
                    </Card.Text>

                    {loading ? <Card.Text>Loading</Card.Text> : ''}
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Staff ID</th>
                            <th>Name</th>
                            <th>Date of birth</th>
                            <th>Email</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {lectureList.map((lecture: Lecture, index: number) => {
                            return (
                                <tr key={index}>
                                    <td>{lecture.id}</td>
                                    <td>{lecture.staff_id}</td>
                                    <td>{lecture.user.first_name} {lecture.user.last_name}</td>
                                    <td>{lecture.date_of_birth}</td>
                                    <td>{lecture.user.email}</td>
                                    <td className="d-flex gap-2 justify-content-end">
                                        <Button onClick={() => {startEditForm(lecture.id)}}>Edit</Button>
                                        <Button onClick={() => {deleteLecture(lecture.id)}} variant={"danger"}>Delete</Button>
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </Table>
                </Card.Body>
                {/*<Card.Footer></Card.Footer>*/}
            </Card>
        </DashBoardLayout>
    )
}

export default Lectures;