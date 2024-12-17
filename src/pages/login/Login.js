import React, { useEffect } from 'react';
import { Button, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Navigate, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from "../../apiService.js";
import { useAuth } from "../../contexts/authContext";
import { doSignInWithGoogle } from '../../firebase/auth';
import { useAuthStore } from '../../stores/useAuthStore.js';
import { useState } from '../hooks/Hooks.js';

const Login = () => {
    const { addUser } = useAuthStore();
    const { userLoggedIn, initializeUser } = useAuth();

    const [username, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [isSigningIn, setIsSigningIn] = useState(false)
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

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

    const onGoogleSignIn = async (e) => {
        e.preventDefault()
        if (!selectedCampus) {
            toast.error("Vui lòng chọn cơ sở.");
            return;
        }
        // localStorage.setItem("campusId", selectedCampus);
        try {
            const user = await doSignInWithGoogle();
            const isUserValid = await initializeUser(user);
            if (isUserValid) {
                toast.success("Đăng nhập thành công!");
                navigate("/");
            } else {
                throw new Error("Thông tin đăng nhập không hợp lệ. Vui lòng thử lại!");
            }
        } catch (error) {
            console.error(error.message || "Lỗi không xác định.");
            toast.error(error.message || "Thông tin đăng nhập không hợp lệ! Vui lòng thử lại!");
        } finally {
            setIsSigningIn(false);
        }
    }
    return (
        <Container className="my-5">
            <div id="chatbox"></div>
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

                        <Form.Group controlId="password">
                            <Form.Label>Mật khẩu</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Nhập mật khẩu"
                                />
                                <InputGroup.Text onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </InputGroup.Text>
                            </InputGroup>
                        </Form.Group>
                        {/* Thêm nút Quên mật khẩu */}
                        <div className="text-end mb-2">
                            <Button
                                variant="link"
                                className="text-decoration-none"
                                onClick={() => navigate('/quen-mat-khau')}
                            >
                                Quên mật khẩu?
                            </Button>
                        </div>
                        <div className="d-grid gap-2">
                            <Button style={{ backgroundColor: 'orange', borderColor: 'orange' }}
                                type="submit"
                                disabled={isSigningIn}
                                className="btn-block">
                                {isSigningIn ? 'Đang đăng nhập...' : 'Đăng nhập'}
                            </Button>
                        </div>
                    </Form>
                    <div className="text-center my-3">
                        <div className="d-flex align-items-center">
                            <div className="flex-grow-1 border-top"></div>
                            <span className="mx-3 text-muted">hoặc</span>
                            <div className="flex-grow-1 border-top"></div>
                        </div>
                    </div>
                    <div className="d-grid gap-2 mt-3">
                        <Button
                            disabled={isSigningIn}
                            onClick={(e) => { onGoogleSignIn(e) }}
                            variant="outline-primary" className="btn-block">
                            {isSigningIn ? 'Đang xử lý...' : 'Đăng nhập bằng tài khoản Google'}
                        </Button>
                    </div>
                    <div className="d-grid gap-2 mt-3">
                        <Button variant="outline-secondary" onClick={() => navigate('/')}>
                            Quay lại trang chủ
                        </Button>
                    </div>

                </Col>
            </Row>
        </Container>
    );
}

export default Login;