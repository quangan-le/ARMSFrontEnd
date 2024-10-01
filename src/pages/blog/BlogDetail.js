import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Breadcrumb, Card, ListGroup, Form, Button } from 'react-bootstrap';
import api from '../../apiService';

const BlogDetail = () => {
    const { blogId } = useParams();
    const [blogData, setBlogData] = useState(null); // State để lưu dữ liệu bài viết
    const [comments, setComments] = useState([]); // State để lưu các bình luận
    const [newComment, setNewComment] = useState("");
    const [parentCommentId, setParentCommentId] = useState(null);
    const [relatedBlogs, setRelatedBlogs] = useState([]); // State để lưu danh sách tin tức liên quan

    // Gọi API để lấy dữ liệu bài viết chi tiết
    useEffect(() => {
        const fetchBlogDetail = async () => {
            try {
                const response = await api.get(`/Blog/get-blog?BlogId=${blogId}`);
                setBlogData(response.data);
                setComments(response.data.comments);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu bài viết:', error);
            }
        };

        fetchBlogDetail();
    }, [blogId]);

    // Tạo cấu trúc cây cho các bình luận
    const organizeComments = (comments) => {
        const commentMap = {};
        comments.forEach(comment => (commentMap[comment.commentId] = { ...comment, children: [] }));

        const commentTree = [];
        comments.forEach(comment => {
            if (comment.parentCommentId === null) {
                commentTree.push(commentMap[comment.commentId]);
            } else if (commentMap[comment.parentCommentId]) {
                commentMap[comment.parentCommentId].children.push(commentMap[comment.commentId]);
            }
        });

        return commentTree;
    };

    const handleReply = (commentId) => {
        setParentCommentId(commentId);
    };

    const handleAddComment = () => {
        // Gửi comment mới đến API hoặc thêm vào state tạm thời
        if (newComment.trim()) {
            const newCommentObject = {
                commentId: comments.length + 1,
                content: newComment,
                createdDate: new Date().toISOString(),
                facebookUserId: 'temporaryUserId',
                facebookUserName: 'Temporary User',
                parentCommentId: parentCommentId,
            };
            setComments([...comments, newCommentObject]);
            setNewComment("");
            setParentCommentId(null);
        }
    };

    const renderComment = (comment, level = 0) => (
        <div key={comment.commentId} style={{ marginLeft: level * 20 + 'px' }} className="mb-3">
            <strong>{comment.facebookUserName}</strong> <span className="text-muted">{new Date(comment.createdDate).toLocaleString()}</span>
            <p>{comment.content}</p>
            <div className="actions">
                <Button variant="link" size="sm" onClick={() => handleReply(comment.commentId)}>Trả lời</Button>
                <Button variant="link" size="sm">Chỉnh sửa</Button>
                <Button variant="link" size="sm">Xóa</Button>
            </div>
            {/* Hiển thị các bình luận con */}
            {comment.children.map(childComment => renderComment(childComment, level + 1))}
        </div>
    );

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

                    <div className="comment-section mt-4">
                        <h5>Bình luận</h5>
                        {comments.length === 0 ? (
                            <p>Chưa có bình luận. Hãy là người đầu tiên bình luận!</p>
                        ) : (
                            <div>
                                {organizeComments(comments).map(comment => renderComment(comment))}
                            </div>
                        )}

                        <Form>
                            <Form.Group controlId="commentTextarea">
                                <Form.Control
                                    as="textarea"
                                    rows={1}
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder={parentCommentId ? `Trả lời bình luận #${parentCommentId}` : "Nhập bình luận..."}
                                />
                            </Form.Group>
                            <Button variant="primary" type="button" className="mt-2" onClick={handleAddComment}>
                                Gửi bình luận
                            </Button>
                            {parentCommentId && (
                                <Button variant="secondary" type="button" className="mt-2 ms-2" onClick={() => setParentCommentId(null)}>
                                    Hủy trả lời
                                </Button>
                            )}
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