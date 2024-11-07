import React, { useState } from "react";
import { Button, Table, Form, Pagination, Container, Row, Col, Modal } from "react-bootstrap";

const NewsList = () => {
    const [searchTitle, setSearchTitle] = useState("");

    // Dummy data for news posts
    const newsPosts = [
        { id: 1, title: "Thông tin tuyển sinh năm 2024", description: "Lorem ipsum dolor sit amet...", date: "12/12/2024", imgSrc: "/path/to/image.png" },
        { id: 2, title: "Thông tin tuyển sinh năm 2024", description: "Lorem ipsum dolor sit amet...", date: "12/12/2024", imgSrc: "/path/to/image.png" },
        { id: 3, title: "Thông tin tuyển sinh năm 2024", description: "Lorem ipsum dolor sit amet...", date: "12/12/2024", imgSrc: "/path/to/image.png" },
        { id: 4, title: "Thông tin tuyển sinh năm 2024", description: "Lorem ipsum dolor sit amet...", date: "12/12/2024", imgSrc: "/path/to/image.png" },
        { id: 5, title: "Thông tin tuyển sinh năm 2024", description: "Lorem ipsum dolor sit amet...", date: "12/12/2024", imgSrc: "/path/to/image.png" },
        { id: 6, title: "Thông tin tuyển sinh năm 2024", description: "Lorem ipsum dolor sit amet...", date: "12/12/2024", imgSrc: "/path/to/image.png" },
        { id: 7, title: "Thông tin tuyển sinh năm 2024", description: "Lorem ipsum dolor sit amet...", date: "12/12/2024", imgSrc: "/path/to/image.png" },
        { id: 8, title: "Thông tin tuyển sinh năm 2024", description: "Lorem ipsum dolor sit amet...", date: "12/12/2024", imgSrc: "/path/to/image.png" }
    ];

    // Pagination and state
    const [activePage, setActivePage] = useState(2); // Current page
    const totalItems = 120; // Total news items
    const itemsPerPage = 10;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [selectedNews, setSelectedNews] = useState(null);
    const [isEditing, setIsEditing] = useState(false);  
    
    const handlePageChange = (pageNumber) => {
        setActivePage(pageNumber);
    };

    const handleShowModal = (news) => {
        setSelectedNews(news);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedNews(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedNews((prevNews) => ({
            ...prevNews,
            [name]: value,
        }));
    };

    const handleSaveChanges = () => {
        console.log('Saving updated news:', selectedNews);
        handleCloseModal();
    };
    return (
        <Container>
            <h2 className="text-center">Danh sách tin tức</h2>
            <p className="text-center mb-4 fw-bold">Quản lý danh sách tin tức thuộc campus</p>

            <Row className="mb-3">
                <Col xs={12} md={6} className="d-flex">
                    <Form.Group className="me-2 d-flex align-items-center" style={{ flexGrow: 1, whiteSpace: 'nowrap' }}>
                        <Form.Label className="mb-0 me-2">Tìm kiếm:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Nhập tiêu đề bài viết"
                            value={searchTitle}
                            onChange={(e) => setSearchTitle(e.target.value)}
                        />
                    </Form.Group>
                </Col>
                <Col xs={12} md={6} className="d-flex justify-content-end">

                    <Form.Select className="me-2" style={{ width: '200px' }}>
                        <option>Chọn loại bài viết</option>
                        <option value="1">Loại 1</option>
                        <option value="2">Loại 2</option>
                        <option value="3">Loại 3</option>
                    </Form.Select>
                </Col>
            </Row>

            <Table bordered>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tiêu đề</th>
                        <th>Mô tả</th>
                        <th>Thời gian đăng bài</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {newsPosts.map((news) => (
                        <tr key={news.id}>
                            <td>1</td>
                            <td>
                                <div className="d-flex align-items-center">
                                    <img src={news.imgSrc} alt="News" className="img-thumbnail" width="80" />
                                    <div className="ms-3">
                                        <span className="text-orange fw-bold" onClick={() => handleShowModal(news)} style={{ cursor: "pointer" }}>
                                            {news.title}
                                        </span>
                                    </div>
                                </div>
                            </td>
                            <td>{news.description}</td>
                            <td>{news.date}</td>
                            <td>
                                <Button variant="warning" className="text-white">Chỉnh sửa</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Pagination Section */}
            <div className="d-flex justify-content-between">
                <span>Hiển thị {activePage * itemsPerPage - itemsPerPage + 1}-{Math.min(activePage * itemsPerPage, totalItems)} trên tổng số {totalItems} ngành học</span>
                <Pagination>
                    <Pagination.Prev disabled={activePage === 1} onClick={() => handlePageChange(activePage - 1)} />
                    {[...Array(totalPages)].map((_, i) => (
                        <Pagination.Item key={i + 1} active={i + 1 === activePage} onClick={() => handlePageChange(i + 1)}>
                            {i + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next disabled={activePage === totalPages} onClick={() => handlePageChange(activePage + 1)} />
                </Pagination>
            </div>

            <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
                {selectedNews && (
                    <>
                        <Modal.Header closeButton>
                            <Modal.Title>{isEditing ? 'Chỉnh sửa tin tức' : 'Chi tiết tin tức'}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>Tiêu đề:</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    value={selectedNews.title}
                                    onChange={handleInputChange}
                                    readOnly={!isEditing}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Loại bài viết:</Form.Label>
                                <Form.Select
                                    name="postType"
                                    value={selectedNews.postType}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                >
                                    <option value="Tuyển sinh">Tuyển sinh</option>
                                    <option value="Loại 1">Loại 1</option>
                                    <option value="Loại 2">Loại 2</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Nội dung:</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={5}
                                    name="content1"
                                    value={selectedNews.content1}
                                    onChange={handleInputChange}
                                    readOnly={!isEditing}
                                />
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                {isEditing ? 'Hủy' : 'Quay lại'}
                            </Button>
                            {isEditing ? (
                                <Button variant="warning" className="text-white" onClick={handleSaveChanges}>
                                    Lưu
                                </Button>
                            ) : (
                                <Button variant="warning" className="text-white" onClick={() => setIsEditing(true)}>
                                    Chỉnh sửa
                                </Button>
                            )}
                        </Modal.Footer>
                    </>
                )}
            </Modal>
        </Container>
    );
};

export default NewsList;
