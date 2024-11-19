import React, {useEffect, useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {Course} from "../model.ts";
import {API_HOST} from "../../configure.ts";


interface CourseFormProps {
    isShown: boolean;
    currentData: Course | undefined;
    closeModal: () => void;
    updated: () => void;
}

const CourseForm: React.FC<CourseFormProps> = (({isShown,closeModal, currentData, updated}) => {

    const [code, setCode] = useState('');
    const [name, setName] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);


    useEffect(() => {
        if (isShown) {
            if (currentData) {
                const data = currentData;
                setIsEdit(true);
                setCode(data.code || '');
                setName(data.name || '');
            } else {
                setIsEdit(false);
                setCode('');
                setName('');
            }
        }
    }, [isShown]);

    function postCourse(callback: () => void) {
        fetch(`${API_HOST}/api/courses/`, {
            method: 'POST',
            body: JSON.stringify({
                "code": code,
                "name": name,
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
    function updateCourse(callback: () => void) {
        if (!currentData) {
            return;
        }
        fetch(`${API_HOST}/api/courses/${currentData.id}/`, {
            method: 'PATCH',
            body: JSON.stringify({
                "code": code,
                "name": name,
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
            updateCourse(() => {
                setIsLoading(false);
                form.reset();
                updated();
                closeModal();
            });
        } else {
            postCourse(() => {
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
                <Modal.Title>{isEdit?"Edit ":"Add "}Course</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form className="form" onSubmit={confirmTask}>
                    <Form.Group controlId="code" className="mb-3">
                        <Form.Label>Course code</Form.Label>
                        <Form.Control
                            type="text"
                            value={code}
                            placeholder="Enter course code"
                            onChange={(e) => setCode(e.target.value)}
                            required={true}
                        />
                    </Form.Group>
                    <Form.Group controlId="name" className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            placeholder="Enter course name"
                            onChange={(e) => setName(e.target.value)}
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

export default CourseForm;