import React from 'react';
import { Container, Breadcrumb } from 'react-bootstrap';

const History = () => {
    return (
        <div>
            <div className="homeguest-banner position-relative">
                <div className="banner-overlay"></div>
                <h1 className="banner-title">Lịch sử thành lập</h1>
            </div>
            <Container className="mt-4">
                <Breadcrumb>
                    <Breadcrumb.Item href="/" className="text-orange">Trang chủ</Breadcrumb.Item>
                    <Breadcrumb.Item active className="text-orange">Lịch sử thành lập</Breadcrumb.Item>
                </Breadcrumb>
            </Container>
            <Container className="homeguest-description py-3 px-5">
                <p>
                    Trường Cao đẳng Nghề được thành lập vào năm 2010 với mục tiêu cung cấp nguồn nhân lực chất lượng cao cho thị trường lao động trong và ngoài nước. Ban đầu, trường chỉ có một số ngành nghề đào tạo cơ bản, nhưng qua nhiều năm phát triển, nhà trường đã không ngừng mở rộng quy mô và nâng cao chất lượng giảng dạy, trở thành một trong những cơ sở giáo dục nghề nghiệp hàng đầu trong khu vực.
                </p>
                <p>
                    Trong những năm đầu hoạt động, trường đã tập trung xây dựng cơ sở vật chất và đội ngũ giảng viên, phát triển chương trình đào tạo theo hướng ứng dụng thực tế, đáp ứng nhu cầu của các doanh nghiệp. Trường đã thiết lập quan hệ hợp tác với nhiều doanh nghiệp, cơ sở sản xuất, và các tổ chức giáo dục trong và ngoài nước nhằm nâng cao chất lượng đào tạo và tạo điều kiện cho sinh viên thực hành, thực tập.
                </p>
                <p>
                    Với phương châm <strong>"Học đi đôi với hành"</strong>, Trường Cao đẳng Nghề đã và đang đóng góp tích cực vào việc nâng cao tay nghề và tạo cơ hội việc làm cho hàng nghìn sinh viên mỗi năm, khẳng định vị thế và uy tín trong lĩnh vực đào tạo nghề nghiệp tại Việt Nam.
                </p>
                <p>
                    Hiện nay, trường tiếp tục phát triển các ngành nghề mới, phù hợp với xu hướng của thị trường lao động và nhu cầu của xã hội, nhằm đáp ứng tốt hơn nữa sự phát triển của nền kinh tế và công nghiệp 4.0.
                </p>
            </Container>
        </div>
    );
};

export default History;