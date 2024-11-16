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

export type {
    ResponseData,
    Lecture,
    Student,
    Course,
}