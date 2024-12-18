import React, { useEffect, useState } from 'react';
import { Breadcrumb, Col, Container, ListGroup, Row } from 'react-bootstrap';
import { Link, useOutletContext, useParams } from 'react-router-dom';
import api from '../../apiService';

const BlogDetail = () => {
    const { selectedCampus } = useOutletContext();
    const campusIdGuest = selectedCampus?.id;

    const { blogId } = useParams();
    const [blogData, setBlogData] = useState(null);
    const [relatedBlogs, setRelatedBlogs] = useState([]);
    const { campusId } = useOutletContext();

    useEffect(() => {
        const fetchBlogDetail = async () => {
            try {
                const response = await api.get(`/Blog/get-blog?BlogId=${blogId}`);
                setBlogData(response.data);

                const categoryId = response.data.blogCategory.blogCategoryId;
                if (selectedCampus) {
                    fetchRelatedBlogs(categoryId, selectedCampus.id);
                }
                if (campusId) {
                    fetchRelatedBlogs(categoryId, campusId);
                }
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu bài viết:', error);
            }
        };

        const fetchRelatedBlogs = async (categoryId, campusId) => {
            try {
                const response = await api.get(`/Blog/get-top5blogs?CampusId=${campusId}&BlogCategoryId=${categoryId}`);
                setRelatedBlogs(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy tin tức liên quan:', error);
            }
        };

        fetchBlogDetail();
    }, [blogId, selectedCampus]);

    // Khởi tạo và cập nhật plugin bình luận của Facebook khi URL thay đổi
    useEffect(() => {
        if (window.FB) {
            window.FB.XFBML.parse();
        }
    }, [blogData]);

    return (
        <Container className="news-detail my-4">
            {campusIdGuest && (
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/">Trang chủ</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link to="/tin-tuc">Danh sách tin tức</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item active className="text-orange">
                        {blogData?.title || 'Đang tải...'}
                    </Breadcrumb.Item>
                </Breadcrumb>
            )}
            <Row className='px-3'>
                <Col md={8}>
                    <h2 className="news-title">{blogData?.title || 'Đang tải...'}</h2>
                    <p className="text-muted">Ngày đăng: {new Date(blogData?.dateCreate).toLocaleDateString() || 'Đang tải...'}</p>
                    <div className="news-content">
                        <p>{blogData?.description || 'Đang tải...'}</p>
                        <div dangerouslySetInnerHTML={{ __html: blogData?.content || '' }} />
                    </div>
                    <div
                        class="fb-like"
                        data-share="true"
                        data-width="450"
                        data-show-faces="true">
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
                    <h5 className="mb-3">Tin tức nổi bật</h5>
                    <ListGroup>
                        {relatedBlogs.map((blog) => (
                            <ListGroup.Item key={blog.blogId} className="d-flex align-items-center">
                                <Link to={`/tin-tuc/${blog.blogId}`}>
                                    <img
                                        src={blog.img || 'https://phothongcaodang.fpt.edu.vn/wp-content/uploads/800x870.jpg'}
                                        alt={blog.title}
                                        className="me-3"
                                        style={{ width: '80px', height: '80px', cursor: 'pointer' }}
                                    />
                                </Link>
                                <div>
                                    <Link to={`/tin-tuc/${blog.blogId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <h6 className="mb-1" style={{ cursor: 'pointer' }}>{blog.title}</h6>
                                    </Link>
                                    <p className="mb-0 text-muted line-clamp">{blog.description}</p>
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
