import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-orange p-4">
            <div className="container">
                <div className="row">
                    <div className="col-md-4 d-flex align-items-center text-white">
                        <h4 className='my-3'>Admissions and Registration Management Software</h4>
                    </div>
                    <div className="col-md-8">
                        <h5 className="text-white">Hệ thống phòng tuyển sinh</h5>
                        <div className="row">
                            <div className="col-md-6">
                                <p><strong>Cơ sở Hà Nội</strong><br />
                                    Công số 1, Tòa nhà A5, 13 phố Trịnh Văn Bô, phường Phương Canh, quận Nam Từ Liêm, TP Hà Nội <br />
                                    (024) 8582 0808
                                </p>
                            </div>
                            <div className="col-md-6">
                                <p><strong>Cơ sở Hồ Chí Minh</strong><br />
                                    Tòa nhà QTSC9 (toà T), đường Tô Ký, phường Tân Chánh Hiệp, quận 12, TP HCM. 778/B1 Nguyễn Kiệm, phường 04, quận Phú Nhuận, TP HCM<br />
                                    0901 660 002-028 6686 6486
                                </p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <p><strong>Cơ sở Đà Nẵng</strong><br />
                                    137 Nguyễn Thị Thập, Phường Hòa Minh, Quận Liên Chiểu, TP Đà Nẵng<br />
                                    (0236) 7300 468
                                </p>
                            </div>
                            <div className="col-md-6">
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