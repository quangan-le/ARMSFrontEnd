
import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, Card, Col, Container, Form, Pagination, Row } from 'react-bootstrap';
import { Link, useOutletContext } from 'react-router-dom';
import api from "../../apiService.js";

const Blog = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [blogs, setBlogs] = useState([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { selectedCampus } = useOutletContext();
    const campusIdGuest = selectedCampus?.id;
    const { campusId } = useOutletContext();

    // Gọi API để lấy danh sách loại tin tức theo CampusId
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                if (campusIdGuest) {
                    const response = await api.get(`/Blog/get-blogcategories?CampusId=${campusIdGuest}`);
                    setCategories(response.data);
                }
                if (campusId) {
                    const response = await api.get(`/Blog/get-blogcategories?CampusId=${campusId}`);
                    setCategories(response.data);
                }
            } catch (error) {
                console.error("Có lỗi xảy ra khi lấy danh sách loại tin tức:", error);
            }
        };

        fetchCategories();
    }, [campusId, campusIdGuest]);

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
            }
            if (campusIdGuest) {
                const response = await api.get(`/Blog/get-blogs`, {
                    params: {
                        CampusId: campusIdGuest,
                        Search: search,
                        CurrentPage: currentPage,
                        PageSize: 8,
                        CategoryID: selectedCategory || null,
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
    }, [search, currentPage, campusId, selectedCategory, campusIdGuest]);

    // Hàm xử lý sự kiện thay đổi từ khóa tìm kiếm
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };
    return (
        <Container className='mt-5'>
            <h1 className="page-title" style={{ color: 'orange', textAlign: 'center' }}>Tin tức</h1>
            <div className="filter-section m-3 ">
                {campusIdGuest && (
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <Link to="/">Trang chủ</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item active className="text-orange">Tin tức</Breadcrumb.Item>
                    </Breadcrumb>
                )}
                <Row className="align-items-center">
                    <Col md={9} className="mt-3 d-flex align-items-center">
                        <Form.Control
                            type="text"
                            placeholder="Nhập từ khóa tìm kiếm..."
                            value={search}
                            onChange={handleSearchChange}
                            className="flex-grow-1"
                        />
                    </Col>
                    <Col md={3} className="mt-3">
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
            <Row className='mx-3'>
                {blogs.length === 0 ? (
                    <p className="text-center">Không tìm thấy tin tức phù hợp.</p>
                ) : (
                    blogs.map((blog) => (
                        <Col md={3} sm={6} key={blog.blogId} className="mb-3">
                            <Card className="blog-card h-100">
                                <Card.Img
                                    variant="top"
                                    src={blog.img || 'https://phothongcaodang.fpt.edu.vn/wp-content/uploads/800x870.jpg'}
                                    className="blog-card-img"
                                />
                                <Card.Body>
                                    <Card.Title className="blog-card-title">
                                        <Link to={`/tin-tuc/${blog.blogId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <h6 className="mb-1" style={{ cursor: 'pointer' }}>{blog.title}</h6>
                                        </Link>
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