import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Modal, Row, Table } from "react-bootstrap";
import { useOutletContext } from 'react-router-dom';
import api from "../../apiService.js";

const MajorsList = () => {
    const [majors, setMajors] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const { campusId } = useOutletContext();

    // Gọi API để lấy danh sách các majors theo điều kiện tìm kiếm
    const fetchMajors = async () => {
        try {
            if (campusId) {
                const response = await api.get(`/admin/Major/get-majors`, {
                    params: {
                        campus: campusId
                    },
                });
                 setMajors(response.data);
            }
        } catch (error) {
            console.error("Có lỗi xảy ra khi lấy danh sách ngành học:", error);
        }
    };
    const [showModal, setShowModal] = useState(false);
    const [selectedMajors, setSelectedMajors] = useState(null);
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedMajors(null);
    };
    const handleShowModal = async (major) => {
        try {
            
            const response = await api.get(`/school-service/Major/get-major-details?MajorId=${major.majorID}`);
            const majorData = response.data;
            
            setSelectedMajors(majorData);
            setShowModal(true); // Hiển thị modal
            
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu bài viết:', error);
        }
    };
    // Gọi API lấy danh sách major khi search hoặc currentPage thay đổi
    useEffect(() => {
        fetchMajors();
    }, [campusId]);


    return (
        <Container>
            <h2 className="text-center text-orange fw-bold">Danh sách ngành học</h2>
            <p className="text-center mb-4 text-orange fw-bold">Quản lý danh sách chuyên ngành thuộc campus</p>
            <Row className="mb-3">
                <Col xs={12} md={6} className="d-flex">
                </Col>
                <Col xs={12} md={6} className="d-flex justify-content-end">
                    <Button className="btn-orange" 
                    //onClick={handleShow}
                    >Tạo mới</Button>
                </Col>
            </Row>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên ngành</th>
                        <th>Mã ngành</th>
                        <th>Mã code</th>
                        <th>Học phí</th>
                        <th>Thời gian học</th>
                        <th>Hệ đào tạo</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                {majors && majors.length > 0 ? (
                        majors.map((major, index) => (
                            <tr key={major.majorID}>
                                <td className="text-center fw-bold">{index + 1}</td>
                                <td>
                                    <div className="d-flex align-items-center">
                                    
                                    <div className="ms-3">
                                            <span
                                                className="text-orange"
                                                onClick={() => handleShowModal(major)}
                                                style={{ cursor: "pointer" }}
                                            >
                                                {major.majorName}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td>{major.majorID}</td>
                                <td>{major.majorCode}</td>
                                <td>{major.tuition}</td>
                                <td>{major.timeStudy}</td>
                                <td>{major.isVocationalSchool==true?"Trung cấp": "Cao đẳng"}</td>
                                <td>
                                    <Button className="btn-orange" 
                                    //onClick={handleShow}
                                    >
                                        Chỉnh sửa
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="text-center">
                                Không có ngành học nào
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <div className="d-flex justify-content-between">
              
            </div>
            <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
                {selectedMajors && (
                    <>
                        <Modal.Header closeButton>
                            <Modal.Title>Chi tiết ngành học</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>Tên ngành học:</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    value={selectedMajors.majorName}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Row>
                                    <Col md={6}>
                                        <Form.Label>Mã code:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="title"
                                            value={selectedMajors.majorCode}
                                        />
                                    </Col>
                                    <Col md={6}>
                                        <Form.Label>Mã ngành:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="title"
                                            value={selectedMajors.majorID}
                                        />
                                    </Col>
                                </Row>
                            </Form.Group>

                            
                            <Form.Group className="mb-3">
                                <Form.Label>Mô tả:</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={5}
                                    name="description"
                                    value={selectedMajors.description}
                                    //onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Row>
                                    <Col md={6}>
                                        <Form.Label>Học phí:</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="tuition"
                                            value={selectedMajors.tuition}
                                        />
                                    </Col>
                                    <Col md={6}>
                                        <Form.Label>Chỉ tiêu:</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="target"
                                            value={selectedMajors.target}
                                        />
                                    </Col>
                                </Row>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Row>
                                    <Col md={6}>
                                        <Form.Label>Thời gian học:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="timeStudy"
                                            value={selectedMajors.timeStudy}
                                        />
                                    </Col>
                                    <Col md={6}>
                                        <Form.Label>Loại bài viết:</Form.Label>
                                        <Form.Select 
                                            name="postType"
                                            value={selectedMajors.isVocationalSchool}
                                            onChange={(e) => {
                                                setSelectedMajors({
                                                    ...selectedMajors,
                                                    isVocationalSchool: e.target.value === 'true' 
                                                });
                                                setCurrentPage(1); 
                                            }}
                                            disabled
                                        >
                                            <option value="false">Cao Đẳng</option>
                                            <option value="true">Trung Cấp</option>
                                        </Form.Select>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Phương thức xét tuyển:</Form.Label>
                                {selectedMajors.typeAdmissions && selectedMajors.typeAdmissions.length > 0 ? (
                                    <ul>
                                        {selectedMajors.typeAdmissions.map((typeAdmission, index) => (
                                            <li key={index}>
                                                {typeAdmission.typeDiploma === 0
                                                    ? "Tốt nghiệp trung học cơ sở"
                                                    : typeAdmission.typeDiploma === 1
                                                    ? "Tốt nghiệp trung học phổ thông"
                                                    : typeAdmission.typeDiploma === 2
                                                    ? "Tốt nghiệp trung học đại học, cao đẳng"
                                                    : typeAdmission.typeDiploma === 3
                                                    ? `Xét học bạ THPT - ${
                                                        typeAdmission.typeOfTranscript === 0
                                                            ? "Xét học bạ năm 12"
                                                            : typeAdmission.typeOfTranscript === 1
                                                            ? "Xét học bạ 3 năm"
                                                            : typeAdmission.typeOfTranscript === 2
                                                            ? "Xét học bạ lớp 10, lớp 11, học kỳ 1 12"
                                                            : typeAdmission.typeOfTranscript === 3
                                                            ? "Xét học bạ 5 kỳ"
                                                            : "Xét học bạ 3 kỳ"
                                                    }`
                                                    : typeAdmission.typeDiploma === 4
                                                    ? "Liên thông"
                                                    : "Xét điểm thi THPT"}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div>Không có phương thức xét tuyển</div>
                                )}
                            </Form.Group>


                            <Form.Group className="mb-3">
                                <Form.Label>Hình thức xét tuyển:</Form.Label>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Khung chương trình:</Form.Label>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Mã môn</th>
                                            <th>Tên môn</th>
                                            <th>Số tín chỉ</th>
                                            <th>Kỳ học</th>
                                            <th>Thời gian học</th>
                                            <th>Ghi chú</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {selectedMajors.subjects && selectedMajors.subjects.length > 0 ? (
                                            selectedMajors.subjects.map((subject, index) => (
                                                <tr key={subject.subjectCode}>
                                                    <td className="text-center fw-bold">{index + 1}</td>
                                                    <td>{subject.subjectCode}</td>
                                                    <td>{subject.subjectName}</td>
                                                    <td>{subject.numberOfCredits}</td>
                                                    <td>{subject.semesterNumber}</td>
                                                    <td>{subject.studyTime}</td>
                                                    <td>{subject.note}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="8" className="text-center">
                                                    Không có môn học nào
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </Form.Group>

                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Quay lại
                            </Button>
                        </Modal.Footer>
                    </>
                )}
            </Modal>
        </Container>
    );
};

export default MajorsList;
