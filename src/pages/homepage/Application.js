import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const Application = () => {
    return (
        <Container className="mt-5 mb-3">
            <Form>
                <h4 className='text-orange'>Thông tin thí sinh</h4>
                <Row>
                    <Col md={3}>
                        <Form.Group controlId="fullName">
                            <Form.Label>Họ và tên</Form.Label>
                            <Form.Control type="text" placeholder="Nhập họ và tên" />
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group controlId="dob">
                            <Form.Label>Ngày sinh</Form.Label>
                            <Form.Control type="date" />
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group controlId="gender">
                            <Form.Label>Giới tính</Form.Label>
                            <Form.Control as="select">
                                <option>Nam</option>
                                <option>Nữ</option>
                                <option>Khác</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group >
                            <Form.Label>Dân tộc</Form.Label>
                            <Form.Control type="text" placeholder="Nhập dân tộc" />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mt-3">
                    <Col md={4}>
                        <Form.Group controlId="idNumber">
                            <Form.Label>Số CMND/CCCD</Form.Label>
                            <Form.Control type="text" placeholder="Nhập số CMND/CCCD" />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="issueDate">
                            <Form.Label>Ngày cấp</Form.Label>
                            <Form.Control type="date" />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="issuingAuthority">
                            <Form.Label>Nơi cấp</Form.Label>
                            <Form.Control type="text" placeholder="Nhập nơi cấp" />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mt-3">
                    <Col md={3}>
                        <Form.Group controlId="province">
                            <Form.Label>Nơi thường trú</Form.Label>
                            <Form.Control as="select">
                                <option>Chọn tỉnh/thành phố</option>
                                <option>Hà Nội</option>
                                <option>TP.HCM</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group controlId="district">
                            <Form.Label></Form.Label>
                            <Form.Control as="select">
                                <option>Quận/Huyện</option>
                                <option>Quận 1</option>
                                <option>Quận 2</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group controlId="ward">
                            <Form.Label></Form.Label>
                            <Form.Control as="select">
                                <option>Xã/Phường/Thị trấn</option>
                                <option>Phường 1</option>
                                <option>Phường 2</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group controlId="houseNumber">
                            <Form.Label></Form.Label>
                            <Form.Control type="text" placeholder="Nhập số nhà, đường, ngõ..." />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col md={3}>
                        <Form.Group controlId="phoneNumber">
                            <Form.Label>Số điện thoại thí sinh</Form.Label>
                            <Form.Control type="text" placeholder="Nhập số điện thoại" />
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group controlId="email">
                            <Form.Label>Email thí sinh</Form.Label>
                            <Form.Control type="email" placeholder="Nhập email" />
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group controlId="parentName">
                            <Form.Label>Họ và tên phụ huynh</Form.Label>
                            <Form.Control type="text" placeholder="Nhập họ và tên phụ huynh" />
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group controlId="parentPhoneNumber">
                            <Form.Label>Số điện thoại phụ huynh</Form.Label>
                            <Form.Control type="text" placeholder="Nhập số điện thoại phụ huynh" />
                        </Form.Group>
                    </Col>
                </Row>

                <h4 className='text-orange mt-4'>Thông tin đăng ký cơ sở</h4>
                <Row className="mt-2">
                    <Col md={4}>
                        <Form.Group controlId="campusSelection">
                            <Form.Label>Cơ sở nhập học</Form.Label>
                            <Form.Control as="select">
                                <option>Cơ sở Hà Nội</option>
                                <option>Cơ sở TP.HCM</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mt-3">
                    <Col md={3}>
                        <Form.Group controlId="firstChoiceMajor">
                            <Form.Label>Nguyện vọng 1</Form.Label>
                            <Form.Control as="select">
                                <option>Ngành</option>
                                <option>Công nghệ thông tin</option>
                                <option>Quản trị kinh doanh</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group controlId="firstChoiceSpecialization">
                            <Form.Label></Form.Label>
                            <Form.Control as="select">
                                <option>Chuyên ngành</option>
                                <option>Kỹ thuật phần mềm</option>
                                <option>An ninh mạng</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group controlId="secondChoiceMajor">
                            <Form.Label>Nguyện vọng 2</Form.Label>
                            <Form.Control as="select">
                                <option>Ngành</option>
                                <option>Marketing</option>
                                <option>Quản trị nhân lực</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group controlId="secondChoiceSpecialization">
                            <Form.Label></Form.Label>
                            <Form.Control as="select">
                                <option>Chuyên ngành</option>
                                <option>Quản trị kinh doanh tổng hợp</option>
                                <option>Quản lý dự án</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col md={6}>
                        <Form.Group controlId="degreeType">
                            <Form.Label>Chọn loại bằng</Form.Label>
                            <Form.Check type="checkbox" label="Tốt nghiệp THCS, học lớp 10,11,12 – học 2 năm" />
                            <Form.Check type="checkbox" label="Tốt nghiệp THCS" />
                            <Form.Check type="checkbox" label="Tốt nghiệp THPT hoặc bổ túc THPT - Học 1 năm đến 1,5 năm" />
                            <Form.Check type="checkbox" label="Tôt nghiệp ĐH-CD-TC-Học 1 năm" />
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group controlId="graduationYear">
                            <Form.Label>Năm tốt nghiệp</Form.Label>
                            <Form.Control type="text" placeholder="2024" />
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group controlId="schoolName">
                            <Form.Label>Tên trường</Form.Label>
                            <Form.Control type="text" placeholder="Trường THCS A" />
                        </Form.Group>
                    </Col>
                </Row>
                <Button variant="primary" type="submit" className="mt-3">
                    Nộp Hồ Sơ
                </Button>
            </Form>
        </Container>
    );
};

export default Application;