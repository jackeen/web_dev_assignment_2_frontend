import React, {useEffect, useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {Semester} from "../model.ts";
import {API_HOST} from "../../configure.ts";


interface SemesterFormProps {
    isShown: boolean;
    currentData: Semester | undefined;
    closeModal: () => void;
    updated: () => void;
}

const SemesterForm: React.FC<SemesterFormProps> = (({isShown,closeModal, currentData, updated}) => {

    const [year, setYear] = useState('');
    const [semester, setSemester] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);


    useEffect(() => {
        if (isShown) {
            if (currentData) {
                const data = currentData;
                setIsEdit(true);
                setYear(data.year || '');
                setSemester(data.semester || '');
                setStartDate(data.start_date || '');
                setEndDate(data.end_date || '');
            } else {
                setIsEdit(false);
                setYear('');
                setSemester('');
                setStartDate('');
                setEndDate('');
            }
        }
    }, [isShown]);

    function postSemester(callback: () => void) {
        fetch(`${API_HOST}/api/semesters/`, {
            method: 'POST',
            body: JSON.stringify({
                "year": year,
                "semester": semester,
                "start_date": startDate,
                "end_date": endDate,
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}`,
            }
        }).then((res) => {
            return res.json();
        }).then((json) => {
            if (json.success) {
                callback();
            } else {

            }
        });
    }
    function updateSemester(callback: () => void) {
        if (!currentData) {
            return;
        }
        fetch(`${API_HOST}/api/semesters/${currentData.id}/`, {
            method: 'PATCH',
            body: JSON.stringify({
                "year": year,
                "semester": semester,
                "start_date": startDate,
                "end_date": endDate,
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}`,
            }
        }).then((res) => {
            return res.json();
        }).then((json) => {
            if (json.success) {
                callback();
            } else {

            }
        });
    }

    function confirmTask(e: React.FormEvent) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        setIsLoading(true);
        if (isEdit) {
            updateSemester(() => {
                setIsLoading(false);
                form.reset();
                updated();
                closeModal();
            });
        } else {
            postSemester(() => {
                setIsLoading(false);
                form.reset();
                updated();
                closeModal();
            });
        }
    }
    function cancelTask() {
        closeModal();
    }

    return (
        <Modal className="dialog"
               show={isShown}
               centered={true}
               size={"lg"}
               animation={true}
        >
            <Modal.Header>
                <Modal.Title>{isEdit?"Edit ":"Add "}Semester</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form className="form" onSubmit={confirmTask}>
                    <Form.Group controlId="year" className="mb-3">
                        <Form.Label>Year</Form.Label>
                        <Form.Control
                            type="text"
                            value={year}
                            placeholder="Enter semester year"
                            onChange={(e) => setYear(e.target.value)}
                            required={true}
                        />
                    </Form.Group>
                    <Form.Group controlId="semester" className="mb-3">
                        <Form.Label>Semester</Form.Label>
                        <Form.Control
                            type="text"
                            value={semester}
                            placeholder="Enter semester"
                            onChange={(e) => setSemester(e.target.value)}
                            required={true}
                        />
                    </Form.Group>
                    <Form.Group controlId="startdate" className="mb-3">
                        <Form.Label>Start date</Form.Label>
                        <Form.Control
                            type="date"
                            value={startDate}
                            placeholder="Enter start date"
                            onChange={(e) => setStartDate(e.target.value)}
                            required={true}
                        />
                    </Form.Group>
                    <Form.Group controlId="enddate" className="mb-3">
                        <Form.Label>End date</Form.Label>
                        <Form.Control
                            type="date"
                            value={endDate}
                            placeholder="Enter end date"
                            onChange={(e) => setEndDate(e.target.value)}
                            required={true}
                        />
                    </Form.Group>

                    <div className="d-flex justify-content-end gap-2">
                        <Button disabled={isLoading} type={"submit"} variant="primary">Save</Button>
                        <Button onClick={cancelTask} variant="secondary">Cancel</Button>
                    </div>

                </Form>
            </Modal.Body>

            <Modal.Footer hidden={true}></Modal.Footer>
        </Modal>
    )
});

export default SemesterForm;