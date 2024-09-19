import React from 'react';
import { Container, Breadcrumb } from 'react-bootstrap';

const Achievement = () => {
    return (
        <div>
            <div className="homeguest-banner position-relative">
                <div className="banner-overlay"></div>
                <h1 className="banner-title">Thành tích</h1>
            </div>
            <Container className="mt-4">
                <Breadcrumb>
                    <Breadcrumb.Item href="/" className="text-orange">Trang chủ</Breadcrumb.Item>
                    <Breadcrumb.Item active className="text-orange">Thành tích</Breadcrumb.Item>
                </Breadcrumb>
            </Container>
            <Container className="homeguest-description py-3 px-5">
                <p>
                    Trường Cao đẳng Nghề tự hào với những thành tích nổi bật trong quá trình phát triển và khẳng định vị thế của mình trong lĩnh vực giáo dục nghề nghiệp. Dưới đây là một số thành tích đáng chú ý của nhà trường:
                </p>
                <ol>
                    <li>
                        <strong>Chất lượng đào tạo đạt chuẩn:</strong>
                        <ul>
                            <li>
                                Trường đã đạt chứng nhận kiểm định chất lượng giáo dục nghề nghiệp theo tiêu chuẩn quốc gia, khẳng định chất lượng đào tạo luôn đáp ứng các yêu cầu khắt khe của Bộ Lao động - Thương binh và Xã hội.
                            </li>
                            <li>
                                Hơn [số lượng sinh viên tốt nghiệp mỗi năm], với tỷ lệ có việc làm sau khi ra trường lên đến [tỷ lệ phần trăm]%.
                            </li>
                        </ul>
                    </li>
                    <li>
                        <strong>Giải thưởng và danh hiệu:</strong>
                        <ul>
                            <li>
                                Được trao tặng Bằng khen của Thủ tướng Chính phủ vì những đóng góp xuất sắc trong sự nghiệp giáo dục nghề nghiệp.
                            </li>
                            <li>
                                Nhận nhiều giải thưởng cấp quốc gia và khu vực trong các kỳ thi tay nghề, bao gồm các giải nhất, nhì, ba ở các lĩnh vực như công nghệ thông tin, cơ khí, điện tử, và du lịch.
                            </li>
                            <li>
                                Được vinh danh là một trong những trường cao đẳng nghề tiêu biểu toàn quốc trong việc đổi mới sáng tạo phương pháp giảng dạy.
                            </li>
                        </ul>
                    </li>
                    <li>
                        <strong>Hợp tác quốc tế và doanh nghiệp:</strong>
                        <ul>
                            <li>
                                Thiết lập quan hệ hợp tác với nhiều trường đại học, tổ chức giáo dục, và doanh nghiệp trong và ngoài nước, tạo điều kiện cho sinh viên thực tập, trao đổi học thuật, và cơ hội việc làm quốc tế.
                            </li>
                            <li>
                                Được các đối tác doanh nghiệp đánh giá cao về chất lượng nguồn nhân lực, liên tục ký kết các biên bản ghi nhớ hợp tác đào tạo và tuyển dụng.
                            </li>
                        </ul>
                    </li>
                    <li>
                        <strong>Cơ sở vật chất và công nghệ hiện đại:</strong>
                        <ul>
                            <li>
                                Đầu tư mạnh mẽ vào cơ sở vật chất, xây dựng các phòng học, phòng thực hành, và xưởng đào tạo hiện đại, trang bị đầy đủ các thiết bị và công nghệ tiên tiến.
                            </li>
                            <li>
                                Áp dụng công nghệ số vào quản lý và giảng dạy, giúp nâng cao trải nghiệm học tập cho sinh viên.
                            </li>
                        </ul>
                    </li>
                    <li>
                        <strong>Hoạt động nghiên cứu và sáng tạo:</strong>
                        <ul>
                            <li>
                                Đội ngũ giảng viên và sinh viên đã thực hiện nhiều đề tài nghiên cứu khoa học, dự án sáng tạo được công nhận và ứng dụng thực tiễn.
                            </li>
                            <li>
                                Tổ chức và tham gia nhiều cuộc thi, hội thảo khoa học nhằm thúc đẩy sự sáng tạo và nghiên cứu trong cộng đồng học viên.
                            </li>
                        </ul>
                    </li>
                </ol>
                <p>
                    Với những thành tựu này, Trường Cao đẳng Nghề [Tên Trường] không chỉ khẳng định vị thế là một cơ sở đào tạo nghề hàng đầu mà còn góp phần tích cực vào việc phát triển nguồn nhân lực chất lượng cao cho đất nước.
                </p>
            </Container>
        </div>
    );
};

export default Achievement;