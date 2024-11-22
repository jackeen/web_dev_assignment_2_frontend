import React, {useEffect, useState} from "react";
import DashBoardLayout from "./DashBoardLayout.tsx";
import {Button, Card, Spinner, Table} from "react-bootstrap";

import {Course, ResponseData} from "../model.ts";
import CourseForm from "./CourseForm.tsx";
import dataLoader from "../dataLoader.ts";


const Courses: React.FC = () => {
    const [showForm, setShowForm] = useState(false);

    const [courseList, setCourseList] = useState<Course[]>([]);
    const [loading, setLoading] = useState(false);

    // for edit form, which cannot use the common variable, must state
    const [currentData, setCurrentData] = useState<Course|undefined>(undefined);
    const [listChanging, setListChanging] = useState(0);

    useEffect(() => {
        setLoading(true);
        dataLoader.get('/api/courses/').then((d) => {
            const res = d.data as ResponseData<Course[]>;
            if (res.success) {
                setCourseList(res.data);
            } else {
                alert(res.error.join());
            }
            setLoading(false);
        });
    }, [listChanging]);

    function startEditForm(id?: number) {
        if (id !== undefined) {
            setCurrentData(courseList.find((course) => course.id === id));
            setShowForm(true);
        }
    }
    function startNewForm() {
        setCurrentData(undefined);
        setShowForm(true);
    }

    function listUpdated() {
        setListChanging(Math.floor(Math.random() * 100));
    }

    function deleteCourse(id?: number) {
        if (id !== undefined) {
            if (!confirm("Are you sure you want to delete this course?")) {
                return;
            }
            setLoading(true);
            dataLoader.delete(`/api/courses/${id}/`).then((d) => {
                setLoading(false);
                if (d.status === 204) {
                    listUpdated()
                } else {
                    alert(d.statusText);
                }
            });
        }
    }

    return (
        <DashBoardLayout>
            <CourseForm
                isShown={showForm}
                currentData={currentData}
                closeModal={()=>{setShowForm(false)}}
                updated={listUpdated}
            />
            <Card>
                <Card.Header>Courses</Card.Header>
                <Card.Body>
                    {/*<Card.Title></Card.Title>*/}
                    <Card.Text>
                        <Button onClick={startNewForm}>New Course</Button>
                    </Card.Text>
                    <Table responsive bordered hover>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Code</th>
                            <th>Name</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {courseList.map((course: Course, _: number) => {
                            return (
                                <tr key={course.id}>
                                    <td>{course.id}</td>
                                    <td>{course.code}</td>
                                    <td>{course.name}</td>
                                    <td className="d-flex gap-2 justify-content-end">
                                        <Button size="sm" onClick={() => {
                                            startEditForm(course.id)
                                        }}>Edit</Button>
                                        <Button size="sm" onClick={() => {
                                            deleteCourse(course.id)
                                        }} variant={"danger"}>Delete</Button>
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                        <tfoot hidden={!loading}>
                        <tr>
                            <td colSpan={4} className="text-center">
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
            </Card>
        </DashBoardLayout>
    )
}

export default Courses;