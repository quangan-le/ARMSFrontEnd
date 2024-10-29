import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Breadcrumb, ListGroup, Button } from 'react-bootstrap';
import { Link, useOutletContext } from 'react-router-dom';
import api from '../../apiService';

const BlogDetail = () => {
    const { selectedCampus } = useOutletContext();
    const { blogId } = useParams();
    const [blogData, setBlogData] = useState(null);
    const [relatedBlogs, setRelatedBlogs] = useState([]);

    useEffect(() => {
        const fetchBlogDetail = async () => {
            try {
                const response = await api.get(`/Blog/get-blog?BlogId=${blogId}`);
                setBlogData(response.data);

                const categoryId = response.data.blogCategory.blogCategoryId;
                fetchRelatedBlogs(categoryId);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu bài viết:', error);
            }
        };

        const fetchRelatedBlogs = async (categoryId) => {
            try {
                const response = await api.get(`/Blog/get-top5blogs?CampusId=${selectedCampus.id}&BlogCategoryId=${categoryId}`);
                setRelatedBlogs(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy tin tức liên quan:', error);
            }
        };

        fetchBlogDetail();
    }, [blogId]);

    // Khởi tạo và cập nhật plugin bình luận của Facebook khi URL thay đổi
    useEffect(() => {
        if (window.FB) {
            window.FB.XFBML.parse();
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
                        <p>{blogData?.description || 'Đang tải...'}</p>
                        <div dangerouslySetInnerHTML={{ __html: blogData?.content || '' }} />
                    </div>

                    <div className="facebook-comments mt-4">
                        <h6>Bình luận Facebook</h6>
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
                        {relatedBlogs.map((blog) => (
                            <ListGroup.Item key={blog.blogId} className="d-flex align-items-center">
                                <img
                                    src="https://via.placeholder.com/80"
                                    alt={blog.title}
                                    className="me-3"
                                    style={{ width: '80px', height: '80px' }}
                                />
                                <div>
                                    <h6 className="mb-1">{blog.title}</h6>
                                    <p className="mb-0 text-muted">{blog.description}</p>
                                    <Button
                                        variant="link"
                                        as={Link}
                                        to={`/tin-tuc/${blog.blogId}`}
                                        className="read-more-btn p-0"
                                    >
                                        Đọc thêm
                                    </Button>
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
