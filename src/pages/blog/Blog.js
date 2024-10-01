
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Pagination, Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import api from "../../apiService.js";

const Blog = () => {
    const [categories, setCategories] = useState([]); // State để lưu danh sách các loại tin tức
    const [selectedCategory, setSelectedCategory] = useState(''); // State để lưu loại tin tức đã chọn
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
    }, [campusId]); // Gọi lại API mỗi khi campusId thay đổi


    return (
        <Container className='mt-5'>
            <h1 className="page-title" style={{ color: 'orange', textAlign: 'center' }}>Tin tức</h1>
            <Breadcrumb>
                <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
                <Breadcrumb.Item active className="text-orange">Tin tức</Breadcrumb.Item>
            </Breadcrumb>

            <div className="filter-section my-3">
                <select
                    className="form-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="">Phân loại</option>
                    {categories.map((category) => (
                        <option key={category.blogCategoryId} value={category.blogCategoryId}>
                            {category.blogCategoryName}
                        </option>
                    ))}
                </select>
            </div>
            <Row>
                {[...Array(4)].map((_, index) => (
                    <Col md={3} key={index} className="mb-3">
                        <Card>
                            <Card.Img variant="top" src={`https://via.placeholder.com/150?text=News+${index + 1}`} />
                            <Card.Body>
                                <Card.Title>Tiêu đề tin tức {index + 1}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">Ngày tháng</Card.Subtitle>
                                <Card.Text>
                                    Mô tả ngắn gọn về tin tức {index + 1}.
                                </Card.Text>
                                <div style={{ textAlign: 'center' }}>
                                    <Button
                                        variant="light"
                                        as={Link}
                                        to={`/tin-tuc/${index + 1}`}
                                        className="read-more-btn"
                                    >
                                        Đọc thêm
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row>
                {[...Array(4)].map((_, index) => (
                    <Col md={3} key={index + 4} className="mb-3">
                        <Card>
                            <Card.Img variant="top" src={`https://via.placeholder.com/150?text=News+${index + 5}`} />
                            <Card.Body>
                                <Card.Title>Tiêu đề tin tức {index + 5}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">Ngày tháng</Card.Subtitle>
                                <Card.Text>
                                    Mô tả ngắn gọn về tin tức {index + 5}.
                                </Card.Text>
                                <div style={{ textAlign: 'center' }}>
                                    <Button
                                        variant="light"
                                        as={Link}
                                        to={`/tin-tuc/${index + 1}`}
                                        className="read-more-btn"
                                    >
                                        Đọc thêm
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Pagination className="mt-4 mx-auto">
                <Pagination.Prev />
                <Pagination.Item>{1}</Pagination.Item>
                <Pagination.Item>{2}</Pagination.Item>
                <Pagination.Item>{3}</Pagination.Item>
                <Pagination.Next />
            </Pagination>
        </Container>
    );
};

export default Blog;