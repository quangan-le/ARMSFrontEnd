import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Tab, Nav, Form } from 'react-bootstrap';
import api from "../../apiService.js"; // Đảm bảo rằng apiService.js đã được cấu hình đúng để gọi API

const StudentProfile = () => {
    const [studentData, setStudentData] = useState(null);
    // Lấy thông tin sinh viên từ API khi component được mount
    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const response = await api.get("/Profile/get-profile");
                const data = response.data;
                setStudentData(data);
            } catch (error) {
                console.error("Lỗi khi lấy thông tin sinh viên: ", error);
            }
        };

        fetchStudentData();
    }, []);

    // Format DOB nếu có dữ liệu
    const formatDate = (date) => {
        if (!date) return '';  // Trường hợp không có ngày sinh
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const formattedDate = new Date(date).toLocaleDateString('vi-VN', options);
        return formattedDate;
    };

    if (!studentData) {
        return <div>Đang tải thông tin...</div>;  // Hoặc có thể trả về một loading spinner
    }
    return (
        <Container className='my-5'>
            <h1 className="text-center" style={{ color: 'orange' }}>Thông tin sinh viên</h1>
            <Tab.Container id="left-tabs-example" defaultActiveKey="profile">
                <Row className='mt-4'>
                    <Col md={3}>
                        <Nav variant="pills" className="flex-column">
                            <Nav.Item>
                                <Nav.Link eventKey="profile">Xem Thông Tin Cá Nhân</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>

                    <Col md={6}>
                        <Tab.Content>
                            <Tab.Pane eventKey="profile">
                                <Form>
                                    <Row className='mb-3'>
                                        <Col md={3}>
                                            <Form.Label>Họ và Tên</Form.Label>
                                        </Col>
                                        <Col md={9}>
                                            <Form.Group controlId="formFullName">
                                                <Form.Control type="text" value={studentData.fullname} disabled />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className='mb-3'>
                                        <Col md={3}>
                                            <Form.Label>Ngày sinh</Form.Label>
                                        </Col>
                                        <Col md={9}>
                                            <Form.Group controlId="formDateOfBirth">
                                                <Form.Control
                                                    type="text"
                                                    value={formatDate(studentData.dob)}
                                                    disabled
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className='mb-3'>
                                        <Col md={3}>
                                            <Form.Label>Giới tính</Form.Label>
                                        </Col>
                                        <Col md={9}>
                                            <Form.Group controlId="formGender">
                                                <Form.Control
                                                    type="text"
                                                    value={studentData.gender === true ? 'Nam' : 'Nữ'}
                                                    disabled
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className='mb-3'>
                                        <Col md={3}>
                                            <Form.Label>Ngành học</Form.Label>
                                        </Col>
                                        <Col md={9}>
                                            <Form.Group controlId="formMajor">
                                                <Form.Control type="text" value={studentData.majorName} disabled />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className='mb-3'>
                                        <Col md={3}>
                                            <Form.Label>Email</Form.Label>
                                        </Col>
                                        <Col md={9}>
                                            <Form.Group controlId="formEmail">
                                                <Form.Control type="email" value={studentData.email} disabled />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row className='mb-3'>
                                        <Col md={3}>
                                            <Form.Label>Số điện thoại</Form.Label>
                                        </Col>
                                        <Col md={9}>
                                            <Form.Group controlId="formPhoneNumber">
                                                <Form.Control type="text" value={studentData.phone} disabled />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Form>
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>


                </Row>
            </Tab.Container>
        </Container>
    );
};

export default StudentProfile;
