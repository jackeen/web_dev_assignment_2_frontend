import React, {useState} from 'react';
import {Alert, Button, Card, Form, Spinner} from "react-bootstrap";
import {API_HOST} from "../../configure.ts";
import {ResponseData, User} from "../model.ts";
import axios from "axios";
import Roles from "../Roles.ts";
import ROUTES from "../routes.ts";


interface TokenData {
    token: string;
}

const Login: React.FC = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const response = await fetch(`${API_HOST}/api/login/`, {
            method: 'POST',
            body: JSON.stringify({username, password}),
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data: ResponseData<TokenData> = await response.json();
        if (data.success) {
            const token = data.data.token;
            localStorage.setItem('token', data.data.token);

            axios.get(`${API_HOST}/api/current_user/`, {
                headers: {
                    "Authorization": `Token ${token}`,
                }
            }).then((res) => {
                const user = res.data.data as User;
                let role = "";
                if (user.is_superuser) {
                    role = Roles.Admin.toString();
                } else {
                    role = user.group;
                }
                localStorage.setItem('role', role);
                localStorage.setItem('user', JSON.stringify(user));
                setTimeout(() => {
                    window.location.href = `${ROUTES.HOME}`;
                    setLoading(false);
                }, 200);
            }).catch((err) => {
                alert(err.toString());
                setLoading(false);
            })

        } else {
            if (data.error.length > 0) {
                let error_text = data.error.join('\n');
                setError(error_text);
            }
        }
    }

    return (
        <div className="d-flex flex-column align-items-center justify-content-center vw-100 vh-100 login-bg">
            <Card className="w-50 p-5 shadow">
                <h1 className="text-center mb-5">Login</h1>
                <Alert hidden={error==""} variant={"danger"}>{error}</Alert>
                <Form onSubmit={handleLogin}>
                    <Form.Group controlId="username" className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            value={username}
                            placeholder="Enter username"
                            onChange={(e) => setUsername(e.target.value)}
                            required={true}
                            size="lg"
                        />
                    </Form.Group>
                    <Form.Group controlId="password" className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            placeholder="Enter password"
                            onChange={(e) => setPassword(e.target.value)}
                            required={true}
                            size="lg"
                        />
                    </Form.Group>
                    <div className="d-flex justify-content-center">
                        <Button variant="primary" size="lg" type="submit"
                                className="w-100 d-flex gap-2 align-items-center justify-content-center"
                                disabled={loading}
                        >
                            <Spinner
                                hidden={!loading}
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                            <span>Login</span>
                        </Button>
                    </div>
                </Form>
            </Card>
            <div className="pt-5 login-copyright text-center">
                <div>Attendance system for WebDev Assignment 2</div>
                <div>© 2024 Attendance by Jack</div>
            </div>
        </div>
    )
}

export default Login