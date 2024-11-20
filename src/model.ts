import Roles from "./Roles.ts";

// For API Data
interface ResponseData<D> {
    success: boolean;
    error: string[];
    data: D;
}

interface User {
    id?:number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_superuser: boolean;
    is_staff: boolean;
    is_active: boolean;
    group: string;
}

interface Lecture {
    id?: number;
    staff_id: string;
    date_of_birth: string;
    user: User
}

interface Student {
    id?: number;
    student_id: string;
    date_of_birth: string;
    user: User
}

interface Course {
    id?: number;
    code: string;
    name: string;
}

interface Semester {
    id?: number;
    year: string;
    semester: string;
    start_date: string;
    end_date: string;
}

interface Class {
    id?: number;
    number: string;
    course: Course;
    semester: Semester;
    lecture: Lecture | null;
    students: Student[];
}

interface Attendance {
    id?: number;
    class_id: number;
    student_id: number;
    lecture_id: number;
    status: string;
}

interface CollegeDay {
    id?: number;
    semester_id: number;
    date: string;
}

export type {
    Roles,
    ResponseData,
    User,
    Lecture,
    Student,
    Course,
    Semester,
    Class,
    Attendance,
    CollegeDay,
}