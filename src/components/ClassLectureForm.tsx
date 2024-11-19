import React, {useEffect, useState} from "react";
import {Alert, Button, Form, Modal} from "react-bootstrap";
import {Class, Lecture} from "../model.ts";
import {API_HOST} from "../../configure.ts";


interface ClassLectureFormProps {
    isShown: boolean;
    currentData: Class | undefined;
    closeModal: () => void;
    updated: () => void;
}

const ClassLectureForm: React.FC<ClassLectureFormProps> = (({isShown,closeModal, currentData, updated}) => {

    const [lecture, setLecture] = useState(0);
    const [lectureList, setLectureList] = useState<Lecture[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setLecture(currentData?.lecture?.id || 0);
    }, [isShown]);

    // load options
    useEffect(() => {
        fetch(`${API_HOST}/api/lectures/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((res) => {
            return res.json();
        }).then((json) => {
            if (json.success) {
                let data = json.data as Lecture[];
                setLectureList(data);
            }
        });
    }, [])

    function updateClass(callback: () => void) {
        if (!currentData) {
            return;
        }
        fetch(`${API_HOST}/api/classes/${currentData.id}/`, {
            method: 'PATCH',
            body: JSON.stringify({
                "lecture_id": lecture,
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
                <Modal.Title>Assign Lecture for Class</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Alert hidden={error === ''} variant={'danger'}>{error}</Alert>
                <Form className="form" onSubmit={confirmTask}>
                    <Form.Group controlId="lecture" className="mb-3">
                        <Form.Label>Lecture</Form.Label>
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