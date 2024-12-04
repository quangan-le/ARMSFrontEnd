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
        Student: "Sinh viên",
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
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.message || 'Đã xảy ra lỗi khi tạo mới!';
                toast.error(errorMessage);
            } else {
                toast.error("Thêm tài khoản thất bại!");
            }
            console.error("Thêm tài khoản thất bại:", error);
        }
    };

    // Chi tiết
    const [showDetails, setShowDetails] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
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
    const handleCloseDetails = () => {
        setShowDetails(false);
    };

    // Chỉnh sửa
    const [showEdit, setShowEdit] = useState(false);
    const [editUser, setEditUser] = useState({
        id: "",
        fullname: "",
        gender: true,
        email: "",
        phone: "",
        dob: null,
        studentCode: "",
        isAccountActive: false,
        majorName: "",
        roleName: "",
        userName: "",
        typeAccount: 0, // Mặc định là Account
    });
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditUser({ ...editUser, [name]: value });
    };

    // Hàm mở modal chỉnh sửa
    const handleShowEdit = async (accountId) => {
        try {
            const response = await api.get(`/Account/get-account/${accountId}`);
            const accountData = response.data;
            setEditUser({
                id: accountData.id,
                fullname: accountData.fullname,
                gender: accountData.gender,
                email: accountData.email,
                phone: accountData.phone,
                dob: accountData.dob,
                studentCode: accountData.studentCode,
                isAccountActive: accountData.isAccountActive,
                majorName: accountData.majorName,
                roleName: accountData.roleName,
                userName: accountData.userName,
            });

            setShowEdit(true); // Mở modal chỉnh sửa
        } catch (error) {
            console.error("Lỗi khi lấy thông tin tài khoản:", error);
        }
    };

    // Hàm đóng modal
    const handleCloseEdit = () => {
        setShowEdit(false);
    };

    // Hàm submit chỉnh sửa
    const handleSubmitEdit = async () => {
        // Validate email nếu có giá trị
        if (editUser.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editUser.email)) {
            toast.error("Địa chỉ email không hợp lệ!");
            return;
        }

        // Validate số điện thoại nếu có giá trị
        if (editUser.phone && !/^\d{10,15}$/.test(editUser.phone)) {
            toast.error("Số điện thoại không hợp lệ!");
            return;
        }
        if (editUser.dob) {
            const dob = new Date(editUser.dob);
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
            // Xác định typeAccount dựa trên roleName
            const updatedUser = {
                userName: editUser.userName,
                fullname: editUser.fullname,
                gender: editUser.gender,
                phone: editUser.phone,
                dob: editUser.dob,
                studentCode: editUser.studentCode,
                typeAccount: editUser.roleName === "Student" ? 2 : 0,
                roleName: editUser.roleName,
                isAccountActive: editUser.isAccountActive,
                email: editUser.email,
            };
            await api.put(`/Account/update-account/${editUser.id}`, updatedUser);

            toast.success("Cập nhật tài khoản thành công!");
            fetchAccounts();
            setShowEdit(false);
        } catch (error) {
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.message || 'Đã xảy ra lỗi khi cập nhật!';
                toast.error(errorMessage);
            } else {
                toast.error("Cập nhật tài khoản thất bại!");
            }
            console.error("Cập nhật tài khoản thất bại:", error);
        }
    };

    const handleResetPassword = async (accountId) => {
        try {
            const response = await api.get(`/Account/reset-password/${accountId}`);
            if (response.data.status) {
                toast.success(response.data.message || "Đặt lại mật khẩu thành công!");
            } else {
                toast.error(response.data.message || "Không thể đặt lại mật khẩu!");
            }
        } catch (error) {
            console.error("Lỗi khi đặt lại mật khẩu:", error);
            toast.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
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
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {accounts.map((account, index) => (
                        <tr key={index}>
                            <td className="text-center fw-bold">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                            <td>{account.userName}</td>
                            <td>{account.fullname}</td>
                            <td>{account.email}</td>
                            <td>{account.phone || "N/A"}</td>
                            <td>{roleNames[account.roleName] || "N/A"}</td>
                            <td style={{ color: account.isAccountActive ? 'green' : 'red' }}>
                                {account.isAccountActive ? "Đang hoạt động" : "Ngưng hoạt động"}
                            </td>

                            <td>
                                <td>
                                    <Button variant="info" className="me-2" onClick={() => handleViewDetails(account.id)}>
                                        Chi tiết
                                    </Button>
                                    {account.roleName !== "Admin" && (
                                        <>

                                            <Button variant="warning" onClick={() => handleShowEdit(account.id)}>
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
            </Modal>
            <Modal show={showDetails} onHide={handleCloseDetails} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Chi tiết tài khoản</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={4}>Tên đăng nhập</Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    type="text"
                                    value={selectedAccount?.userName || ""}
                                    readOnly
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={4}>Vai trò</Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    type="text"
                                    value={roleNames[selectedAccount?.roleName] || "N/A"}
                                    readOnly
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={4}>Họ tên</Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    type="text"
                                    value={selectedAccount?.fullname || ""}
                                    readOnly
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={4}>Email</Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    type="text"
                                    value={selectedAccount?.email || ""}
                                    readOnly
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={4}>Giới tính</Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    type="text"
                                    value={
                                        selectedAccount?.gender === true
                                            ? "Nam"
                                            : selectedAccount?.gender === false
                                                ? "Nữ"
                                                : ""
                                    }
                                    readOnly
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={4}>Ngày sinh</Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    type="text"
                                    value={selectedAccount?.dob ? new Date(selectedAccount.dob).toLocaleDateString() : ""}
                                    readOnly
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={4}>Số điện thoại</Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    type="text"
                                    value={selectedAccount?.phone || ""}
                                    readOnly
                                />
                            </Col>
                        </Form.Group>
                        {selectedAccount?.roleName === "Student" && (
                            <>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={4}>Mã sinh viên</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control
                                            type="text"
                                            value={selectedAccount?.studentCode || ""}
                                            readOnly
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={4}>Chuyên ngành</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control
                                            type="text"
                                            value={selectedAccount?.majorName || ""}
                                            readOnly
                                        />
                                    </Col>
                                </Form.Group>
                            </>
                        )}
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={4}>Trạng thái</Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    type="text"
                                    value={selectedAccount?.isAccountActive ? "Đang hoạt động" : "Ngưng hoạt động"}
                                    readOnly
                                />
                            </Col>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDetails}>Đóng</Button>
                    <Button variant="warning" onClick={() => { handleCloseDetails(); handleShowEdit(selectedAccount.id); }}>
                        Chỉnh sửa
                    </Button>
                    {selectedAccount?.roleName !== "Student" && selectedAccount?.roleName !== "Admin" && (
                        <>
                            <Button
                                variant="danger"
                                onClick={() => handleResetPassword(selectedAccount.id)} // Gọi hàm reset mật khẩu
                            >
                                Đặt lại mật khẩu
                            </Button>
                        </>
                    )}
                </Modal.Footer>
            </Modal>
            <Modal show={showEdit} onHide={handleCloseEdit} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Chỉnh sửa tài khoản</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={4}>
                                Tên đăng nhập <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    type="text"
                                    name="userName"
                                    value={editUser.userName}
                                    readOnly
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={4}>
                                Vai trò <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Col sm={8}>
                                {editUser.roleName === "Student" ? (
                                    <Form.Control
                                        type="text"
                                        value="Sinh viên"
                                        readOnly
                                    />
                                ) : (
                                    <Form.Select
                                        name="roleName"
                                        value={editUser.roleName}
                                        onChange={handleEditChange}
                                    >
                                        <option value="SchoolService">Dịch vụ sinh viên</option>
                                        <option value="AdmissionOfficer">Cán bộ tuyển sinh</option>
                                        <option value="AdmissionCouncil">Hội đồng tuyển sinh</option>
                                        <option value="Admin">Quản trị campus</option>
                                    </Form.Select>
                                )}
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={4}>Họ tên</Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    type="text"
                                    name="fullname"
                                    value={editUser.fullname}
                                    onChange={handleEditChange}
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={4}>Email</Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={editUser.email}
                                    onChange={handleEditChange}
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={4}>Giới tính</Form.Label>
                            <Col sm={8}>
                                <Form.Check
                                    type="radio"
                                    id="gender-male"
                                    label="Nam"
                                    name="gender"
                                    value={true}
                                    checked={editUser.gender === true}
                                    onChange={(e) => handleEditChange({ target: { name: "gender", value: e.target.value === "true" } })}
                                />
                                <Form.Check
                                    type="radio"
                                    id="gender-female"
                                    label="Nữ"
                                    name="gender"
                                    value={false}
                                    checked={editUser.gender === false}
                                    onChange={(e) => handleEditChange({ target: { name: "gender", value: e.target.value === "true" } })}
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={4}>Ngày sinh</Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    type="date"
                                    name="dob"
                                    value={editUser.dob ? editUser.dob.split('T')[0] : ""}
                                    onChange={handleEditChange}
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={4}>Số điện thoại</Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    type="text"
                                    name="phone"
                                    value={editUser.phone}
                                    onChange={handleEditChange}
                                />
                            </Col>
                        </Form.Group>
                        {editUser?.roleName === "Student" && (
                            <>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={4}>Mã sinh viên</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control
                                            type="text"
                                            name="studentCode"
                                            value={editUser?.studentCode || ""}
                                            readOnly
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={4}>Chuyên ngành</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control
                                            type="text"
                                            name="majorName"
                                            value={editUser?.majorName || ""}
                                            onChange={handleEditChange}
                                        />
                                    </Col>
                                </Form.Group>
                            </>
                        )}
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={4}>Trạng thái</Form.Label>
                            <Col sm={8}>
                                <Form.Check
                                    type="radio"
                                    id="status-active"
                                    label="Đang hoạt động"
                                    name="isAccountActive"
                                    value={true}
                                    checked={editUser.isAccountActive === true}
                                    onChange={(e) => handleEditChange({ target: { name: "isAccountActive", value: e.target.value === "true" } })}
                                />
                                <Form.Check
                                    type="radio"
                                    id="status-inactive"
                                    label="Ngưng hoạt động"
                                    name="isAccountActive"
                                    value={false}
                                    checked={editUser.isAccountActive === false}
                                    onChange={(e) => handleEditChange({ target: { name: "isAccountActive", value: e.target.value === "true" } })}
                                />
                            </Col>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEdit}>Đóng</Button>
                    <Button className="btn-orange" onClick={handleSubmitEdit}>Cập nhật</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default UserList;
