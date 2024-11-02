import React, { useEffect, useState } from 'react';
import { Container, Breadcrumb, Button, Table, Spinner, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import api from '../../apiService';

const Information = () => {
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
                    api.get(`/AdmissionTime/get-admission-time?CampusId=${selectedCampus.id}&year=${currentYear}`),
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
        <Container className="my-3">
            <Breadcrumb>
                <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
                <Breadcrumb.Item active className='text-orange'>Thông tin tuyển sinh</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="page-title" style={{ color: 'orange', textAlign: 'center' }}>Thông tin tuyển sinh</h1>
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
                            <th>Yêu cầu</th>
                            <th>Trung bình (Xét Học Bạ)</th>
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
                                <td>{major.tuition} VND</td>
                                <td>Tốt nghiệp THPT</td>
                                <td>{major.admissionDetailForMajors[0]?.totalScoreAcademic} điểm</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
            <h4 className='text-orange mt-4'>II. Lệ phí xét tuyển</h4>
            {admissionInfo ? (
                <>
                    <p className="mb-1">Lệ phí xét tuyển: <strong>{admissionInfo.feeRegister} VND</strong></p>
                    <p>Lệ phí nhập học: <strong>{admissionInfo.feeAdmission} VND</strong></p>
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
                            <tr key={admission.admissionTimeID}>
                                <td className="text-center">{index + 1}</td>
                                <td>{admission.admissionTimeName || `Đợt ${index + 1}`}</td>
                                <td>{new Date(admission.timeStart).toLocaleDateString()}</td>
                                <td>{new Date(admission.timeEnd).toLocaleDateString()}</td>
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
