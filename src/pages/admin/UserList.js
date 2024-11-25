import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Modal, Pagination, Row, Table } from "react-bootstrap";
import { useOutletContext } from 'react-router-dom';
import api from "../../apiService.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserList = () => {
    const { campusId } = useOutletContext();
    const [selectedRole, setSelectedRole] = useState("");
    const [search, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [accounts, setAccounts] = useState([]);
    const itemsPerPage = 8;

    const roleNames = {
        Student: "Học sinh",
        SchoolService: "Dịch vụ sinh viên",
        AdmissionCouncil: "Hội đồng tuyển sinh",
        Admin: "Quản trị campus",
        AdmissionOfficer: "Cán bộ tuyển sinh",
    };

    // Gọi API để lấy danh sách các accounts theo điều kiện tìm kiếm
    const fetchAccounts = async () => {
        try {
            if (campusId) {
                const response = await api.get(`/Account/get-accounts`, {
                    params: {
                        CampusId: campusId,
                        Search: search,
                        CurrentPage: currentPage,
                        role: selectedRole
                    },
                });
                setAccounts(response.data.item || []);
                setTotalPages(response.data.pageCount || 1);
                setTotalItems(response.data.totalItems || 0);
            }
        } catch (error) {
            console.error("Có lỗi xảy ra khi lấy danh sách ngành học:", error);
        }
    };
    useEffect(() => {
        fetchAccounts();
    }, [search, currentPage, campusId, selectedRole]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Tạo mới
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [newUser, setNewUser] = useState({
        userName: "",
        fullname: "",
        gender: true,
        phone: "",
        dob: null,
        campusId: campusId || "",
        typeAccount: 0, // Mặc định là Account
        roleName: "",
        email: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    const handleSubmit = async () => {
        if (!newUser.userName || !newUser.roleName) {
            toast.error("Vui lòng nhập đầy đủ các trường bắt buộc!");
            return;
        }
        // Validate email nếu có giá trị
        if (newUser.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
            toast.error("Địa chỉ email không hợp lệ!");
            return;
        }

        // Validate số điện thoại nếu có giá trị
        if (newUser.phone && !/^\d{10,15}$/.test(newUser.phone)) {
            toast.error("Số điện thoại không hợp lệ!");
            return;
        }
        if (newUser.dob) {
            const dob = new Date(newUser.dob);
            const today = new Date();
            if (dob > today) {
                toast.error("Ngày sinh không thể là sau ngày hiện tại!");
                return;
            }

            if (isNaN(dob.getTime())) {
                toast.error("Ngày sinh không hợp lệ!");
                return;
            }
        }

        try {
            await api.post("/Account/create-account", newUser);
            toast.success("Tạo tài khoản thành công!");
            fetchAccounts();
            setNewUser({
                userName: "",
                fullname: "",
                gender: true,
                phone: "",
                dob: null,
                campusId: campusId || "",
                typeAccount: 0, // Mặc định là Account
                roleName: "",
                email: ""
            });
            handleClose();
        } catch (error) {
            console.error("Lỗi khi tạo tài khoản:", error);
            toast.error("Tạo tài khoản thất bại!");
        }
    };
    // Chi tiết, chỉnh sửa
    const [showDetails, setShowDetails] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [editUser, setEditUser] = useState({
        userName: "",
        fullname: "",
        gender: true,
        phone: "",
        dob: null,
        studentCode: "",
        majorId: "",
        typeAccount: 0, // Mặc định là Account
        roleName: "",
        isAccountActive: false,
        email: ""
    });

    // Hàm mở modal chi tiết
    const handleViewDetails = async (id) => {
        try {
            const response = await api.get(`/Account/get-account/${id}`);
            setSelectedAccount(response.data);
            setShowDetails(true);
        } catch (error) {
            console.error("Lỗi khi lấy thông tin tài khoản:", error);
        }
    };
    
    // Hàm mở modal chỉnh sửa
    const handleEditAccount = (account) => {
        setSelectedAccount(account);
        setNewUser({
            userName: account.userName,
            fullname: account.fullname,
            gender: account.gender,
            phone: account.phone,
            dob: account.dob,
            campusId: account.campusId,
            typeAccount: account.typeAccount,
            roleName: account.roleName,
            email: account.email
        });
        setShowEdit(true);
    };
    
    // Hàm đóng modal
    const handleCloseViewEdit = () => {
        setShowDetails(false);
        setShowEdit(false);
    };
    
    // Hàm submit chỉnh sửa
    const handleSubmitEdit = async () => {
        try {
            await api.put("/Account/update-account", newUser);
            toast.success("Cập nhật tài khoản thành công!");
            fetchAccounts();  // Cập nhật lại bảng sau khi chỉnh sửa
            setShowEdit(false);
        } catch (error) {
            toast.error("Cập nhật tài khoản thất bại!");
        }
    };
    return (
        <Container>
            <ToastContainer position="top-right" autoClose={3000} />
            <h2 className="text-center text-orange fw-bold">Danh sách người dùng</h2>
            <p className="text-center text-orange mb-4 fw-bold">Quản lý danh sách người dùng thuộc campus</p>
            <Row className="mb-3">
                <Col xs={12} md={7} className="d-flex">
                    <Form.Group className="me-2 d-flex align-items-center" style={{ flexGrow: 1, whiteSpace: 'nowrap' }}>
                        <Form.Control
                            type="text"
                            placeholder="Nhập tên người dùng"
                            value={search}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Form.Group>
                </Col>
                <Col xs={12} md={3} className="d-flex justify-content-end">
                    <Form.Select
                        value={selectedRole}
                        onChange={(e) => {
                            setSelectedRole(e.target.value);
                            setCurrentPage(1); // Reset về trang 1
                        }}
                    >
                        <option value="">Vai trò</option>
                        {Object.entries(roleNames).map(([key, value]) => (
                            <option key={key} value={key}>{value}</option>
                        ))}
                    </Form.Select>
                </Col>
                <Col xs={12} md={2} className="d-flex justify-content-end">
                    <Button className="btn-orange" onClick={handleShow}>Tạo mới</Button>
                </Col>
            </Row>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên đăng nhập</th>
                        <th>Họ tên</th>
                        <th>Email</th>
                        <th>Số điện thoại</th>
                        <th>Vai trò</th>
                        <th>Chuyên ngành</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {accounts.map((account, index) => (
                        <tr key={index}>
                            <td className="text-center fw-bold">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                            <td>{account.username}</td>
                            <td>{account.fullname}</td>
                            <td>{account.email}</td>
                            <td>{account.phone || "N/A"}</td>
                            <td>{roleNames[account.roleName] || "N/A"}</td>
                            <td>{account.majorName}</td>
                            <td style={{ color: account.isAccountActive ? 'green' : 'red' }}>
                                {account.isAccountActive ? "Đang hoạt động" : "Ngưng hoạt động"}
                            </td>

                            <td>
                                <td>
                                    {account.roleName !== "Admin" && (
                                        <>
                                            <Button variant="info" className="me-2" onClick={() => handleViewDetails(account.id)}>
                                                Chi tiết
                                            </Button>
                                            <Button variant="warning" onClick={() => handleEditAccount(account.id)}>
                                                Chỉnh sửa
                                            </Button>
                                        </>
                                    )}
                                </td>
                            </td>

                        </tr>
                    ))}

                </tbody>
            </Table>
            <div className="d-flex justify-content-between">
                <span>
                    Hiển thị {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalItems)} trên tổng số {totalItems} người dùng
                </span>
                <Pagination>
                    <Pagination.Prev
                        onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                        disabled={currentPage === 1}
                    />
                    {[...Array(totalPages)].map((_, index) => (
                        <Pagination.Item
                            key={index}
                            active={index + 1 === currentPage}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next
                        onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    />
                </Pagination>
            </div>

            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Tạo người dùng mới</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {/* Tên đăng nhập */}
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={4}>
                                Tên đăng nhập <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    type="text"
                                    placeholder="Nhập tên đăng nhập"
                                    name="userName"
                                    value={newUser.userName}
                                    onChange={handleInputChange}
                                />
                            </Col>
                        </Form.Group>
                        {/* Vai trò */}
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={4}>
                                Vai trò <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Col sm={8}>
                                <Form.Select
                                    name="roleName"
                                    value={newUser.roleName}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Chọn vai trò</option>
                                    <option value="AdmissionOfficer">Cán bộ tuyển sinh</option>
                                    <option value="Admin">Quản trị campus</option>
                                    <option value="SchoolService">Dịch vụ sinh viên</option>
                                    <option value="AdmissionCouncil">Hội đồng tuyển sinh</option>
                                </Form.Select>
                            </Col>
                        </Form.Group>
                        {/* Họ tên */}
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={4}>Họ tên</Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    type="text"
                                    placeholder="Nhập họ tên"
                                    name="fullname"
                                    value={newUser.fullname}
                                    onChange={handleInputChange}
                                />
                            </Col>
                        </Form.Group>

                        {/* Email */}
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={4}>Email</Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    type="email"
                                    placeholder="Nhập email"
                                    name="email"
                                    value={newUser.email}
                                    onChange={handleInputChange}
                                />
                            </Col>
                        </Form.Group>

                        {/* Giới tính */}
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={4}>Giới tính</Form.Label>
                            <Col sm={8}>
                                <Form.Check
                                    type="radio"
                                    label="Nam"
                                    name="gender"
                                    value={true}
                                    checked={newUser.gender === true}
                                    onChange={() => setNewUser({ ...newUser, gender: true })}
                                    inline
                                />
                                <Form.Check
                                    type="radio"
                                    label="Nữ"
                                    name="gender"
                                    value={false}
                                    checked={newUser.gender === false}
                                    onChange={() => setNewUser({ ...newUser, gender: false })}
                                    inline
                                />
                            </Col>
                        </Form.Group>

                        {/* Ngày sinh */}
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={4}>Ngày sinh</Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    type="date"
                                    name="dob"
                                    value={newUser.dob}
                                    onChange={handleInputChange}
                                />
                            </Col>
                        </Form.Group>

                        {/* Số điện thoại */}
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={4}>Số điện thoại</Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    type="text"
                                    placeholder="Nhập số điện thoại"
                                    name="phone"
                                    value={newUser.phone}
                                    onChange={handleInputChange}
                                />
                            </Col>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Hủy
                    </Button>
                    <Button className="btn-orange" onClick={handleSubmit}>
                        Tạo mới
                    </Button>
                </Modal.Footer>
            </Modal>;
        </Container>
    );
};

export default UserList;
