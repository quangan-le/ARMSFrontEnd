import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, Card, Col, Container, Form, Modal, Row, Spinner } from 'react-bootstrap';
import { Download } from 'react-bootstrap-icons';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../apiService';
import uploadImage from '../../firebase/uploadImage.js';
import ApplicationUpdate from './ApplicationUpdate.js';

const ApplicationSearch = () => {
    const navigate = useNavigate();
    // Xử lý thông báo thanh toán
    useEffect(() => {
        // Kiểm tra cờ trong sessionStorage
        const doneSuccess = sessionStorage.getItem('doneSuccess');
        const spIdSuccess = sessionStorage.getItem('spIdSuccess');
        if (doneSuccess) {
            toast.success('Thanh toán phí nhập học thành công!');
            const timeout = setTimeout(() => {
                sessionStorage.removeItem('doneSuccess');
            }, 2000);
            // Dọn dẹp timeout khi component unmount
            return () => clearTimeout(timeout);
        }
        if (spIdSuccess) {
            toast.success('Thanh toán phí đăng ký thành công!');
            const timeout = setTimeout(() => {
                sessionStorage.removeItem('spIdSuccess');
            }, 2000);
            // Dọn dẹp timeout khi component unmount
            return () => clearTimeout(timeout);
        }
    }, []);

    const { selectedCampus } = useOutletContext();
    const [cccd, setCccd] = useState('');
    const [otp, setOtp] = useState('');
    const [token, setToken] = useState('');
    const [applicationData, setApplicationData] = useState(null);
    const [email, setEmail] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [address, setAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Trạng thái loading

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    // Gửi OTP qua API
    const handleSendOtp = async () => {
        setIsLoading(true);
        try {
            const response = await api.post('/RegisterAdmission/send-OTP', {
                citizenIentificationNumber: cccd
            });
            setEmail(response.data.email);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success(response.data.message);
            handleShow();
        } catch (error) {
            console.error('Lỗi khi gửi OTP:', error);
            toast.error('Không thể gửi mã OTP. Vui lòng kiểm tra lại số CCCD.');
        } finally {
            setIsLoading(false); // Kết thúc loading
        }
    };
    // Đoạn mã ẩn phần giữa của email
    const hideEmail = email => {
        const [user, domain] = email.split('@');
        const hiddenUser = user.slice(0, 3) + '***'; // Ẩn một phần đầu
        return `${hiddenUser}@${domain}`;
    };

    //Logic hiển thị tag
    const [currentStep, setCurrentStep] = useState(1); // Trạng thái theo dõi bước hiện tại
    const [maxStep, setMaxStep] = useState(null);
    // Hàm xác định tiến trình hiện tại
    const getCurrentStep = (typeofStatusProfile, typeofStatusMajor) => {
        if (typeofStatusProfile === 7) return 1; // Kết quả xét tuyển
        if (typeofStatusProfile > 1) return 4; // Hồ sơ nhập học cuối cùng
        if (typeofStatusProfile === 1 && typeofStatusMajor === 1) return 3; // Nhập học
        if (typeofStatusProfile === 0 || typeofStatusProfile === 1) return 2; // Kết quả xét tuyển
        return 1; // Hồ sơ xét tuyển
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
            const tokenData = response.data?.token
            setToken(response.data?.token);
            if (!tokenData) {
                toast.error('Token không tồn tại trong phản hồi.');
                return;
            }
            toast.success('Xác thực thành công!');
            const dataResponse = await api.post(
                '/RegisterAdmission/search-register-admission',
                { citizenIentificationNumber: cccd },
                {
                    headers: {
                        Authorization: `Bearer ${tokenData}`
                    }
                }
            );
            setApplicationData(dataResponse.data);
            setMaxStep(getCurrentStep(dataResponse.data.typeofStatusProfile, dataResponse.data.typeofStatusMajor));
            handleClose(dataResponse.data);
        } catch (error) {
            console.error('Lỗi xác thực OTP:', error);
            toast.error('Mã OTP không hợp lệ hoặc đã hết hạn.');
        }
    };

    // CSS classes cho các bước tiến trình
    const stepClasses = (step) => {
        if (step > maxStep) return "step disabled"; // Không thể nhấn
        return `step ${step === currentStep ? "active" : ""} ${step === currentStep ? "current" : ""}`;
    };

    // Xử lý nhấp vào bước
    const handleStepClick = (step) => {
        if (step <= maxStep) {
            setCurrentStep(step);
        }
    };

    // Tiến trình 1
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

    // Cơ sở
    const [campuses, setCampuses] = useState([]);
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

    // Hiển thị điểm
    const fieldMapping = {
        0: ["CN12"], // Xét học bạ lớp 12
        1: ["CN10", "CN11", "CN12"], // Xét học bạ 3 năm
        2: ["CN10", "CN11", "HK1-12"], // Xét học bạ lớp 10, lớp 11, HK1 lớp 12
        3: ["HK1-10", "HK2-10", "HK1-11", "HK2-11", "HK1-12"], // Xét học bạ 5 kỳ
        4: ["HK1-11", "HK2-11", "HK1-12"], // Xét học bạ 3 kỳ
    };

    const indexMap = [
        [0, 3, 6, 9, 12],
        [1, 4, 7, 10, 13],
        [2, 5, 8, 11, 14],
    ];

    const getSubjects = (majorTranscripts) => {
        if (!majorTranscripts) {
            return [];
        }

        return majorTranscripts
            .filter((item) => item.typeOfAcademicTranscript < 3) // Lấy 3 môn đầu tiên
            .map((item) => ({
                name: item.subjectName,
                baseIndex: item.typeOfAcademicTranscript,
            }));
    };

    const renderTable = (majorTranscripts, typeOfTranscriptMajor) => {
        if (!majorTranscripts || !Array.isArray(majorTranscripts) || majorTranscripts.length === 0) {
            return null;
        }
        if (typeOfTranscriptMajor === null) {
            // Trường hợp xét điểm THPT (typeOfDiplomaMajor === 5)
            return (
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Môn học</th>
                            <th>Điểm</th>
                        </tr>
                    </thead>
                    <tbody>
                        {majorTranscripts.map((item, index) => (
                            <tr key={index}>
                                <td>{item.subjectName}</td>
                                <td>{item.subjectPoint}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }
        // Trường hợp khác (xét học bạ)
        // Lấy danh sách môn học
        const subjects = getSubjects(majorTranscripts);

        // Lấy danh sách kỳ từ fieldMapping
        const periods = fieldMapping[typeOfTranscriptMajor];

        return (
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Môn học</th>
                        {periods.map((period, index) => (
                            <th key={index}>{period}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {subjects.map((subject, subjectIndex) => (
                        <tr key={subjectIndex}>
                            <td>{subject.name}</td>
                            {periods.map((_, periodIndex) => {
                                const index = indexMap[subject.baseIndex][periodIndex];
                                const transcript = majorTranscripts.find(
                                    (item) => item.typeOfAcademicTranscript === index
                                );
                                return <td key={periodIndex}>{transcript ? transcript.subjectPoint : "-"}</td>;
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    const getDiplomaName = (typeDiploma) => {
        switch (typeDiploma) {
            case 0: return "Tốt nghiệp THCS";
            case 1: return "Tốt nghiệp THPT";
            case 2: return "Tốt nghiệp CĐ/ĐH";
            case 3: return "Xét học bạ THPT";
            case 4: return "Liên thông";
            case 5: return "Xét điểm thi THPT";
            default: return "Khác";
        }
    };
    const getTranscriptName = (typeOfTranscript) => {
        switch (typeOfTranscript) {
            case 0: return "Xét học bạ 12";
            case 1: return "Xét học bạ 3 năm";
            case 2: return "Xét học bạ lớp 10, lớp 11, HK1 lớp 12";
            case 3: return "Xét học bạ 5 kỳ";
            case 4: return "Xét học bạ 3 kỳ";
            default: return null;
        }
    };

    // Định nghĩa các state hiển thị ảnh học bạ cho từng kỳ
    const [majors, setMajors] = useState([]);
    useEffect(() => {
        const fetchMajors = async () => {
            if (!applicationData?.campusId) return;

            try {
                const response = await api.get(`/Major/get-majors-college?campus=${applicationData.campusId}`);
                setMajors(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy giá trị ngành học', error);
            }
        };
        fetchMajors();
    }, [applicationData?.campusId]);

    // Hàm lấy các trường nhập điểm duy nhất từ loại xét học bạ
    const getUniqueFields = (type1) => {
        const fields1 = fieldMapping[type1] || [];
        return Array.from(new Set(fields1));
    };
    const [showSemester1Year10, setShowSemester1Year10] = useState(false);
    const [showSemester2Year10, setShowSemester2Year10] = useState(false);
    const [showFinalYear10, setShowFinalYear10] = useState(false);

    const [showSemester1Year11, setShowSemester1Year11] = useState(false);
    const [showSemester2Year11, setShowSemester2Year11] = useState(false);
    const [showFinalYear11, setShowFinalYear11] = useState(false);

    const [showSemester1Year12, setShowSemester1Year12] = useState(false);
    const [showFinalYear12, setShowFinalYear12] = useState(false);
    useEffect(() => {
        const selectedMajorData = majors.find((major) => major.majorID === applicationData.major);
        const selectedType = selectedMajorData?.typeAdmissions.find(
            (type) => type.typeDiploma === applicationData.typeOfDiplomaMajor
        );
        // Cập nhật displayedFields dựa trên các loại xét học bạ đã chọn
        const fields = getUniqueFields(selectedType?.typeOfTranscript);
        // Xác định có cần hiện form nhập ảnh học bạ
        setShowSemester1Year10(fields.includes('HK1-10'));
        setShowSemester2Year10(fields.includes('HK2-10'));
        setShowFinalYear10(fields.includes('CN10'));
        setShowSemester1Year11(fields.includes('HK1-11'));
        setShowSemester2Year11(fields.includes('HK2-11'));
        setShowFinalYear11(fields.includes('CN11'));
        setShowSemester1Year12(fields.includes('HK1-12'));
        setShowFinalYear12(fields.includes('CN12'));
    }, [applicationData, majors]);

    // Nhập học
    const [selectedEnrollmentForm, setSelectedEnrollmentForm] = useState(null); // File đơn nhập học
    const [selectedBirthCertificate, setSelectedBirthCertificate] = useState(null); // File giấy khai sinh
    const [birthCertificatePreview, setBirthCertificatePreview] = useState(null); // URL xem trước giấy khai sinh

    const handleUpload = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        const allowedFormats = {
            enrollmentForm: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"], // .pdf, .doc, .docx
            birthCertificate: ["image/jpeg", "image/png", "image/gif", "image/bmp"], // Các định dạng ảnh phổ biến
        };

        if (!allowedFormats[type].includes(file.type)) {
            toast.error(`Định dạng tệp không hợp lệ. Vui lòng chọn tệp đúng định dạng: ${type === "enrollmentForm" ? ".pdf, .doc, .docx" : "ảnh (JPEG, PNG, GIF, BMP)"}`);
            return;
        }

        // Nếu định dạng hợp lệ, lưu file
        if (type === "birthCertificate") {
            setSelectedBirthCertificate(file);
            setBirthCertificatePreview(URL.createObjectURL(file));
        } else if (type === "enrollmentForm") {
            setSelectedEnrollmentForm(file);
        }
    };
    const handlePayment = async () => {
        const selectedCampusPost = {
            campus: applicationData.campusId
        };
        sessionStorage.setItem('spId', applicationData.spId);
        try {
            const paymentResponse = await api.post('/VNPay/pay-register-admission', selectedCampusPost);
            window.location.href = paymentResponse.data.paymentUrl;
        } catch (error) {
            toast.error('Lỗi khi gửi yêu cầu thanh toán, vui lòng thử lại!');
            sessionStorage.removeItem('spId');
        }
    };

    const handleEnrollmentSubmit = async () => {
        if (!selectedEnrollmentForm || !selectedBirthCertificate) {
            toast.error("Vui lòng tải lên đầy đủ Đơn nhập học và Giấy khai sinh.");
            return;
        }
        // Upload Đơn nhập học và Giấy khai sinh
        const [enrollmentFormUrl, birthCertificateUrl] = await Promise.all([
            uploadImage(selectedEnrollmentForm, "ProfileAdmission"),
            uploadImage(selectedBirthCertificate, "ProfileAdmission"),
        ]);

        // Gửi dữ liệu đến API
        const data = {
            citizenIentificationNumber: cccd,
            admissionForm: enrollmentFormUrl,
            birthCertificate: birthCertificateUrl,
        };
        sessionStorage.setItem('data', JSON.stringify(data));

        const selectedCampusPost = {
            campus: applicationData.campusId,
            major: applicationData.major,
        };
        try {
            const paymentResponse = await api.post('/VNPay/pay-admission', selectedCampusPost);
            window.location.href = paymentResponse.data.paymentUrl;
        } catch (error) {
            toast.error('Lỗi khi gửi yêu cầu thanh toán, vui lòng thử lại!');
            sessionStorage.removeItem('data');
        }
    };

    // Thông báo gửi hồ sơ bản cứng
    const [admissionInfo, setAdmissionInfo] = useState(null);
    const [campusDetail, setCampusDetail] = useState(null);
    const [formattedAmount, setFormattedAmount] = useState(null);
    const formatCurrency = (amount) => {
        return amount.toLocaleString('vi-VN') + ' VND';
    };
    useEffect(() => {
        const fetchCampuses = async () => {
            try {
                const response = await api.get(`/AdmissionInformation/get-admission-information?CampusId=${selectedCampus.id}`);
                setAdmissionInfo(response.data);
                const admissionFee = response.data?.feeRegister;
                if (admissionFee) {
                    setFormattedAmount(formatCurrency(admissionFee));
                } else {
                    setFormattedAmount("Không rõ");
                }
                const responseCampus = await api.get(`/Campus/get-campus?campusid=${selectedCampus.id}`);
                setCampusDetail(responseCampus.data.address);
            } catch (error) {
                console.error('Lỗi lấy thông tin tuyển sinh: ', error);
            }
        };
        fetchCampuses();
    }, [selectedCampus.id]);

    const [isEditing, setIsEditing] = useState(false);  // Trạng thái chỉnh sửa
    const handleEditClick = () => {
        setIsEditing(true);  // Hiển thị form chỉnh sửa
    };
    const handleCloseEdit = () => {
        setIsEditing(false);  // Quay lại chế độ xem thông tin
    };
    // Callback sau khi chỉnh sửa thành công
    const handleEditSuccess = async () => {
        toast.success('Cập nhật hồ sơ thành công');
        setTimeout(() => setIsEditing(false), 1000); // Chuyển trạng thái sau 1 giây
        const dataResponse = await api.post(
            '/RegisterAdmission/search-register-admission',
            { citizenIentificationNumber: cccd },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        setApplicationData(dataResponse.data);
    };


    return (
        <Container className="my-5">
            <ToastContainer position="top-right" autoClose={3000} />
            <h1 className="page-title" style={{ color: 'orange', textAlign: 'center' }}>Tra cứu hồ sơ</h1>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to="/">Trang chủ</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item active className="text-orange">Tra cứu hồ sơ</Breadcrumb.Item>
            </Breadcrumb>
            <Form className="my-4 mx-3" onSubmit={(e) => { e.preventDefault(); handleSendOtp(); }}>
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
                            disabled={!!applicationData || isLoading}
                        />
                    </Col>
                    <Col xs={4} md={3} lg={2}>
                        <Button variant="light" onClick={handleSendOtp}
                            className="w-100 bg-orange text-white"
                            disabled={!!applicationData || isLoading || !cccd.trim()}
                        >
                            {isLoading ? (
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                            ) : (
                                'Gửi OTP'
                            )}
                        </Button>
                    </Col>
                </Row>
            </Form>
            <Modal show={showModal} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Xác thực OTP</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className="my-4 mx-5" onSubmit={(e) => { e.preventDefault(); handleVerifyOtp(); }}>
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
                    <div className="progress-container my-4">
                        <div className="progress-steps d-flex justify-content-between align-items-center">
                            <div
                                className={stepClasses(1)}
                                onClick={() => handleStepClick(1)}
                            >
                                Hồ sơ xét tuyển
                            </div>
                            <span>→</span>
                            <div
                                className={stepClasses(2)}
                                onClick={() => handleStepClick(2)}
                            >
                                Kết quả xét tuyển
                            </div>
                            <span>→</span>
                            <div
                                className={stepClasses(3)}
                                onClick={() => handleStepClick(3)}
                            >
                                Nhập học
                            </div>
                            <span>→</span>
                            <div
                                className={stepClasses(4)}
                                onClick={() => handleStepClick(4)}
                            >
                                Hồ sơ nhập học
                            </div>
                        </div>
                    </div>
                    {/* Hiển thị các tag trạng thái */}
                    <Card className="mt-4 px-md-5 px-3">
                        {currentStep === 1 && (
                            <Card.Body>
                                {isEditing ? (
                                    <ApplicationUpdate
                                        applicationData={applicationData}
                                        onEditSuccess={handleEditSuccess}  // Chuyển về trạng thái view
                                        onCloseEdit={handleCloseEdit}      // Quay lại chế độ view khi nhấn Đóng
                                    />
                                ) : (
                                    <div>
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
                                            <h4 className='text-orange mt-2'>Thông tin xét tuyển</h4>
                                            <Col xs={12} md={6}>
                                                <div className="info-item">
                                                    <span className="label">Cơ sở nhập học</span>
                                                    <span className="value">
                                                        {
                                                            campuses.find(campus => campus.campusId === applicationData.campusId)?.campusName || "Tên cơ sở không có sẵn"
                                                        }
                                                    </span>
                                                </div>
                                                <div className="info-item">
                                                    <span className="label">Nguyện vọng</span>
                                                    <span className="value">{applicationData.majorName}</span>
                                                </div>
                                                <div className="info-item">
                                                    <span className="label">Hình thức xét tuyển</span>
                                                    <span className="value">
                                                        {getDiplomaName(applicationData.typeOfDiplomaMajor)}{" "}
                                                        {applicationData.typeOfTranscriptMajor !== null &&
                                                            getTranscriptName(applicationData.typeOfTranscriptMajor) ?
                                                            `- ${getTranscriptName(applicationData.typeOfTranscriptMajor)}` : ""}
                                                    </span>
                                                </div>
                                            </Col>
                                            <Col xs={12} md={6}>
                                                {applicationData.academicTranscriptsMajor &&
                                                    (applicationData.typeOfDiplomaMajor === 3 || applicationData.typeOfDiplomaMajor === 5) && (
                                                        <>
                                                            {renderTable(
                                                                applicationData.academicTranscriptsMajor,
                                                                applicationData.typeOfTranscriptMajor || null
                                                            )}
                                                        </>
                                                    )}
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
                                                {applicationData.imgDiplomaMajor && (
                                                    <Col xs={6} sm={4} md={3} className="mb-2">
                                                        <div className="image-container">
                                                            <img src={applicationData.imgDiplomaMajor} alt="Bằng xét NV1" className="img-fluid" />
                                                        </div>
                                                        <p className="image-title text-center mt-2">Bằng nộp xét tuyển</p>
                                                    </Col>
                                                )}
                                                {applicationData.imgAcademicTranscript1 && showSemester1Year10 && (
                                                    <Col xs={6} sm={4} md={3} className="mb-2">
                                                        <div className="image-container">
                                                            <img
                                                                src={applicationData.imgAcademicTranscript1}
                                                                alt={
                                                                    (applicationData.typeOfDiplomaMajor === 4 || applicationData.typeOfDiplomaMajor === null)
                                                                        ? "Bảng điểm"
                                                                        : "Ảnh học bạ HKI lớp 10"}
                                                                className="img-fluid"
                                                            />
                                                        </div>
                                                        <p className="image-title text-center mt-2">
                                                            {(applicationData.typeOfDiplomaMajor === 4 || applicationData.typeOfDiplomaMajor === null)
                                                                ? "Bảng điểm"
                                                                : "Ảnh học bạ HKI - Lớp 10"}
                                                        </p>
                                                    </Col>
                                                )}
                                                {applicationData.imgAcademicTranscript2 && showSemester2Year10 && (
                                                    <Col xs={6} sm={4} md={3} className="mb-2">
                                                        <div className="image-container">
                                                            <img src={applicationData.imgAcademicTranscript2} alt="Ảnh học bạ HKII lớp 10" className="img-fluid" />
                                                        </div>
                                                        <p className="image-title text-center mt-2">Ảnh học bạ HKII - Lớp 10</p>
                                                    </Col>
                                                )}

                                                {applicationData.imgAcademicTranscript3 && showFinalYear10 && (
                                                    <Col xs={6} sm={4} md={3} className="mb-2">
                                                        <div className="image-container">
                                                            <img src={applicationData.imgAcademicTranscript3} alt="Ảnh học bạ CN - Lớp 10" className="img-fluid" />
                                                        </div>
                                                        <p className="image-title text-center mt-2">Ảnh học bạ CN - Lớp 10</p>
                                                    </Col>
                                                )}

                                                {applicationData.imgAcademicTranscript4 && showSemester1Year11 && (
                                                    <Col xs={6} sm={4} md={3} className="mb-2">
                                                        <div className="image-container">
                                                            <img src={applicationData.imgAcademicTranscript4} alt="Ảnh học bạ HKI - Lớp 11" className="img-fluid" />
                                                        </div>
                                                        <p className="image-title text-center mt-2">Ảnh học bạ HKI - Lớp 11</p>
                                                    </Col>
                                                )}

                                                {applicationData.imgAcademicTranscript5 && showSemester2Year11 && (
                                                    <Col xs={6} sm={4} md={3} className="mb-2">
                                                        <div className="image-container">
                                                            <img src={applicationData.imgAcademicTranscript5} alt="Ảnh học bạ HKII - Lớp 11" className="img-fluid" />
                                                        </div>
                                                        <p className="image-title text-center mt-2">Ảnh học bạ HKII - Lớp 11</p>
                                                    </Col>
                                                )}

                                                {applicationData.imgAcademicTranscript6 && showFinalYear11 && (
                                                    <Col xs={6} sm={4} md={3} className="mb-2">
                                                        <div className="image-container">
                                                            <img src={applicationData.imgAcademicTranscript6} alt="Ảnh học bạ CN - Lớp 11" className="img-fluid" />
                                                        </div>
                                                        <p className="image-title text-center mt-2">Ảnh học bạ CN - Lớp 11</p>
                                                    </Col>
                                                )}

                                                {applicationData.imgAcademicTranscript7 && showSemester1Year12 && (
                                                    <Col xs={6} sm={4} md={3} className="mb-2">
                                                        <div className="image-container">
                                                            <img src={applicationData.imgAcademicTranscript7} alt="Ảnh học bạ HKI - Lớp 12" className="img-fluid" />
                                                        </div>
                                                        <p className="image-title text-center mt-2">Ảnh học bạ HKI - Lớp 12</p>
                                                    </Col>
                                                )}

                                                {applicationData.imgAcademicTranscript9 && showFinalYear12 && (
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
                                            <h4 className='text-orange mt-3'>Thông tin thanh toán</h4>
                                            <Col md={12}>
                                                <div className="info-item">
                                                    <span className="label2">Phí thanh toán</span>
                                                    <span className="value">
                                                        {formattedAmount || 'Đang tải...'}
                                                    </span>
                                                </div>
                                                <div className="info-item">
                                                    <span className="label2">Trạng thái thanh toán</span>
                                                    <span className={`value ${applicationData.typeofStatusProfile !== 7 ? 'text-success' : 'text-danger'}`}>
                                                        {applicationData.typeofStatusProfile !== 7 ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                                    </span>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Col className="d-flex justify-content-end">
                                            {(applicationData.typeofStatusProfile === 0 || applicationData.typeofStatusProfile === 7) && (
                                                <Button
                                                    variant="light"
                                                    onClick={handleEditClick}
                                                    className="btn-block bg-orange text-white me-3"
                                                >
                                                    Cập nhật hồ sơ
                                                </Button>
                                            )}
                                            {applicationData.typeofStatusProfile === 7 && (
                                                <Button
                                                    variant="light"
                                                    onClick={handlePayment}
                                                    className="bg-primary text-white px-4 py-2"
                                                    style={{ width: "auto" }}
                                                >
                                                    Thanh toán phí đăng ký
                                                </Button>
                                            )}
                                        </Col>
                                    </div>
                                )}
                            </Card.Body>
                        )}
                        {currentStep === 2 && (
                            <div className="enrollment-section mt-4 mb-5">
                                <h4 className='text-orange mb-2'>Kết quả xét tuyển</h4>
                                <Row>
                                    <Col xs={12} md={6}>
                                        <div className="info-item">
                                            <span className="label">Nguyện vọng</span>
                                            <span className="value">{applicationData.majorName}</span>
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
                                            <span className="label me-3">Trạng thái xét duyệt</span>
                                            <span className="value">
                                                {applicationData.typeofStatusMajor === null
                                                    ? "Chờ xét duyệt"
                                                    : applicationData.typeofStatusMajor === 0
                                                        ? "Không đạt"
                                                        : applicationData.typeofStatusMajor === 1
                                                            ? "Đạt"
                                                            : applicationData.typeofStatusMajor === 2
                                                                ? "Đang xử lý"
                                                                : ""}
                                            </span>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        )}
                        {currentStep === 3 && (
                            <div className="enrollment-section mt-4">
                                <h4 className='text-orange mb-2'>Nhập học</h4>
                                <Form>
                                    <Row>
                                        <Col md={4}>
                                            <Form.Group controlId="uploadEnrollmentForm" className="mb-3">
                                                <Form.Label>Đơn nhập học</Form.Label>
                                                <Form.Control
                                                    type="file"
                                                    className="mb-2"
                                                    accept=".pdf,.doc,.docx"
                                                    onChange={(e) => handleUpload(e, "enrollmentForm")}
                                                />
                                                <a href="/AdmissionForm.docx" download className="d-flex align-items-center text-primary">
                                                    Mẫu đơn nhập học
                                                    <Download className="ms-2" />
                                                </a>
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group controlId="uploadBirthCertificate" className="mb-3">
                                                <Form.Label>Giấy khai sinh</Form.Label>
                                                <Form.Control
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleUpload(e, "birthCertificate")}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            {birthCertificatePreview && (
                                                <div className="birth-certificate-preview mt-3">
                                                    <img
                                                        src={birthCertificatePreview}
                                                        alt="Birth Certificate"
                                                        className="img-fluid"
                                                        style={{ maxWidth: "300px", maxHeight: "300px", border: "1px solid #ccc" }}
                                                    />
                                                </div>
                                            )}
                                        </Col>
                                    </Row>
                                    <Col className="d-flex justify-content-end my-3">
                                        <Button
                                            variant="light"
                                            onClick={handleEnrollmentSubmit}
                                            className="bg-orange text-white px-4 py-2"
                                            style={{ width: "auto" }}
                                            disabled={
                                                !!(applicationData.birthCertificate || applicationData.admissionForm) ||
                                                (applicationData.typeofStatusMajor === 0)
                                            }
                                        >
                                            Gửi thông tin nhập học
                                        </Button>
                                    </Col>
                                </Form>
                            </div>
                        )}
                        {currentStep === 4 && (
                            <div className="enrollment-section mt-4">
                                <h4 className="text-orange mb-3">Hồ sơ nhập học</h4>
                                <Row>
                                    <Col md={6}>
                                        {applicationData.admissionForm ? (
                                            <div className="mb-3 d-flex align-items-center">
                                                <p className="mb-0 me-2"><strong>Đơn nhập học:</strong></p>
                                                <a href={applicationData.admissionForm} target="_blank" rel="noopener noreferrer">
                                                    Tải xuống Đơn nhập học đã gửi
                                                    <Download className="ms-2" />
                                                </a>
                                            </div>
                                        ) : (
                                            <p>Không tìm thấy Đơn nhập học.</p>
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
                                            <p>Không tìm thấy Giấy khai sinh.</p>
                                        )}
                                    </Col>

                                    {admissionInfo ? (
                                        <div className="mb-3">
                                            <p><strong>Vui lòng gửi hồ sơ bản cứng bao gồm các giấy tờ sau:</strong></p>
                                            {admissionInfo.admissionProfileDescription
                                                .split('\r\n')
                                                .filter(item => item.trim() !== '')
                                                .map((item, index) => (
                                                    <li key={index}>{item}</li>
                                                ))
                                            }
                                        </div>
                                    ) : (
                                        <p>Không tìm thấy Thông tin yêu cầu hồ sơ bản cứng.</p>
                                    )}
                                    {campusDetail ? (
                                        <div className="mb-3 d-flex">
                                            <p>
                                                <strong>Địa chỉ gửi hồ sơ: </strong>
                                                <span>
                                                    {campusDetail}
                                                </span>
                                            </p>
                                        </div>
                                    ) : (
                                        <p>Không tìm thấy Thông tin yêu cầu hồ sơ bản cứng.</p>
                                    )}
                                </Row>
                            </div>
                        )}
                    </Card>
                </div>
            )}
        </Container>
    );
};

export default ApplicationSearch;