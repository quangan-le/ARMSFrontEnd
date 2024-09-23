import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useState } from '../hooks/Hooks.js';

const Application = () => {
    const [showOtherAddress, setShowOtherAddress] = useState(false);
    const [frontCCCD, setFrontCCCD] = useState(null);
    const [backCCCD, setBackCCCD] = useState(null);
    const [graduationCertificate, setGraduationCertificate] = useState(null);

    const handleFileChange = (e, setFile) => {
        const file = e.target.files[0];
        if (file) {
            setFile(URL.createObjectURL(file));
        }
    };
    return (
        <div>
            <div className=" background-overlay">
                <div className="overlay"></div>
                <Container>
                    <Row>
                        <Col md={12} className="background-content">
                            <h2>Nộp hồ sơ trực tuyến</h2>
                            <h4>1. Điền thông tin xét tuyển</h4>
                            <h4>2. Chụp CCCD/CMND 2 mặt</h4>
                            <h4>3. Chụp chứng nhận/Bằng tốt nghiệp THCS hoặc tương đương</h4>
                        </Col>
                    </Row>
                </Container>
                <Row className="mt-5 background-content text-center justify-content-center align-items-center text-white bg-orange p-3 mx-auto w-75 rounded">
                    <div className="d-flex justify-content-center align-items-center">
                        <h4 className="text-black d-inline mb-0">Đăng ký tư vấn ngay tại đây</h4>
                        <a href="/dang-ky" className="text-white d-inline ms-3 fs-4">ĐĂNG KÝ TƯ VẤN!</a>
                    </div>
                </Row>
            </div>
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
                                <Form.Check
                                    type="radio"
                                    label="Tốt nghiệp THCS, học lớp 10,11,12 – học 2 năm"
                                    name="degreeType"
                                />
                                <Form.Check
                                    type="radio"
                                    label="Tốt nghiệp THCS"
                                    name="degreeType"
                                />
                                <Form.Check
                                    type="radio"
                                    label="Tốt nghiệp THPT hoặc bổ túc THPT - Học 1 năm đến 1,5 năm"
                                    name="degreeType"
                                />
                                <Form.Check
                                    type="radio"
                                    label="Tôt nghiệp ĐH-CD-TC-Học 1 năm"
                                    name="degreeType"
                                />
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
                    <h4 className='text-orange mt-3'>Thông tin nhận giấy báo kết quả</h4>
                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="recipient">
                                <Form.Label>Người nhận</Form.Label>
                                <Form.Check
                                    type="radio"
                                    label="Thí sinh"
                                    name="recipient"
                                    id="recipientStudent"
                                />
                                <Form.Check
                                    type="radio"
                                    label="Phụ huynh/Người bảo trợ"
                                    name="recipient"
                                    id="recipientParent"
                                    className="pt-3"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="address">
                                <Form.Label>Địa chỉ nhận</Form.Label>
                                <Form.Check
                                    type="radio"
                                    label="Địa chỉ thường trú"
                                    name="address"
                                    id="permanentAddress"
                                    onChange={() => setShowOtherAddress(false)}
                                />
                                <div className='d-flex align-items-end'>
                                    <Form.Check
                                        type="radio"
                                        label="Khác"
                                        name="address"
                                        id="otherAddress"
                                        onChange={() => setShowOtherAddress(true)}
                                        className="pt-3"
                                    />
                                    {showOtherAddress && (
                                        <Form.Control
                                            type="text"
                                            placeholder="Nhập địa chỉ khác"
                                            className="ms-2"
                                        />
                                    )}
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>
                    <h4 className='text-orange mt-3'>Tải lên giấy tờ xác thực hồ sơ đăng ký học</h4>
                    <Row>
                        <Col md={6}>
                            <Row>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Ảnh CMND/CCCD mặt trước</Form.Label>
                                        <Form.Control
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, setFrontCCCD)}
                                        />
                                        {frontCCCD && (
                                            <div className="image-preview-container mt-2">
                                                <img src={frontCCCD} alt="Mặt trước CCCD" className="img-preview" />
                                            </div>
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Ảnh CMND/CCCD mặt sau</Form.Label>
                                        <Form.Control
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, setBackCCCD)}
                                        />
                                        {backCCCD && (
                                            <div className="image-preview-container mt-2">
                                                <img src={backCCCD} alt="Mặt sau CCCD" className="img-preview" />
                                            </div>
                                        )}
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Col>

                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Bằng tốt nghiệp (Hoặc giấy tờ xác nhận tốt nghiệp tạm thời)</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, setGraduationCertificate)}
                                />
                                {graduationCertificate && (
                                    <div className="image-preview-container mt-2">
                                        <img src={graduationCertificate} alt="Ảnh bằng tốt nghiệp" className="img-preview" />
                                    </div>
                                )}
                            </Form.Group>
                        </Col>
                    </Row>
                    <div className="d-flex justify-content-center">
                        <Button variant="light" type="submit" className="read-more-btn mt-3">
                            Gửi hồ sơ đăng ký
                        </Button>
                    </div>
                </Form>
            </Container>
        </div>
    );
};

export default Application;