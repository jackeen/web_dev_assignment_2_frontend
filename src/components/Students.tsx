import React, {useEffect, useState} from "react";
import DashBoardLayout from "./DashBoardLayout.tsx";
import {Button, Card, Spinner, Table} from "react-bootstrap";

import {ResponseData, Student} from "../model.ts";
import StudentForm from "./StudentForm.tsx";
import dataLoader from "../dataLoader.ts";


const Students: React.FC = () => {
    const [showForm, setShowForm] = useState(false);

    const [studentList, setStudentList] = useState<Student[]>([]);
    const [loading, setLoading] = useState(false);

    // for edit form, which cannot use the common variable, must state
    const [currentData, setCurrentData] = useState<Student|undefined>(undefined);
    const [listChanging, setListChanging] = useState(0);

    useEffect(() => {
        setLoading(true);
        dataLoader.get('/api/students/').then((d) => {
            const res = d.data as ResponseData<Student[]>;
            if (res.success) {
                setStudentList(res.data);
            } else {
                alert(res.error.join());
            }
            setLoading(false);
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
            dataLoader.delete(`/api/students/${id}/`).then((d) => {
                if (d.status === 204) {
                    listUpdated()
                }
                setLoading(false);
            }).catch((err) => {
                alert(err);
                setLoading(false);
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
                    <Table bordered hover responsive>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Staff ID</th>
                            <th>User Name</th>
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
                                    <td>{student.user.username}</td>
                                    <td>{student.user.first_name} {student.user.last_name}</td>
                                    <td>{student.date_of_birth}</td>
                                    <td>{student.user.email}</td>
                                    <td className="d-flex gap-2 justify-content-end">
                                        <Button size="sm" onClick={() => {
                                            startEditForm(student.id)
                                        }}>Edit</Button>
                                        <Button size="sm" onClick={() => {
                                            deleteStudent(student.id)
                                        }} variant={"danger"}>Delete</Button>
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                        <tfoot hidden={!loading}>
                        <tr>
                            <td colSpan={7} className="text-center">
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                            </td>
                        </tr>
                        </tfoot>
                    </Table>
                </Card.Body>
                {/*<Card.Footer></Card.Footer>*/}
            </Card>
        </DashBoardLayout>
    )
}

export default Students;