
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Pagination, Breadcrumb, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import api from "../../apiService.js";

const Blog = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [blogs, setBlogs] = useState([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { selectedCampus } = useOutletContext();
    const campusId = selectedCampus.id;

    // Gọi API để lấy danh sách loại tin tức theo CampusId
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                if (campusId) {
                    const response = await api.get(`/Blog/get-blogcategories?CampusId=${campusId}`);
                    setCategories(response.data); // Lưu dữ liệu từ API vào state
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
                    },
                });
                setBlogs(response.data.item);
                setTotalPages(response.data.pageCount);
            }
        } catch (error) {
            console.error("Có lỗi xảy ra khi lấy danh sách blog:", error);
        }
    };

    // Gọi API lấy danh sách blog khi search hoặc currentPage thay đổi
    useEffect(() => {
        fetchBlogs();
    }, [search, currentPage, campusId]);

    // Hàm xử lý sự kiện thay đổi từ khóa tìm kiếm
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setSelectedCategory('');
        setCurrentPage(1);
    };
    return (
        <Container className='mt-5'>
            <h1 className="page-title" style={{ color: 'orange', textAlign: 'center' }}>Tin tức</h1>
            <Breadcrumb>
                <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
                <Breadcrumb.Item active className="text-orange">Tin tức</Breadcrumb.Item>
            </Breadcrumb>

            <div className="filter-section my-3">
                <Row className="align-items-center">
                    <Col md={1} className="text-end">
                        <Form.Label className="fw-bold">Tìm kiếm:</Form.Label>
                    </Col>
                    <Col md={8}>
                        <Form.Control
                            type="text"
                            placeholder="Nhập từ khóa tìm kiếm..."
                            value={search}
                            onChange={handleSearchChange}
                        />
                    </Col>
                    <Col md={3}>
                        <Form.Select
                            value={selectedCategory}
                            onChange={(e) => {
                                setSelectedCategory(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option value="">Phân loại</option>
                            {categories.map((category) => (
                                <option key={category.blogCategoryId} value={category.blogCategoryId}>
                                    {category.blogCategoryName}
                                </option>
                            ))}
                        </Form.Select>
                    </Col>
                </Row>
            </div>
            <Row>
                {blogs.length === 0 ? (
                    <p className="text-center">Không tìm thấy tin tức phù hợp.</p>
                ) : (
                    blogs.map((blog) => (
                        <Col md={3} key={blog.blogId} className="mb-3">
                            <Card className="blog-card h-100">
                                <Card.Img
                                    variant="top"
                                    src={blog.blogDetails[0]?.img || 'https://via.placeholder.com/150?text=No+Image'}
                                    className="blog-card-img"
                                />
                                <Card.Body>
                                    <Card.Title className="blog-card-title">
                                        {blog.title}
                                    </Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">
                                        {new Date(blog.dateCreate).toLocaleDateString('vi-VN')}
                                    </Card.Subtitle>
                                    <Card.Text className="blog-card-text">
                                        {blog.description}
                                    </Card.Text>
                                    <div style={{ textAlign: 'center' }}>
                                        <Button
                                            variant="light"
                                            as={Link}
                                            to={`/tin-tuc/${blog.blogId}`}
                                            className="read-more-btn"
                                        >
                                            Đọc thêm
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                )}
            </Row>
            <div className='d-flex'>
                <Pagination className="mt-3 mx-auto">
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
            </div>
        </Container>
    );
};


export default Blog;