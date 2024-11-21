import React, {useEffect, useState} from "react";
import {Attendance, Class, ResponseData, User} from "../model.ts";
import dataLoader from "../dataLoader.ts";
import {Spinner, Table} from "react-bootstrap";


interface attendanceMapValue {
    P: number;
    A: number;
}

const StudentHome: React.FC = () => {

    const [classList, setClassList] = useState<Class[]>([]);
    const [attendanceData, setAttendanceData] = useState<Map<number, attendanceMapValue>>(new Map());
    const [loading, setLoading] = useState(false);

    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) as User : null;

    useEffect(() => {

        if (user) {
            setLoading(true);
            dataLoader.get('/api/classes/')
                .then((data) => {
                    const res = data.data as ResponseData<Class[]>;
                    if (res.success) {
                        if (res.data.length > 0) {
                            // continue attendance for student
                            dataLoader.get(`/api/attendances/?student_id=${user?.id}`)
                                .then((data) => {
                                    const AttendanceRes = data.data as ResponseData<Attendance[]>;
                                    const attendanceMap: Map<number, attendanceMapValue> = new Map();
                                    if (AttendanceRes.success) {
                                        AttendanceRes.data.forEach((attendance) => {
                                            let stdAtt = attendanceMap.get(attendance.class_id)
                                            if (stdAtt) {
                                                if (attendance.status === 'A') {
                                                    stdAtt.A++;
                                                } else if (attendance.status === 'P') {
                                                    stdAtt.P++;
                                                }
                                                attendanceMap.set(attendance.class_id, stdAtt);
                                            } else {
                                                const newAtt: attendanceMapValue = {
                                                    A: (attendance.status === 'A' ? 1 : 0),
                                                    P: (attendance.status === 'P' ? 1 : 0),
                                                }
                                                attendanceMap.set(attendance.class_id, newAtt);
                                            }
                                        });
                                        setAttendanceData(attendanceMap);
                                        setClassList(res.data);
                                        setLoading(false);
                                    }
                                });
                        }
                    } else {
                        alert(res.error.join());
                    }
                });
        }

    }, []);

    return (
        <div>
            <h2 className="pt-3 d-flex gap-2 align-items-center justify-content-center">
                <span>Student attendance</span>
                <Spinner
                    hidden={!loading}
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                />
            </h2>
            <Table bordered hover responsive>
                <thead>
                <tr>
                    <th>Class Number</th>
                    <th>Semester</th>
                    <th>Course</th>
                    <th>Lecture</th>
                    <th>Absent</th>
                    <th>Present</th>
                </tr>
                </thead>
                <tbody>
                {classList.map((cls) => {
                    return (
                        <tr key={cls.id}>
                            <td>{cls.number}</td>
                            <td>{cls.semester.year} {cls.semester.semester}</td>
                            <td>{cls.course.code} {cls.course.name}</td>
                            <td>
                                {cls.lecture?.user.first_name} {cls.lecture?.user.last_name}
                                {cls.lecture ? "" : "Not Assigned"}
                            </td>
                            <td>
                                {attendanceData.get(cls.id || 0)?.A || "--"}
                            </td>
                            <td>
                                {attendanceData.get(cls.id || 0)?.P || "--"}
                            </td>
                        </tr>
                    )
                })}
                </tbody>
                <tfoot hidden={!loading}>
                    <tr>
                        <td colSpan={6} className="text-center">loading...</td>
                    </tr>
                </tfoot>
            </Table>
        </div>
    );
};

export default StudentHome;