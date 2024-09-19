import React from 'react';
import { Container, Breadcrumb } from 'react-bootstrap';

const Motto = () => {
    return (
        <div>
            <div className="homeguest-banner position-relative">
                <div className="banner-overlay"></div>
                <h1 className="banner-title">Phương châm đào tạo</h1>
            </div>
            <Container className="mt-4">
                <Breadcrumb>
                    <Breadcrumb.Item href="/" className="text-orange">Trang chủ</Breadcrumb.Item>
                    <Breadcrumb.Item active className="text-orange">Phương châm đào tạo</Breadcrumb.Item>
                </Breadcrumb>
            </Container>
            <Container className="homeguest-description py-3 px-5">
                <p>
                    Phương châm đào tạo của Trường Cao đẳng Nghề là: <strong>Học đi đôi với hành, nghề nghiệp vững chắc, tương lai sáng tạo.</strong>
                </p>
                <p>Với phương châm này, nhà trường cam kết:</p>
                <ol>
                    <li>
                        <strong>Kết hợp lý thuyết và thực hành:</strong> Đào tạo gắn liền với thực tế sản xuất và yêu cầu của doanh nghiệp, đảm bảo sinh viên không chỉ nắm vững kiến thức chuyên môn mà còn thành thạo kỹ năng thực hành.
                    </li>
                    <li>
                        <strong>Chú trọng chất lượng giảng dạy:</strong> Liên tục cải tiến chương trình học và phương pháp giảng dạy, sử dụng công nghệ hiện đại và các phương pháp học tập sáng tạo để truyền đạt kiến thức hiệu quả.
                    </li>
                    <li>
                        <strong>Phát triển toàn diện:</strong> Đào tạo không chỉ về kỹ năng nghề nghiệp mà còn trang bị cho sinh viên những kỹ năng mềm, như giao tiếp, làm việc nhóm, và tư duy sáng tạo, giúp họ tự tin và sẵn sàng đối mặt với mọi thách thức trong công việc và cuộc sống.
                    </li>
                    <li>
                        <strong>Đáp ứng nhu cầu xã hội:</strong> Luôn cập nhật chương trình đào tạo phù hợp với xu hướng thị trường lao động, đảm bảo sinh viên tốt nghiệp có thể đáp ứng ngay yêu cầu của các nhà tuyển dụng.
                    </li>
                </ol>
                <p>
                    Trường Cao đẳng Nghề tin rằng chỉ với nền tảng kiến thức vững chắc, kỹ năng thực hành chuyên sâu, và thái độ làm việc chuyên nghiệp, sinh viên mới có thể tự tin xây dựng một sự nghiệp bền vững và phát triển.
                </p>
            </Container>
        </div>
    );
};

export default Motto;