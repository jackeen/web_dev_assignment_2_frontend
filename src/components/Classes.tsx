import React, {useEffect, useState} from "react";
import DashBoardLayout from "./DashBoardLayout.tsx";
import {Button, Card, Spinner, Table} from "react-bootstrap";

import {Class, ResponseData} from "../model.ts";
import {API_HOST} from "../../configure.ts";
import ClassForm from "./ClassForm.tsx";
import ClassLectureForm from "./ClassLectureForm.tsx";
import ClassStudentsForm from "./ClassStudentsForm.tsx";
import axios from "axios";


const Classes: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [showLectureForm, setShowLectureForm] = useState(false);
    const [showStudentsForm, setShowStudentsForm] = useState(false);


    const [classList, setClassList] = useState<Class[]>([]);
    const [loading, setLoading] = useState(false);

    // for edit form, which cannot use the common variable, must state
    const [currentData, setCurrentData] = useState<Class|undefined>(undefined);
    const [listChanging, setListChanging] = useState(0);

    useEffect(() => {
        setLoading(true);
        axios.get(`${API_HOST}/api/classes/`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}`,
            }
        }).then((res) => {
            const studentsRes = res.data as ResponseData<Class[]>;
            if (studentsRes.success) {
                setClassList(studentsRes.data);
            }
            setLoading(false);
        }).catch((err) => {
            alert(err.toString());
        });
    }, [listChanging]);

    function startEditForm(id?: number) {
        if (id !== undefined) {
            setCurrentData(classList.find((class_instance) => class_instance.id === id));
            setShowForm(true);
        }
    }
    function startNewForm() {
        setCurrentData(undefined);
        setShowForm(true);
    }

    function startLectureForm(id?: number) {
        if (id !== undefined) {
            setCurrentData(classList.find((class_instance) => class_instance.id === id));
            setShowLectureForm(true);
        }
    }
    function startStudentsForm(id?: number) {
        if (id !== undefined) {
            setCurrentData(classList.find((class_instance) => class_instance.id === id));
            setShowStudentsForm(true);
        }
    }

    function listUpdated() {
        setListChanging(Math.random());
    }

    function deleteClass(id?: number) {
        if (id !== undefined) {
            if (!confirm("Are you sure you want to delete this class?")) {
                return;
            }
            setLoading(true);
            fetch(`${API_HOST}/api/classes/${id}/`, {
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
            <ClassForm
                isShown={showForm}
                currentData={currentData}
                closeModal={()=>{setShowForm(false)}}
                updated={listUpdated}
            />

            <ClassLectureForm
                isShown={showLectureForm}
                currentData={currentData}
                closeModal={()=>{setShowLectureForm(false)}}
                updated={listUpdated}
            />

            <ClassStudentsForm
                isShown={showStudentsForm}
                currentData={currentData}
                closeModal={()=>{setShowStudentsForm(false)}}
                updated={listUpdated}
            />

            <Card>
                <Card.Header>Classes</Card.Header>
                <Card.Body>
                    {/*<Card.Title></Card.Title>*/}
                    <Card.Text>
                        <Button onClick={startNewForm}>New Class</Button>
                    </Card.Text>
                    <Table responsive bordered hover>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Number</th>
                            <th>Semester</th>
                            <th>Course</th>
                            <th>Lecture</th>
                            <th>Students' count</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {classList.map((class_instance: Class, _: number) => {
                            return (
                                <tr key={class_instance.id}>
                                    <td>{class_instance.id}</td>
                                    <td>{class_instance.number}</td>
                                    <td>{class_instance.semester.year} {class_instance.semester.semester}</td>
                                    <td>{class_instance.course.code} {class_instance.course.name}</td>
                                    <td>{
                                        class_instance.lecture ?
                                            class_instance.lecture.user.first_name + " " + class_instance.lecture.user.last_name
                                            : "Not occupied"
                                    }
                                    </td>
                                    <td>{class_instance.students.length}</td>
                                    <td className="d-flex gap-2 justify-content-end">
                                        <Button size={"sm"} onClick={() => {
                                            startLectureForm(class_instance.id);
                                        }}>Assign Lecture</Button>
                                        <Button size={"sm"} onClick={() => {
                                            startStudentsForm(class_instance.id)
                                        }}>Assign Students</Button>

                                        <Button size={"sm"} onClick={() => {
                                            startEditForm(class_instance.id)
                                        }}>Edit</Button>
                                        <Button size={"sm"} onClick={() => {
                                            deleteClass(class_instance.id)
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

export default Classes;