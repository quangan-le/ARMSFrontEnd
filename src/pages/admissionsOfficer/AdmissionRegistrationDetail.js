import React, { useState, useEffect } from 'react';
import { Modal, Container, Form, Button, Row, Col, Card, Breadcrumb } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../apiService';
import axios from 'axios';
import { Download } from 'react-bootstrap-icons';

const AdmissionRegistrationDetail = () => {
    const navigate = useNavigate();
    const { spId } = useParams();
    const [applicationData, setApplicationData] = useState(null);
    const [address, setAddress] = useState('');

    useEffect(() => {
        const fetchApplicationData = async () => {
            try {
                const response = await api.get(
                    `/admin-officer/RegisterAdmission/get-register-admission/${spId}`
                );
                setApplicationData(response.data);
            } catch (error) {
                console.error("Lỗi lấy dữ liệu ứng tuyển:", error);
            }
        };

        fetchApplicationData();
    }, [spId]);

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

    return (
        <Container className="my-3">
            <ToastContainer position="top-right" autoClose={3000} />
            <h2 className="text-center text-orange fw-bold">Chi tiết hồ sơ đăng ký</h2>
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
                                                <img
                                                    src={applicationData.imgAcademicTranscript1}
                                                    alt={(applicationData.typeOfDiplomaMajor1 === 4 || applicationData.typeOfDiplomaMajor2 === 4)
                                                        ? "Bảng điểm"
                                                        : "Ảnh học bạ HKI lớp 10"}
                                                    className="img-fluid"
                                                />
                                            </div>
                                            <p className="image-title text-center mt-2">
                                                {(applicationData.typeOfDiplomaMajor1 === 4 || applicationData.typeOfDiplomaMajor2 === 4)
                                                    ? "Bảng điểm"
                                                    : "Ảnh học bạ HKI - Lớp 10"}
                                            </p>
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
                                        <div>
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
                                        <span className="value">{applicationData.majorName1}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Nguyện vọng 2</span>
                                        <span className="value">{applicationData.majorName2}</span>
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
                                                                    ? "Chờ thanh toán phí nhập học"
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
                                        <span className="label me-3 text-nowrap">Trạng thái xét duyệt NV1</span>
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
                                        <span className="label me-3 text-nowrap">Trạng thái xét duyệt NV2</span>
                                        <span className="value">
                                            {applicationData.typeofStatusMajor2 === null
                                                ? "Chờ xét duyệt"
                                                : applicationData.typeofStatusMajor2 === 0
                                                    ? "Không đạt"
                                                    : applicationData.typeofStatusMajor2 === 1
                                                        ? "Đạt"
                                                        : applicationData.typeofStatusMajor2 === 2
                                                            ? "Đang xử lý"
                                                            : "N/A"}
                                        </span>
                                    </div>
                                </Col>
                                <h4 className='text-orange mb-2'>Hồ sơ nhập học</h4>
                                <Col md={6}>
                                    {applicationData.admissionForm ? (
                                        <div className="mb-3 d-flex align-items-center">
                                            <p className="mb-0 me-2"><strong>Đơn nhập học:</strong></p>
                                            <a href={applicationData.admissionForm} target="_blank" rel="noopener noreferrer">
                                                Tải xuống Đơn nhập học
                                                <Download className="ms-2" />
                                            </a>
                                        </div>
                                    ) : (
                                        <p>Chưa có thông tin Đơn nhập học.</p>
                                    )}
                                </Col>
                                <Col md={6}>
                                    {applicationData.birthCertificate ? (
                                        <div className="mb-3">
                                            <p><strong>Giấy khai sinh:</strong></p>
                                            <img
                                                src={applicationData.birthCertificate}
                                                alt="Giấy khai sinh"
                                                className="img-fluid"
                                                style={{
                                                    maxWidth: "300px",
                                                    maxHeight: "300px",
                                                    border: "1px solid #ccc"
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <p>Chưa có thông tin Giấy khai sinh.</p>
                                    )}
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

export default AdmissionRegistrationDetail;
