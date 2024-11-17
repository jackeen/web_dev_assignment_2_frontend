// For API Data
interface ResponseData<E, D> {
    success: boolean;
    error: E;
    data: D;
}

interface User {
    id?:number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
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

export type {
    ResponseData,
    Lecture,
    Student,
    Course,
    Semester,
    Class,
}