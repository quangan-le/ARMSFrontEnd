import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useState, useEffect } from '../hooks/Hooks.js';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import api from '../../apiService';

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
    const [specializations1, setSpecializations1] = useState([]);
    const [specializations2, setSpecializations2] = useState([]);

    // Khi người dùng chọn cơ sở, cập nhật ngành học
    const handleCampusChange = async (e) => {
        const campusId = e.target.value;
        setSelectedCampus(campusId);
        setSelectedMajor1('');
        setSelectedMajor2('');
        setSpecializations1([]);
        setSpecializations2([]);
        console.log(campusId);
        if (campusId) {
            try {
                const response = await api.get(`/Major/get-majors-college?campus=${campusId}`);
                setMajors(response.data);
                console.log(response.data);
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
        setSpecializations1(selectedMajor ? selectedMajor.specializeMajorDTOs : []);
    };

    // Khi người dùng chọn ngành cho nguyện vọng 2
    const handleMajorChange2 = (e) => {
        const selectedMajorId = e.target.value;
        setSelectedMajor2(selectedMajorId);
        const selectedMajor = majors.find((major) => major.majorID === selectedMajorId);
        setSpecializations2(selectedMajor ? selectedMajor.specializeMajorDTOs : []);
    };

    // Xử lý CCCD và bằng
    const [showOtherAddress, setShowOtherAddress] = useState(false);
    const [frontCCCD, setFrontCCCD] = useState(null);
    const [backCCCD, setBackCCCD] = useState(null);
    const [graduationCertificate, setGraduationCertificate] = useState(null);
    const [degreeType, setDegreeType] = useState('');

    const handleFileChange = (e, setFile) => {
        const file = e.target.files[0];
        if (file) {
            setFile(URL.createObjectURL(file));
        }
    };
    const handleDegreeChange = (e) => {
        setDegreeType(e.target.value);
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
                <Form>
                    <h4 className='text-orange'>Thông tin thí sinh</h4>
                    <Row>
                        <Col md={3} className="mt-2">
                            <Form.Group controlId="fullName">
                                <Form.Label>Họ và tên</Form.Label>
                                <Form.Control type="text" placeholder="Nhập họ và tên" />
                            </Form.Group>
                        </Col>
                        <Col md={3} className="mt-2">
                            <Form.Group controlId="dob">
                                <Form.Label>Ngày sinh</Form.Label>
                                <Form.Control type="date" />
                            </Form.Group>
                        </Col>
                        <Col md={3} className="mt-2">
                            <Form.Group controlId="gender">
                                <Form.Label>Giới tính</Form.Label>
                                <Form.Control as="select">
                                    <option>Nam</option>
                                    <option>Nữ</option>
                                    <option>Khác</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={3} className="mt-2">
                            <Form.Group >
                                <Form.Label>Dân tộc</Form.Label>
                                <Form.Control type="text" placeholder="Nhập dân tộc" />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mt-3">
                        <Col md={4} className="mt-2">
                            <Form.Group controlId="idNumber">
                                <Form.Label>Số CMND/CCCD</Form.Label>
                                <Form.Control type="text" placeholder="Nhập số CMND/CCCD" />
                            </Form.Group>
                        </Col>
                        <Col md={4} className="mt-2">
                            <Form.Group controlId="issueDate">
                                <Form.Label>Ngày cấp</Form.Label>
                                <Form.Control type="date" />
                            </Form.Group>
                        </Col>
                        <Col md={4} className="mt-2">
                            <Form.Group controlId="issuingAuthority">
                                <Form.Label>Nơi cấp</Form.Label>
                                <Form.Control type="text" placeholder="Nhập nơi cấp" />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mt-3">
                        <Form.Label>Nơi thường trú</Form.Label>
                        <Col md={3} xs={12} className="mb-3">
                            <Form.Group controlId="province">
                                <Form.Control
                                    as="select"
                                    onChange={(e) => setSelectedProvince(e.target.value)}
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
                                    onChange={(e) => setSelectedDistrict(e.target.value)}
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
                                <Form.Control as="select" disabled={!selectedDistrict}>
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
                            <Form.Group controlId="houseNumber">
                                <Form.Control type="text" placeholder="Nhập số nhà, đường, ngõ..." />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={3} className="mt-2">
                            <Form.Group controlId="phoneNumber">
                                <Form.Label>Số điện thoại thí sinh</Form.Label>
                                <Form.Control type="text" placeholder="Nhập số điện thoại" />
                            </Form.Group>
                        </Col>
                        <Col md={3} className="mt-2">
                            <Form.Group controlId="email">
                                <Form.Label>Email thí sinh</Form.Label>
                                <Form.Control type="email" placeholder="Nhập email" />
                            </Form.Group>
                        </Col>
                        <Col md={3} className="mt-2">
                            <Form.Group controlId="parentName">
                                <Form.Label>Họ và tên phụ huynh</Form.Label>
                                <Form.Control type="text" placeholder="Nhập họ và tên phụ huynh" />
                            </Form.Group>
                        </Col>
                        <Col md={3} className="mt-2">
                            <Form.Group controlId="parentPhoneNumber">
                                <Form.Label>Số điện thoại phụ huynh</Form.Label>
                                <Form.Control type="text" placeholder="Nhập số điện thoại phụ huynh" />
                            </Form.Group>
                        </Col>
                    </Row>

                    <h4 className='text-orange mt-4'>Thông tin đăng ký cơ sở</h4>
                    <Row className="mt-3">
                        <Col md={6}>
                            <Form.Group controlId="campusSelection">
                                <Form.Label>Cơ sở nhập học</Form.Label>
                                <Form.Control as="select" onChange={handleCampusChange} value={selectedCampus}>
                                    <option value="">Chọn cơ sở</option>
                                    {campuses.map(campus => (
                                        <option key={campus.campusId} value={campus.campusId}>
                                            {campus.campusName}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>

                            <Row className="mt-3">
                                <Col md={6}>
                                    <Form.Group controlId="majorSelection1">
                                        <Form.Label>Nguyện vọng 1</Form.Label>
                                        <Form.Control as="select" disabled={!selectedCampus} onChange={handleMajorChange1} value={selectedMajor1}>
                                            <option value="">Chọn ngành</option>
                                            {majors.map(major => (
                                                <option key={major.majorID} value={major.majorID}>
                                                    {major.majorName}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="majorSelection2">
                                        <Form.Label>Nguyện vọng 2</Form.Label>
                                        <Form.Control as="select" disabled={!selectedCampus} onChange={handleMajorChange2} value={selectedMajor2}>
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

                            <Row className="mt-3">
                                <Col md={6}>
                                    <Form.Group controlId="graduationYear">
                                        <Form.Label>Năm tốt nghiệp</Form.Label>
                                        <Form.Control type="text" placeholder="2024" />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="schoolName">
                                        <Form.Label>Tên trường</Form.Label>
                                        <Form.Control type="text" placeholder="Trường THCS A" />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Col>

                        <Col md={6}>
                            <Form.Group controlId="degreeType" className='ms-md-5 mt-2'>
                                <Form.Label>Chọn loại bằng</Form.Label>
                                <Form.Check
                                    type="radio"
                                    label="Tốt nghiệp THCS"
                                    name="degreeType"
                                    value="thcs"
                                    onChange={handleDegreeChange}
                                    checked={degreeType === 'thcs'}
                                />
                                <Form.Check
                                    type="radio"
                                    label="Tốt nghiệp Trung cấp loại giỏi"
                                    name="degreeType"
                                    value="trung-cap"
                                    onChange={handleDegreeChange}
                                    checked={degreeType === 'trung-cap'}
                                />
                                <Form.Check
                                    type="radio"
                                    label="Tốt nghiệp THPT hoặc bổ túc"
                                    name="degreeType"
                                    value="thpt"
                                    onChange={handleDegreeChange}
                                    checked={degreeType === 'thpt'}
                                />
                                <Form.Check
                                    type="radio"
                                    label="Tốt nghiệp ĐH-CD-TC"
                                    name="degreeType"
                                    value="dh-cd"
                                    onChange={handleDegreeChange}
                                    checked={degreeType === 'dh-cd'}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
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
                        {degreeType === 'thpt' && (
                            <Col md={12} >
                                <Form.Group>
                                    <Row className='mt-2'>
                                        <Col md={3} className='mt-2'>
                                            <Form.Label>Học bạ kỳ 1 lớp 10</Form.Label>
                                            <Form.Control type="file" accept="image/*" />
                                        </Col>
                                        <Col md={3} className='mt-2'>
                                            <Form.Label>Học bạ kỳ 2 lớp 10</Form.Label>
                                            <Form.Control type="file" accept="image/*" />
                                        </Col>
                                        <Col md={3} className='mt-2'>
                                            <Form.Label>Học bạ kỳ 1 lớp 11</Form.Label>
                                            <Form.Control type="file" accept="image/*" />
                                        </Col>
                                        <Col md={3} className='mt-2'>
                                            <Form.Label>Học bạ kỳ 2 lớp 11</Form.Label>
                                            <Form.Control type="file" accept="image/*" />
                                        </Col>
                                        <Col md={3} className='mt-3'>
                                            <Form.Label>Học bạ kỳ 1 lớp 12</Form.Label>
                                            <Form.Control type="file" accept="image/*" />
                                        </Col>
                                    </Row>
                                </Form.Group>
                            </Col>
                        )}
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