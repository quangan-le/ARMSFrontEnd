import React, { useEffect, useState } from 'react';
import { Container, Breadcrumb, Button, Table, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import api from '../../apiService';

const Information = () => {
    const { selectedCampus } = useOutletContext();
    const [admissionTimes, setAdmissionTimes] = useState([]);
    const [campuses, setCampuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAdmissionTimes = async () => {
            try {
                setLoading(true);
                const currentYear = new Date().getFullYear();
                const [admissionResponse, campusesResponse] = await Promise.all([
                    api.get(`/AdmissionTime/get-admission-time?CampusId=${selectedCampus.id}&year=${currentYear}`),
                    api.get('/Campus/get-campuses')
                ]);
                setAdmissionTimes(admissionResponse.data);
                setCampuses(campusesResponse.data);
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
            <h4 className='text-orange mt-4'>I. Chuyên ngành đạo tạo và học phí</h4>
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
                        <th>Trung bình(Xét Học Bạ)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>Công nghệ thông tin</td>
                        <td>Cao đẳng</td>
                        <td>18 tháng</td>
                        <td>IT</td>
                        <td>23tr</td>
                        <td>Tốt nghiệp THPT</td>
                        <td>22 điểm</td>
                    </tr>
                </tbody>
            </Table>
            <h4 className='text-orange mt-4'>II. Lệ phí xét tuyển</h4>
            <p>Lệ phí xét tuyển các chuyên ngành tại trường được áp dụng chung với phí 1.000.000 VND</p>

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
            <ul>
                <li>01 Bản sao bằng cấp</li>
                <li>02 Ảnh 3x4</li>
                <li>01 Bản đơn xin nhập học</li>
                <li>01 Giấy xác nhận thông tin cư trú</li>
                <li>01 Bản sao bảng điểm (nếu xét học bạ)</li>
            </ul>
            <h4 className='text-orange mt-4'>V. Cơ sở đào tạo</h4>
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
