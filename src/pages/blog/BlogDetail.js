import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Breadcrumb, Card, ListGroup } from 'react-bootstrap';
import api from '../../apiService';

const BlogDetail = () => {
    const { blogId } = useParams();
    const [blogData, setBlogData] = useState(null); // State để lưu dữ liệu bài viết
    const [relatedBlogs, setRelatedBlogs] = useState([]); // State để lưu danh sách tin tức liên quan

    // Gọi API để lấy dữ liệu bài viết chi tiết
    useEffect(() => {
        const fetchBlogDetail = async () => {
            try {
                const response = await api.get(`/Blog/get-blog?BlogId=${blogId}`);
                setBlogData(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu bài viết:', error);
            }
        };

        fetchBlogDetail();
    }, [blogId]);

    // Khởi tạo và cập nhật plugin bình luận của Facebook khi URL thay đổi
    useEffect(() => {
        if (window.FB) {
            window.FB.XFBML.parse();  // Cập nhật plugin Facebook
        }
    }, [blogData]);

    return (
        <Container className="news-detail my-4">
            <Breadcrumb>
                <Breadcrumb.Item href="/" >Trang chủ</Breadcrumb.Item>
                <Breadcrumb.Item href="/tin-tuc">Danh sách tin tức</Breadcrumb.Item>
                <Breadcrumb.Item active className="text-orange">{blogData?.title || 'Đang tải...'}</Breadcrumb.Item>
            </Breadcrumb>

            <Row>
                <Col md={8}>
                    <h2 className="news-title">{blogData?.title || 'Đang tải...'}</h2>
                    <p className="text-muted">Ngày đăng: {new Date(blogData?.dateCreate).toLocaleDateString() || 'Đang tải...'}</p>

                    <div className="news-content">
                        {blogData?.blogDetails?.map((detail, index) => (
                            <div key={detail.bdId} className="mb-4">
                                {detail.img && <img src={detail.img} alt="Blog" className="img-fluid mb-3" />}
                                <p>{detail.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* Thêm Facebook Comments Plugin */}
                    <div className="facebook-comments mt-4">
                        <h5>Bình luận Facebook</h5>
                        <div 
                            className="fb-comments" 
                            data-href={window.location.href} 
                            data-width="100%" 
                            data-numposts="5">
                        </div>
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
