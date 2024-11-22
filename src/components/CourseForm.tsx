import React, {useEffect, useState} from "react";
import {Button, Form, Modal, Spinner} from "react-bootstrap";
import {Course, ResponseData} from "../model.ts";
import dataLoader from "../dataLoader.ts";


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

    function postCourse(ok: () => void, fail: () => void) {
        dataLoader.post(`/api/courses/`, {
            "code": code,
            "name": name,
        }).then((d) => {
            const res = d.data as ResponseData<Course>;
            if (res.success) {
                ok();
            } else {
                fail();
            }
        });
    }
    function updateCourse(ok: () => void, fail: () => void) {
        if (!currentData) {
            return;
        }
        dataLoader.patch(`/api/courses/${currentData.id}/`, {
            "code": code,
            "name": name,
        }).then((d) => {
            const res = d.data as ResponseData<Course>;
            if (res.success) {
                ok();
            } else {
                fail();
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
            }, () => {
                setIsLoading(false);
            });
        } else {
            postCourse(() => {
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

export default CourseForm;