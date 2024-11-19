import React, {useEffect, useState} from "react";
import DashBoardLayout from "./DashBoardLayout.tsx";
import {Button, Card, Table} from "react-bootstrap";

import {Student} from "../model.ts";
import StudentForm from "./StudentForm.tsx";
import {API_HOST} from "../../configure.ts";


const Students: React.FC = () => {
    const [showForm, setShowForm] = useState(false);

    const [studentList, setStudentList] = useState<Student[]>([]);
    const [loading, setLoading] = useState(false);

    // for edit form, which cannot use the common variable, must state
    const [currentData, setCurrentData] = useState<Student|undefined>(undefined);
    const [listChanging, setListChanging] = useState(0);

    useEffect(() => {
        setLoading(true);
        fetch(`${API_HOST}/api/students/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((res) => {
            setLoading(false);
            return res.json();
        }).then((json) => {
            if (json.success) {
                let data = json.data as Student[];
                setStudentList(data);
            } else {

            }
        });
    }, [listChanging]);

    function startEditForm(id?: number) {
        if (id !== undefined) {
            setCurrentData(studentList.find((student) => student.id === id));
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

    function deleteStudent(id?: number) {
        if (id !== undefined) {
            if (!confirm("Are you sure you want to delete this student?")) {
                return;
            }
            setLoading(true);
            fetch(`${API_HOST}/api/students/${id}/`, {
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
            <StudentForm
                isShown={showForm}
                currentData={currentData}
                closeModal={()=>{setShowForm(false)}}
                updated={listUpdated}
            />
            <Card>
                <Card.Header>Students</Card.Header>
                <Card.Body>
                    {/*<Card.Title></Card.Title>*/}
                    <Card.Text>
                        <Button onClick={startNewForm}>New Student</Button>
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
                        {studentList.map((student: Student, index: number) => {
                            return (
                                <tr key={index}>
                                    <td>{student.id}</td>
                                    <td>{student.student_id}</td>
                                    <td>{student.user.first_name} {student.user.last_name}</td>
                                    <td>{student.date_of_birth}</td>
                                    <td>{student.user.email}</td>
                                    <td className="d-flex gap-2 justify-content-end">
                                        <Button onClick={() => {startEditForm(student.id)}}>Edit</Button>
                                        <Button onClick={() => {deleteStudent(student.id)}} variant={"danger"}>Delete</Button>
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

export default Students;