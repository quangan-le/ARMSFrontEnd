import React from 'react';
import { Container, Row, Col, Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const EnrollmentPlan = () => {
    const enrollmentData = [
        { stt: 1, major: 'Công nghệ thông tin', specialization: 'Lập trình mobile', code: '5580102', target: 130 },
        { stt: 2, major: 'Công nghệ thông tin', specialization: 'Lập trình web', code: '5580102', target: 130 },
        { stt: 3, major: 'Công nghệ thông tin', specialization: 'Lập trình game', code: '5580102', target: 130 },
        { stt: 4, major: 'Quản trị kinh doanh', specialization: 'Quản trị khách sạn', code: '5580102', target: 130 },
        { stt: 5, major: 'Quản trị kinh doanh', specialization: 'Marketing', code: '5580102', target: 130 },
        { stt: 6, major: 'Thẩm mỹ và làm đẹp', specialization: 'Phun xăm làm đẹp', code: '5580102', target: 130 },
        { stt: 7, major: 'Thẩm mỹ và làm đẹp', specialization: 'Chăm sóc da', code: '5580102', target: 130 }
    ];

    const timelineData = [
        { stt: 1, phase: 'Đợt 1', start: '12/12/2024', end: '12/12/2024' },
        { stt: 2, phase: 'Đợt 2', start: '12/12/2024', end: '12/12/2024' },
        { stt: 3, phase: 'Đợt 3', start: '12/12/2024', end: '12/12/2024' }
    ];

    return (
        <Container>
            <h2 className="text-center">Kế hoạch tuyển sinh</h2>
            <p className="text-center mb-4 fw-bold">Kế hoạch tuyển sinh của campus</p>

            <h5 className='text-orange'>I. Chỉ tiêu tuyển sinh</h5>
            <p>Số lượng tuyển sinh: 2800 chỉ tiêu</p>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên ngành</th>
                        <th>Chuyên ngành</th>
                        <th>Mã ngành</th>
                        <th>Chỉ tiêu</th>
                    </tr>
                </thead>
                <tbody>
                    {enrollmentData.map((item, index) => (
                        <tr key={index}>
                            <td>{item.stt}</td>
                            <td>{item.major}</td>
                            <td>{item.specialization}</td>
                            <td>{item.code}</td>
                            <td>{item.target}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <h5 className='text-orange'>II. Đối tượng tuyển sinh </h5>
            <p>
                - Học sinh tốt nghiệp THCS trở lên đủ điều kiện nhập học ngay. <br />
                - Tốt nghiệp THCS, học bổ túc 10/11/12 – học 2 năm. <br />
                - Tốt nghiệp THPT hoặc bổ túc THPT – học 1 năm đến 1.5 năm.
            </p>
            <h5 className='text-orange'>III. Hình thức tư vấn tuyển sinh</h5>
            <h5 className='text-orange'>IV. Nội dung</h5>




            <h5 className='text-orange'>V. Thời gian</h5>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Đợt</th>
                        <th>Từ</th>
                        <th>Đến</th>
                    </tr>
                </thead>
                <tbody>
                    {timelineData.map((item, index) => (
                        <tr key={index}>
                            <td>{item.stt}</td>
                            <td>{item.phase}</td>
                            <td>{item.start}</td>
                            <td>{item.end}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <h5 className='text-orange'>VI. Hồ sơ xét tuyển</h5>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
            <h5 className='text-orange'>VII. Hình thức xét tuyển</h5>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
            <h5 className='text-orange'>VIII. Tổ chức thực hiện</h5>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
            <div className="d-flex justify-content-end">
                <Button className="btn-orange mb-3" as={Link} to={`/chinh-sua-ke-hoach-tuyen-sinh`}>Chỉnh sửa</Button>
            </div>
        </Container>
    );
};

export default EnrollmentPlan;
