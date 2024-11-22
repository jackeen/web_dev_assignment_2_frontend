import React, {useEffect, useState} from "react";
import {Button, Form, Modal, Spinner} from "react-bootstrap";
import {Lecture, ResponseData} from "../model.ts";
import dataLoader from "../dataLoader.ts";


interface LectureFormProps {
    isShown: boolean;
    currentData: Lecture | undefined;
    closeModal: () => void;
    updated: () => void;
}

const LectureForm: React.FC<LectureFormProps> = (({isShown,closeModal, currentData, updated}) => {

    const [staffId, setStaffId] = useState('');
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
                setStaffId(data.staff_id || '');
                setBirthDay(data.date_of_birth || '');
                setEmail(data.user.email || '');
                setFirstName(data.user.first_name || '');
                setLastName(data.user.last_name || '');
                setUserName(data.user.username || '');
            } else {
                setIsEdit(false);
                setStaffId('');
                setBirthDay('');
                setEmail('');
                setFirstName('');
                setLastName('');
                setUserName('');
            }
        }
    }, [isShown]);

    function postLecture(ok: () => void, fail: () => void) {
        dataLoader.post('/api/lectures/', {
            "staff_id": staffId,
            "date_of_birth": birthDay,
            "user": {
                "username": userName,
                "email": email,
                "first_name": firstName,
                "last_name": lastName
            }
        }).then((d) => {
            const res = d.data as ResponseData<Lecture>;
            if (res.success) {
                ok();
            } else {
                fail();
                alert(res.error.join());
            }
        });
    }
    function updateLecture(ok: () => void, fail: () => void) {
        if (!currentData) {
            return;
        }
        dataLoader.patch(`/api/lectures/${currentData.id}/`, {
            "staff_id": staffId,
            "date_of_birth": birthDay,
            "user": {
                "email": email,
                "first_name": firstName,
                "last_name": lastName
            }
        }).then((d) => {
            const res = d.data as ResponseData<Lecture>;
            if (res.success) {
                ok();
            } else {
                fail();
                alert(res.error.join());
            }
        });
    }

    function confirmTask(e: React.FormEvent) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        setIsLoading(true);
        if (isEdit) {
            updateLecture(() => {
                setIsLoading(false);
                form.reset();
                updated();
                closeModal();
            }, () => {
                setIsLoading(false);
            });
        } else {
            postLecture(() => {
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
                <Modal.Title>{isEdit?"Edit ":"Add "}Lecture</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form className="form" onSubmit={confirmTask}>
                    <Form.Group controlId="staffid" className="mb-3">
                        <Form.Label>Staff ID</Form.Label>
                        <Form.Control
                            type="text"
                            value={staffId}
                            placeholder="Enter staff ID"
                            onChange={(e) => setStaffId(e.target.value)}
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

export default LectureForm;