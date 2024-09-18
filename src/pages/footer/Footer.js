import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-orange p-4">
            <div className="container">
                <div className="row">
                    <div className="col-md-4 d-flex align-items-center text-white">
                        <h4>Admissions and Registration Management Software</h4>
                    </div>
                    <div className="col-md-8">
                        <h5 className="text-white">Hệ thống phòng tuyển sinh</h5>
                        <div className="row">
                            <div className="col-md-6">
                                <p><strong>Cơ sở Hà Nội</strong><br />
                                    Cổng số 1, Tòa nhà FPT Polytechnic, 13 phố Trịnh Văn Bô,<br />
                                    phường Phương Canh, quận Nam Từ Liêm, TP Hà Nội<br />
                                    Km12 Cầu Diễn, Phường Phúc Diễn, Quận Bắc Từ Liêm, Hà Nội<br />
                                    (024) 8582 0808
                                </p>
                                <p><strong>Cơ sở Đà Nẵng</strong><br />
                                    137 Nguyễn Thị Thập, Phường Hòa Minh, Quận Liên Chiểu, TP Đà Nẵng<br />
                                    (0236) 7300 468
                                </p>
                            </div>

                            <div className="col-md-6">
                                <p><strong>Cơ sở Hồ Chí Minh</strong><br />
                                    391A Nam Kỳ Khởi Nghĩa, Phường 7, Quận 3, TP Hồ Chí Minh<br />
                                    (028) 7300 468
                                </p>
                                <p><strong>Cơ sở Cần Thơ</strong><br />
                                    160 Đường 30/4, P. Hưng Lợi, Q. Ninh Kiều, TP Cần Thơ<br />
                                    (0292) 3739 394
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </footer>
    );
};

export default Footer;