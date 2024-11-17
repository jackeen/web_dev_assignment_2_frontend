import React, {useEffect, useState} from "react";
import {Alert, Button, Form, Modal} from "react-bootstrap";
import {Class, Course, Semester} from "./model.ts";
import {API_HOST} from "../../configure.ts";


interface ClassFormProps {
    isShown: boolean;
    currentData: Class | undefined;
    closeModal: () => void;
    updated: () => void;
}

const ClassForm: React.FC<ClassFormProps> = (({isShown,closeModal, currentData, updated}) => {

    const [number, setNumber] = useState('');
    const [semester, setSemester] = useState(0);
    const [course, setCourse] = useState(0);

    const [courseList, setCourseList] = useState<Course[]>([]);
    const [semesterList, setSemesterList] = useState<Semester[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isEdit, setIsEdit] = useState(false);


    useEffect(() => {
        if (isShown) {
            if (currentData) {
                const data = currentData;
                setIsEdit(true);
                setNumber(data.number || '');
                setCourse(data.course.id || 0);
                setSemester(data.semester.id || 0);
            } else {
                setIsEdit(false);
                setNumber('');
                setSemester(0);
                setCourse(0);
            }
        } else {
            setIsLoading(false);
        }
    }, [isShown]);

    // load options
    useEffect(() => {
        fetch(`${API_HOST}/api/courses/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((res) => {
            return res.json();
        }).then((json) => {
            if (json.success) {
                let data = json.data as Course[];
                setCourseList(data);
            }
        });
        fetch(`${API_HOST}/api/semesters/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((res) => {
            return res.json();
        }).then((json) => {
            if (json.success) {
                let data = json.data as Semester[];
                setSemesterList(data);
            }
        });
    }, [])

    function postClass(callback: () => void) {
        fetch(`${API_HOST}/api/classes/`, {
            method: 'POST',
            body: JSON.stringify({
                "number": number,
                "semester_id": semester,
                "course_id": course,
            }),
            headers: {
                'Content-Type': 'application/json',
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
    function updateClass(callback: () => void) {
        if (!currentData) {
            return;
        }
        fetch(`${API_HOST}/api/classes/${currentData.id}/`, {
            method: 'PATCH',
            body: JSON.stringify({
                "number": number,
                "semester_id": semester,
                "course_id": course,
            }),
            headers: {
                'Content-Type': 'application/json',
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

        if (semester === 0) {
            setError("Please select a semester for this class");
            return;
        } else {
            setError("");
        }

        if (course === 0) {
            setError("Please select a course for this class");
            return;
        } else {
            setError("");
        }

        setIsLoading(true);
        if (isEdit) {
            updateClass(() => {
                setIsLoading(false);
                form.reset();
                updated();
                closeModal();
            });
        } else {
            postClass(() => {
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
                <Modal.Title>{isEdit?"Edit ":"Add "}Class</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Alert hidden={error === ''} variant={'danger'}>{error}</Alert>
                <Form className="form" onSubmit={confirmTask}>
                    <Form.Group controlId="number" className="mb-3">
                        <Form.Label>Class Number</Form.Label>
                        <Form.Control
                            type="text"
                            value={number}
                            placeholder="Enter class number"
                            onChange={(e) => setNumber(e.target.value)}
                            required={true}
                        />
                    </Form.Group>

                    <Form.Group controlId="semester" className="mb-3">
                        <Form.Label>Semester</Form.Label>
                        <Form.Select
                            value={semester}
                            onChange={(e) => setSemester(Number(e.target.value))}
                            required={true}
                        >
                            <option value={0}>--Select semester--</option>
                            {semesterList.map((semester) => {
                                return (
                                    <option key={semester.id} value={semester.id}>{semester.year} {semester.semester}</option>
                                )
                            })}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group controlId="course" className="mb-3">
                        <Form.Label>Course</Form.Label>
                        <Form.Select
                            value={course}
                            onChange={(e) => setCourse(Number(e.target.value))}
                            required={true}
                        >
                            <option value={0}>--Select course--</option>
                            {courseList.map((course) => {
                                return (
                                    <option key={course.id} value={course.id}>{course.code} {course.name}</option>
                                )
                            })}
                        </Form.Select>
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

export default ClassForm;