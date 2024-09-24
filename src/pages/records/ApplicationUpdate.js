import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Card, Breadcrumb } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ApplicationUpdate = () => {
    const [formData, setFormData] = useState({
        name: 'Nguyễn Văn A',
        gender: 'Nam',
        dob: '01/01/2000',
        ethnicity: 'Kinh',
        studentPhone: '0987654321',
        studentEmail: 'nguyenvana@example.com',
        cccd: '123456789',
        issueDate: '15/07/2020',
        issuePlace: 'Hà Nội',
        parentName: 'Nguyễn Văn B',
        parentPhone: '0912345678',
        graduationYear: '2020',
        school: 'THCS Việt Đức',
        diploma: 'Tốt nghiệp THCS, học lớp 10,11,12 – học 2 năm',
        address: 'Số 123, Đường ABC, Phường Kim Liên, Quận Thanh Xuân, Hà Nội',
        recipient: 'Thí sinh',
        addressRecipient: 'Địa chỉ thường trú',
        enrollmentCenter: 'Hà Nội',
        aspiration: 'Công nghệ thông tin - Lập trình viên Mobile',
        status: 'Chờ xét duyệt',
    });

    const [cccd, setCccd] = useState('');
    const [applicationData, setApplicationData] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Updated data:', formData);
        navigate('/records'); 
    };

    const handleSearch = async () => {
        try {
            const response = await fetch(`API_URL_HERE?cccd=${cccd}`);
            const data = await response.json();
            setApplicationData(data);
        } catch (error) {
            console.error('Lỗi tra cứu hồ sơ:', error);
        }
    };

    return (
        <Container className="my-3">
            <Breadcrumb>
                <Breadcrumb.Item href="/" className="text-orange">Trang chủ</Breadcrumb.Item>
                <Breadcrumb.Item href="/records" className="text-orange">Tra cứu hồ sơ</Breadcrumb.Item>
                <Breadcrumb.Item active className="text-orange">Cập nhật hồ sơ</Breadcrumb.Item>
            </Breadcrumb>
            <Form className="my-4 mx-5">
                <Row>
                    <Col md={10}>
                        <Form.Group controlId="formCccd" className="d-flex align-items-center">
                            <Form.Label className="me-2 mb-0">Nhập CCCD/CMND:</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập số CCCD/CMND"
                                value={cccd}
                                onChange={(e) => setCccd(e.target.value)}
                                className="flex-grow-1 w-75"
                            />
                        </Form.Group>
                    </Col>
                    <Col md={1} className="d-flex justify-content-end">
                        <Button variant="light" onClick={handleSearch} className="btn-block bg-orange text-white">
                            Tra cứu
                        </Button>
                    </Col>
                </Row>
            </Form>
            <div className="progress-container my-4">
                <div className="progress-steps d-flex justify-content-between align-items-center">
                    <span>Hồ sơ xét tuyển</span>
                    <span>→</span>
                    <span>Kết quả xét tuyển</span>
                    <span>→</span>
                    <span>Nhập học</span>
                    <span>→</span>
                    <span>Hồ sơ nhập học</span>
                </div>
            </div>
            <Form className="my-4 mx-5" onSubmit={handleSubmit}>
                <h4 className='text-orange'>Cập nhật thông tin hồ sơ</h4>
                <Row>
                        <Col md={6}>
                            <Form.Group controlId="formName" className="form-group-flex">
                                <Form.Label className="fixed-label">Họ và tên</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formGender" className="form-group-flex">
                                <Form.Label className="fixed-label">Giới tính</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                >
                                    <option>Nam</option>
                                    <option>Nữ</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formDob" className="form-group-flex">
                                <Form.Label className="fixed-label">Ngày sinh</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="dob"
                                    value={formData.dob}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formEthnicity" className="form-group-flex">
                                <Form.Label className="fixed-label">Dân tộc</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="ethnicity"
                                    value={formData.ethnicity}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formPhone" className="form-group-flex">
                                <Form.Label className="fixed-label">Số điện thoại</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="studentPhone"
                                    value={formData.studentPhone}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formEmail" className="form-group-flex">
                                <Form.Label className="fixed-label">Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="studentEmail"
                                    value={formData.studentEmail}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formCccd" className="form-group-flex">
                                <Form.Label className="fixed-label">Số CMND/CCCD</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="cccd"
                                    value={formData.cccd}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formIssueDate" className="form-group-flex">
                                <Form.Label className="fixed-label">Ngày cấp</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="issueDate"
                                    value={formData.issueDate}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formIssuePlace" className="form-group-flex">
                                <Form.Label className="fixed-label">Nơi cấp</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="issuePlace"
                                    value={formData.issuePlace}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="formParentName" className="form-group-flex">
                                <Form.Label className="fixed-label">Họ và tên phụ huynh/người bảo trợ</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="parentName"
                                    value={formData.parentName}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formParentPhone" className="form-group-flex">
                                <Form.Label className="fixed-label">Số điện thoại phụ huynh/người bảo trợ</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="parentPhone"
                                    value={formData.parentPhone}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formGraduationYear" className="form-group-flex">
                                <Form.Label className="fixed-label">Năm tốt nghiệp</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="graduationYear"
                                    value={formData.graduationYear}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formSchool" className="form-group-flex">
                                <Form.Label className="fixed-label">Trường tốt nghiệp</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="school"
                                    value={formData.school}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formDiploma" className="form-group-flex">
                                <Form.Label className="fixed-label">Bằng tốt nghiệp</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="diploma"
                                    value={formData.diploma}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group controlId="formAddress" className="form-group-flex">
                        <Form.Label className="fixed-label">Địa chỉ thường trú</Form.Label>
                        <Form.Control
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </Form.Group>
                <Button variant="light" type="submit" className="btn-block bg-orange text-white">
                    Cập nhật hồ sơ
                </Button>
            </Form>
        </Container>
    );
};

export default ApplicationUpdate;

