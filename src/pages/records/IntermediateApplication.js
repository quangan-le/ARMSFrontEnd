import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Modal } from 'react-bootstrap';
import { Link, useOutletContext, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../../apiService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import uploadImage from '../../firebase/uploadImage.js';

const IntermediateApplication = () => {
    const [formData, setFormData] = useState({
        fullname: "",
        dob: "",
        gender: "",
        nation: "",
        citizenIentificationNumber: "",
        ciDate: "",
        ciAddress: "",
        province: "",
        district: "",
        ward: "",
        specificAddress: "",
        emailStudent: "",
        phoneStudent: "",
        fullnameParents: "",
        phoneParents: "",
        campusId: "",
        major1: "",
        major2: "",
        yearOfGraduation: "",
        schoolName: "",
        recipientResults: true,
        permanentAddress: true,
        addressRecipientResults: "",
        imgCitizenIdentification1: "",
        imgCitizenIdentification2: "",
        imgpriority: "",
        imgAcademicTranscript1: "",
        priorityDetailPriorityID: null,
        campusName: "",
        studentCode: "",
    });

    // Lưu trữ ảnh tạm thời
    const [tempImages, setTempImages] = useState({
        imgpriority: null,
        imgCitizenIdentification1: null,
        imgCitizenIdentification2: null,
        imgAcademicTranscript1: null,
    });

    // formData
    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: (id === "gender" || id === "recipientResults") ? (value === "true") : (type === "checkbox" ? checked : value)
        }));
    };

    const { selectedCampus } = useOutletContext();
    const [isWithinAdmissionTime, setIsWithinAdmissionTime] = useState(false);
    const [admissionTimes, setAdmissionTimes] = useState([]); // Lưu toàn bộ dữ liệu thời gian tuyển sinh

    // Kiểm tra có trong thời gian tuyển sinh không
    const checkAdmissionTime = async () => {
        try {
            const response = await api.get('/AdmissionTime/get-admission-time',
                { params: { CampusId: selectedCampus.id } }
            );
            const times = response.data;
            setAdmissionTimes(times); // Lưu toàn bộ thời gian tuyển sinh
            const currentTime = new Date();

            // Kiểm tra nếu thời gian hiện tại trong bất kỳ khoảng nào
            const withinTime = times.some((admission) => {
                const start = new Date(admission.startRegister);
                const end = new Date(admission.endRegister);
                return currentTime >= start && currentTime <= end;
            });

            setIsWithinAdmissionTime(withinTime);
        } catch (error) {
            console.error('Lỗi khi kiểm tra thời gian tuyển sinh:', error);
            toast.error('Không thể kiểm tra thời gian tuyển sinh, vui lòng thử lại sau!');
        }
    };

    useEffect(() => {
        if (selectedCampus?.id) {
            checkAdmissionTime();
        }
    }, [selectedCampus?.id]);

    // Xử lý lấy danh sách tỉnh huyện
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');

    // Lấy danh sách tỉnh/thành phố khi component mount
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await axios.get('https://provinces.open-api.vn/api/p');
                setProvinces(response.data);
            } catch (error) {
                console.error('Error fetching provinces data:', error);
            }
        };
        fetchProvinces();
    }, []);

    // Lấy danh sách quận/huyện khi chọn tỉnh/thành phố
    useEffect(() => {
        if (selectedProvince) {
            const fetchDistricts = async () => {
                try {
                    const response = await axios.get(
                        `https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`
                    );
                    setDistricts(response.data.districts);
                } catch (error) {
                    console.error('Error fetching districts data:', error);
                }
            };
            fetchDistricts();
        } else {
            setDistricts([]);
            setWards([]);
        }
    }, [selectedProvince]);

    // Lấy danh sách xã/phường khi chọn quận/huyện
    useEffect(() => {
        if (selectedDistrict) {
            const fetchWards = async () => {
                try {
                    const response = await axios.get(
                        `https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`
                    );
                    setWards(response.data.wards);
                } catch (error) {
                    console.error('Error fetching wards data:', error);
                }
            };
            fetchWards();
        } else {
            setWards([]);
        }
    }, [selectedDistrict]);

    const handleProvinceChange = (e) => {
        const selected = e.target.value;
        setSelectedProvince(selected);
        setFormData(prevState => ({
            ...prevState,
            province: selected,
            district: "",
            ward: ""
        }));
        setSelectedDistrict('');
    };

    const handleDistrictChange = (e) => {
        const selected = e.target.value;
        setSelectedDistrict(selected);
        setFormData(prevState => ({
            ...prevState,
            district: selected,
            ward: ""
        }));
    };

    const handleWardChange = (e) => {
        const selected = e.target.value;
        setFormData(prevState => ({
            ...prevState,
            ward: selected
        }));
    };

    // Ngành học
    const [majors, setMajors] = useState([]);
    const [selectedMajor1, setSelectedMajor1] = useState('');
    const [selectedMajor2, setSelectedMajor2] = useState('');

    // Cập nhật formData và ngành học khi selectedCampus thay đổi
    useEffect(() => {
        if (selectedCampus?.id) {
            setFormData((prevData) => ({
                ...prevData,
                campusId: selectedCampus.id,
                campusName: selectedCampus.name,
            }));
            setSelectedMajor1('');
            setSelectedMajor2('');

            const fetchMajors = async () => {
                try {
                    const response = await api.get(`/Major/get-majors-college-for-vocational-school?campus=${selectedCampus.id}`);
                    setMajors(response.data);
                } catch (error) {
                    console.error('Lỗi khi lấy giá trị ngành học', error);
                }
            };
            fetchMajors();
        }
    }, [selectedCampus]);

    // Khi người dùng chọn ngành cho nguyện vọng
    const handleMajorChange1 = (e) => {
        const selectedMajorId = e.target.value;
        setSelectedMajor1(selectedMajorId);
        setFormData(prevData => ({
            ...prevData,
            major1: selectedMajorId
        }));
    };
    // Khi người dùng chọn ngành cho nguyện vọng
    const handleMajorChange2 = (e) => {
        const selectedMajorId = e.target.value;
        setSelectedMajor2(selectedMajorId);
        setFormData(prevData => ({
            ...prevData,
            major2: selectedMajorId
        }));
    };

    // Thông tin ưu tiên
    const [priorityData, setPriorityData] = useState([]);
    const [selectedPriority, setSelectedPriority] = useState('');
    const [showPriorityModal, setShowPriorityModal] = useState(false);

    useEffect(() => {
        const fetchPriorityData = async () => {
            try {
                const response = await api.get('/Priority/get-priority');
                setPriorityData(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu ưu tiên:', error);
            }
        };
        fetchPriorityData();
    }, []);

    // Xử lý khi người dùng chọn đối tượng ưu tiên
    const handlePriorityChange = (e) => {
        const selectedPriorityID = parseInt(e.target.value);
        setSelectedPriority(selectedPriorityID);
        setFormData(prevData => ({
            ...prevData,
            priorityDetailPriorityID: selectedPriorityID,
        }));
    };
    const handleFileChangePriority = (e) => {
        const file = e.target.files[0];
        setTempImages(prev => ({ ...prev, imgpriority: file }));
    };

    // Xử lý CCCD và bằng
    const [showOtherAddress, setShowOtherAddress] = useState(false);
    const [frontCCCD, setFrontCCCD] = useState(null);
    const [backCCCD, setBackCCCD] = useState(null);
    const [imgAcademicTranscript1, setImgAcademicTranscript1] = useState(null);

    // Ảnh mặt trước
    const handleFrontCCCDChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFrontCCCD(URL.createObjectURL(file));
            setTempImages(prev => ({ ...prev, imgCitizenIdentification1: file }));
        }
    };
    // Ảnh mặt sau
    const handleBackCCCDChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBackCCCD(URL.createObjectURL(file));
            setTempImages(prev => ({ ...prev, imgCitizenIdentification2: file }));
        }
    };
    // Bảng điểm
    const handleAcademicTranscript = (e) => {
        const file = e.target.files[0];
        if (file) {
            setTempImages(prev => ({
                ...prev,
                imgAcademicTranscript1: file
            }));
            setImgAcademicTranscript1(URL.createObjectURL(file));
        }
    };

    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    // Gửi dữ liệu và upload ảnh
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Bắt đầu trạng thái loading
        setLoadingMessage('Đang lưu hồ sơ...');
        const currentTime = new Date();
        // Kiểm tra nếu thời gian hiện tại không nằm trong bất kỳ khoảng nào
        const isWithinTime = admissionTimes.some((admission) => {
            const start = new Date(admission.startRegister);
            const end = new Date(admission.endRegister);
            return currentTime >= start && currentTime <= end;
        });


        if (!isWithinTime) {
            toast.error('Đã hết thời gian đăng ký xét tuyển! Vui lòng xem thông tin đợt tuyển sinh mới tại trang tuyển sinh!');
            setTimeout(() => {
                window.location.reload();
            }, 3000);
            setIsLoading(false);
            return;
        }

        // Duyệt qua các ảnh trong tempImages và upload
        for (const [key, file] of Object.entries(tempImages)) {
            if (file) {
                const folder = 'RegisterAdmission';
                try {
                    // Upload ảnh và lấy URL
                    const url = await uploadImage(file, folder);

                    // Cập nhật updatedFormData với URL ảnh đã upload
                    formData[key] = url;
                } catch (error) {
                    console.error(`Lỗi cập nhật ảnh lên firebase ${key}:`, error);
                }
            }
        }

        setLoadingMessage('Chuẩn bị thanh toán...');
        //Cập nhật lại formData với các URL ảnh và các điểm của academicTranscripts
        sessionStorage.setItem('formData', JSON.stringify(formData));

        const selectedCampusPost = {
            campus: selectedCampus.id
        };
        try {
            // Gửi yêu cầu thanh toán đến VNPAY
            const paymentResponse = await api.post('/VNPay/pay-register-admission', selectedCampusPost);
            // const paymentResponse = await axios.post(
            //     'https://roughy-finer-seemingly.ngrok-free.app/api/VNPay/pay-register-admission',
            //     selectedCampusPost
            // );
            const { paymentUrl } = paymentResponse.data;

            // Chuyển hướng người dùng đến trang thanh toán của VNPAY
            window.location.href = paymentUrl;
        } catch (error) {
            toast.error('Lỗi khi gửi yêu cầu thanh toán, vui lòng thử lại!');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div>
            {isLoading && (
                <div className="loading-overlay">
                    <div className="spinner-border text-orange" role="status"></div>
                    <p>{loadingMessage}</p>
                </div>
            )}
            <ToastContainer position="top-right" autoClose={3000} />
            <div className=" background-overlay">
                <div className="overlay"></div>
                <Container>
                    <Row>
                        <Col md={12} className="background-content">
                            <h2>Nộp hồ sơ trực tuyến</h2>
                            <h4>1. Điền thông tin xét tuyển</h4>
                            <h4>2. Chụp CCCD/CMND 2 mặt</h4>
                            <h4>3. Bảng điểm tốt nghiệp trung cấp</h4>
                        </Col>
                    </Row>
                </Container>
                <Row className="mt-5 background-content text-center justify-content-center align-items-center text-white bg-orange p-3 mx-auto w-75 rounded">
                    <div className="d-flex justify-content-center align-items-center">
                        <h4 className="text-black d-inline mb-0">Đăng ký tư vấn ngay tại đây</h4>
                        <Link to="/#dang-ky" className="text-white d-inline ms-3 fs-4">ĐĂNG KÝ TƯ VẤN!</Link>
                    </div>
                </Row>
            </div>
            {isWithinAdmissionTime ? (
                <Container className="mt-5 mb-3 px-4">
                    <Form onSubmit={handleSubmit}>
                        <h4 className='text-orange'>Thông tin thí sinh</h4>
                        <Row>
                            <Col md={3} className="mt-2">
                                <Form.Group controlId="fullname">
                                    <Form.Label>Họ và tên</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập họ và tên"
                                        value={formData.fullname}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3} className="mt-2">
                                <Form.Group controlId="dob">
                                    <Form.Label>Ngày sinh</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={formData.dob}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3} className="mt-2">
                                <Form.Group controlId="gender">
                                    <Form.Label>Giới tính</Form.Label>
                                    <Form.Control as="select" value={formData.gender} onChange={handleChange}>
                                        <option value="">Chọn giới tính</option>
                                        <option value="true">Nam</option>
                                        <option value="false">Nữ</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col md={3} className="mt-2">
                                <Form.Group controlId="nation">
                                    <Form.Label>Dân tộc</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập dân tộc"
                                        value={formData.nation}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mt-2">
                            <Col md={3} className="mt-2">
                                <Form.Group controlId="citizenIentificationNumber">
                                    <Form.Label>Số CMND/CCCD</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập số CMND/CCCD"
                                        value={formData.citizenIentificationNumber}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3} className="mt-2">
                                <Form.Group controlId="ciDate">
                                    <Form.Label>Ngày cấp</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={formData.ciDate}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6} className="mt-2">
                                <Form.Group controlId="ciAddress">
                                    <Form.Label>Nơi cấp</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập nơi cấp"
                                        value={formData.ciAddress}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mt-3">
                            <Form.Label>Nơi thường trú</Form.Label>
                            <Col md={3} xs={12} className="mb-3">
                                <Form.Group controlId="province">
                                    <Form.Control
                                        as="select"
                                        value={formData.province}
                                        onChange={handleProvinceChange}
                                    >
                                        <option value="">Tỉnh/thành phố</option>
                                        {provinces.map((province) => (
                                            <option key={province.code} value={province.code}>
                                                {province.name}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>

                            <Col md={3} xs={12} className="mb-3">
                                <Form.Group controlId="district">
                                    <Form.Control
                                        as="select"
                                        value={formData.district}
                                        onChange={handleDistrictChange}
                                        disabled={!selectedProvince}
                                    >
                                        <option value="">Quận/Huyện</option>
                                        {districts.map((district) => (
                                            <option key={district.code} value={district.code}>
                                                {district.name}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>

                            <Col md={3} xs={12} className="mb-3">
                                <Form.Group controlId="ward">
                                    <Form.Control
                                        as="select"
                                        value={formData.ward}
                                        onChange={handleWardChange}
                                        disabled={!selectedDistrict}
                                    >
                                        <option value="">Xã/Phường/Thị trấn</option>
                                        {wards.map((ward) => (
                                            <option key={ward.code} value={ward.code}>
                                                {ward.name}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>

                            <Col md={3} xs={12} className="mb-2">
                                <Form.Group controlId="specificAddress">
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập số nhà, đường, ngõ..."
                                        value={formData.specificAddress}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={3} className="mt-2">
                                <Form.Group controlId="phoneStudent">
                                    <Form.Label>Số điện thoại thí sinh</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập số điện thoại"
                                        value={formData.phoneStudent}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3} className="mt-2">
                                <Form.Group controlId="emailStudent">
                                    <Form.Label>Email thí sinh</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Nhập email"
                                        value={formData.emailStudent}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3} className="mt-2">
                                <Form.Group controlId="fullnameParents">
                                    <Form.Label>Họ và tên phụ huynh</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập họ và tên phụ huynh"
                                        value={formData.fullnameParents}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3} className="mt-2">
                                <Form.Group controlId="phoneParents">
                                    <Form.Label>Số điện thoại phụ huynh</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập số điện thoại phụ huynh"
                                        value={formData.phoneParents}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <h4 className='text-orange mt-4'>Thông tin thí sinh khi học trung cấp</h4>
                        <Row>
                            <Col md={3} className="mt-2">
                                <Form.Group controlId="schoolName">
                                    <Form.Label>Trường học</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Trường THPT FPT"
                                        value={formData.schoolName}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3} className="mt-2">
                                <Form.Group controlId="studentCode">
                                    <Form.Label>Mã sinh viên</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập mã sinh viên"
                                        value={formData.studentCode}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3} className="mt-2">
                                <Form.Group controlId="yearOfGraduation">
                                    <Form.Label>Năm tốt nghiệp</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="2024"
                                        value={formData.yearOfGraduation}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <h4 className='text-orange mt-4'>Thông tin đăng ký cơ sở</h4>
                        <Row className="mt-2">
                            <Col md={3}>
                                <Form.Group controlId="campusId">
                                    <Form.Label>Cơ sở</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedCampus?.name || ''}
                                        disabled
                                        className="bg-light"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3} className="mb-2">
                                <Form.Group controlId="major1">
                                    <Form.Label>Nguyện vọng 1</Form.Label>
                                    <Form.Control as="select" value={selectedMajor1} onChange={handleMajorChange1}>
                                        <option value="">Chọn ngành</option>
                                        {majors.map(major => (
                                            <option key={major.majorID} value={major.majorID}>
                                                {major.majorName}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col md={3} className="mb-2">
                                <Form.Group controlId="major2">
                                    <Form.Label>Nguyện vọng 2</Form.Label>
                                    <Form.Control as="select" value={selectedMajor2} onChange={handleMajorChange2}>
                                        <option value="">Chọn ngành</option>
                                        {majors.map(major => (
                                            <option key={major.majorID} value={major.majorID}>
                                                {major.majorName}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <h4 className='text-orange mt-3'>Thông tin ưu tiên (nếu có)</h4>
                        <Row className="mt-3">
                            <Col md={6}>
                                <Row>
                                    <Form.Label>Chọn đối tượng ưu tiên</Form.Label>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group controlId="prioritySelection">
                                            <Form.Control as="select" value={selectedPriority} onChange={handlePriorityChange}>
                                                <option value="">Chọn đối tượng</option>
                                                {priorityData.map((priority) => (
                                                    <option key={priority.priorityID} value={priority.priorityID}>
                                                        {priority.priorityName} ({priority.typeOfPriority})
                                                    </option>
                                                ))}
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Button variant="light" className="read-more-btn" onClick={() => setShowPriorityModal(true)}>
                                            Mô tả chi tiết
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="priorityDocument">
                                    <Form.Label>Giấy tờ ưu tiên</Form.Label>
                                    <Form.Control type="file" onChange={handleFileChangePriority} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Modal show={showPriorityModal} onHide={() => setShowPriorityModal(false)} size="lg">
                            <Modal.Header closeButton>
                                <Modal.Title>Mô tả chi tiết các đối tượng ưu tiên</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {priorityData.map((priority) => (
                                    <div key={priority.priorityID} className="mb-3">
                                        <h5>{priority.priorityName} - {priority.typeOfPriority}</h5>
                                        <p>{priority.priorityDescription}</p>
                                        <p>Điểm cộng: {priority.bonusPoint}</p>
                                        <hr />
                                    </div>
                                ))}
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowPriorityModal(false)}>
                                    Đóng
                                </Button>
                            </Modal.Footer>
                        </Modal>
                        <h4 className='text-orange mt-3'>Thông tin nhận giấy báo kết quả</h4>
                        <Row>
                            <Col md={6} className='mt-2'>
                                <Form.Group controlId="recipient">
                                    <Form.Label>Người nhận</Form.Label>
                                    <Form.Check
                                        type="radio"
                                        label="Thí sinh"
                                        name="recipient"
                                        id="recipientResults"
                                        value="true"
                                        onChange={handleChange}
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="Phụ huynh/Người bảo trợ"
                                        name="recipient"
                                        id="recipientResults"
                                        value="false"
                                        className="pt-3"
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6} className='mt-2'>
                                <Form.Group controlId="addressRecipientResults">
                                    <Form.Label>Địa chỉ nhận</Form.Label>
                                    <Form.Check
                                        type="radio"
                                        label="Địa chỉ thường trú"
                                        name="address"
                                        id="permanentAddress"
                                        onChange={() => {
                                            setFormData(prevData => ({
                                                ...prevData,
                                                permanentAddress: true,
                                                addressRecipientResults: "" // Xóa địa chỉ khác nếu chọn địa chỉ thường trú
                                            }));
                                            setShowOtherAddress(false);
                                        }}
                                    />
                                    <div className='d-flex align-items-end'>
                                        <Form.Check
                                            type="radio"
                                            label="Khác"
                                            name="address"
                                            id="otherAddress"
                                            onChange={() => {
                                                setFormData(prevData => ({ ...prevData, permanentAddress: false }));
                                                setShowOtherAddress(true);
                                            }}
                                            className="pt-3"
                                        />
                                        {showOtherAddress && (
                                            <Form.Control
                                                type="text"
                                                placeholder="Nhập địa chỉ khác"
                                                className="ms-2"
                                                value={formData.addressRecipientResults !== undefined ? formData.addressRecipientResults : ''}
                                                onChange={handleChange}
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
                                    <Col md={6} className='mt-2'>
                                        <Form.Group>
                                            <Form.Label>Ảnh CMND/CCCD mặt trước</Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFrontCCCDChange}
                                            />
                                            {frontCCCD && (
                                                <div className="image-preview-container mt-2">
                                                    <img src={frontCCCD} alt="Mặt trước CCCD" className="img-preview" />
                                                </div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6} className='mt-2'>
                                        <Form.Group>
                                            <Form.Label>Ảnh CMND/CCCD mặt sau</Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept="image/*"
                                                onChange={handleBackCCCDChange}
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
                            <Col md={3} className='mt-2'>
                                <Form.Group>
                                    <Form.Label>Bảng điểm</Form.Label>
                                    <Form.Control
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleAcademicTranscript(e)}
                                    />
                                    {imgAcademicTranscript1 && (
                                        <div className="image-preview-container mt-2">
                                            <img src={imgAcademicTranscript1} alt="Bảng điểm tốt nghiệp" className="img-preview" />
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
            ) : (
                <Container className="my-5 py-5 px-4 text-center">
                    <h3 className="text-danger mt-5 pt-5">Đã hết thời gian tuyển sinh</h3>
                    <p className='mb-5 pb-5'>
                        Vui lòng tham khảo thông tin đợt tuyển sinh mới tại trang{' '}
                        <Link to="/tuyen-sinh" className="text-primary">
                            tuyển sinh
                        </Link>.
                    </p>
                </Container>
            )}
        </div>
    );
};

export default IntermediateApplication;