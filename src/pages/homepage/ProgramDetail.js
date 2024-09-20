import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Breadcrumb } from 'react-bootstrap';
import axios from 'axios';

const ProgramDetail = () => {
    // const { majorField, minorField } = useParams();
    // const [programDescription, setProgramDescription] = useState('');

    // useEffect(() => {
    //     const fetchProgramDetails = async () => {
    //         const response = await axios.get(`/api/programs/${majorField}${minorField ? `/${minorField}` : ''}`);
    //         setProgramDescription(response.data.description);
    //     };

    //     fetchProgramDetails();
    // }, [majorField, minorField]);

    return (
        <div>
            {/* <Breadcrumb>
                <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
                <Breadcrumb.Item href="/nganh-hoc">Ngành học</Breadcrumb.Item>
                <Breadcrumb.Item href={`/nganh-hoc/${majorField}`}>{majorField}</Breadcrumb.Item>
                {minorField && <Breadcrumb.Item active>{minorField}</Breadcrumb.Item>}
            </Breadcrumb>

            <h1>{minorField ? minorField : majorField}</h1>
            <p>{programDescription}</p> */}
        </div>
    );
};

export default ProgramDetail;