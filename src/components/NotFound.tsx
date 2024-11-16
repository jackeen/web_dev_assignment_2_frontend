import React, {useState} from 'react';
import {Alert, Button, Card, Form} from "react-bootstrap";
import {API_HOST} from "../../configure.ts";
import {ResponseData} from "./model.ts";
import {useNavigate} from "react-router-dom";

const NotFound: React.FC = () => {
    return (
        <div>404</div>
    )
}

export default NotFound