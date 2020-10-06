import React, {useState} from "react";
import { Col, Row, Button, Container, CardGroup, CardBody, Card, CardHeader} from "reactstrap";
import {NotificationContainer} from 'react-notifications';
import {AvForm} from 'availity-reactstrap-validation'
import axios from "../../../axios";
import {showNotification} from "../../components/Notification";
import AvInput from "../../components/Input";
import UpdateEmail2 from './UpdateEmail2';
import auth from '../../../auth';
// import useApp from '../../hooks/useApp';

function UpdateEmail(props) {
    const [cekOTP, setCekOTP] = useState(false);
    const [object, setObject] = useState(null);
    let email;

    if(typeof(props.location.state) === 'undefined') {
        console.log('wow')
        props.history.push('profile')
    } else {
        email = props.location.state.email;
    }

    const Modal = () => {
        return (
            <div>
                <UpdateEmail2 modal={cekOTP} data={object} onSuccess={() => props.history.push('profile')} onCancel={() => setCekOTP(false)}/>
            </div>
        )
    }

    
    const Form = () => {
        return (
            <AvForm onSubmit={handleSubmit}>
                <Row>
                    <Col md="12">
                        <AvInput type="email" required={false} label="Email Baru"/>
                    </Col>
                    <Col md="12">
                        <AvInput type="password" required={false} label="Password"/>
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        <Button type="button" color="secondary" onClick={() => {props.history.push('profile')}} className="float-left">Kembali</Button>
                        <Button type="submit" color="primary" className="float-right">Lanjut</Button>{' '}
                    </Col>
                </Row>
            </AvForm>
        )
    }

    const handleSubmit = async (e, err, value) => {
        if (err.length > 0) {
            return;
        }

        if (email === value.email_baru) {
            showNotification("Mohon gunakan email baru", "danger");
            return;
        }

        try {
            const q2 = {
                query: `query{
                    emailExist(email:"${value.email_baru}")
                }`
            }

            let resEmailExist = await axios.post('graphql', JSON.stringify(q2), {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const emailExist = resEmailExist.data.data.emailExist;

            if (emailExist) {
                showNotification("Email telah digunakan, silahkan gunakan email lain", "danger");
                return;
            }

            const q = {
                query: `query{
                    login(email:"${email}", password:"${value.password}"){
                        name
                        type
                        token
                        company
                    }
                }`
            }

            let res = await axios.post('graphql', JSON.stringify(q), {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const resData = res.data;
            if (resData.errors) {
                showNotification("Password salah", "danger");
                return;
            }

            const q3 = {
                query: `mutation{
                    otp(email:"${email}", emailBaru:"${value.email_baru}"){
                        code
                    }
                }`
            }

            let resOTP = await axios.post('graphql', JSON.stringify(q3), {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const resOTPData = resOTP.data;

            if (resOTPData.errors) {
                showNotification("Password salah", "danger");
                return;
            }

            setObject({email: email, emailBaru: value.email_baru});
            setCekOTP(true);
        } catch (e) {
            console.log(e);
            showNotification("Data tidak valid", "danger")
        }
    }

    return (
        <div className="mt-5">
            <Container>
                <NotificationContainer/>  
                <Modal/>
                <Row className="justify-content-center">
                    <Col md="8">
                        <CardGroup className="box-shadow">
                            <Card className="text-black">
                                <Row>
                                    <Col md="12">
                                        <CardHeader className="pb-1">
                                            <h5>Ubah Email</h5>
                                        </CardHeader>
                                        <CardBody className="text-center justify-content-center d-flex">
                                            <Form/>
                                        </CardBody>
                                    </Col>
                                </Row>
                            </Card>
                        </CardGroup>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default UpdateEmail;