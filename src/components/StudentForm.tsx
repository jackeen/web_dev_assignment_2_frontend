import React, {useEffect, useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {Student} from "../model.ts";
import {API_HOST} from "../../configure.ts";


interface StudentFormProps {
    isShown: boolean;
    currentData: Student | undefined;
    closeModal: () => void;
    updated: () => void;
}

const StudentForm: React.FC<StudentFormProps> = (({isShown,closeModal, currentData, updated}) => {

    const [studentId, setStudentId] = useState('');
    const [birthDay, setBirthDay] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userName, setUserName] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);


    useEffect(() => {
        if (isShown) {
            if (currentData) {
                const data = currentData;
                setIsEdit(true);
                setStudentId(data.student_id || '');
                setBirthDay(data.date_of_birth || '');
                setEmail(data.user.email || '');
                setFirstName(data.user.first_name || '');
                setLastName(data.user.last_name || '');
                setUserName(data.user.username || '');
            } else {
                setIsEdit(false);
                setStudentId('');
                setBirthDay('');
                setEmail('');
                setFirstName('');
                setLastName('');
                setUserName('');
            }
        }
    }, [isShown]);

    function postStudent(callback: () => void) {
        fetch(`${API_HOST}/api/students/`, {
            method: 'POST',
            body: JSON.stringify({
                "student_id": studentId,
                "date_of_birth": birthDay,
                "user": {
                    "username": userName,
                    "email": email,
                    "first_name": firstName,
                    "last_name": lastName
                }
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
    function updateStudent(callback: () => void) {
        if (!currentData) {
            return;
        }
        fetch(`${API_HOST}/api/students/${currentData.id}/`, {
            method: 'PATCH',
            body: JSON.stringify({
                "student_id": studentId,
                "date_of_birth": birthDay,
                "user": {
                    "email": email,
                    "first_name": firstName,
                    "last_name": lastName
                }
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
            updateStudent(() => {
                setIsLoading(false);
                form.reset();
                updated();
                closeModal();
            });
        } else {
            postStudent(() => {
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
                <Modal.Title>{isEdit?"Edit ":"Add "}Student</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form className="form" onSubmit={confirmTask}>
                    <Form.Group controlId="studentid" className="mb-3">
                        <Form.Label>Student ID</Form.Label>
                        <Form.Control
                            type="text"
                            value={studentId}
                            placeholder="Enter student ID"
                            onChange={(e) => setStudentId(e.target.value)}
                            required={true}
                        />
                    </Form.Group>
                    <Form.Group controlId="birthday" className="mb-3">
                        <Form.Label>Date of birth</Form.Label>
                        <Form.Control
                            type="date"
                            value={birthDay}
                            placeholder="Enter date of birth"
                            onChange={(e) => setBirthDay(e.target.value)}
                            required={true}
                        />
                    </Form.Group>
                    <Form.Group controlId="email" className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            placeholder="Enter email"
                            onChange={(e) => setEmail(e.target.value)}
                            required={true}
                        />
                    </Form.Group>
                    <Form.Group controlId="firstname" className="mb-3">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={firstName}
                            placeholder="Enter first name"
                            onChange={(e) => setFirstName(e.target.value)}
                            required={true}
                        />
                    </Form.Group>
                    <Form.Group controlId="lastname" className="mb-3">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={lastName}
                            placeholder="Enter last name"
                            onChange={(e) => setLastName(e.target.value)}
                            required={true}
                        />
                    </Form.Group>
                    <Form.Group controlId="username" className="mb-3">
                        <Form.Label>User Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={userName}
                            placeholder="Enter user name"
                            onChange={(e) => setUserName(e.target.value)}
                            required={true}
                            disabled={isEdit}
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

export default StudentForm;