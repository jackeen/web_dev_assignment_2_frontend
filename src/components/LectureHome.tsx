import React, {useEffect, useState} from "react";
import {Button, Card, Table} from "react-bootstrap";
import dataLoader from "../dataLoader.ts";
import {Attendance, Class, ResponseData, Student} from "../model.ts";
import {Link} from "react-router-dom";
import AttendanceMaking from "./AttendanceMaking.tsx";


interface attendanceMapValue {
    P: number;
    A: number;
}

const LectureHome: React.FC = () => {

    const [classList, setClassList] = useState<Class[]>([]);
    const [attendanceData, setAttendanceData] = useState<Map<string, attendanceMapValue>>(new Map());

    const [status, setStatus] = useState('');
    const [classId, setClassId] = useState(0);
    const [studentId, setStudentId] = useState(0);
    const [lectureId, setLectureId] = useState(0);
    const [semesterId, setSemesterId] = useState(0);

    const [isShown, setIsShown] = useState(false);
    // const [isLoading, setIsLoading] = useState(false);
    const [listChanging, setListChanging] = useState(0);


    useEffect(() => {
        dataLoader.get('/api/classes/')
            .then((data) => {
                const res = data.data as ResponseData<Class[]>;
                if (res.success) {
                    if (res.data.length > 0) {

                        const first = res.data[0];
                        const lectureId = first.lecture?.id;
                        const classId = first.id;
                        setClassId(classId || 0);
                        setLectureId(lectureId || 0);

                        // continue attendance for the list
                        dataLoader.get(`/api/attendances/?lecture_id=${lectureId}`)
                            .then((data) => {
                                const AttendanceRes = data.data as ResponseData<Attendance[]>;
                                const attendanceMap: Map<string, attendanceMapValue> = new Map();

                                // rebuild attendance data for every student for next list to display
                                if (AttendanceRes.success) {
                                    AttendanceRes.data.forEach((attendance) => {
                                        const attKey = `${attendance.student_id}_${attendance.class_id}`;
                                        let stdAtt = attendanceMap.get(attKey)
                                        if (stdAtt) {
                                            if (attendance.status === 'A') {
                                                stdAtt.A++;
                                            } else if (attendance.status === 'P') {
                                                stdAtt.P++;
                                            }
                                            attendanceMap.set(attKey, stdAtt);
                                        } else {
                                            const newAtt: attendanceMapValue = {
                                                A: (attendance.status === 'A' ? 1 : 0),
                                                P: (attendance.status === 'P' ? 1 : 0),
                                            }
                                            attendanceMap.set(attKey, newAtt);
                                        }
                                    });
                                    setAttendanceData(attendanceMap);
                                    setClassList(res.data);
                                }
                            });
                    }
                } else {
                    alert(res.error.join());
                }
            });
    }, [listChanging]);

    function attendanceMaking(status: string, studentId: number|undefined, semesterId: number|undefined, classId: number|undefined) {
        if (classId !== undefined && studentId !== undefined && lectureId !== undefined && semesterId !== undefined) {
            setStatus(status);
            setStudentId(studentId);
            setSemesterId(semesterId);
            setClassId(classId);
            setIsShown(true);
        }
    }
    function closeModal() {
        setIsShown(false);
    }
    function listUpdated() {
        setListChanging(Math.random());
    }

    function getAttendanceNumber(studentId: number|undefined, classId: number|undefined, s: string): string {
        const d = attendanceData.get(`${studentId}_${classId}`)
        if (d !== undefined) {
            if (s === 'A') {
                return d.A.toString();
            } else if (s === 'P') {
                return d.P.toString();
            }
        }
        return "--"
    }

    return (
        <div>
            <AttendanceMaking
                status={status}
                lectureId={lectureId}
                classId={classId}
                studentId={studentId}
                semesterId={semesterId}
                isShown={isShown}
                closeModal={closeModal}
                updated={listUpdated}
            />
            <h3 className="pt-3">Lectures' classes</h3>
            {classList.length == 0 ? <p>This is no class.</p> : ''}
            {classList.map((cls, index) => {
                return (
                    <div key={cls.id}>
                        <Card key={cls.id} className="mb-3">
                            <Card.Header><b>{index + 1}: Class-{cls.number}</b></Card.Header>
                            <Card.Body>
                                <Card.Text className="d-flex align-items-center gap-2">
                                    <span>{cls.course.code} {cls.course.name}</span>
                                    <span>IN</span>
                                    <span>{cls.semester.year} {cls.semester.semester}</span>
                                </Card.Text>

                                <Table bordered hover>
                                    <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Student ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Absent</th>
                                        <th>Present</th>
                                        <th></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {cls.students.map((student: Student) => {
                                        return (
                                            <tr key={student.id}>
                                                <td>{student.id}</td>
                                                <td>{student.student_id}</td>
                                                <td>{student.user.first_name} {student.user.last_name}</td>
                                                <td>
                                                    <Link to={`mailto:${student.user.email}`}>{student.user.email}</Link>
                                                </td>
                                                <td>{getAttendanceNumber(student.id, cls.id, 'A')}</td>
                                                <td>{getAttendanceNumber(student.id, cls.id, 'P')}</td>
                                                <td className="d-flex gap-2 justify-content-end">
                                                    <Button variant="warning" size={'sm'} onClick={() => {
                                                        attendanceMaking('A', student.id, cls.semester.id, cls.id);
                                                    }}>Absent</Button>
                                                    <Button variant="success" size={'sm'} onClick={() => {
                                                        attendanceMaking('P', student.id, cls.semester.id, cls.id);
                                                    }}>Present</Button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                    </tbody>
                                </Table>
                            </Card.Body>
                            {/*<Card.Footer>*/}
                            {/*    <Button>Load attendance list</Button>*/}
                            {/*</Card.Footer>*/}
                        </Card>
                    </div>
                )
            })}
        </div>
    )
};

export default LectureHome;