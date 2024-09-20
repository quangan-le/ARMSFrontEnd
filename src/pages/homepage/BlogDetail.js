import React from 'react';
import { Container, Row, Col, Breadcrumb, Card, ListGroup, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const BlogDetail = () => {
    return (
        <Container className="news-detail my-4">
            <Breadcrumb>
                <Breadcrumb.Item href="/" >Trang chủ</Breadcrumb.Item>
                <Breadcrumb.Item href="/tin-tuc">Danh sách tin tức</Breadcrumb.Item>
                <Breadcrumb.Item active className="text-orange">Thông tin tuyển sinh 2024</Breadcrumb.Item>
            </Breadcrumb>

            <Row>
                <Col md={8}>
                    <h2 className="news-title">Thông tin tuyển sinh 2024</h2>
                    <p className="text-muted">Ngày đăng: 20/09/2024</p>

                    <div className="news-content">
                        <p>Chi tiết nội dung bài viết về thông tin tuyển sinh 2024...</p>
                    </div>

                    {/* Comment Section */}
                    <div className="comment-section mt-4">
                        <h5>Bình luận</h5>
                        <p>Chưa có bình luận. Hãy là người đầu tiên bình luận!</p>
                        <Form>
                            <Form.Group controlId="commentTextarea">
                                <Form.Label>Viết bình luận của bạn</Form.Label>
                                <Form.Control as="textarea" rows={4} placeholder="Nhập bình luận tại đây..." />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="mt-2">
                                Gửi bình luận
                            </Button>
                        </Form>
                    </div>
                </Col>
                <Col md={4}>
                    <h5 className="mb-3">Tin tức khác</h5>
                    <ListGroup>
                        {[...Array(5)].map((_, index) => (
                            <ListGroup.Item key={index} className="d-flex align-items-center">
                                <img
                                    src={`https://via.placeholder.com/80?text=News+${index + 1}`}
                                    alt={`News ${index + 1}`}
                                    className="me-3"
                                    style={{ width: '80px', height: '80px' }}
                                />
                                <div>
                                    <h6 className="mb-1">Tiêu đề tin tức {index + 1}</h6>
                                    <p className="mb-0 text-muted">Mô tả ngắn gọn về tin tức {index + 1}</p>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>
            </Row>
        </Container>
    );
};

export default BlogDetail;