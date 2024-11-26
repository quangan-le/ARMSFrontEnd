import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Modal, Row, Table } from 'react-bootstrap';
import { useOutletContext, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from "../../apiService.js";

const PlanAdmissionDetail = () => {
    const { admissionInformationID } = useParams();
    const { campusId } = useOutletContext();
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentSection, setCurrentSection] = useState(null);

    // Phần I
    const [admissionData, setAdmissionData] = useState(null);
    const fetchAdmissionData = async () => {
        try {
            const response = await api.get(
                `/admission-council/AdmissionInformation/get-admission-information-by-id?AdmissionInformationID=${admissionInformationID}`
            );
            setAdmissionData(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy thông tin tuyển sinh:", error);
        }
    };

    useEffect(() => {
        fetchAdmissionData();
    }, [admissionInformationID]);

    // Phần II
    const admissionInfo = admissionData ? admissionData : null;
    const admissionRounds = admissionInfo?.admissionTimes || [];
    const admissionMajors = admissionInfo?.majorAdmissions || [];

    const [editFormData, setEditFormData] = useState({});
    const [selectedMajor, setSelectedMajor] = useState(null);

    // Handle Modal
    const handleShowEditModal = (section, data) => {
        setCurrentSection(section);
        if (data) {
            setEditFormData({ ...data });
        }
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setCurrentSection(null);
    };

    useEffect(() => {
        if (currentSection === 'I' && admissionInfo) {
            setEditFormData({
                ...admissionInfo,
            });
        } else if (currentSection === 'III' && selectedMajor) {
            setEditFormData({
                ...selectedMajor,
            });
        }
    }, [currentSection, admissionInfo, selectedMajor]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const handleSaveChanges = async () => {
        // Validation trước khi lưu
        if (currentSection === 'I') {
            if (editFormData.feeRegister <= 100000) {
                toast.error('Phí xét tuyển phải lớn hơn 100.000 VND!');
                return;
            }
            if (editFormData.feeAdmission <= 100000) {
                toast.error('Phí nhập học phải lớn hơn 100.000 VND!');
                return;
            }
        }
        console.log(editFormData);
        try {
            if (currentSection === 'I') {
                await api.put('/admission-council/AdmissionInformation/update-admission-information', editFormData);
            } else if (currentSection === 'II') {
                await api.put('/admission-council/AdmissionTime/update-admission-time', editFormData);
            }
            await fetchAdmissionData();
            toast.success('Cập nhật thành công!');
            handleCloseEditModal();
        } catch (error) {
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.message || 'Đã xảy ra lỗi khi cập nhật!';
                toast.error(errorMessage);
            } else {
                toast.error('Cập nhật thất bại! Đã xảy ra lỗi không xác định.');
            }
            console.error("Lỗi khi cập nhật:", error);
        }
    };
    // Tạo mới đợt tuyển sinh
    const [showModalCreate, setShowModalCreate] = useState(false);

    const [formData, setFormData] = useState({
        admissionTimeName: "",
        startRegister: "",
        endRegister: "",
        startAdmission: "",
        endAdmission: "",
        
    });
    const handleShowModalCreate = () => setShowModalCreate(true);
    const handleCloseModalCreate = () => setShowModalCreate(false);
    const handleCreateChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataWithCampusId = { 
            ...formData, 
            admissionInformationID: parseInt(admissionInformationID, 10) 
        };
    
        try {
            const response = await api.post(
                "/admission-council/AdmissionTime/add-admission-time",
                formDataWithCampusId
            );
            toast.success("Thêm đợt tuyển sinh thành công!");
            handleCloseModalCreate();
            fetchAdmissionData();
        } catch (error) {
            // if (error.response && error.response.data) {
            //     const errorMessage = error.response.data.message || 'Đã xảy ra lỗi khi tạo mới!';
            //     toast.error(errorMessage);
            // } else {
            //     toast.error("Thêm đợt tuyển sinh thất bại!");
            // }
            console.error("Lỗi khi thêm đợt tuyển sinh:", error);
        }
    };

    // Tạo mới ngành tuyển
    const [showModalCreateMajor, setShowModalCreateMajor] = useState(false);

    const [formDataMajor, setFormDataMajor] = useState({
        majorID: "",
        admissionInformationID: "",
        target: "",
        status: "",
        subjectGroupsJson: "",
        typeAdmissions: ""
    });
    const handleShowModalCreateMajor = () => setShowModalCreateMajor(true);
    const handleCloseModalCreateMajor = () => setShowModalCreateMajor(false);
    const handleCreateChangeMajor = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmitMajor = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put(
                "/admission-council/Major/update-major",
                formDataMajor
            );
            toast.success("Thêm ngành tuyển sinh thành công!");
            handleCloseModalCreateMajor();
            fetchAdmissionData();
        } catch (error) {
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.message || 'Đã xảy ra lỗi khi cập nhật!';
                toast.error(errorMessage);
            } else {
                toast.error("Thêm ngành tuyển sinh thất bại!");
            }
            console.error("Lỗi khi thêm ngành tuyển sinh:", error);
        }
    };


    return (
        <Container>
            <ToastContainer position="top-right" autoClose={3000} />
            <h2 className="text-center text-orange fw-bold mb-4">Chi tiết kế hoạch tuyển sinh</h2>

            <h4 className='text-orange mt-4'>I. Thông tin</h4>
            {admissionInfo ? (
                <Row>
                    <Col md={10}>
                        <p><strong>Năm:</strong> {admissionInfo.year}</p>
                        <p><strong>Thời gian bắt đầu:</strong>  {new Date(admissionInfo.startAdmission).toLocaleString()}</p>
                        <p><strong>Thời gian kết thúc:</strong> {new Date(admissionInfo.endAdmission).toLocaleString()}</p>
                        <p><strong>Lệ phí:</strong> {admissionInfo.feeRegister.toLocaleString()} VND</p>
                        <p><strong>Nhập học:</strong> {admissionInfo.feeAdmission.toLocaleString()} VND</p>
                    </Col>
                    <Col md={2}>
                        <Button variant="warning" onClick={() => handleShowEditModal('I')}>
                            Chỉnh sửa
                        </Button>
                    </Col>
                </Row>
            ) : (
                <p>Đang tải dữ liệu...</p>
            )}
            <Row className='mt-3 mb-2'>
                <Col md={10}>
                    <h4 className='text-orange'>II. Đợt tuyển sinh</h4>
                </Col>
                <Col md={2}>
                    <Button variant="warning" onClick={handleShowModalCreate}>
                        Tạo mới
                    </Button>
                </Col>
            </Row>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Đợt</th>
                        <th>Thời gian bắt đầu tuyển</th>
                        <th>Thời gian kết thúc tuyển</th>
                        <th>Thời gian bắt đầu nhập học</th>
                        <th>Thời gian kết thúc nhập học</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {admissionRounds.length > 0 ? (
                        admissionRounds.map((round, index) => (
                            <tr key={round.admissionTimeId}>
                                <td>{index + 1}</td>
                                <td>{round.admissionTimeName}</td>
                                <td>{new Date(round.startRegister).toLocaleString()}</td>
                                <td>{new Date(round.endRegister).toLocaleString()}</td>
                                <td>{new Date(round.startAdmission).toLocaleString()}</td>
                                <td>{new Date(round.endAdmission).toLocaleString()}</td>
                                <td>
                                    <Button variant="warning" onClick={() => handleShowEditModal('II', round)}>
                                        Sửa
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">
                                Đang tải dữ liệu...
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <Modal show={showModalCreate} onHide={handleCloseModalCreate}>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm mới đợt tuyển sinh</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Tên đợt tuyển sinh</Form.Label>
                            <Form.Control
                                type="text"
                                name="admissionTimeName"
                                value={formData.admissionTimeName}
                                onChange={handleCreateChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Thời gian bắt đầu tuyển</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                name="startRegister"
                                value={formData.startRegister}
                                onChange={handleCreateChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Thời gian kết thúc tuyển</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                name="endRegister"
                                value={formData.endRegister}
                                onChange={handleCreateChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Thời gian bắt đầu nhập học</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                name="startAdmission"
                                value={formData.startAdmission}
                                onChange={handleCreateChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Thời gian kết thúc nhập học</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                name="endAdmission"
                                value={formData.endAdmission}
                                onChange={handleCreateChange}
                                required
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModalCreate}>
                        Đóng
                    </Button>
                    <Button variant="warning" onClick={handleSubmit}>Lưu thay đổi</Button>
                </Modal.Footer>
            </Modal>
            <Row className='mt-5 mb-2'>
                <Col md={10}>
                    <h4 className='text-orange'>III. Ngành tuyển</h4>
                </Col>
                <Col md={2}>
                    <Button variant="warning" onClick={handleShowModalCreateMajor}>
                        Thêm mới
                    </Button>
                </Col>
            </Row>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã ngành</th>
                        <th>Tên ngành</th>
                        <th>Số lượng tuyển</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {admissionMajors.length > 0 ? (
                        admissionMajors.map((major, index) => (
                            <tr key={major.admissionInformationID}>
                                <td>{index + 1}</td>
                                <td>{major.majorID}</td>
                                <td>{major.majorName}</td>
                                <td>{major.target}</td>
                                <td>{major.status ? "Đang tuyển" : "Ngưng tuyển"}</td>
                                <td>
                                    <Button variant="warning" onClick={() => handleShowEditModal('III', major)}>
                                        Sửa
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">Chưa có dữ liệu ngành tuyển</td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <Modal show={showModalCreateMajor} onHide={handleCloseModalCreateMajor}>
                <Modal.Header closeButton>
                    <Modal.Title>Tạo mới Ngành Tuyển Sinh</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Mã ngành</Form.Label>
                            <Form.Control
                                type="text"
                                name="majorID"
                                value={formDataMajor.majorID}
                                onChange={handleCreateChangeMajor}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Tên ngành</Form.Label>
                            <Form.Control
                                type="text"
                                name="majorName"
                                value={formDataMajor.majorName}
                                onChange={handleCreateChangeMajor}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Số lượng tuyển</Form.Label>
                            <Form.Control
                                type="number"
                                name="target"
                                value={formDataMajor.target}
                                onChange={handleCreateChangeMajor}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Trạng thái</Form.Label>
                            <Form.Check
                                type="checkbox"
                                name="status"
                                checked={formDataMajor.status}
                                onChange={handleCreateChangeMajor}
                                label={formDataMajor.status ? "Đang tuyển" : "Ngưng tuyển"}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModalCreateMajor}>
                        Đóng
                    </Button>
                    <Button variant="warning" onClick={handleSubmitMajor}>Lưu thay đổi</Button>
                </Modal.Footer>
            </Modal>

            {/* Modal chỉnh sửa */}
            <Modal show={showEditModal} onHide={handleCloseEditModal} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {currentSection === 'I' && 'Chỉnh sửa Thông tin'}
                        {currentSection === 'II' && 'Chỉnh sửa Đợt tuyển sinh'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentSection === 'I' && admissionInfo && (
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Năm:</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="year"
                                    value={editFormData.year || ''}
                                    readOnly
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Thời gian bắt đầu:</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    name="startAdmission"
                                    value={editFormData.startAdmission || ''}
                                    readOnly
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Thời gian kết thúc:</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    name="endAdmission"
                                    value={editFormData.endAdmission || ''}
                                    readOnly
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Lệ phí đăng ký:</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="feeRegister"
                                    value={editFormData.feeRegister || ''}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Nhập học:</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="feeAdmission"
                                    value={editFormData.feeAdmission || ''}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Mô tả hồ sơ tuyển sinh:</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    name="admissionProfileDescription"
                                    value={editFormData.admissionProfileDescription || ''}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Form>
                    )}
                    {currentSection === 'II' && (
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Tên đợt:</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="admissionTimeName"
                                    value={editFormData.admissionTimeName || ''}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Thời gian bắt đầu tuyển:</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    name="startRegister"
                                    value={editFormData.startRegister || ''}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Thời gian kết thúc tuyển:</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    name="endRegister"
                                    value={editFormData.endRegister || ''}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Thời gian bắt đầu nhập học:</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    name="startAdmission"
                                    value={editFormData.startAdmission || ''}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Thời gian kết thúc nhập học:</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    name="endAdmission"
                                    value={editFormData.endAdmission || ''}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEditModal}>
                        Đóng
                    </Button>
                    <Button variant="warning" onClick={handleSaveChanges}>Lưu thay đổi</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default PlanAdmissionDetail;
