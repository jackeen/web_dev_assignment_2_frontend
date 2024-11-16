import React, {useState} from 'react';
import {Alert, Button, Card, Form} from "react-bootstrap";
import {API_HOST} from "../../configure.ts";
import {ResponseData} from "./model.ts";
import {useNavigate} from "react-router-dom";

interface LoginError {
    non_field_errors: [String]
}
interface TokenData {
    token: string;
}


const Login: React.FC = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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


        const data: ResponseData<LoginError, TokenData> = await response.json();
        if (data.success) {
            localStorage.setItem('token', data.data.token);
            navigate('/');
        } else {
            if (data.error.non_field_errors.length > 0) {
                let error_text = data.error.non_field_errors[0];
                // @ts-ignore
                setError(error_text);
            }
        }

        setLoading(false);
    }

    return (
        <div className="d-flex align-items-center justify-content-center vw-100 vh-100">
            <Card className="flex-column w-50 p-5 shadow">
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
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" disabled={loading}>Login</Button>
                </Form>
            </Card>
        </div>
    )
}

export default Login