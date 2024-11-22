import React, {useEffect, useState} from "react";
import DashBoardLayout from "./DashBoardLayout.tsx";
import {Button, Card, Spinner, Table} from "react-bootstrap";

import {Lecture, ResponseData} from "../model.ts";
import LectureForm from "./LectureForm.tsx";
import dataLoader from "../dataLoader.ts";


const Lectures: React.FC = () => {
    const [showForm, setShowForm] = useState(false);

    const [lectureList, setLectureList] = useState<Lecture[]>([]);
    const [loading, setLoading] = useState(false);

    // for edit form, which cannot use the common variable, must state
    const [currentData, setCurrentData] = useState<Lecture|undefined>(undefined);
    const [listChanging, setListChanging] = useState(0);

    useEffect(() => {
        setLoading(true);
        dataLoader.get('/api/lectures/').then((d) => {
            const res = d.data as ResponseData<Lecture[]>;
            if (res.success) {
                setLectureList(res.data);
            } else {
                alert(res.error.join())
            }
            setLoading(false);
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
            dataLoader.delete(`/api/lectures/${id}/`).then((d) => {
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
                        {lectureList.map((lecture: Lecture, index: number) => {
                            return (
                                <tr key={index}>
                                    <td>{lecture.id}</td>
                                    <td>{lecture.staff_id}</td>
                                    <td>{lecture.user.username}</td>
                                    <td>{lecture.user.first_name} {lecture.user.last_name}</td>
                                    <td>{lecture.date_of_birth}</td>
                                    <td>{lecture.user.email}</td>
                                    <td className="d-flex gap-2 justify-content-end">
                                        <Button size="sm" onClick={() => {startEditForm(lecture.id)}}>Edit</Button>
                                        <Button size="sm" onClick={() => {deleteLecture(lecture.id)}} variant={"danger"}>Delete</Button>
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

export default Lectures;