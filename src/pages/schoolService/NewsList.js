import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Modal, Pagination, Row, Table } from "react-bootstrap";
import { useOutletContext } from 'react-router-dom';
import api from "../../apiService.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TextEditor from '../../firebase/TextEditor.js';
import uploadImage from '../../firebase/uploadImage.js';
import { ClipLoader } from "react-spinners";

const NewsList = () => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [blogs, setBlogs] = useState([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [categories, setCategories] = useState([]);
    const { campusId } = useOutletContext();

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
    const [newImage, setNewImage] = useState(null); // Trạng thái lưu trữ hình ảnh mới

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
        setSelectedNews((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleEditorChange = (content) => {
        setSelectedNews((prevState) => ({
            ...prevState,
            content,
        }));
    };

    const handleSaveChanges = async () => {
        try {
            let updatedImage = selectedNews.img;
            // Nếu người dùng chọn hình ảnh mới, upload và sử dụng URL mới
            if (newImage) {
                const imageUrl = await uploadImage(newImage, 'Blog');
                updatedImage = imageUrl; // Cập nhật hình ảnh mới
            }
            const updatedNew = {
                blogId: selectedNews.blogId,
                title: selectedNews.title,
                img: updatedImage,
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
        img: null,
        description: '',
        content: '',
        blogCategoryId: '',
    });
    const [uploading, setUploading] = useState(false); // Trạng thái tải lên

    const handleCloseCreateModal = () => {
        setShowModalCreate(false);
    };
    const handleCreateInputChange = (e) => {
        const { name, value } = e.target;
        setNewPost((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        console.log(newPost);
    };

    const handleContentChange = (content) => {
        setNewPost((prev) => ({
            ...prev,
            content,
        }));
    };

    const handleCreateNew = async () => {
        try {
            let imageUrl = null;
            setUploading(true);
            // Tải ảnh lên firebase và nhận URL
            if (newPost.img) {
                imageUrl = await uploadImage(newPost.img, 'Blog');
                // setNewPost((prevState) => ({
                //     ...prevState,
                //     img: imageUrl,
                // }));
            }

            const blogData = {
                ...newPost,
                img: imageUrl,
            };
            await api.post('/school-service/Blog/add-blog', blogData);
            toast.success('Bài viết đã được tạo thành công!');
            fetchBlogs();
        } catch (error) {
            console.error('Lỗi khi tạo bài viết mới:', error);
            toast.error('Tạo bài viết thất bại.');
        } finally {
            setUploading(false);
            handleCloseCreateModal();
        }
    };

    const handleShowCreateModal = () => {
        setNewPost({
            title: '',
            img: null,
            description: '',
            content: '',
            blogCategoryId: '',
        });
        setShowModalCreate(true);
    };

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedBlogId, setSelectedBlogId] = useState(null);
    // Hiển thị modal xác nhận xóa
    const handleOpenDeleteModal = (blogId) => {
        setSelectedBlogId(blogId);
        setShowDeleteModal(true);
    };

    // Đóng modal
    const handleCloseDeleteModal = () => {
        setSelectedBlogId(null);
        setShowDeleteModal(false);
    };

    // Xử lý xóa blog
    const handleConfirmDelete = async () => {
        setShowDeleteModal(false);
        try {
            await api.delete(`/school-service/Blog/delete-blog?BlogId=${selectedBlogId}`);
            toast.success("Bài viết đã được xóa thành công!");
            fetchBlogs(); // Tải lại danh sách blog
        } catch (error) {
            console.error("Lỗi khi xóa bài viết:", error);
            toast.error("Xóa bài viết thất bại.");
        } finally {
            setSelectedBlogId(null);
        }
    };

    return (
        <Container>
            <ToastContainer position="top-right" autoClose={3000} />
            <h2 className="text-center text-orange fw-bold">Danh sách tin tức</h2>
            <p className="text-center mb-4 fw-bold text-orange">Quản lý danh sách tin tức thuộc campus</p>

            <Row className="mb-3">
                <Col xs={12} md={6} className="d-flex">
                    <Form.Group className="me-2 d-flex align-items-center" style={{ flexGrow: 1, whiteSpace: 'nowrap' }}>
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

            <Table striped bordered hover>
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
                                <td className="text-center fw-bold">{startItem + index}</td> {/* Cập nhật số thứ tự */}
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
                                    <div className="d-flex justify-content-center gap-2">
                                        <Button
                                            variant="orange"
                                            className="text-white"
                                            style={{ whiteSpace: 'nowrap' }}
                                            onClick={() => handleEditModal(news)}
                                        >
                                            Chỉnh sửa
                                        </Button>
                                        <Button
                                            variant="danger"
                                            className="text-white"
                                            style={{ whiteSpace: 'nowrap' }}
                                            onClick={() => handleOpenDeleteModal(news.blogId)}
                                        >
                                            Xóa
                                        </Button>
                                    </div>
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

                                <Col md={3}>
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
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        {isEditing ? ( // Hiển thị phần chọn tệp khi ở chế độ chỉnh sửa
                                            <Form.Control
                                                type="file"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        setNewImage(file); // Cập nhật hình ảnh mới khi người dùng chọn
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            setSelectedNews((prevState) => ({
                                                                ...prevState,
                                                                img: reader.result, // Cập nhật hình ảnh hiển thị trong modal
                                                            }));
                                                        };
                                                        reader.readAsDataURL(file); // Chuyển hình ảnh thành URL để hiển thị
                                                    }
                                                }}
                                                disabled={!isEditing} // Không cho phép chọn khi không ở chế độ chỉnh sửa
                                            />
                                        ) : (
                                            // Ẩn phần chọn tệp khi ở chế độ xem
                                            <div className="mt-2">

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
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Tiêu đề:</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="title"
                                    value={newPost.title}
                                    onChange={handleCreateInputChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Loại bài viết:</Form.Label>
                                <Form.Select
                                    name="blogCategoryId"
                                    value={newPost.blogCategoryId}
                                    onChange={handleCreateInputChange}
                                >
                                    <option value="">Chọn loại bài viết</option>
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
                                    rows={3}
                                    name="description"
                                    value={newPost.description}
                                    onChange={handleCreateInputChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Chọn ảnh:</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setNewPost({ ...newPost, img: e.target.files[0] })}
                                />
                            </Form.Group>
                            {newPost.img && (
                                <div
                                    className='mx-auto'
                                    style={{
                                        width: "290.4px",
                                        height: "200px",
                                        overflow: "hidden",
                                        borderRadius: "5px",
                                        border: "1px solid #ccc",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <img
                                        src={URL.createObjectURL(newPost.img)}
                                        alt="Selected"
                                        style={{
                                            maxWidth: "100%",
                                            maxHeight: "100%",
                                            objectFit: "cover",
                                        }}
                                    />
                                </div>
                            )}
                        </Col>
                    </Row>
                    <Form.Group className="mb-3">
                        <Form.Label>Nội dung:</Form.Label>
                        <TextEditor
                            value={newPost.content}
                            onChange={handleContentChange}
                            name="content"
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseCreateModal}>
                        Hủy
                    </Button>
                    <Button
                        variant="orange"
                        className="text-white"
                        style={{ whiteSpace: 'nowrap' }}
                        onClick={handleCreateNew}
                        disabled={uploading}
                    >
                        {uploading ? (
                            <ClipLoader size={20} color={"#fff"} loading={uploading} />
                        ) : (
                            'Lưu'
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Modal xác nhận xóa */}
            <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="text-center w-100 text-orange">Xác nhận xóa</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <p>Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.</p>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-center gap-2">
                    <Button variant="secondary" onClick={handleCloseDeleteModal} style={{ flex: 1 }}>
                        Hủy
                    </Button>
                    <Button variant="danger" onClick={handleConfirmDelete} style={{ flex: 1 }}>
                        Xóa
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default NewsList;
