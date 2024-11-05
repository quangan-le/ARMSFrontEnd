import React from 'react';
import { Container, Row, Col, Form, Button, Modal } from 'react-bootstrap';
import { useState, useEffect } from '../hooks/Hooks.js';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import api from '../../apiService';
import uploadImage from '../../uploadImage.js';

const Application = () => {
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

    // Cơ sở
    const [campuses, setCampuses] = useState([]);
    const [selectedCampus, setSelectedCampus] = useState('');
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

    // Ngành học
    const [majors, setMajors] = useState([]);
    const [selectedMajor1, setSelectedMajor1] = useState('');
    const [selectedMajor2, setSelectedMajor2] = useState('');

    const [typeAdmissions1, setTypeAdmissions1] = useState([]);
    const [typeAdmissions2, setTypeAdmissions2] = useState([]);
    const [selectedAdmissionType1, setSelectedAdmissionType1] = useState(null);
    const [selectedAdmissionType2, setSelectedAdmissionType2] = useState(null);

    const [subjectGroups1, setSubjectGroups1] = useState([]);
    const [subjectGroups2, setSubjectGroups2] = useState([]);

    const [scores1, setScores1] = useState({ subject1: '', subject2: '', subject3: '' });
    const [scores2, setScores2] = useState({ subject1: '', subject2: '', subject3: '' });
    const [showSubjectSelection1, setShowSubjectSelection1] = useState(false);
    const [showSubjectSelection2, setShowSubjectSelection2] = useState(false);

    // State for selected transcript types
    const [selectedTranscriptType1, setSelectedTranscriptType1] = useState(null);
    const [selectedTranscriptType2, setSelectedTranscriptType2] = useState(null);

    // State for displayed fields
    const [displayedFields, setDisplayedFields] = useState([]);
    // Định nghĩa các state hiển thị ảnh học bạ cho từng kỳ
    const [showSemester1Year10, setShowSemester1Year10] = useState(false);
    const [showSemester2Year10, setShowSemester2Year10] = useState(false);
    const [showFinalYear10, setShowFinalYear10] = useState(false);

    const [showSemester1Year11, setShowSemester1Year11] = useState(false);
    const [showSemester2Year11, setShowSemester2Year11] = useState(false);
    const [showFinalYear11, setShowFinalYear11] = useState(false);

    const [showSemester1Year12, setShowSemester1Year12] = useState(false);
    const [showSemester2Year12, setShowSemester2Year12] = useState(false);
    const [showFinalYear12, setShowFinalYear12] = useState(false);


    const TypeOfDiploma = {
        0: 'Tốt nghiệp THCS',
        1: 'Tốt nghiệp THPT',
        2: 'Tốt nghiệp Cao đẳng, Đại học',
        3: 'Xét học bạ THPT',
        4: 'Liên thông',
        5: 'Xét điểm thi THPT',
    };
    const fieldMapping = {
        0: ['finalYear12'], // Xét học bạ lớp 12
        1: ['finalYear10', 'finalYear11', 'finalYear12'], // Xét học bạ 3 năm
        2: ['finalYear10', 'finalYear11', 'semester1Year12'], // Xét học bạ lớp 10, lớp 11, HK1 lớp 12
        3: ['semester1Year10', 'semester2Year10', 'semester1Year11', 'semester2Year11', 'semester1Year12'], // Xét học bạ 5 kỳ
        4: ['semester1Year11', 'semester2Year11', 'semester1Year12'] // Xét học bạ 3 kỳ
    };

    // Hàm lấy các trường nhập điểm duy nhất từ hai loại xét học bạ
    const getUniqueFields = (type1, type2) => {
        const fields1 = fieldMapping[type1] || [];
        const fields2 = fieldMapping[type2] || [];
        return Array.from(new Set([...fields1, ...fields2]));
    };

    // Khi người dùng chọn cơ sở, cập nhật ngành học
    const handleCampusChange = async (e) => {
        const campusId = e.target.value;
        setSelectedCampus(campusId);
        setFormData(prevData => ({
            ...prevData,
            campusId: campusId
        }));
        setSelectedMajor1('');
        setSelectedMajor2('');
        setTypeAdmissions1([]);
        setTypeAdmissions2([]);
        setSelectedAdmissionType1(null);
        setSelectedAdmissionType2(null);
        setShowSubjectSelection1(false);
        setShowSubjectSelection2(false);
        setSubjectGroups1([]);
        setSubjectGroups2([]);
        setScores1({ subject1: '', subject2: '', subject3: '' });
        setScores2({ subject1: '', subject2: '', subject3: '' });
        if (campusId) {
            try {
                const response = await api.get(`/Major/get-majors-college?campus=${campusId}`);
                setMajors(response.data);
            } catch (error) {
                console.error('Error fetching majors:', error);
            }
        } else {
            setMajors([]);
        }
    };
    // Khi người dùng chọn ngành cho nguyện vọng 1
    const handleMajorChange1 = (e) => {
        const selectedMajorId = e.target.value;
        setSelectedMajor1(selectedMajorId);
        const selectedMajor = majors.find((major) => major.majorID === selectedMajorId);
        setTypeAdmissions1(selectedMajor?.typeAdmissions || []);
        setShowSubjectSelection1(false);
        setFormData(prevData => ({
            ...prevData,
            major1: selectedMajorId
        }));
    };

    // Khi người dùng chọn ngành cho nguyện vọng 2
    const handleMajorChange2 = (e) => {
        const selectedMajorId = e.target.value;
        setSelectedMajor2(selectedMajorId);
        const selectedMajor = majors.find((major) => major.majorID === selectedMajorId);
        setTypeAdmissions2(selectedMajor?.typeAdmissions || []);
        setShowSubjectSelection2(false);
        setFormData(prevData => ({
            ...prevData,
            major2: selectedMajorId
        }));
    };

    const handleAdmissionTypeChange1 = (e) => {
        const typeId = parseInt(e.target.value, 10);
        setSelectedAdmissionType1(typeId);
        setFormData(prevData => ({
            ...prevData,
            typeOfDiplomaMajor1: typeId
        }));
        const selectedMajor = majors.find((major) => major.majorID === selectedMajor1);
        const selectedType = selectedMajor?.typeAdmissions.find(
            (type) => type.typeDiploma === typeId
        );

        if (typeId === 5) {
            setSubjectGroups1(selectedMajor?.admissionDetailForMajors[0]?.subjectGroupDTOs || []);
            setShowSubjectSelection1(true);
        } else {
            setShowSubjectSelection1(false);
            setSubjectGroups1([]);
        }
    };

    const handleAdmissionTypeChange2 = (e) => {
        const typeId = parseInt(e.target.value, 10);
        setSelectedAdmissionType2(typeId);
        setFormData(prevData => ({
            ...prevData,
            typeOfDiplomaMajor2: typeId
        }));
        const selectedMajor = majors.find((major) => major.majorID === selectedMajor2);
        const selectedType = selectedMajor?.typeAdmissions.find(
            (type) => type.typeDiploma === typeId
        );

        if (typeId === 5) {
            setSubjectGroups2(selectedMajor?.admissionDetailForMajors[0]?.subjectGroupDTOs || []);
            setShowSubjectSelection2(true);
        } else {
            setShowSubjectSelection2(false);
            setSubjectGroups2([]);
        }
    };

    const handleScoreChange1 = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            academicTranscripts: {
                ...prevData.academicTranscripts,
                [name]: value
            }
        }));
    };

    const handleScoreChange2 = (e) => {
        const { name, value } = e.target;
        setScores2((prevScores) => ({ ...prevScores, [name]: value }));
    };

    useEffect(() => {
        const selectedMajor1Data = majors.find((major) => major.majorID === selectedMajor1);
        const selectedMajor2Data = majors.find((major) => major.majorID === selectedMajor2);

        const selectedType1 = selectedMajor1Data?.typeAdmissions.find(
            (type) => type.typeDiploma === selectedAdmissionType1
        );
        const selectedType2 = selectedMajor2Data?.typeAdmissions.find(
            (type) => type.typeDiploma === selectedAdmissionType2
        );

        // Cập nhật loại xét học bạ dựa vào typeOfTranscript nếu typeDiploma là Xét học bạ
        setSelectedTranscriptType1(selectedType1?.typeOfTranscript || null);
        setSelectedTranscriptType2(selectedType2?.typeOfTranscript || null);

        // Cập nhật displayedFields dựa trên các loại xét học bạ đã chọn
        const fields = getUniqueFields(selectedType1?.typeOfTranscript, selectedType2?.typeOfTranscript);
        setDisplayedFields(fields);

        // Xác định có cần hiện form nhập ảnh học bạ
        setShowSemester1Year10(fields.includes('semester1Year10'));
        setShowSemester2Year10(fields.includes('semester2Year10'));
        setShowFinalYear10(fields.includes('finalYear10'));
        setShowSemester1Year11(fields.includes('semester1Year11'));
        setShowSemester2Year11(fields.includes('semester2Year11'));
        setShowFinalYear11(fields.includes('finalYear11'));
        setShowSemester1Year12(fields.includes('semester1Year12'));
        setShowSemester2Year12(fields.includes('semester2Year12'));
        setShowFinalYear12(fields.includes('finalYear12'));
    }, [selectedAdmissionType1, selectedAdmissionType2, selectedMajor1, selectedMajor2, majors]);

    // Thông tin ưu tiên
    const [priorityData, setPriorityData] = useState([]);
    const [selectedPriority, setSelectedPriority] = useState('');
    const [priorityDocument, setPriorityDocument] = useState(null);
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
    const handleFileChangePriority = async (e) => {
        const file = e.target.files[0];
        setPriorityDocument(file);
        const folder = 'RegisterAdmission';
        try {
            const url = await uploadImage(file, folder);
            setFormData(prevData => ({
                ...prevData,
                imgpriority: url
            }));
        } catch (error) {
            console.error("Error uploading file: ", error);
        }
    };

    // Xử lý CCCD và bằng
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
        yearOfGraduation: 0,
        schoolName: "",
        recipientResults: true,
        permanentAddress: true,
        addressRecipientResults: "",
        imgCitizenIdentification1: "",
        imgCitizenIdentification2: "",
        imgDiplomaMajor1: "",
        imgDiplomaMajor2: "",
        imgpriority: "",
        imgAcademicTranscript1: "",
        imgAcademicTranscript2: "",
        imgAcademicTranscript3: "",
        imgAcademicTranscript4: "",
        imgAcademicTranscript5: "",
        imgAcademicTranscript6: "",
        imgAcademicTranscript7: "",
        imgAcademicTranscript8: "",
        imgAcademicTranscript9: "",
        typeOfDiplomaMajor1: 0,
        typeOfTranscriptMajor1: 0,
        typeOfDiplomaMajor2: 0,
        typeOfTranscriptMajor2: 0,
        priorityDetailPriorityID: 0,
        typeofStatusMajor1: 0,
        typeofStatusMajor2: 0,
        typeofStatusProfile: 0,
        academicTranscripts: [],
        campusName: "",
        priorityDetail: {
            priorityID: 0,
            priorityName: "",
            priorityDescription: "",
            typeOfPriority: 0
        },
        payFeeAdmission: {
            txnRef: "",
            amount: 0,
            bankCode: "",
            bankTranNo: "",
            cardType: "",
            orderInfo: "",
            payDate: "",
            responseCode: "",
            tmnCode: "",
            transactionNo: "",
            transactionStatus: "",
            secureHash: "",
            isFeeRegister: true
        }
    });
    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: type === "checkbox" ? checked : value
        }));
    };
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

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Dữ liệu gửi đi:", formData);
    };

    return (
        <div>
            <div className="background-overlay">
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
                    <div className="register-section d-flex justify-content-center align-items-center flex-column flex-md-row">
                        <h4 className="text-black mb-2 mb-md-0">Đăng ký tư vấn ngay tại đây</h4>
                        <a href="/dang-ky" className="text-white ms-md-3 fs-4">ĐĂNG KÝ TƯ VẤN!</a>
                    </div>
                </Row>
            </div>
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
                                    <option value="other">Khác</option>
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

                    <Row className="mt-3">
                        <Col md={4} className="mt-2">
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
                        <Col md={4} className="mt-2">
                            <Form.Group controlId="ciDate">
                                <Form.Label>Ngày cấp</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={formData.ciDate}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4} className="mt-2">
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

                        <Col md={3} xs={12} className="mb-3">
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

                    <h4 className='text-orange mt-4'>Thông tin đăng ký cơ sở</h4>
                    <div>
                        <Row className='mb-2'>
                            <Col md={6}>
                                <Form.Group controlId="campusId">
                                    <Form.Label>Cơ sở</Form.Label>
                                    <Form.Control as="select" className='w-50' value={selectedCampus} onChange={handleCampusChange}>
                                        <option value="">Chọn cơ sở</option>
                                        {campuses.map(campus => (
                                            <option key={campus.campusId} value={campus.campusId}>
                                                {campus.campusName}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
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
                            <Col md={3}>
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
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="major1" className='mb-2'>
                                    <Form.Label>Ngành học Nguyện vọng 1</Form.Label>
                                    <Form.Control as="select" value={selectedMajor1} onChange={handleMajorChange1}>
                                        <option value="">Chọn ngành</option>
                                        {majors.map(major => (
                                            <option key={major.majorID} value={major.majorID}>
                                                {major.majorName}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>

                                {typeAdmissions1.length > 0 && (
                                    <Form.Group controlId="typeOfDiplomaMajor1 " className='mb-2'>
                                        <Form.Label>Loại xét tuyển Nguyện vọng 1</Form.Label>
                                        <Form.Control as="select" value={selectedAdmissionType1 || ''} onChange={handleAdmissionTypeChange1}>
                                            <option value="">Chọn loại xét tuyển</option>
                                            {typeAdmissions1.map((admission, index) => (
                                                <option key={index} value={admission.typeDiploma}>
                                                    {TypeOfDiploma[admission.typeDiploma]}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                )}

                                {showSubjectSelection1 && (
                                    <div>
                                        <Form.Group controlId="subjectSelection1" className='mb-2'>
                                            <Form.Label>Khối xét tuyển Nguyện vọng 1</Form.Label>
                                            <Form.Control as="select">
                                                <option value="">Chọn khối</option>
                                                {subjectGroups1.map(subject => (
                                                    <option key={subject.subjectGroup} value={subject.subjectGroup}>
                                                        {subject.subjectGroupName}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                        </Form.Group>

                                        <Form.Group controlId="subjectScores1" className='mb-2'>
                                            <Form.Label>Nhập điểm 3 môn</Form.Label>
                                            <Row>
                                                <Col md={4}>
                                                    <Form.Control
                                                        className='mb-2'
                                                        type="number"
                                                        placeholder="Môn 1"
                                                        name="subject1"
                                                        value={scores1.subject1}
                                                        onChange={handleScoreChange1}

                                                    />
                                                </Col>
                                                <Col md={4}>
                                                    <Form.Control
                                                        className='mb-2'
                                                        type="number"
                                                        placeholder="Môn 2"
                                                        name="subject2"
                                                        value={scores1.subject2}
                                                        onChange={handleScoreChange1}
                                                    />

                                                </Col>
                                                <Col md={4}>
                                                    <Form.Control
                                                        className='mb-2'
                                                        type="number"
                                                        placeholder="Môn 3"
                                                        name="subject3"
                                                        value={scores1.subject3}
                                                        onChange={handleScoreChange1}
                                                    />
                                                </Col>
                                            </Row>
                                        </Form.Group>
                                    </div>
                                )}
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="majorSelection2" className='mb-2'>
                                    <Form.Label>Ngành học Nguyện vọng 2</Form.Label>
                                    <Form.Control as="select" value={selectedMajor2} onChange={handleMajorChange2}>
                                        <option value="">Chọn ngành</option>
                                        {majors.map(major => (
                                            <option key={major.majorID} value={major.majorID}>
                                                {major.majorName}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                {typeAdmissions2.length > 0 && (
                                    <Form.Group controlId="admissionTypeSelection2" className='mb-2'>
                                        <Form.Label>Loại xét tuyển Nguyện vọng 2</Form.Label>
                                        <Form.Control as="select" value={selectedAdmissionType2 || ''} onChange={handleAdmissionTypeChange2}>
                                            <option value="">Chọn loại xét tuyển</option>
                                            {typeAdmissions2.map((admission, index) => (
                                                <option key={index} value={admission.typeDiploma}>
                                                    {TypeOfDiploma[admission.typeDiploma]}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                )}

                                {showSubjectSelection2 && (
                                    <div>
                                        <Form.Group controlId="subjectSelection2" className='mb-2'>
                                            <Form.Label>Khối xét tuyển Nguyện vọng 2</Form.Label>
                                            <Form.Control as="select">
                                                <option value="">Chọn khối</option>
                                                {subjectGroups2.map(subject => (
                                                    <option key={subject.subjectGroup} value={subject.subjectGroup}>
                                                        {subject.subjectGroupName}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                        </Form.Group>

                                        <Form.Group controlId="subjectScores2" className='mb-2'>
                                            <Form.Label>Nhập điểm 3 môn</Form.Label>
                                            <Row>
                                                <Col md={4}>
                                                    <Form.Control
                                                        className='mb-2'
                                                        type="number"
                                                        placeholder="Môn 1"
                                                        name="subject1"
                                                        value={scores2.subject1}
                                                        onChange={handleScoreChange2}
                                                    />
                                                </Col>
                                                <Col md={4}>
                                                    <Form.Control
                                                        className='mb-2'
                                                        type="number"
                                                        placeholder="Môn 2"
                                                        name="subject2"
                                                        value={scores2.subject2}
                                                        onChange={handleScoreChange2}
                                                    />
                                                </Col>
                                                <Col md={4}>
                                                    <Form.Control
                                                        className='mb-2'
                                                        type="number"
                                                        placeholder="Môn 3"
                                                        name="subject3"
                                                        value={scores2.subject3}
                                                        onChange={handleScoreChange2}
                                                    />
                                                </Col>
                                            </Row>
                                        </Form.Group>
                                    </div>
                                )}
                            </Col>
                            <div className="score-input-container">
                                {displayedFields.includes('semester1Year10') && (
                                    <div className="score-input">
                                        <label>Điểm học kỳ 1 lớp 10</label>
                                        <input placeholder="Nhập điểm" />
                                    </div>
                                )}
                                {displayedFields.includes('semester2Year10') && (
                                    <div className="score-input">
                                        <label>Điểm học kỳ 2 lớp 10</label>
                                        <input placeholder="Nhập điểm" />
                                    </div>
                                )}
                                {displayedFields.includes('finalYear10') && (
                                    <div className="score-input">
                                        <label>Điểm cuối năm lớp 10</label>
                                        <input placeholder="Nhập điểm" />
                                    </div>
                                )}
                                {displayedFields.includes('semester1Year11') && (
                                    <div className="score-input">
                                        <label>Điểm học kỳ 1 lớp 11</label>
                                        <input placeholder="Nhập điểm" />
                                    </div>
                                )}
                                {displayedFields.includes('semester2Year11') && (
                                    <div className="score-input">
                                        <label>Điểm học kỳ 2 lớp 11</label>
                                        <input placeholder="Nhập điểm" />
                                    </div>
                                )}
                                {displayedFields.includes('finalYear11') && (
                                    <div className="score-input">
                                        <label>Điểm cuối năm lớp 11</label>
                                        <input placeholder="Nhập điểm" />
                                    </div>
                                )}
                                {displayedFields.includes('semester1Year12') && (
                                    <div className="score-input">
                                        <label>Điểm học kỳ 1 lớp 12</label>
                                        <input placeholder="Nhập điểm" />
                                    </div>
                                )}
                                {displayedFields.includes('semester2Year12') && (
                                    <div className="score-input">
                                        <label>Điểm học kỳ 2 lớp 12</label>
                                        <input placeholder="Nhập điểm" />
                                    </div>
                                )}
                                {displayedFields.includes('finalYear12') && (
                                    <div className="score-input">
                                        <label>Điểm cuối năm lớp 12</label>
                                        <input placeholder="Nhập điểm" />
                                    </div>
                                )}
                            </div>
                        </Row>
                    </div>
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
                        <Col md={6} className='mt-2'>
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
                                <Col md={6} className='mt-2'>
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
                                <Col md={6} className='mt-2'>
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

                        <Col md={6} className='mt-2'>
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
                        <Col md={12}>
                            <Form.Group>
                                <Row className="mt-2">
                                    {showSemester1Year10 && (
                                        <Col md={3} className="mt-2">
                                            <Form.Label>Ảnh học bạ học kỳ 1 lớp 10</Form.Label>
                                            <Form.Control type="file" accept="image/*" />
                                        </Col>
                                    )}
                                    {showSemester2Year10 && (
                                        <Col md={3} className="mt-2">
                                            <Form.Label>Ảnh học bạ học kỳ 2 lớp 10</Form.Label>
                                            <Form.Control type="file" accept="image/*" />
                                        </Col>
                                    )}
                                    {showFinalYear10 && (
                                        <Col md={3} className="mt-2">
                                            <Form.Label>Ảnh học bạ cuối năm lớp 10</Form.Label>
                                            <Form.Control type="file" accept="image/*" />
                                        </Col>
                                    )}
                                    {showSemester1Year11 && (
                                        <Col md={3} className="mt-2">
                                            <Form.Label>Ảnh học bạ học kỳ 1 lớp 11</Form.Label>
                                            <Form.Control type="file" accept="image/*" />
                                        </Col>
                                    )}
                                    {showSemester2Year11 && (
                                        <Col md={3} className="mt-2">
                                            <Form.Label>Ảnh học bạ học kỳ 2 lớp 11</Form.Label>
                                            <Form.Control type="file" accept="image/*" />
                                        </Col>
                                    )}
                                    {showFinalYear11 && (
                                        <Col md={3} className="mt-2">
                                            <Form.Label>Ảnh học bạ cuối năm lớp 11</Form.Label>
                                            <Form.Control type="file" accept="image/*" />
                                        </Col>
                                    )}
                                    {showSemester1Year12 && (
                                        <Col md={3} className="mt-2">
                                            <Form.Label>Ảnh học bạ học kỳ 1 lớp 12</Form.Label>
                                            <Form.Control type="file" accept="image/*" />
                                        </Col>
                                    )}
                                    {showSemester2Year12 && (
                                        <Col md={3} className="mt-2">
                                            <Form.Label>Ảnh học bạ học kỳ 2 lớp 12</Form.Label>
                                            <Form.Control type="file" accept="image/*" />
                                        </Col>
                                    )}
                                    {showFinalYear12 && (
                                        <Col md={3} className="mt-2">
                                            <Form.Label>Ảnh học bạ cuối năm lớp 12</Form.Label>
                                            <Form.Control type="file" accept="image/*" />
                                        </Col>
                                    )}
                                </Row>
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