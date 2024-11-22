import React, {useEffect, useState} from "react";
import {Alert, Button, Col, Form, Modal, Row, Spinner} from "react-bootstrap";
import {Class, ResponseData, Student} from "../model.ts";
import dataLoader from "../dataLoader.ts";


interface ClassLectureFormProps {
    isShown: boolean;
    currentData: Class | undefined;
    closeModal: () => void;
    updated: () => void;
}

const ClassLectureForm: React.FC<ClassLectureFormProps> = (({isShown,closeModal, currentData, updated}) => {

    const [students, setStudents] = useState<number[]>([]);
    const [studentList, setStudentList] = useState<Student[]>([]);
    const [studentLoading, setStudentLoading] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // load assigned students' id
    useEffect(() => {
        if (currentData) {
            const ids: number[] = [];
            currentData.students.forEach((student) => {
                if (student.id) {
                    ids.push(student.id);
                }
            })
            setStudents(ids);
        }
    }, [isShown]);

    // load options
    useEffect(() => {
        setStudentLoading(true);
        dataLoader.get('/api/students/').then((d) => {
            const res = d.data as ResponseData<Student[]>;
            if (res.success) {
                setStudentList(res.data);
            }
            setStudentLoading(false);
        });
    }, [])

    function onChecked(e: React.ChangeEvent) {
        const target = e.target as HTMLInputElement;
        const value = Number(target.value);
        const studentSet = new Set(students);
        if (target.checked) {
            studentSet.add(value)
        } else {
            studentSet.delete(value)
        }
        setStudents([...studentSet])
    }

    function updateClass(ok: () => void, fail: () => void) {
        if (!currentData) {
            return;
        }
        dataLoader.patch(`/api/classes/${currentData.id}/`, {
            "student_ids": students,
        }).then((d) => {
            const res = d.data as ResponseData<Class>;
            if (res.success) {
                ok();
            } else {
                setError(res.error.join());
                fail();
            }
        });
    }

    function confirmTask(e: React.FormEvent) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        setIsLoading(true);
        updateClass(() => {
            setIsLoading(false);
            form.reset();
            updated();
            closeModal();
        }, () => {
            setIsLoading(false);
        });
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
                <Modal.Title>Assign Students for Class</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Alert hidden={error === ''} variant={'danger'}>{error}</Alert>
                <Form className="form" onSubmit={confirmTask}>
                    <h6 className="d-flex gap-2 align-items-center">
                        <span>Student list</span>
                        <Spinner
                            hidden={!studentLoading}
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        />
                    </h6>
                    <Form.Group controlId="students" className="mb-3 over-flow-auto">
                        {studentList.map((student: Student, index) => {
                            return (
                                <Row key={student.id}>
                                    <Col xs={"auto"}>
                                        <Form.Check
                                            id={`std_${index}`}
                                            value={student.id}
                                            checked={student.id !== undefined && students.includes(student.id)}
                                            onChange={onChecked}
                                        />
                                    </Col>
                                    <Col>
                                        <Form.Label htmlFor={`std_${index}`}>Student ID: {student.student_id}, Student Name: {student.user.first_name} {student.user.last_name}</Form.Label>
                                    </Col>
                                </Row>
                            )
                        })}
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

export default ClassLectureForm;