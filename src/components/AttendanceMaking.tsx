import React, {useEffect, useState} from "react";
import {Alert, Button, Form, Modal} from "react-bootstrap";
import dataLoader from "../dataLoader.ts";
import {CollegeDay, ResponseData} from "../model.ts";


interface AttendanceMakingProp {
    classId: number;
    studentId: number;
    lectureId: number;
    semesterId: number;
    status: string;
    isShown: boolean;
    updated: () => void;
    closeModal: () => void;
}
const AttendanceMaking: React.FC<AttendanceMakingProp> = (props) => {

    const [collegeDayId, setCollegeDayId] = useState(0);
    const [collegeDayList, setCollegeDayList] = useState<CollegeDay[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        dataLoader.get(`/api/college_days/?semester_id=${props.semesterId}`)
            .then((data) => {
                const res = data.data as ResponseData<CollegeDay[]>;
                if (res.success) {
                    setCollegeDayList(res.data);
                }
            });
    }, [props.isShown]);

    function confirmTask() {
        if (collegeDayId === 0) {
            setError("Please select a college day.");
            return;
        } else {
            setError("");
        }
        setIsLoading(true);
        dataLoader.post('/api/attendances/', {
            'college_day_id': collegeDayId,
            'student_id': props.studentId,
            'lecture_id': props.lectureId,
            'status': props.status,
            'class_id': props.classId,
        }).then((_) => {
            setIsLoading(false);
            props.updated();
            props.closeModal();
        });
    }
    function cancelTask() {
        setIsLoading(false);
        props.closeModal();
    }

    function collegeDayChanged(e: React.FormEvent<HTMLSelectElement>) {
        const target = e.target as HTMLInputElement;
        const v = Number(target.value)
        setCollegeDayId(v);
        if (v === 0) {
            setError("Please select a college day.");
        } else {
            setError("");
        }
    }

    return (
        <Modal className="dialog"
               show={props.isShown}
               centered={true}
               size={"lg"}
               animation={true}
        >
            <Modal.Header>
                <Modal.Title>{props.status === 'P' ? 'Present' : 'Absent'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Alert variant="danger" hidden={error === ""}>{error}</Alert>
                <Form onSubmit={confirmTask}>
                    <Form.Select size="lg" onInput={(e) => {
                        collegeDayChanged(e);
                    }} value={collegeDayId}>
                        <option value="0">Select the day</option>
                        {collegeDayList.map((d) => {
                            return (
                                <option key={d.id} value={d.id}>{d.date}</option>
                            )
                        })}
                    </Form.Select>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <div className="d-flex justify-content-end gap-2">
                    <Button onClick={confirmTask} disabled={isLoading} variant="primary">Save</Button>
                    <Button onClick={cancelTask} variant="secondary">Cancel</Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default AttendanceMaking;