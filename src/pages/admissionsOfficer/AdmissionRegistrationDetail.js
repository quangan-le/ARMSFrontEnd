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
    const [majorDetails, setMajorDetails] = useState(null);

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
    useEffect(() => {
        fetchApplicationData();
    }, [spId]);

    // Fetch major details
    useEffect(() => {
        const fetchMajorDetails = async () => {
            if (!applicationData) return;

            try {
                const majorResponse = await api.get(
                    `/admin-officer/Major/get-major-details?MajorId=${applicationData.major}`
                );
                setMajorDetails({
                    major: majorResponse.data,
                });
            } catch (error) {
                console.error("Lỗi lấy chi tiết ngành:", error);
            }
        };

        fetchMajorDetails();
    }, [applicationData]);

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

    const getSubjects = () => {
        if (!applicationData?.academicTranscripts) {
            return [];
        }

        return applicationData.academicTranscripts
            .filter((item) => item.typeOfAcademicTranscript < 3) // Lấy 3 môn đầu tiên
            .map((item) => ({
                name: item.subjectName,
                baseIndex: item.typeOfAcademicTranscript,
            }));
    };

    const renderTable = (typeOfTranscriptMajor) => {
        // Lấy danh sách môn học
        const subjects = getSubjects();

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
                                const transcript = applicationData.academicTranscripts.find(
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

    const [bonusPoint, setBonusPoint] = useState(null); // State lưu điểm ưu tiên

    useEffect(() => {
        const fetchPriorityBonusPoint = async () => {
            if (!applicationData?.priorityDetailPriorityID) return;

            try {
                const response = await api.get('/Priority/get-priority');
                const priorityList = response.data;

                const priority = priorityList.find(
                    (p) => p.priorityID === applicationData.priorityDetailPriorityID
                );

                if (priority) {
                    setBonusPoint(priority.bonusPoint);
                } else {
                    setBonusPoint(null);
                }
            } catch (error) {
                console.error('Lỗi khi gọi API Priority:', error);
                setBonusPoint(null);
            }
        };

        fetchPriorityBonusPoint();
    }, [applicationData?.priorityDetailPriorityID]);

    const calculateAverageScores = (typeOfDiplomaMajor) => {
        if (!applicationData?.academicTranscripts) {
            return { averageScores: {}, totalAverageScore: 0 }; // Trả về mặc định
        }

        if (typeOfDiplomaMajor === 5) {
            // Xét điểm THPT
            const subjects = applicationData.academicTranscripts;

            const averageScores = {};
            subjects.forEach((item) => {
                averageScores[item.subjectName] = item.subjectPoint;
            });

            // Tính tổng điểm
            let totalAverageScore = Object.values(averageScores).reduce(
                (sum, point) => sum + point,
                0
            );
            //Cộng điểm ưu tiên (nếu có)
            if (bonusPoint !== null) {
                totalAverageScore += bonusPoint;
            }

            return { averageScores, totalAverageScore: totalAverageScore.toFixed(2) };
        } else {
            // Xét học bạ (typeOfDiplomaMajor == 3)
            const subjects = applicationData.academicTranscripts;

            // Tạo một object để lưu điểm của từng môn
            const scoresBySubject = {};
            subjects.forEach((item) => {
                if (!scoresBySubject[item.subjectName]) {
                    scoresBySubject[item.subjectName] = [];
                }
                scoresBySubject[item.subjectName].push(item.subjectPoint);
            });

            // Tính điểm trung bình của từng môn
            const averageScores = {};
            for (const [subject, scores] of Object.entries(scoresBySubject)) {
                const total = scores.reduce((sum, score) => sum + score, 0);
                averageScores[subject] = (total / scores.length).toFixed(2); // Lấy 2 số thập phân
            }

            // Tính tổng điểm trung bình xét tuyển
            let totalAverageScore = Object.values(averageScores).reduce(
                (sum, avg) => sum + parseFloat(avg),
                0
            );
            // Cộng điểm ưu tiên (nếu có)
            if (bonusPoint !== null) {
                totalAverageScore += bonusPoint;
            }
            return { averageScores, totalAverageScore: totalAverageScore.toFixed(2) };
        }
    };

    const majorResults = calculateAverageScores(applicationData?.typeOfDiplomaMajor ?? null);

    const getHeaderTitle = (typeOfDiplomaMajor) => {
        return typeOfDiplomaMajor === 5 ? "Điểm" : "Điểm trung bình";
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

    const [admissionTimeName, setAdmissionTimeName] = useState(""); // Lưu tên đợt xét tuyển
    const fetchAdmissionTime = async (aiId) => {
        try {
            const response = await api.get(`/AdmissionTime/get-admission-time/${aiId}`);
            if (response.data) {
                setAdmissionTimeName(response.data.admissionTimeName);
            }
        } catch (error) {
            console.error("Error fetching admission time:", error);
            setAdmissionTimeName("Thông tin đợt xét tuyển không có sẵn");
        }
    };
    useEffect(() => {
        if (applicationData?.aiId) {
            fetchAdmissionTime(applicationData.aiId);
        }
    }, [applicationData?.aiId]);
    // Duyệt, từ chối
    const handleUpdateStatus = async (typeofStatusProfile, typeofStatusMajor) => {
        try {
            if (typeofStatusProfile === 1) {
                const payload = {
                    spId: applicationData.spId,
                    typeofStatusProfile,
                };
                await api.put('/admin-officer/RegisterAdmission/update-student-register-status', payload);
                toast.success("Duyệt hồ sơ thành công!");
            }
            // Tạo payload cho trường hợp từ chối hồ sơ 
            else if (typeofStatusMajor === 0) {
                const payload = {
                    spId: applicationData.spId,
                    typeofStatusMajor1: typeofStatusMajor,
                };
                await api.put('/admin-officer/RegisterAdmission/update-student-register-status', payload);
                toast.success("Từ chối hồ sơ thành công!");
            }
            fetchApplicationData();

        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái hồ sơ:", error);
            toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
        }
    };
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

                                <Col xs={12} md={6}>
                                    {applicationData.typeOfDiplomaMajor === 3 &&
                                        applicationData.typeOfTranscriptMajor !== undefined && (
                                            <>
                                                <h6>Bảng điểm xét nguyện vọng</h6>
                                                {renderTable(applicationData.typeOfTranscriptMajor)}
                                            </>
                                        )}
                                </Col>
                                <Col xs={12} md={6}>
                                    {(applicationData.typeOfDiplomaMajor === 3 || applicationData.typeOfDiplomaMajor === 5) && (
                                        <>
                                            <h6>Tổng điểm xét tuyển</h6>
                                            <table className="table table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>Môn học</th>
                                                        <th>{getHeaderTitle(applicationData.typeOfDiplomaMajor)}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {Object.entries(majorResults.averageScores).map(([subject, avg], index) => (
                                                        <tr key={index}>
                                                            <td>{subject}</td>
                                                            <td>{avg}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot>
                                                    {applicationData.priorityDetailPriorityID && (
                                                        <tr>
                                                            <td><strong>Điểm ưu tiên</strong></td>
                                                            <td>{bonusPoint !== null ? bonusPoint : 'Không có điểm ưu tiên'}</td>
                                                        </tr>
                                                    )}
                                                    <tr>
                                                        <td><strong>Tổng điểm xét tuyển</strong></td>
                                                        <td>{majorResults.totalAverageScore}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Điểm chuẩn</strong></td>
                                                        <td>
                                                            {majorDetails?.major && (
                                                                applicationData.typeOfDiplomaMajor === 5
                                                                    ? majorDetails.major.totalScore
                                                                    : majorDetails.major.totalScoreAcademic
                                                            )}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Kết quả</strong></td>
                                                        <td>
                                                            {majorDetails?.major && (
                                                                parseFloat(majorResults.totalAverageScore) >=
                                                                    (applicationData.typeOfDiplomaMajor === 5
                                                                        ? majorDetails.major.totalScore
                                                                        : majorDetails.major.totalScoreAcademic)
                                                                    ? "Đạt"
                                                                    : "Không đạt"
                                                            )}
                                                        </td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </>
                                    )}
                                </Col>
                                <span className="label my-2">Giấy tờ xác thực hồ sơ đăng ký</span>
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
                                                <img src={applicationData.imgDiplomaMajor} alt="Bằng xét tuyển" className="img-fluid" />
                                            </div>
                                            <p className="image-title text-center mt-2">Bằng xét tuyển</p>
                                        </Col>
                                    )}

                                    {applicationData.imgAcademicTranscript1 && showSemester1Year10 && (
                                        <Col xs={6} sm={4} md={3} className="mb-2">
                                            <div className="image-container">
                                                <img
                                                    src={applicationData.imgAcademicTranscript1}
                                                    alt={(applicationData.typeOfDiplomaMajor === 4 || applicationData.typeOfDiplomaMajor === null)
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
                                <h4 className='text-orange mt-2'>Thông tin xét tuyển</h4>

                                <Col xs={12} md={6}>
                                    <div className="info-item">
                                        <span className="label">Cơ sở nhập học</span>
                                        <span className="value">{applicationData.campusName}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Nguyện vọng</span>
                                        <span className="value">{applicationData.majorName}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Trạng thái hồ sơ</span>
                                        <span className="value">
                                            {applicationData.typeofStatusProfile === null
                                                ? "Chờ xét duyệt"
                                                : applicationData.typeofStatusProfile === 7
                                                    ? "Chờ thanh toán phí xét tuyển"
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
                                        <span className="label me-3 text-nowrap">Đợt xét tuyển</span>
                                        <span className="value">{admissionTimeName || "Đang tải..."}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label me-3 text-nowrap">Hình thức xét tuyển</span>
                                        <span className="value">
                                            {getDiplomaName(applicationData.typeOfDiplomaMajor)}{" "}
                                            {applicationData.typeOfTranscriptMajor !== null &&
                                                getTranscriptName(applicationData.typeOfTranscriptMajor) ?
                                                `- ${getTranscriptName(applicationData.typeOfTranscriptMajor)}` : ""}
                                        </span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label me-3 text-nowrap">Trạng thái xét duyệt</span>
                                        <span className="value">
                                            {applicationData.typeofStatusMajor === null
                                                ? ""
                                                : applicationData.typeofStatusMajor === 0
                                                    ? "Từ chối"
                                                    : applicationData.typeofStatusMajor === 1
                                                        ? "Đã duyệt"
                                                        : applicationData.typeofStatusMajor === 2
                                                            ? "Đang xử lý"
                                                            : applicationData.typeofStatusMajor === 3
                                                                ? "N/A"
                                                                : ""}
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
                                {applicationData?.typeofStatusProfile === 0 && (
                                    <>
                                        {/* <Button
                                            variant="light"
                                            onClick={() =>
                                                navigate(`/admissions-officer/chinh-sua-ho-so/${applicationData.spId}`)
                                            }
                                            className="bg-orange text-white mx-2"
                                        >
                                            Chỉnh sửa
                                        </Button> */}

                                        {majorDetails?.major && (
                                            <>
                                                {(
                                                    (applicationData.typeOfDiplomaMajor === 3 || applicationData.typeOfDiplomaMajor === 5) &&
                                                    majorResults.totalAverageScore >=
                                                    (applicationData.typeOfDiplomaMajor === 5
                                                        ? majorDetails.major.totalScore
                                                        : majorDetails.major.totalScoreAcademic)
                                                ) ||
                                                    // Các loại diploma khác không cần xét điểm
                                                    (![3, 5].includes(applicationData.typeOfDiplomaMajor)) ? (
                                                    <Button
                                                        variant="success"
                                                        className="mx-2"
                                                        onClick={() => handleUpdateStatus(1)}
                                                    >
                                                        Duyệt hồ sơ
                                                    </Button>
                                                ) : null}

                                                <Button
                                                    variant="danger"
                                                    className="mx-2"
                                                    onClick={() => handleUpdateStatus(null, 0)}
                                                >
                                                    Từ chối hồ sơ
                                                </Button>
                                            </>
                                        )}
                                    </>
                                )}
                            </Col>
                        </Card.Body>
                    </Card>
                </div>
            )
            }
        </Container >
    );
};

export default AdmissionRegistrationDetail;
