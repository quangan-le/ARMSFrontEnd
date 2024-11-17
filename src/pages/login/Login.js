import React, { useEffect } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { useState } from '../hooks/Hooks.js';
import { doSignInWithGoogle } from '../../firebase/auth'
import { useAuth } from '../../contexts/authContext'
import api from "../../apiService.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthStore } from '../../stores/useAuthStore.js';

const Login = () => {
    const { userLoggedIn } = useAuth()
    const { loginWithCustomAuth } = useAuth();
    const { addUser } = useAuthStore()

    const [username, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [isSigningIn, setIsSigningIn] = useState(false)
    const navigate = useNavigate();

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
        if (!selectedCampus) {
            toast.error("Vui lòng chọn cơ sở.");
            return;
        }

        setIsSigningIn(true);
        try {
            const response = await api.post(`/Authentication/login`, {
                campusId: selectedCampus,
                username,
                password
            });
            addUser(response.data);

            switch (response.data.role) {
                case "Admin":
                    navigate('/admin/dashboard');
                    break;
                case "AdmissionOfficer":
                    navigate('/admissions-officer/dashboard');
                    break;
                case "SchoolService":
                    navigate('/school-service/dashboard');
                    break;
                case "AdmissionCouncil":
                    navigate('/admissions-council/dashboard');
                    break;
                default:
                    toast.error("Role không hợp lệ.");
                    break;
            }
        } catch (error) {
            toast.error("Đăng nhập không thành công. Vui lòng kiểm tra thông tin.");
        } finally {
            setIsSigningIn(false);
        }
    };

    const onGoogleSignIn = (e) => {
        e.preventDefault()
        if (!selectedCampus) {
            toast.error("Vui lòng chọn cơ sở.");
            return;
        }
        localStorage.setItem("campusId", selectedCampus);

        if (!isSigningIn) {
            setIsSigningIn(true)
            doSignInWithGoogle(selectedCampus, loginWithCustomAuth)
                .then(() => {
                    navigate('/');
                    setIsSigningIn(false);
                })
                .catch(err => {
                    console.error(err);
                    setIsSigningIn(false);
                    toast.error("Tài khoản của bạn không tồn tại trong campus hiện tại.");
                });
        }
    }
    return (
        <Container className="my-5">
            <ToastContainer position="top-right" autoClose={3000} />
            {userLoggedIn && (<Navigate to={'/'} replace={true} />)}
            <Row className="justify-content-center">
                <Col md={5}>
                    <h2 className="text-center" style={{ color: 'orange' }}>Đăng nhập</h2>
                    <Form onSubmit={onSubmit}>
                        <Form.Group className="mb-3" controlId="campus">
                            <Form.Label>Cơ sở</Form.Label>
                            <Form.Control as="select" value={selectedCampus} onChange={(e) => setSelectedCampus(e.target.value)}>
                                <option value="">Chọn cơ sở</option>
                                {campuses.map(campus => (
                                    <option key={campus.campusId} value={campus.campusId}>
                                        {campus.campusName}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="username">
                            <Form.Label>Tên đăng nhập</Form.Label>
                            <Form.Control type="text"
                                autoComplete='username'
                                required
                                value={username} onChange={(e) => { setUserName(e.target.value) }}
                                placeholder="Nhập tên đăng nhập" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Mật khẩu</Form.Label>
                            <Form.Control type="password"
                                autoComplete='current-password'
                                required
                                value={password} onChange={(e) => { setPassword(e.target.value) }}
                                placeholder="Nhập mật khẩu" />
                        </Form.Group>
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