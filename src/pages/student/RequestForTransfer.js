import React, { useState, useEffect } from 'react';
import { Container, Breadcrumb, Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import api from "../../apiService.js";
import { useOutletContext } from 'react-router-dom';
import { Link } from "react-router-dom";

const RequestForTransfer = () => {
    const { selectedCampus } = useOutletContext();
    const campusId = selectedCampus.id;

    // Lấy ngành học
    const [vocationalMajors, setVocationalMajors] = useState([]);
    const [collegeMajors, setCollegeMajors] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            if (campusId) {
                try {
                    const [vocationalResponse, collegeResponse] = await Promise.all([
                        api.get(`/Major/get-majors-vocational-school?campus=${campusId}`),
                        api.get(`/Major/get-majors-college?campus=${campusId}`),
                    ]);

                    setVocationalMajors(vocationalResponse.data);
                    setCollegeMajors(collegeResponse.data);
                } catch (error) {
                    console.error("Có lỗi khi lấy dữ liệu:", error);
                }
            }
        };
        fetchData();
    }, [campusId]);

    const [show, setShow] = useState(false); // Quản lý trạng thái hiển thị modal

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // State để lưu thông tin form
    const [formData, setFormData] = useState({
        fullName: "Quang An",
        major: "Công nghệ thông tin",
        specialization: "Kỹ thuật phần mềm",
        transferMajor: "",
        file: null,
        reason: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, file: e.target.files[0] });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        handleClose();
    };

    const requests = [
        {
            id: 1,
            content: "Em muốn chuyển sang ngành Công nghệ thông tin",
            fileName: "Chuyennganh.docx",
            createdAt: "01/10/2024",
            status: "Từ chối"
        },
        {
            id: 2,
            content: "Em muốn chuyển sang ngành Công nghệ thông tin",
            fileName: "Chuyennganh.docx",
            createdAt: "01/10/2024",
            status: "Chấp nhận"
        },
        {
            id: 3,
            content: "Em muốn chuyển sang ngành Công nghệ thông tin",
            fileName: "Chuyennganh.docx",
            createdAt: "01/10/2024",
            status: "Đang đợi"
        }
    ];

    return (
        <Container className='my-5'>
            <h1 className="page-title" style={{ color: 'orange', textAlign: 'center' }}>Yêu cầu chuyển ngành</h1>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to="/">Trang chủ</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item active className="text-orange">Yêu cầu chuyển ngành</Breadcrumb.Item>
            </Breadcrumb>
            <div className="text-end mb-3">
                <Button variant="warning" onClick={handleShow}>
                    Tạo đơn
                </Button>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên ngành cũ</th>
                        <th>Tên ngành mới</th>
                        <th>Nội dung yêu cầu</th>
                        <th>Đơn yêu cầu</th>
                        <th>Phản hồi</th>
                        <th>Trạng thái đơn</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((request, index) => (
                        <tr key={request.id}>
                            <td>{index + 1}</td>
                            <td>Công nghệ thông tin</td>
                            <td>Công nghệ thông tin</td>
                            <td>{request.content}</td>
                            <td>{request.fileName}</td>
                            <td>Đồng ý</td>
                            <td style={{ color: request.status === 'Chấp nhận' ? 'green' : request.status === 'Từ chối' ? 'red' : 'orange' }}>
                                {request.status}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Modal show={show} onHide={handleClose} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title className="w-100 text-center" style={{ color: 'orange' }}>
                        Tạo đơn chuyển ngành
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Col md={3}>
                                <Form.Label>Họ và tên</Form.Label>
                            </Col>
                            <Col md={9}>
                                <div>{formData.fullName}</div>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col md={3}>
                                <Form.Label>Ngành học</Form.Label>
                            </Col>
                            <Col md={9}>
                                <div>{formData.major}</div>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col md={3}>
                                <Form.Label>Chuyên ngành</Form.Label>
                            </Col>
                            <Col md={9}>
                                <div>{formData.specialization}</div>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col md={3}>
                                <Form.Label>Ngành học chuyển</Form.Label>
                            </Col>
                            <Col md={4}>
                                <Form.Control as="select" name="transferMajor" value={formData.transferMajor} onChange={handleChange} required>
                                    <option value="">Ngành</option>
                                    <option value="Ngành A">Ngành A</option>
                                    <option value="Ngành B">Ngành B</option>
                                    <option value="Ngành C">Ngành C</option>
                                </Form.Control>
                            </Col>
                            <Col md={5}>
                                <Form.Control as="select" name="transferCourse" value={formData.transferCourse} onChange={handleChange} required>
                                    <option value="">Chuyên ngành</option>
                                    <option value="Chuyên ngành 1">Chuyên ngành 1</option>
                                    <option value="Chuyên ngành 2">Chuyên ngành 2</option>
                                    <option value="Chuyên ngành 3">Chuyên ngành 3</option>
                                </Form.Control>
                            </Col>
                            {/* <Form.Group className="mb-3">
                                <Form.Label>Ngành mới</Form.Label>
                                <Form.Select
                                    value={newMajorID}
                                    onChange={(e) => setNewMajorID(e.target.value)}
                                >
                                    <option value="">Chọn ngành mới</option>
                                    {collegeMajors.length > 0 && (
                                        <optgroup label="Ngành học Cao đẳng">
                                            {collegeMajors.map((major) => (
                                                <option key={major.majorID} value={major.majorID}>
                                                    {major.majorName}
                                                </option>
                                            ))}
                                        </optgroup>
                                    )}

                                    {vocationalMajors.length > 0 && (
                                        <optgroup label="Ngành học Trung cấp">
                                            {vocationalMajors.map((major) => (
                                                <option key={major.majorID} value={major.majorID}>
                                                    {major.majorName}
                                                </option>
                                            ))}
                                        </optgroup>
                                    )}
                                </Form.Select>
                            </Form.Group> */}
                        </Row>
                        <Row className="mb-3">
                            <Col md={3}>
                                <Form.Label>Đơn xin chuyển ngành</Form.Label>
                            </Col>
                            <Col md={9}>
                                <Form.Control type="file" onChange={handleFileChange} required />
                            </Col>
                        </Row>
                        <Row className="mb-1">
                            <Col md={3}>
                                <Form.Label>Lý do</Form.Label>
                            </Col>
                            <Col md={9}>
                                <Form.Control as="textarea" rows={3} name="reason" value={formData.reason} onChange={handleChange} placeholder="Lý do chuyển ngành" required />
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col md={{ span: 9, offset: 3 }} className='d-flex'>
                                <div className='me-2'> Download đơn chuyển ngành</div>
                                <a href="/" style={{ textDecoration: 'underline', color: 'blue' }}>
                                    Tại đây
                                </a>
                            </Col>
                        </Row>
                        <Form.Group as={Row} className="mb-2 text-center">
                            <Col md={12}>
                                <Button variant="warning" type="submit" >
                                    Gửi đơn
                                </Button>
                            </Col>
                        </Form.Group>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default RequestForTransfer;