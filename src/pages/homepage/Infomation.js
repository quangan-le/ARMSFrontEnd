import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, Col, Container, Row, Spinner, Table } from 'react-bootstrap';
import { Link, useOutletContext } from 'react-router-dom';
import api from '../../apiService';

const Information = () => {
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

    const { selectedCampus } = useOutletContext();
    const [majors, setMajors] = useState([]);
    const [admissionTimes, setAdmissionTimes] = useState([]);
    const [campuses, setCampuses] = useState([]);
    const [admissionInfo, setAdmissionInfo] = useState(null);
    const [priorityGroups, setPriorityGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAdmissionTimes = async () => {
            try {
                setLoading(true);
                const currentYear = new Date().getFullYear();
                const [admissionResponse, campusesResponse, priorityResponse, admissionInfoResponse, collegeResponse, vocationalResponse] = await Promise.all([
                    api.get(`/AdmissionTime/get-admission-time?CampusId=${selectedCampus.id}`),
                    api.get('/Campus/get-campuses'),
                    api.get('/Priority/get-priority'),
                    api.get(`/AdmissionInformation/get-admission-information?CampusId=${selectedCampus.id}`),
                    api.get(`/Major/get-majors-college?campus=${selectedCampus.id}`),
                    api.get(`/Major/get-majors-vocational-school?campus=${selectedCampus.id}`)
                ]);
                setAdmissionTimes(admissionResponse.data);
                setCampuses(campusesResponse.data);
                setPriorityGroups(priorityResponse.data);
                setAdmissionInfo(admissionInfoResponse.data);
                const collegeMajors = collegeResponse.data.map((major) => ({
                    ...major,
                    educationLevel: 'Cao đẳng',
                }));

                const vocationalMajors = vocationalResponse.data.map((major) => ({
                    ...major,
                    educationLevel: 'Trung cấp',
                }));

                setMajors([...collegeMajors, ...vocationalMajors]);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        if (selectedCampus.id) {
            fetchAdmissionTimes();
        }
    }, [selectedCampus]);

    return (
        <Container className="my-5">
            <h1 className="page-title" style={{ color: 'orange', textAlign: 'center' }}>Thông tin tuyển sinh</h1>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to="/">Trang chủ</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item active className='text-orange'>Thông tin tuyển sinh</Breadcrumb.Item>
            </Breadcrumb>
            <h4 className='text-orange mt-4'>I. Chuyên ngành đào tạo và học phí</h4>
            {loading && <Spinner animation="border" />}
            {error && <p className="text-danger">Lỗi: {error.message}</p>}
            {!loading && !error && (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Ngành học</th>
                            <th>Hệ đào tạo</th>
                            <th>Thời gian học</th>
                            <th>Mã ngành</th>
                            <th>Học phí</th>
                            <th>Hình thức xét tuyển</th>
                            <th>Khối xét tuyển</th>
                            <th>Xét điểm THPT</th>
                            <th>Xét học bạ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {majors.map((major, index) => (
                            <tr key={major.majorID}>
                                <td>{index + 1}</td>
                                <td>{major.majorName}</td>
                                <td>{major.educationLevel}</td>
                                <td>{major.timeStudy}</td>
                                <td>{major.majorCode}</td>
                                <td>{major.tuition.toLocaleString()} VND</td>
                                <td>
                                    {major.typeAdmissions.map((admission, idx) => (
                                        <div key={idx}>
                                            {getDiplomaName(admission.typeDiploma)}{" "}
                                            {admission.typeOfTranscript !== null && `- ${getTranscriptName(admission.typeOfTranscript)}`}
                                        </div>
                                    ))}
                                </td>
                                <td>
                                    {major.subjectGroupDTOs.map((subjectGroup, idx) => (
                                        <div key={idx}>
                                            {subjectGroup.subjectGroup}
                                        </div>
                                    ))}
                                </td>
                                <td>{major.totalScore != null ? major.totalScore + " điểm" : "N/A"}</td>
                                <td>{major.totalScoreAcademic != null ? major.totalScoreAcademic + " điểm" : "N/A"}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
            <h4 className='text-orange mt-4'>II. Lệ phí xét tuyển</h4>
            {admissionInfo ? (
                <>
                    <p className="mb-1">Lệ phí xét tuyển: <strong>{admissionInfo.feeRegister.toLocaleString()} VND</strong></p>
                    <p>Lệ phí nhập học: <strong>{admissionInfo.feeAdmission.toLocaleString()} VND</strong></p>
                </>
            ) : (
                <p>Không có dữ liệu lệ phí</p>
            )}

            <h4 className='text-orange mt-4'>III. Thông tin đợt tuyển sinh</h4>
            {loading && <Spinner animation="border" />}
            {error && <p className="text-danger">Lỗi: {error.message}</p>}
            {!loading && !error && (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Đợt</th>
                            <th>Thời gian bắt đầu</th>
                            <th>Thời gian kết thúc</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admissionTimes.map((admission, index) => (
                            <tr key={index + 1}>
                                <td className="text-center">{index + 1}</td>
                                <td>{admission.admissionInformationName || `Đợt ${index + 1}`}</td>
                                <td>{new Date(admission.startRegister).toLocaleDateString('en-GB')}</td>
                                <td>{new Date(admission.endRegister).toLocaleDateString('en-GB')}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            <h4 className='text-orange mt-4'>IV. Hồ sơ nhập học</h4>
            <p>{admissionInfo ? admissionInfo.admissionProfileDescription : "Không có dữ liệu hồ sơ nhập học"}</p>

            <h4 className='text-orange mt-4'>VI. Đối tượng ưu tiên</h4>
            {loading && <Spinner animation="border" />}
            {error && <p className="text-danger">Lỗi: {error.message}</p>}
            {!loading && !error && (
                <Row>
                    <Col md={6}>
                        <h5>Ưu tiên 1</h5>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Mô tả</th>
                                </tr>
                            </thead>
                            <tbody>
                                {priorityGroups
                                    .filter(priority => priority.typeOfPriority === 'Ưu tiên 1')
                                    .map((priority, index) => (
                                        <tr key={priority.priorityID}>
                                            <td className="text-center">{index + 1}</td>
                                            <td>{priority.priorityDescription}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </Table>
                    </Col>
                    <Col md={6}>
                        <h5>Ưu tiên 2</h5>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Mô tả</th>
                                </tr>
                            </thead>
                            <tbody>
                                {priorityGroups
                                    .filter(priority => priority.typeOfPriority === 'Ưu tiên 2')
                                    .map((priority, index) => (
                                        <tr key={priority.priorityID}>
                                            <td className="text-center">{index + 1}</td>
                                            <td>{priority.priorityDescription}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            )}
            <h4 className='text-orange mt-4'>VI. Cơ sở đào tạo</h4>
            {loading && <Spinner animation="border" />}
            {error && <p className="text-danger">Lỗi: {error.message}</p>}
            {!loading && !error && (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Cơ sở</th>
                            <th>Địa chỉ</th>
                            <th>Số điện thoại</th>
                        </tr>
                    </thead>
                    <tbody>
                        {campuses.map((campus, index) => (
                            <tr key={campus.campusId}>
                                <td className="text-center">{index + 1}</td>
                                <td>{campus.campusName}</td>
                                <td>{campus.address}</td>
                                <td>{campus.phoneNumber}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            <div className="mt-4 d-flex align-items-center">
                <h5 className="mb-0">Nộp hồ sơ đăng ký</h5>
                <Link to="/nop-ho-so" className="ms-2">
                    <Button variant="light" className="read-more-btn">Nộp hồ sơ ngay</Button>
                </Link>
            </div>
        </Container>
    );
};

export default Information;
