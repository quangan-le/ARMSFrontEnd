import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Modal, Pagination, Row, Table } from "react-bootstrap";
import { useOutletContext } from 'react-router-dom';
import api from "../../apiService.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TextEditor from '../../firebase/TextEditor.js';

const NewsList = () => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [blogs, setBlogs] = useState([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [categories, setCategories] = useState([]);
    const { selectedCampus } = useOutletContext();
    const campusId = selectedCampus.id;
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                if (campusId) {
                    const response = await api.get(`/Blog/get-blogcategories?CampusId=${campusId}`);
                    setCategories(response.data);
                }
            } catch (error) {
                console.error("Có lỗi xảy ra khi lấy danh sách loại tin tức:", error);
            }
        };

        fetchCategories();
    }, [campusId]);
    // Gọi API để lấy danh sách các blog theo điều kiện tìm kiếm
    const fetchBlogs = async () => {
        try {
            if (campusId) {
                const response = await api.get(`/Blog/get-blogs`, {
                    params: {
                        CampusId: campusId,
                        Search: search,
                        CurrentPage: currentPage,
                        PageSize: 8,
                        CategoryID: selectedCategory || null,
                    },
                });
                setBlogs(response.data.item);
                setTotalPages(response.data.pageCount);
                setTotalItems(response.data.totalItems);
            }
        } catch (error) {
            console.error("Có lỗi xảy ra khi lấy danh sách blog:", error);
        }
    };
    // Gọi API lấy danh sách blog khi search hoặc currentPage thay đổi
    useEffect(() => {
        fetchBlogs();
    }, [search, currentPage, campusId, selectedCategory]);

    // Hàm xử lý sự kiện thay đổi từ khóa tìm kiếm
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };
    // Pagination and state
    const itemsPerPage = 8;
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [selectedNews, setSelectedNews] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const handleShowModal = async (news) => {
        try {

            const response = await api.get(`/Blog/get-blog?BlogId=${news.blogId}`);
            const blogData = response.data;
            setSelectedNews(blogData);
            setIsEditing(false);
            setShowModal(true); // Hiển thị modal
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu bài viết:', error);
        }
    };
    const handleEditModal = (news) => {
        handleShowModal(news);
        setIsEditing(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedNews(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setSelectedNews((prevState) => {
            if (name === "blogCategoryId") {
                // Cập nhật giá trị cho blogCategory
                return {
                    ...prevState,
                    blogCategory: {
                        ...prevState.blogCategory,
                        blogCategoryId: value,
                    },
                };
            } else {
                return {
                    ...prevState,
                    [name]: value,
                };
            }
        });
    };

    const handleEditorChange = (content) => {
        setSelectedNews((prevState) => ({
            ...prevState,
            content,
        }));
    };

    const handleSaveChanges = async () => {
        try {
            const updatedNew = {
                blogId: selectedNews.blogId,
                title: selectedNews.title,
                img: selectedNews.img,
                description: selectedNews.description,
                content: selectedNews.content,
                blogCategoryId: selectedNews.blogCategory.blogCategoryId,
            };
            await api.put(`/school-service/Blog/update-blog`, updatedNew)
            fetchBlogs();
            toast.success("Bài viết đã được cập nhật thành công!");
        } catch (error) {
            console.error("Lỗi khi lưu thay đổi:", error);
            toast.error("Lưu thay đổi thất bại.");
        } finally {
            handleCloseModal();
        }
    };

    // Tạo mới blog
    const [showModalCreate, setShowModalCreate] = useState(false);
    const [newPost, setNewPost] = useState({
        title: '',
        description: '',
        content: '',
        postType: '',
        img: null,
    });

    const handleCloseCreateModal = () => {
        setShowModalCreate(false);
    };
    const handleCreateInputChange = (e) => {
        const { name, value } = e.target;
        setNewPost((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    const handleCreateNew = async () => {
        try {
            await api.post(`/Blog/create-blog`, newPost);
            fetchBlogs();
            toast.success("Bài viết đã được tạo thành công!");
        } catch (error) {
            console.error("Lỗi khi tạo bài viết mới:", error);
            toast.error("Tạo bài viết thất bại.");
        } finally {
            handleCloseCreateModal();
        }
    };
    const handleShowCreateModal = () => {
        setNewPost({
            title: '',
            description: '',
            content: '',
            postType: '',
            img: null,
        });
        setShowModalCreate(true);
    };
    return (
        <Container>
            <ToastContainer position="top-right" autoClose={3000} />
            <h2 className="text-center text-orange fw-bold">Danh sách tin tức</h2>
            <p className="text-center mb-4 fw-bold text-orange">Quản lý danh sách tin tức thuộc campus</p>

            <Row className="mb-3">
                <Col xs={12} md={6} className="d-flex">
                    <Form.Group className="me-2 d-flex align-items-center" style={{ flexGrow: 1, whiteSpace: 'nowrap' }}>
                        <Form.Label className="mb-0 me-2">Tìm kiếm:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Nhập từ khóa tìm kiếm..."
                            value={search}
                            onChange={handleSearchChange}
                            className="flex-grow-1"
                        />
                    </Form.Group>
                </Col>
                <Col xs={12} md={6} className="d-flex justify-content-end">

                    <Form.Select
                        className="me-2"
                        style={{ width: '200px' }}
                        value={selectedCategory}
                        onChange={(e) => {
                            setSelectedCategory(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="">Tất cả bài viết</option>
                        {categories.map((category) => (
                            <option key={category.blogCategoryId} value={category.blogCategoryId}>
                                {category.blogCategoryName}
                            </option>
                        ))}
                    </Form.Select>
                    <Button
                        variant="orange"
                        className="text-white"
                        onClick={handleShowCreateModal}
                    >
                        Tạo mới
                    </Button>
                </Col>

            </Row>

            <Table bordered>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Ảnh</th>
                        <th>Tiêu đề</th>
                        <th>Mô tả</th>
                        <th>Thời gian đăng bài</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {blogs && blogs.length > 0 ? (
                        blogs.map((news, index) => (
                            <tr key={news.id}>
                                <td className="text-center fw-bold">{index + 1}</td>
                                <td>
                                    {news.img && (
                                        <div className="mt-2">
                                            <img
                                                src={news.img}
                                                alt={news.title}
                                                style={{ width: '100px', height: 'auto', objectFit: 'cover' }}
                                            />
                                        </div>
                                    )}
                                </td>
                                <td>
                                    <div className="d-flex align-items-center">

                                        <div className="ms-3">
                                            <span
                                                className="text-orange fw-bold"
                                                onClick={() => handleShowModal(news)}
                                                style={{ cursor: "pointer" }}
                                            >
                                                {news.title}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td>{news.description}</td>
                                <td>{new Date(news.dateCreate).toLocaleDateString('vi-VN')}</td>
                                <td>
                                    <Button
                                        variant="orange"
                                        className="text-white"
                                        style={{ whiteSpace: 'nowrap' }}
                                        onClick={() => handleEditModal(news)}
                                    >
                                        Chỉnh sửa
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">
                                Không có bài viết nào
                            </td>
                        </tr>
                    )}
                </tbody>

            </Table>

            {/* Pagination Section */}
            <div className="d-flex justify-content-between">
                <span>
                    Hiển thị {startItem}-{endItem} trên tổng số {totalItems} tin tức
                </span>
                {totalPages > 1 && totalItems > 0 && (
                    <Pagination>
                        <Pagination.Prev
                            onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))}
                            disabled={currentPage === 1}
                        />
                        {[...Array(totalPages)].map((_, index) => (
                            <Pagination.Item
                                key={index}
                                active={index + 1 === currentPage}
                                onClick={() => setCurrentPage(index + 1)}
                            >
                                {index + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next
                            onClick={() => setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        />
                    </Pagination>
                )}


            </div>

            <Modal show={showModal} onHide={handleCloseModal} size="xl" centered>
                {selectedNews && (
                    <>
                        <Modal.Header closeButton>
                            <Modal.Title>{isEditing ? 'Chỉnh sửa tin tức' : 'Chi tiết tin tức'}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>Tiêu đề</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    value={selectedNews.title}
                                    onChange={handleInputChange}
                                    readOnly={!isEditing}
                                />
                            </Form.Group>
                            <Row>
                                <Col md={3}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Loại bài viết</Form.Label>
                                        <Form.Select
                                            name="blogCategoryId"
                                            value={selectedNews.blogCategory.blogCategoryId}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                        >
                                            {categories.map((category) => (
                                                <option key={category.blogCategoryId} value={category.blogCategoryId}>
                                                    {category.blogCategoryName}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Hình ảnh</Form.Label>
                                        {selectedNews.img && (
                                            <div className="mt-2">
                                                <img
                                                    src={selectedNews.img}
                                                    alt="Blog Image"
                                                    style={{ width: '200px', height: 'auto', objectFit: 'cover' }}
                                                />
                                            </div>
                                        )}
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-3">
                                <Form.Label>Mô tả</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={5}
                                    name="description"
                                    value={selectedNews.description}
                                    onChange={handleInputChange}
                                    readOnly={!isEditing}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Nội dung</Form.Label>
                                {isEditing ? (
                                    <TextEditor
                                        value={selectedNews.content}
                                        onChange={handleEditorChange}
                                        name="content"
                                    />
                                ) : (
                                    <div dangerouslySetInnerHTML={{ __html: selectedNews.content }} />
                                )}
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
            <Modal show={showModalCreate} onHide={handleCloseCreateModal} size="xl" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Tạo mới bài viết</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Tiêu đề:</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={newPost.title}
                            onChange={handleCreateInputChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Loại bài viết:</Form.Label>
                        <Form.Select
                            name="postType"
                            value={newPost.postType}
                            onChange={handleCreateInputChange}
                        >
                            {categories.map((category) => (
                                <option key={category.blogCategoryId} value={category.blogCategoryId}>
                                    {category.blogCategoryName}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Mô tả:</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            name="description"
                            value={newPost.description}
                            onChange={handleCreateInputChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Nội dung:</Form.Label>
                        <TextEditor
                            value={newPost.content}
                            onChange={handleCreateInputChange}
                            name="content"
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseCreateModal}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={handleCreateNew}>
                        Lưu
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default NewsList;
