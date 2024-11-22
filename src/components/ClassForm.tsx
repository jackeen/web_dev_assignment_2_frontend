import React, {useEffect, useState} from "react";
import {Alert, Button, Form, Modal, Spinner} from "react-bootstrap";
import {Class, Course, ResponseData, Semester} from "../model.ts";
import dataLoader from "../dataLoader.ts";


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
    const [courseLoading, setCourseLoading] = useState(false);
    const [semesterLoading, setSemesterLoading] = useState(false);

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
        setCourseLoading(true);
        dataLoader.get('/api/courses/').then((d) => {
            const res = d.data as ResponseData<Course[]>;
            if (res.success) {
                setCourseList(res.data);
            }
            setCourseLoading(false);
        });

        setSemesterLoading(true);
        dataLoader.get('/api/semesters/').then((d) => {
            const res = d.data as ResponseData<Semester[]>;
            if (res.success) {
                setSemesterList(res.data);
            }
            setSemesterLoading(false);
        });
    }, [])

    function postClass(ok: () => void, fail: () => void) {
        dataLoader.post('/api/classes/', {
            "number": number,
            "semester_id": semester,
            "course_id": course,
        }).then((d) => {
            const res = d.data as ResponseData<Class>;
            if (res.success) {
                ok();
            } else {
                alert(res.error.join());
                fail();
            }
        });
    }
    function updateClass(ok: () => void, fail: () => void) {
        if (!currentData) {
            return;
        }
        dataLoader.patch(`/api/classes/${currentData.id}/`, {
            "number": number,
            "semester_id": semester,
            "course_id": course,
        }).then((d) => {
            const res = d.data as ResponseData<Class>;
            if (res.success) {
                ok();
            } else {
                alert(res.error.join());
                fail();
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
            }, () => {
                setIsLoading(false);
            });
        } else {
            postClass(() => {
                setIsLoading(false);
                form.reset();
                updated();
                closeModal();
            }, () => {
                setIsLoading(false);
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
                        <Form.Label className="d-flex gap-2 align-items-center">
                            <span>Semester</span>
                            <Spinner
                                hidden={!semesterLoading}
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                        </Form.Label>
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
                        <Form.Label className="d-flex gap-2 align-items-center">
                            <span>Course</span>
                            <Spinner
                                hidden={!courseLoading}
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                        </Form.Label>
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
                        <Button
                            disabled={isLoading}
                            type={"submit"}
                            variant="primary"
                            className="d-flex gap-2 align-items-center justify-content-center"
                        >
                            <Spinner
                                hidden={!isLoading}
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                            <span>Save</span>
                        </Button>
                        <Button disabled={isLoading} onClick={cancelTask} variant="secondary">Cancel</Button>
                    </div>

                </Form>
            </Modal.Body>

            <Modal.Footer hidden={true}></Modal.Footer>
        </Modal>
    )
});

export default ClassForm;