import React, { useState } from 'react';
import { Container, Row, Col, Tab, Nav, Form, Button } from 'react-bootstrap';

const StudentProfile = () => {
    const studentData = {
        fullName: "Quang An",
        dateOfBirth: "01/01/2000",
        major: "Công nghệ thông tin",
        class: "SE1234",
        email: "quanan@gmail.com",
        phoneNumber: "0123456789",
        address: "Số 1, Đường XYZ, Quận ABC, TP.HCM",
    };

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
                            <Nav.Item>
                                <Nav.Link eventKey="change-password">Đổi Mật Khẩu</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>

                    <Col md={9}>
                        <Tab.Content>
                            <Tab.Pane eventKey="profile">
                                <Form>
                                    <Row className='mb-3'>
                                        <Col md={6}>
                                            <Form.Group controlId="formFullName">
                                                <Form.Label>Họ và Tên</Form.Label>
                                                <Form.Control type="text" value={studentData.fullName} disabled />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId="formDateOfBirth">
                                                <Form.Label>Ngày sinh</Form.Label>
                                                <Form.Control type="text" value={studentData.dateOfBirth} disabled />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row className='mb-3'>
                                        <Col md={6}>
                                            <Form.Group controlId="formMajor">
                                                <Form.Label>Ngành học</Form.Label>
                                                <Form.Control type="text" value={studentData.major} disabled />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId="formClass">
                                                <Form.Label>Lớp</Form.Label>
                                                <Form.Control type="text" value={studentData.class} disabled />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row className='mb-3'>
                                        <Col md={6}>
                                            <Form.Group controlId="formEmail">
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control type="email" value={studentData.email} disabled />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId="formPhoneNumber">
                                                <Form.Label>Số điện thoại</Form.Label>
                                                <Form.Control type="text" value={studentData.phoneNumber} disabled />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row className='mb-3'>
                                        <Col md={12}>
                                            <Form.Group controlId="formAddress">
                                                <Form.Label>Địa chỉ</Form.Label>
                                                <Form.Control as="textarea" rows={2} value={studentData.address} disabled />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Form>
                            </Tab.Pane>

                            <Tab.Pane eventKey="change-password">
                                <Form className='w-75 mx-auto'>
                                    <Form.Group as={Row} controlId="formCurrentPassword" className='mb-3'>
                                        <Form.Label column md={4} >
                                            Mật khẩu hiện tại
                                        </Form.Label>
                                        <Col md={8}>
                                            <Form.Control type="password" placeholder="Nhập mật khẩu hiện tại" />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} controlId="formNewPassword" className='mb-3'>
                                        <Form.Label column md={4}>
                                            Mật khẩu mới
                                        </Form.Label>
                                        <Col md={8}>
                                            <Form.Control type="password" placeholder="Nhập mật khẩu mới" />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} controlId="formConfirmPassword" className='mb-3'>
                                        <Form.Label column md={4}>
                                            Nhập lại mật khẩu mới
                                        </Form.Label>
                                        <Col md={8}>
                                            <Form.Control type="password" placeholder="Nhập lại mật khẩu mới" />
                                        </Col>
                                    </Form.Group>
                                    <div className='d-flex'>
                                        <Button variant="warning" className='mx-auto'>Xác nhận</Button>
                                    </div>
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
