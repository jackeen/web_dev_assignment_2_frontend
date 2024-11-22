import React, {useEffect, useState} from "react";
import {Alert, Button, Form, Modal, Spinner} from "react-bootstrap";
import {Class, Lecture, ResponseData} from "../model.ts";
import dataLoader from "../dataLoader.ts";


interface ClassLectureFormProps {
    isShown: boolean;
    currentData: Class | undefined;
    closeModal: () => void;
    updated: () => void;
}

const ClassLectureForm: React.FC<ClassLectureFormProps> = (({isShown,closeModal, currentData, updated}) => {

    const [lecture, setLecture] = useState(0);
    const [lectureList, setLectureList] = useState<Lecture[]>([]);
    const [lectureLoading, setLectureLoading] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setLecture(currentData?.lecture?.id || 0);
    }, [isShown]);

    // load options
    useEffect(() => {
        setLectureLoading(true);
        dataLoader.get('/api/lectures/').then((d) => {
            const res = d.data as ResponseData<Lecture[]>;
            if (res.success) {
                setLectureList(res.data);
            }
            setLectureLoading(false);
        });
    }, [])

    function updateClass(ok: () => void, fail: () => void) {
        if (!currentData) {
            return;
        }
        dataLoader.patch(`/api/classes/${currentData.id}/`, {
            "lecture_id": lecture,
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
                <Modal.Title>Assign Lecture for Class</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Alert hidden={error === ''} variant={'danger'}>{error}</Alert>
                <Form className="form" onSubmit={confirmTask}>
                    <Form.Group controlId="lecture" className="mb-3">
                        <Form.Label className="d-flex gap-2 align-items-center">
                            <span>Lecture</span>
                            <Spinner
                                hidden={!lectureLoading}
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                        </Form.Label>
                        <Form.Select
                            value={lecture}
                            onChange={(e) => setLecture(Number(e.target.value))}
                            required={true}
                        >
                            <option value={0}>--Select lecture--</option>
                            {lectureList.map((lecture) => {
                                return (
                                    <option key={lecture.id} value={lecture.id}>{lecture.user.first_name} {lecture.user.last_name}</option>
                                )
                            })}
                        </Form.Select>
                    </Form.Group>

                    <p>If you want to cancel the lecture, pls to select the first item.</p>

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