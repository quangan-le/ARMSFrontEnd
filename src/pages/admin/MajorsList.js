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
    // Chi tiết
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
                numberOfCredits: null,
                semesterNumber: null,
                studyTime: "",
                note: "",
            },
        ],
        campusId: campusId
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
                    numberOfCredits: null,
                    semesterNumber: null,
                    studyTime: "",
                    note: "",
                },
            ],
        });
    };
    const handleDeleteSubject = (index) => {
        const updatedSubjects = newMajor.subjects.filter((_, i) => i !== index);
        setNewMajor({ ...newMajor, subjects: updatedSubjects });
    };
    const handleSubmit = async () => {
        // Kiểm tra tất cả các trường bắt buộc
        if (!newMajor.majorName || !newMajor.majorCode || !newMajor.majorID || !newMajor.description || !newMajor.timeStudy) {
            toast.error("Vui lòng nhập đầy đủ thông tin ngành học!");
            return;
        }
        // Kiểm tra từng môn học trong khung chương trình
        for (let i = 0; i < newMajor.subjects.length; i++) {
            const subject = newMajor.subjects[i];

            // Nếu bất kỳ trường nào (ngoại trừ `note`) trống, báo lỗi
            if (
                !subject.subjectCode ||
                !subject.subjectName ||
                !subject.numberOfCredits ||
                !subject.semesterNumber ||
                !subject.studyTime
            ) {
                toast.error(`Vui lòng nhập đầy đủ thông tin cho môn học thứ ${i + 1}!`);
                return;
            }
        }

        try {
            const response = await api.post('/admin/Major/add-major', newMajor);
            toast.success("Tạo mới ngành học thành công!");
            fetchMajors();
            handleCloseModalCreate();
            setNewMajor({
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
                        numberOfCredits: null,
                        semesterNumber: null,
                        studyTime: "",
                        note: "",
                    },
                ],
            });
        } catch (error) {
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.message || 'Lỗi khi tạo mới ngành học!';
                toast.error(errorMessage);
            } else {
                toast.error("Lỗi khi tạo mới ngành học!");
            }
        }
    };
    // Chỉnh sửa
    const [showEditModal, setShowEditModal] = useState(false);
    const [editMajor, setEditMajor] = useState(null);

    const handleShowEditModal = async (majorID) => {
        try {
            const response = await api.get(`/admin/Major/get-major-details?MajorId=${majorID}`);
            const majorData = response.data;

            setEditMajor(majorData);
            setShowEditModal(true);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu ngành học:", error);
            toast.error("Không thể lấy dữ liệu ngành học!");
        }
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setEditMajor(null);
    };
    const handleEditSubjectChange = (index, field, value) => {
        const updatedSubjects = [...editMajor.subjects];
        updatedSubjects[index][field] = value;
        setEditMajor({ ...editMajor, subjects: updatedSubjects });
    };
    const handleDeleteEditSubject = (index) => {
        const updatedSubjects = editMajor.subjects.filter((_, i) => i !== index);
        setEditMajor({ ...editMajor, subjects: updatedSubjects });
    };
    const handleAddEditSubject = () => {
        const newSubject = {
            subjectCode: "",
            subjectName: "",
            numberOfCredits: null,
            semesterNumber: null,
            studyTime: "",
            note: "",
        };
        setEditMajor({ ...editMajor, subjects: [...editMajor.subjects, newSubject] });
    };
    const handleSubmitEdit = async () => {
        // Kiểm tra tất cả các trường bắt buộc
        if (!editMajor.majorName || !editMajor.majorCode || !editMajor.majorID || !editMajor.description || !editMajor.timeStudy) {
            toast.error("Vui lòng nhập đầy đủ thông tin ngành học!");
            return;
        }

        // Kiểm tra từng môn học trong khung chương trình
        for (let i = 0; i < editMajor.subjects.length; i++) {
            const subject = editMajor.subjects[i];

            // Nếu bất kỳ trường nào (ngoại trừ `note`) trống, báo lỗi
            if (
                !subject.subjectCode ||
                !subject.subjectName ||
                !subject.numberOfCredits ||
                !subject.semesterNumber ||
                !subject.studyTime
            ) {
                toast.error(`Vui lòng nhập đầy đủ thông tin cho môn học thứ ${i + 1}!`);
                return;
            }
        }
        const updatedEditMajor = {
            ...editMajor,
            campusId: campusId,
        };

        try {
            await api.put(`/admin/Major/update-major`, updatedEditMajor);
            toast.success("Cập nhật ngành học thành công!");
            fetchMajors();
            handleCloseEditModal();
        } catch (error) {
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.message || 'Lỗi khi cập nhật ngành học!';
                toast.error(errorMessage);
            } else {
                toast.error("Lỗi khi cập nhật ngành học!");
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
                                    <Button
                                        className="btn-orange"
                                        onClick={() => handleShowEditModal(major.majorID)}
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
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {newMajor.subjects.length > 0 ? (
                                        newMajor.subjects.map((subject, index) => (
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
                                                <td className="text-center">
                                                    <Button
                                                        variant="danger"
                                                        onClick={() => handleDeleteSubject(index)} // Gọi hàm xóa
                                                    >
                                                        Xóa
                                                    </Button>
                                                </td>
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
                            <Button
                                className="btn-orange"
                                onClick={() => {
                                    handleCloseModal();
                                    handleShowEditModal(selectedMajors.majorID);
                                }}
                            >
                                Chỉnh sửa
                            </Button>
                        </Modal.Footer>
                    </>
                )}
            </Modal>
            <Modal show={showEditModal} onHide={handleCloseEditModal} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Chỉnh sửa ngành học</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editMajor ? (
                        <>
                            <Form.Group className="mb-3">
                                <Form.Label>Tên ngành học:</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={editMajor.majorName}
                                    onChange={(e) => setEditMajor({ ...editMajor, majorName: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Row>
                                    <Col md={6}>
                                        <Form.Label>Mã code:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={editMajor.majorCode}
                                            onChange={(e) => setEditMajor({ ...editMajor, majorCode: e.target.value })}
                                        />
                                    </Col>
                                    <Col md={6}>
                                        <Form.Label>Mã ngành:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={editMajor.majorID}
                                            readOnly
                                        />
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Mô tả:</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={editMajor.description}
                                    onChange={(e) => setEditMajor({ ...editMajor, description: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Row>
                                    <Col md={4}>
                                        <Form.Label>Học phí:</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={editMajor.tuition}
                                            onChange={(e) => setEditMajor({ ...editMajor, tuition: +e.target.value })}
                                        />
                                    </Col>
                                    <Col md={4}>
                                        <Form.Label>Thời gian học:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={editMajor.timeStudy}
                                            onChange={(e) => setEditMajor({ ...editMajor, timeStudy: e.target.value })}
                                        />
                                    </Col>
                                    <Col md={4}>
                                        <Form.Label>Hệ đào tạo:</Form.Label>
                                        <Form.Select
                                            value={editMajor.isVocationalSchool}
                                            onChange={(e) =>
                                                setEditMajor({ ...editMajor, isVocationalSchool: e.target.value === "true" })
                                            }
                                        >
                                            <option value="false">Cao đẳng</option>
                                            <option value="true">Trung cấp</option>
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
                                            <th>Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {editMajor.subjects.map((subject, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <Form.Control
                                                        type="text"
                                                        value={subject.subjectCode}
                                                        onChange={(e) =>
                                                            handleEditSubjectChange(index, "subjectCode", e.target.value)
                                                        }
                                                    />
                                                </td>
                                                <td>
                                                    <Form.Control
                                                        type="text"
                                                        value={subject.subjectName}
                                                        onChange={(e) =>
                                                            handleEditSubjectChange(index, "subjectName", e.target.value)
                                                        }
                                                    />
                                                </td>
                                                <td>
                                                    <Form.Control
                                                        type="number"
                                                        value={subject.numberOfCredits || ""}
                                                        onChange={(e) =>
                                                            handleEditSubjectChange(index, "numberOfCredits", +e.target.value)
                                                        }
                                                    />
                                                </td>
                                                <td>
                                                    <Form.Control
                                                        type="number"
                                                        value={subject.semesterNumber || ""}
                                                        onChange={(e) =>
                                                            handleEditSubjectChange(index, "semesterNumber", +e.target.value)
                                                        }
                                                    />
                                                </td>
                                                <td>
                                                    <Form.Control
                                                        type="text"
                                                        value={subject.studyTime}
                                                        onChange={(e) =>
                                                            handleEditSubjectChange(index, "studyTime", e.target.value)
                                                        }
                                                    />
                                                </td>
                                                <td>
                                                    <Form.Control
                                                        type="text"
                                                        value={subject.note}
                                                        onChange={(e) =>
                                                            handleEditSubjectChange(index, "note", e.target.value)
                                                        }
                                                    />
                                                </td>
                                                <td>
                                                    <Button
                                                        variant="danger"
                                                        onClick={() => handleDeleteEditSubject(index)}
                                                    >
                                                        Xóa
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                                <Button variant="primary" onClick={handleAddEditSubject}>
                                    Thêm môn học
                                </Button>
                            </Form.Group>
                        </>
                    ) : (
                        <p>Đang tải dữ liệu...</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEditModal}>
                        Hủy
                    </Button>
                    <Button variant="warning" onClick={handleSubmitEdit}>
                        Lưu thay đổi
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default MajorsList;
