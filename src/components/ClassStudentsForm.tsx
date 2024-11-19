import React, {useEffect, useState} from "react";
import {Alert, Button, Col, Form, Modal, Row} from "react-bootstrap";
import {Class, Student} from "../model.ts";
import {API_HOST} from "../../configure.ts";


interface ClassLectureFormProps {
    isShown: boolean;
    currentData: Class | undefined;
    closeModal: () => void;
    updated: () => void;
}

const ClassLectureForm: React.FC<ClassLectureFormProps> = (({isShown,closeModal, currentData, updated}) => {

    const [students, setStudents] = useState<number[]>([]);
    const [studentList, setStudentList] = useState<Student[]>([]);

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
        fetch(`${API_HOST}/api/students/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}`,
            }
        }).then((res) => {
            return res.json();
        }).then((json) => {
            if (json.success) {
                let data = json.data as Student[];
                setStudentList(data);
            }
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

    function updateClass(callback: () => void) {
        if (!currentData) {
            return;
        }
        fetch(`${API_HOST}/api/classes/${currentData.id}/`, {
            method: 'PATCH',
            body: JSON.stringify({
                "student_ids": students,
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
                setError(json.error);
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
                    <Form.Group controlId="students" className="mb-3">
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
                                        <Form.Label htmlFor={`std_${index}`}>{student.user.first_name}</Form.Label>
                                    </Col>
                                </Row>
                            )
                        })}
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

export default ClassLectureForm;