import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Modal, Row, Table } from "react-bootstrap";
import { useOutletContext } from 'react-router-dom';
import api from "../../apiService.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MajorsList = () => {
    const [majors, setMajors] = useState([]);
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

            const response = await api.get(`/admin/Major/get-major-details?MajorId=${major.majorID}`);
            const majorData = response.data;

            setSelectedMajors(majorData);
            setShowModal(true);

        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu bài viết:', error);
        }
    };
    // Gọi API lấy danh sách major khi search hoặc currentPage thay đổi
    useEffect(() => {
        fetchMajors();
    }, [campusId]);

    // Tạo mới 
    const [showModalCreate, setShowModalCreate] = useState(false);
    const handleShowModalCreate = () => {
        setShowModalCreate(true);
    };
    const handleCloseModalCreate = () => {
        setShowModalCreate(false);
    };
    const [newMajor, setNewMajor] = useState({
        majorID: "",
        majorCode: "",
        majorName: "",
        description: "",
        tuition: 0,
        timeStudy: "",
        isVocationalSchool: true,
        campusId: "",
        subjects: [
            {
                subjectCode: "",
                subjectName: "",
                numberOfCredits: 0,
                semesterNumber: 0,
                studyTime: "",
                note: "",
            },
        ],
    });
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMajor({
            ...newMajor,
            [name]: value,
        });
    };

    const handleSubjectChange = (index, e) => {
        const { name, value } = e.target;
        const updatedSubjects = [...newMajor.subjects];
        updatedSubjects[index][name] = value;
        setNewMajor({ ...newMajor, subjects: updatedSubjects });
    };

    const addSubject = () => {
        setNewMajor({
            ...newMajor,
            subjects: [
                ...newMajor.subjects,
                {
                    subjectCode: "",
                    subjectName: "",
                    numberOfCredits: 0,
                    semesterNumber: 0,
                    studyTime: "",
                    note: "",
                },
            ],
        });
    };

    const handleSubmit = async () => {
        // Kiểm tra tất cả các trường bắt buộc
        if (!newMajor.majorName || !newMajor.majorCode || !newMajor.majorID || !newMajor.description || !newMajor.timeStudy) {
            toast.error("Vui lòng nhập đầy đủ thông tin ngành học!");
            return;
        }
        // Kiểm tra khung chương trình: nếu có ít nhất 1 môn học, tất cả các trường của môn học phải được nhập
        if (newMajor.subjects.some(subject => subject.subjectCode || subject.subjectName || subject.numberOfCredits || subject.semesterNumber || subject.studyTime)) {
            for (let i = 0; i < newMajor.subjects.length; i++) {
                const subject = newMajor.subjects[i];
                if (!subject.subjectCode || !subject.subjectName || subject.numberOfCredits === 0 || !subject.semesterNumber || !subject.studyTime) {
                    toast.error(`Vui lòng nhập đầy đủ thông tin cho môn học thứ ${i + 1}`);
                    return;
                }
            }
        }

        try {
            const response = await api.post('/admin/Major/add-major', newMajor);
            toast.success("Tạo mới ngành học thành công!");
            fetchMajors();
            handleCloseModalCreate();
        } catch (error) {
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.message || 'Lỗi khi tạo mới ngành học!';
                toast.error(errorMessage);
            } else {
                toast.error("Lỗi khi tạo mới ngành học!");
            }
        }
    };

    return (
        <Container>
            <ToastContainer position="top-right" autoClose={3000} />
            <h2 className="text-center text-orange fw-bold">Danh sách ngành học</h2>
            <p className="text-center mb-4 text-orange fw-bold">Quản lý danh sách chuyên ngành thuộc campus</p>
            <Row className="mb-3">
                <Col xs={12} md={6} className="d-flex">
                </Col>
                <Col xs={12} md={6} className="d-flex justify-content-end">
                    <Button className="btn-orange" onClick={handleShowModalCreate}>Tạo mới</Button>
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
                                <td>{major.isVocationalSchool == true ? "Trung cấp" : "Cao đẳng"}</td>
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
            <Modal show={showModalCreate} onHide={handleCloseModalCreate} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Tạo mới ngành học</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Tên ngành học:</Form.Label>
                            <Form.Control
                                type="text"
                                name="majorName"
                                value={newMajor.majorName}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Row>
                                <Col md={6}>
                                    <Form.Label>Mã code:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="majorCode"
                                        value={newMajor.majorCode}
                                        onChange={handleInputChange}
                                    />
                                </Col>
                                <Col md={6}>
                                    <Form.Label>Mã ngành:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="majorID"
                                        value={newMajor.majorID}
                                        onChange={handleInputChange}
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
                                value={newMajor.description}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Row>
                                <Col md={4}>
                                    <Form.Label>Học phí:</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="tuition"
                                        value={newMajor.tuition}
                                        onChange={handleInputChange}
                                    />
                                </Col>
                                <Col md={4}>
                                    <Form.Label>Thời gian học:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="timeStudy"
                                        value={newMajor.timeStudy}
                                        onChange={handleInputChange}
                                    />
                                </Col>
                                <Col md={4}>
                                    <Form.Label>Hệ đào tạo:</Form.Label>
                                    <Form.Select
                                        name="isVocationalSchool"
                                        value={newMajor.isVocationalSchool}
                                        onChange={(e) =>
                                            setNewMajor({
                                                ...newMajor,
                                                isVocationalSchool: e.target.value === 'true',
                                            })
                                        }
                                    >
                                        <option value="false">Cao Đẳng</option>
                                        <option value="true">Trung Cấp</option>
                                    </Form.Select>
                                </Col>
                            </Row>
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
                                    {newMajor.subjects.map((subject, index) => (
                                        <tr key={index}>
                                            <td className="text-center fw-bold">{index + 1}</td>
                                            <td>
                                                <Form.Control
                                                    type="text"
                                                    name="subjectCode"
                                                    value={subject.subjectCode}
                                                    onChange={(e) => handleSubjectChange(index, e)}
                                                />
                                            </td>
                                            <td>
                                                <Form.Control
                                                    type="text"
                                                    name="subjectName"
                                                    value={subject.subjectName}
                                                    onChange={(e) => handleSubjectChange(index, e)}
                                                />
                                            </td>
                                            <td>
                                                <Form.Control
                                                    type="number"
                                                    name="numberOfCredits"
                                                    value={subject.numberOfCredits}
                                                    onChange={(e) => handleSubjectChange(index, e)}
                                                />
                                            </td>
                                            <td>
                                                <Form.Control
                                                    type="number"
                                                    name="semesterNumber"
                                                    value={subject.semesterNumber}
                                                    onChange={(e) => handleSubjectChange(index, e)}
                                                />
                                            </td>
                                            <td>
                                                <Form.Control
                                                    type="text"
                                                    name="studyTime"
                                                    value={subject.studyTime}
                                                    onChange={(e) => handleSubjectChange(index, e)}
                                                />
                                            </td>
                                            <td>
                                                <Form.Control
                                                    type="text"
                                                    name="note"
                                                    value={subject.note}
                                                    onChange={(e) => handleSubjectChange(index, e)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            <Button variant="outline-primary" onClick={addSubject}>
                                Thêm môn học
                            </Button>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModalCreate}>
                        Đóng
                    </Button>
                    <Button variant="warning" onClick={handleSubmit}>
                        Tạo mới
                    </Button>
                </Modal.Footer>
            </Modal>
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
                                    <Col md={4}>
                                        <Form.Label>Học phí:</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="tuition"
                                            value={selectedMajors.tuition}
                                        />
                                    </Col>
                                    <Col md={4}>
                                        <Form.Label>Thời gian học:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="timeStudy"
                                            value={selectedMajors.timeStudy}
                                        />
                                    </Col>
                                    <Col md={4}>
                                        <Form.Label>Hệ đào tạo:</Form.Label>
                                        <Form.Select
                                            name="isVocationalSchool"
                                            value={selectedMajors.isVocationalSchool}
                                            onChange={(e) => {
                                                setSelectedMajors({
                                                    ...selectedMajors,
                                                    isVocationalSchool: e.target.value === 'true'
                                                });
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
