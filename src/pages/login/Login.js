import React, { useEffect } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { Navigate, Link } from 'react-router-dom'
import { useState } from '../hooks/Hooks.js';
import { doSignInWithGoogle } from '../../firebase/auth'
import { useAuth } from '../../contexts/authContext'
import api from "../../apiService.js";

const Login = () => {
    const { userLoggedIn } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSigningIn, setIsSigningIn] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    // Cơ sở
    const [campuses, setCampuses] = useState([]);
    const [selectedCampus, setSelectedCampus] = useState('');
    useEffect(() => {
        const fetchCampuses = async () => {
            try {
                const response = await api.get('/Campus/get-campuses');
                setCampuses(response.data);
            } catch (error) {
                console.error('Error fetching campuses:', error);
            }
        };
        fetchCampuses();
    }, []);

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsSigningIn(true);
        setErrorMessage('');

        try {
            const response = await api.post(`/Authentication/login`, {
                email,
                password
            });
            const token = response.data.Bear;
            localStorage.setItem('token', token);
        } catch (error) {
            setErrorMessage('Đăng nhập không thành công');
        } finally {
            setIsSigningIn(false);
        }
    };

    const onGoogleSignIn = (e) => {
        e.preventDefault()
        if (!isSigningIn) {
            setIsSigningIn(true)
            doSignInWithGoogle().catch(err => {
                setIsSigningIn(false)
                setErrorMessage(err.message);
            })
        }
    }
    return (
        <Container className="my-5">
            {userLoggedIn && (<Navigate to={'/'} replace={true} />)}
            <Row className="justify-content-center">
                <Col md={5}>
                    <h2 className="text-center" style={{ color: 'orange' }}>Đăng nhập</h2>
                    <Form onSubmit={onSubmit}>
                        <Form.Group className="mb-3" controlId="campus">
                            <Form.Label>Cơ sở</Form.Label>
                            <Form.Control as="select" value={selectedCampus} onChange={(e) => setSelectedCampus(e.target.value)}>
                                {campuses.map(campus => (
                                    <option key={campus.campusId} value={campus.campusId}>
                                        {campus.campusName}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email"
                                autoComplete='email'
                                required
                                value={email} onChange={(e) => { setEmail(e.target.value) }}
                                placeholder="Nhập địa chỉ email" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Mật khẩu</Form.Label>
                            <Form.Control type="password"
                                autoComplete='current-password'
                                required
                                value={password} onChange={(e) => { setPassword(e.target.value) }}
                                placeholder="Nhập mật khẩu" />
                        </Form.Group>
                        {errorMessage && (
                            <span className='text-red-600 font-bold'>{errorMessage}</span>
                        )}
                        <div className="d-grid gap-2">
                            <Button style={{ backgroundColor: 'orange', borderColor: 'orange' }}
                                type="submit"
                                disabled={isSigningIn}
                                className="btn-block">
                                {isSigningIn ? 'Đang đăng nhập...' : 'Đăng nhập'}
                            </Button>
                        </div>
                    </Form>
                    <div className="d-grid gap-2 mt-3">
                        <Button
                            disabled={isSigningIn}
                            onClick={(e) => { onGoogleSignIn(e) }}
                            variant="outline-primary" className="btn-block">
                            {isSigningIn ? 'Đang xử lý...' : 'Đăng nhập bằng tài khoản Google'}
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;