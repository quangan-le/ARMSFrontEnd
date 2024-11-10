import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Card, Breadcrumb } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ApplicationSearch = () => {
    // Xử lý thông báo thanh toán
    useEffect(() => {
        // Kiểm tra cờ trong sessionStorage
        const admissionSuccess = sessionStorage.getItem('admissionSuccess');
        if (admissionSuccess) {
            // Hiển thị toast thành công
            toast.success('Đơn đã được gửi thành công!');
            
            // Sử dụng setTimeout để xóa cờ sau khi toast hiển thị
            const timeout = setTimeout(() => {
                sessionStorage.removeItem('admissionSuccess');
            }, 2000); // khoảng thời gian chờ (3000ms = 3 giây)
    
            // Dọn dẹp timeout khi component unmount
            return () => clearTimeout(timeout);
        }
    }, []);

    const [cccd, setCccd] = useState('');
    const [applicationData, setApplicationData] = useState(null);
    const navigate = useNavigate();

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
            <ToastContainer position="top-right" autoClose={3000} />
            <Breadcrumb>
                <Breadcrumb.Item href="/" className="text-orange">Trang chủ</Breadcrumb.Item>
                <Breadcrumb.Item active className="text-orange">Tra cứu hồ sơ</Breadcrumb.Item>
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
            {/* {applicationData && (
                <Card className="mt-4">
                    <Card.Body>
                        <h4>Thông tin hồ sơ</h4>
                        <Row>
                            <Col md={6}>
                                <p><strong>Họ và tên:</strong> {applicationData.name}</p>
                                <p><strong>Ngày sinh:</strong> {applicationData.dob}</p>
                                <p><strong>Giới tính:</strong> {applicationData.gender}</p>
                                <p><strong>Dân tộc:</strong> {applicationData.ethnicity}</p>
                                <p><strong>Số CCCD:</strong> {applicationData.cccd}</p>
                                <p><strong>Ngày cấp:</strong> {applicationData.issueDate}</p>
                                <p><strong>Nơi cấp:</strong> {applicationData.issuePlace}</p>
                            </Col>
                            <Col md={6}>
                                <p><strong>Địa chỉ thường trú:</strong> {applicationData.address}</p>
                                <p><strong>Số điện thoại thí sinh:</strong> {applicationData.studentPhone}</p>
                                <p><strong>Email thí sinh:</strong> {applicationData.studentEmail}</p>
                                <p><strong>Họ và tên phụ huynh:</strong> {applicationData.parentName}</p>
                                <p><strong>Số điện thoại phụ huynh:</strong> {applicationData.parentPhone}</p>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            )} */}
            <Card className="mt-4 px-5">
                <Card.Body>
                    <h4 className='text-orange mt-3'>Thông tin hồ sơ</h4>
                    <Row>
                        <Col md={6}>
                            <div className="info-item">
                                <span className="label">Họ và tên</span>
                                <span className="value">Nguyễn Văn A</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Giới tính</span>
                                <span className="value">Nam</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Ngày sinh</span>
                                <span className="value">01/01/2000</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Dân tộc</span>
                                <span className="value">Kinh</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Số điện thoại</span>
                                <span className="value">0987654321</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Email</span>
                                <span className="value">nguyenvana@example.com</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Số CMND/CCCD</span>
                                <span className="value">123456789</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Ngày cấp</span>
                                <span className="value">15/07/2020</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Nơi cấp</span>
                                <span className="value">Hà Nội</span>
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="info-item">
                                <span className="label">Họ và tên phụ huynh/ người bảo trợ</span>
                                <span className="value">Nguyễn Văn B</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Số điện thoại phụ huynh/ người bảo trợ</span>
                                <span className="value">0912345678</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Năm tốt nghiệp</span>
                                <span className="value">2020</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Trường tốt nghiệp</span>
                                <span className="value">THCS Việt Đức</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Bằng tốt nghiệp</span>
                                <span className="value">Tốt nghiệp THCS, học lớp 10,11,12 – học 2 năm</span>
                            </div>
                        </Col>
                        <div className="info-item">
                            <span className="label">Địa chỉ thường trú</span>
                            <span className="value">Số 123, Đường ABC, Phường Kim Liên, Quận Thanh Xuân, Hà Nội</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Giấy tờ xác thực hồ sơ đăng ký</span>
                            <div className="documents-row">
                                <div className="document">
                                    <img
                                        src="https://ktmt.vnmediacdn.com/thumb_x600x/images/2022/09/15/47-1663197443-the-cccd-gan-chip-se-2.jpg"
                                        alt="Mặt trước CCCD"
                                        className="document-image"
                                    />
                                    <p>Mặt trước CCCD</p>
                                </div>
                                <div className="document">
                                    <img
                                        src="https://ktmt.vnmediacdn.com/thumb_x600x/images/2022/09/15/47-1663197443-the-cccd-gan-chip-se-2.jpg"
                                        alt="Mặt sau CCCD"
                                        className="document-image"
                                    />
                                    <p>Mặt sau CCCD</p>
                                </div>
                                <div className="document">
                                    <img
                                        src="https://cdn.thuvienphapluat.vn/uploads/phapluat/2022-2/AHT/bang-tot-nghiep-trung-hoc-pho-thong-1.jpg"
                                        alt="Bằng cấp"
                                        className="document-image"
                                    />
                                    <p>Bằng cấp</p>
                                </div>
                            </div>
                        </div>
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
                                        checked={true} // Đánh dấu là đã chọn
                                        disabled // Làm cho radio button này readonly
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="Phụ huynh/Người bảo trợ"
                                        name="recipient"
                                        id="recipientParent"
                                        className="pt-3"
                                        checked={false} // Đánh dấu là không chọn
                                        disabled // Làm cho radio button này readonly
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
                                        //onChange={() => setShowOtherAddress(false)}
                                        checked={true}
                                        disabled
                                    />
                                    <div className='d-flex align-items-end'>
                                        <Form.Check
                                            type="radio"
                                            label="Khác: "
                                            name="address"
                                            id="otherAddress"
                                            //onChange={() => setShowOtherAddress(true)}
                                            className="pt-3 mb-0"
                                            checked={false}
                                            disabled
                                        />
                                        {/* {showOtherAddress && ( */}
                                        <div className="ms-2" readOnly> Hà Nội</div>
                                        {/* )} */}
                                    </div>
                                </Form.Group>
                            </Col>
                        </Row>
                        <h4 className='text-orange mt-3'>Thông tin xét tuyển</h4>
                        <div className="info-item">
                            <span className="label">Cơ sở nhập học</span>
                            <span className="value">Hà Nội</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Nguyện vọng</span>
                            <span className="value">Công nghệ thông tin - Lập trình viên Mobile</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Trạng thái xét duyệt</span>
                            <span className="value">Chờ xét duyệt</span>
                        </div>
                    </Row>
                    <Col className="d-flex justify-content-end">
                        <Button
                            variant="light"
                            onClick={() => navigate('/cap-nhat-ho-so')}
                            className="btn-block bg-orange text-white"
                        >
                            Cập nhật hồ sơ
                        </Button>
                    </Col>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ApplicationSearch;
