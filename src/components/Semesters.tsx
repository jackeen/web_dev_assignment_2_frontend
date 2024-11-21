import React, {useEffect, useState} from "react";
import DashBoardLayout from "./DashBoardLayout.tsx";
import {Button, Card, Spinner, Table} from "react-bootstrap";

import {Semester} from "../model.ts";
import SemesterForm from "./SemesterForm.tsx";
import {API_HOST} from "../../configure.ts";


const Semesters: React.FC = () => {
    const [showForm, setShowForm] = useState(false);

    const [semesterList, setSemesterList] = useState<Semester[]>([]);
    const [loading, setLoading] = useState(false);

    // for edit form, which cannot use the common variable, must state
    const [currentData, setCurrentData] = useState<Semester|undefined>(undefined);
    const [listChanging, setListChanging] = useState(0);

    useEffect(() => {
        setLoading(true);
        fetch(`${API_HOST}/api/semesters/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}`,
            }
        }).then((res) => {
            setLoading(false);
            return res.json();
        }).then((json) => {
            if (json.success) {
                let data = json.data as Semester[];
                setSemesterList(data);
            } else {

            }
        });
    }, [listChanging]);

    function startEditForm(id?: number) {
        if (id !== undefined) {
            setCurrentData(semesterList.find((semester) => semester.id === id));
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

    function deleteSemester(id?: number) {
        if (id !== undefined) {
            if (!confirm("Are you sure you want to delete this semester?")) {
                return;
            }
            setLoading(true);
            fetch(`${API_HOST}/api/semesters/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('token')}`,
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
            <SemesterForm
                isShown={showForm}
                currentData={currentData}
                closeModal={()=>{setShowForm(false)}}
                updated={listUpdated}
            />
            <Card>
                <Card.Header>Semesters</Card.Header>
                <Card.Body>
                    {/*<Card.Title></Card.Title>*/}
                    <Card.Text>
                        <Button onClick={startNewForm}>New Semester</Button>
                    </Card.Text>
                    <Table responsive bordered hover>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Year</th>
                            <th>Semester</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {semesterList.map((semester: Semester, _: number) => {
                            return (
                                <tr key={semester.id}>
                                    <td>{semester.id}</td>
                                    <td>{semester.year}</td>
                                    <td>{semester.semester}</td>
                                    <td>{semester.start_date}</td>
                                    <td>{semester.end_date}</td>
                                    <td className="d-flex gap-2 justify-content-end">
                                        <Button size="sm" onClick={() => {
                                            startEditForm(semester.id)
                                        }}>Edit</Button>
                                        <Button size="sm" onClick={() => {
                                            deleteSemester(semester.id)
                                        }} variant={"danger"}>Delete</Button>
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                        <tfoot hidden={!loading}>
                        <tr>
                            <td colSpan={6} className="text-center">
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

export default Semesters;