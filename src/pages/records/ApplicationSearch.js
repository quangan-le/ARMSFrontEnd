import React, { useState, useEffect } from 'react';
import { Modal, Container, Form, Button, Row, Col, Card, Breadcrumb } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../apiService';
import axios from 'axios';

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
    const [otp, setOtp] = useState('');
    const [applicationData, setApplicationData] = useState(null);
    const [email, setEmail] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [address, setAddress] = useState('');
    const [majorName1, setMajorName1] = useState('');
    const [majorName2, setMajorName2] = useState('');

    const navigate = useNavigate();
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    // Gửi OTP qua API
    const handleSendOtp = async () => {
        try {
            const response = await api.post('/RegisterAdmission/send-OTP', {
                citizenIentificationNumber: cccd
            });
            setEmail(response.data.email);
            toast.success(response.data.message);
            handleShow();
        } catch (error) {
            console.error('Lỗi khi gửi OTP:', error);
            toast.error('Không thể gửi mã OTP. Vui lòng kiểm tra lại số CCCD.');
        }
    };
    // Đoạn mã ẩn phần giữa của email
    const hideEmail = email => {
        const [user, domain] = email.split('@');
        const hiddenUser = user.slice(0, 3) + '***'; // Ẩn một phần đầu
        return `${hiddenUser}@${domain}`;
    };

    // Kiểm tra OTP và lấy dữ liệu hồ sơ
    const handleVerifyOtp = async () => {
        try {
            const response = await api.post(`/RegisterAdmission/verify-OTP`, null, {
                params: {
                    email: email,
                    otp: otp
                }
            });
            toast.success('Xác thực thành công!');
            const dataResponse = await api.post(
                '/RegisterAdmission/search-register-admission',
                { citizenIentificationNumber: cccd },
                {
                    headers: {
                        Authorization: `Bearer ${response.data.token}`
                    }
                }
            );
            setApplicationData(dataResponse.data);
            handleClose();
        } catch (error) {
            console.error('Lỗi xác thực OTP:', error);
            toast.error('Mã OTP không hợp lệ hoặc đã hết hạn.');
        }
    };

    useEffect(() => {
        const fetchAddress = async () => {
            // Kiểm tra xem applicationData có dữ liệu chưa
            if (!applicationData || !applicationData.province || !applicationData.district || !applicationData.ward) {
                console.log('Dữ liệu không hợp lệ hoặc chưa có địa chỉ');
                return;
            }

            try {
                // Gọi API để lấy thông tin tỉnh, quận, phường
                const provinceResponse = await axios.get(`https://provinces.open-api.vn/api/p/${applicationData.province}`);
                const districtResponse = await axios.get(`https://provinces.open-api.vn/api/d/${applicationData.district}`);
                const wardResponse = await axios.get(`https://provinces.open-api.vn/api/w/${applicationData.ward}`);

                // Lấy tên tỉnh, quận, phường từ dữ liệu trả về
                const provinceName = provinceResponse.data.name;
                const districtName = districtResponse.data.name;
                const wardName = wardResponse.data.name;

                // Kết hợp thành địa chỉ đầy đủ
                const fullAddress = `${applicationData.specificAddress}, ${wardName}, ${districtName}, ${provinceName}`;
                setAddress(fullAddress);
            } catch (error) {
                console.error('Lỗi lấy địa chỉ:', error);
            }
        };

        // Kiểm tra nếu có đầy đủ dữ liệu về mã tỉnh, quận, phường
        if (applicationData && applicationData.province && applicationData.district && applicationData.ward) {
            fetchAddress();
        }
    }, [applicationData]); // Chạy lại khi applicationData thay đổi

    useEffect(() => {
        const fetchMajors = async () => {
            try {
                const [major1Response, major2Response] = await Promise.all([
                    api.get(`/Major/get-major-details?MajorId=${applicationData.major1}`),
                    api.get(`/Major/get-major-details?MajorId=${applicationData.major2}`)
                ]);
                setMajorName1(major1Response.data.majorName);
                setMajorName2(major2Response.data.majorName);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu ngành học:", error);
            }
        };

        if (applicationData && applicationData.major1 && applicationData.major2) {
            fetchMajors();
        }
    }, [applicationData]); // Chạy lại khi applicationData thay đổi

    return (
        <Container className="my-3">
            <ToastContainer position="top-right" autoClose={3000} />
            <Breadcrumb>
                <Breadcrumb.Item href="/" className="text-orange">Trang chủ</Breadcrumb.Item>
                <Breadcrumb.Item active className="text-orange">Tra cứu hồ sơ</Breadcrumb.Item>
            </Breadcrumb>
            <Form className="my-4 mx-3">
                <Row className="align-items-center">
                    <Col xs="auto">
                        <Form.Label className="me-2 mb-0">Nhập CCCD/CMND:</Form.Label>
                    </Col>
                    <Col xs={8} md={6} lg={7} className="pe-0">
                        <Form.Control
                            type="text"
                            placeholder="Nhập số CCCD/CMND"
                            value={cccd}
                            onChange={(e) => setCccd(e.target.value)}
                            className="flex-grow-1"
                        />
                    </Col>
                    <Col xs={4} md={3} lg={2}>
                        <Button variant="light" onClick={handleSendOtp} className="w-100 bg-orange text-white">
                            Gửi OTP
                        </Button>
                    </Col>
                </Row>
            </Form>

            <Modal show={showModal} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Xác thực OTP</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className="my-4 mx-5">
                        <Row>
                            <Col md={12} className="mb-3">
                                <div className="text-muted">
                                    Mã xác thực đã được gửi qua email: <strong>{hideEmail(email)}</strong>
                                </div>
                            </Col>
                            <Col md={12}>
                                <Form.Group controlId="formOtp" className="d-flex align-items-center">
                                    <Form.Label className="me-2 mb-0">Nhập mã OTP:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập mã OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="flex-grow-1 w-75"
                                    />
                                </Form.Group>
                                <div className="mt-2">
                                    <span className="text-muted">Bạn chưa nhận được mã OTP?</span>{" "}
                                    <Button variant="link" onClick={handleSendOtp} className="p-0 text-primary">
                                        Gửi lại OTP
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={handleVerifyOtp} className="btn-block bg-orange text-white">
                        Xác thực OTP
                    </Button>
                </Modal.Footer>
            </Modal>
            {applicationData && (
                <div>
                    <Card className="mt-4 px-md-5 px-3">
                        <Card.Body>
                            <h4 className='text-orange mt-3'>Thông tin thí sinh</h4>
                            <Row>
                                <Col xs={12} md={6}>
                                    <div className="info-item">
                                        <span className="label">Họ và tên</span>
                                        <span className="value">{applicationData.fullname}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Giới tính</span>
                                        <span className="value">{applicationData.gender ? 'Nam' : 'Nữ'}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Ngày sinh</span>
                                        <span className="value">{new Date(applicationData.dob).toLocaleDateString()}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Dân tộc</span>
                                        <span className="value">{applicationData.nation}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Số điện thoại</span>
                                        <span className="value">{applicationData.phoneStudent}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Email</span>
                                        <span className="value">{applicationData.emailStudent}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Số CMND/CCCD</span>
                                        <span className="value">{applicationData.citizenIentificationNumber}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Ngày cấp</span>
                                        <span className="value">{new Date(applicationData.ciDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Nơi cấp</span>
                                        <span className="value">{applicationData.ciAddress}</span>
                                    </div>

                                </Col>
                                <Col xs={12} md={6}>
                                    <div className="info-item">
                                        <span className="label">Họ và tên phụ huynh</span>
                                        <span className="value">{applicationData.fullnameParents}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Số điện thoại phụ huynh</span>
                                        <span className="value">{applicationData.phoneParents}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Địa chỉ thường trú</span>
                                        <span className="value">{address}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Năm tốt nghiệp</span>
                                        <span className="value">{applicationData.yearOfGraduation}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Trường tốt nghiệp</span>
                                        <span className="value">{applicationData.schoolName}</span>
                                    </div>

                                </Col>

                                <span className="label mb-2">Giấy tờ xác thực hồ sơ đăng ký</span>
                                <Row>
                                    <Col xs={6} sm={4} md={3} className="mb-2">
                                        <div className="image-container">
                                            <img src={applicationData.imgCitizenIdentification1} alt="Mặt trước CCCD" className="img-fluid" />
                                        </div>
                                        <p className="image-title text-center mt-2">Mặt trước CCCD</p>

                                    </Col>
                                    <Col xs={6} sm={4} md={3} className="mb-2">
                                        <div className="image-container">
                                            <img src={applicationData.imgCitizenIdentification2} alt="Mặt sau CCCD" className="img-fluid" />
                                        </div>
                                        <p className="image-title text-center mt-2">Mặt sau CCCD</p>

                                    </Col>
                                    {applicationData.imgDiplomaMajor1 && (
                                        <Col xs={6} sm={4} md={3} className="mb-2">
                                            <div className="image-container">
                                                <img src={applicationData.imgDiplomaMajor1} alt="Bằng xét NV1" className="img-fluid" />
                                            </div>
                                            <p className="image-title text-center mt-2">Bằng xét NV1</p>
                                        </Col>
                                    )}

                                    {applicationData.imgDiplomaMajor2 && (
                                        <Col xs={6} sm={4} md={3} className="mb-2">
                                            <div className="image-container">
                                                <img src={applicationData.imgDiplomaMajor2} alt="Bằng xét NV2" className="img-fluid" />
                                            </div>
                                            <p className="image-title text-center mt-2">Bằng xét NV2</p>
                                        </Col>
                                    )}

                                    {applicationData.imgAcademicTranscript1 && (
                                        <Col xs={6} sm={4} md={3} className="mb-2">
                                            <div className="image-container">
                                                <img src={applicationData.imgAcademicTranscript1} alt="Ảnh học bạ HKI lớp 10" className="img-fluid" />
                                            </div>
                                            <p className="image-title text-center mt-2">Ảnh học bạ HKI - Lớp 10</p>
                                        </Col>
                                    )}

                                    {applicationData.imgAcademicTranscript2 && (
                                        <Col xs={6} sm={4} md={3} className="mb-2">
                                            <div className="image-container">
                                                <img src={applicationData.imgAcademicTranscript2} alt="Ảnh học bạ HKII lớp 10" className="img-fluid" />
                                            </div>
                                            <p className="image-title text-center mt-2">Ảnh học bạ HKII - Lớp 10</p>
                                        </Col>
                                    )}

                                    {applicationData.imgAcademicTranscript3 && (
                                        <Col xs={6} sm={4} md={3} className="mb-2">
                                            <div className="image-container">
                                                <img src={applicationData.imgAcademicTranscript3} alt="Ảnh học bạ CN - Lớp 10" className="img-fluid" />
                                            </div>
                                            <p className="image-title text-center mt-2">Ảnh học bạ CN - Lớp 10</p>
                                        </Col>
                                    )}

                                    {applicationData.imgAcademicTranscript4 && (
                                        <Col xs={6} sm={4} md={3} className="mb-2">
                                            <div className="image-container">
                                                <img src={applicationData.imgAcademicTranscript4} alt="Ảnh học bạ HKI - Lớp 11" className="img-fluid" />
                                            </div>
                                            <p className="image-title text-center mt-2">Ảnh học bạ HKI - Lớp 11</p>
                                        </Col>
                                    )}

                                    {applicationData.imgAcademicTranscript5 && (
                                        <Col xs={6} sm={4} md={3} className="mb-2">
                                            <div className="image-container">
                                                <img src={applicationData.imgAcademicTranscript5} alt="Ảnh học bạ HKII - Lớp 11" className="img-fluid" />
                                            </div>
                                            <p className="image-title text-center mt-2">Ảnh học bạ HKII - Lớp 11</p>
                                        </Col>
                                    )}

                                    {applicationData.imgAcademicTranscript6 && (
                                        <Col xs={6} sm={4} md={3} className="mb-2">
                                            <div className="image-container">
                                                <img src={applicationData.imgAcademicTranscript6} alt="Ảnh học bạ CN - Lớp 11" className="img-fluid" />
                                            </div>
                                            <p className="image-title text-center mt-2">Ảnh học bạ CN - Lớp 11</p>
                                        </Col>
                                    )}

                                    {applicationData.imgAcademicTranscript7 && (
                                        <Col xs={6} sm={4} md={3} className="mb-2">
                                            <div className="image-container">
                                                <img src={applicationData.imgAcademicTranscript7} alt="Ảnh học bạ HKI - Lớp 12" className="img-fluid" />
                                            </div>
                                            <p className="image-title text-center mt-2">Ảnh học bạ HKI - Lớp 12</p>
                                        </Col>
                                    )}

                                    {applicationData.imgAcademicTranscript9 && (
                                        <Col xs={6} sm={4} md={3} className="mb-2">
                                            <div className="image-container">
                                                <img src={applicationData.imgAcademicTranscript9} alt="Ảnh học bạ CN - Lớp 12" className="img-fluid" />
                                            </div>
                                            <p className="image-title text-center mt-2">Ảnh học bạ CN - Lớp 12</p>
                                        </Col>
                                    )}
                                </Row>
                                <h4 className='text-orange mt-3'>Thông tin ưu tiên</h4>
                                <Col xs={12} md={6}>
                                    <div className="info-item">
                                        <span className="label">Đối tượng ưu tiên</span>
                                        <span className="value">
                                            {applicationData.priorityDetailPriorityID > 0
                                                ? applicationData.priorityDetail.priorityName
                                                : "Không thuộc diện ưu tiên"}
                                        </span>
                                    </div>
                                </Col>
                                {applicationData.priorityDetailPriorityID > 0 && applicationData.imgpriority && (
                                    <Col xs={12} md={6}>
                                        <div className="info-item">
                                            <span className="label">Giấy tờ ưu tiên</span>
                                            <div>
                                                <img
                                                    src={applicationData.imgpriority}
                                                    alt="Giấy tờ ưu tiên"
                                                    className="img-fluid"
                                                    style={{ maxHeight: '200px', objectFit: 'contain' }}
                                                />
                                            </div>
                                        </div>
                                    </Col>
                                )}
                                <h4 className='text-orange mt-3'>Thông tin nhận giấy báo kết quả</h4>
                                <Row>
                                    <Col md={12}>
                                        <div className="info-item">
                                            <span className="label2">Người nhận</span>
                                            <span className="value">
                                                {applicationData.recipientResults ? "Thí sinh" : "Phụ huynh/Người bảo trợ"}
                                            </span>
                                        </div>
                                        <div className="info-item">
                                            <span className="label2">Địa chỉ nhận</span>
                                            <span className="value">
                                                {applicationData.permanentAddress
                                                    ? address
                                                    : applicationData.addressRecipientResults}
                                            </span>
                                        </div>
                                    </Col>
                                </Row>
                                <h4 className='text-orange mt-2'>Thông tin xét tuyển</h4>
                                <div className="info-item">
                                    <span className="label2">Cơ sở nhập học</span>
                                    <span className="value">{applicationData.campusName}</span>
                                </div>
                                <Col xs={12} md={6}>
                                    <div className="info-item">
                                        <span className="label">Nguyện vọng 1</span>
                                        <span className="value">{majorName1}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Nguyện vọng 2</span>
                                        <span className="value">{majorName2}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Trạng thái hồ sơ</span>
                                        <span className="value">
                                            {applicationData.typeofStatusProfile === null
                                                ? "Chờ xét duyệt"
                                                : applicationData.typeofStatusProfile === 0
                                                    ? "Đăng ký hồ sơ thành công"
                                                    : applicationData.typeofStatusProfile === 1
                                                        ? "Xác nhận đăng ký hồ sơ thành công"
                                                        : applicationData.typeofStatusProfile === 2
                                                            ? "Hồ sơ nhập học thành công"
                                                            : applicationData.typeofStatusProfile === 3
                                                                ? "Xác nhận hồ sơ nhập học thành công"
                                                                : applicationData.typeofStatusProfile === 4
                                                                    ? "Chờ thanh toán nhập học"
                                                                    : applicationData.typeofStatusProfile === 5
                                                                        ? "Đang xử lý nhập học"
                                                                        : applicationData.typeofStatusProfile === 6
                                                                            ? "Hoàn thành"
                                                                            : ""}
                                        </span>
                                    </div>
                                </Col>
                                <Col xs={12} md={6}>
                                    <div className="info-item">
                                        <span className="label">Trạng thái xét duyệt</span>
                                        <span className="value">
                                            {applicationData.typeofStatusMajor1 === null
                                                ? "Chờ xét duyệt"
                                                : applicationData.typeofStatusMajor1 === 0
                                                    ? "Không đạt"
                                                    : applicationData.typeofStatusMajor1 === 1
                                                        ? "Đạt"
                                                        : applicationData.typeofStatusMajor1 === 2
                                                            ? "Đang xử lý"
                                                            : ""}
                                        </span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Trạng thái xét duyệt</span>
                                        <span className="value">
                                            {applicationData.typeofStatusMajor2 === null
                                                ? "Chờ xét duyệt"
                                                : applicationData.typeofStatusMajor2 === 0
                                                    ? "Không đạt"
                                                    : applicationData.typeofStatusMajor2 === 1
                                                        ? "Đạt"
                                                        : applicationData.typeofStatusMajor2 === 2
                                                            ? "Đang xử lý"
                                                            : ""}
                                        </span>
                                    </div>
                                </Col>
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
                </div>
            )}
        </Container>
    );
};

export default ApplicationSearch;
