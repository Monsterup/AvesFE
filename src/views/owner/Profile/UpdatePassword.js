import React, {useState} from "react";
import { Col, Row, Button, Container, CardGroup, CardBody, Card, CardHeader, Label, InputGroup, InputGroupAddon} from "reactstrap";
import {NotificationContainer} from 'react-notifications';
import {AvForm, AvInput as AV} from 'availity-reactstrap-validation'
import axios from "../../../axios";
import {showNotification} from "../../components/Notification";
import AvInput from "../../components/Input";
import UpdatePassword2 from './UpdatePassword2';
import auth from '../../../auth';
// import useApp from '../../hooks/useApp';

function UpdateEmail(props) {
    const [cekOTP, setCekOTP] = useState(false);
    const [object, setObject] = useState(null);
    const [loading, setLoading] = useState(false);
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
                <UpdatePassword2 modal={cekOTP} data={object} onSuccess={() => props.history.push('profile')} onCancel={() => setCekOTP(false)}/>
            </div>
        )
    }

    
    const Form = () => {
        return (
            <AvForm onSubmit={handleSubmit}>
                <Row>
                    <Col md="12">
                        <AvInput type="text" label="Password Lama"/>
                    </Col>
                    <Col md="12">
                        <AvInput type="text" label="Password Baru"/>
                    </Col>
                    <Col md="12">
                        <AvInput type="text" name="ulangi_password" label="Konfirmasi Password Baru"/>
                    </Col>
                    <br/>
                    <br/>
                    <br/>
                </Row>
                <br/>

                <Row>
                    <Col md="12">
                        <Button type="button" color="secondary" onClick={() => {props.history.push('profile')}} className="float-left">Kembali</Button>
                        <Button type="submit" color="primary" className="float-right" disabled={loading}>Lanjut</Button>{' '}
                    </Col>
                </Row>
            </AvForm>
        )
    }

    const handleSubmit = async (e, err, value) => {
        if (err.length > 0) {
            return;
        }
        if (value.password_baru !== value.ulangi_password) {
            showNotification("Konfirmasi Password baru tidak sama", "danger");
            return;
        }

        if (value.password_lama === value.password_baru) {
            showNotification("Mohon gunakan password baru", "danger");
            return;
        }

        try {
            setLoading(true);
            const q = {
                query: `query{
                    login(email:"${email}", password:"${value.password_lama}"){
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
                setLoading(false);                
                showNotification("Password salah", "danger");
                return;
            }

            const q3 = {
                query: `mutation{
                    otp2(email:"${email}", emailBaru:"${email}"){
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
                setLoading(false);
                showNotification("Password salah", "danger");
                return;
            }

            setLoading(false);
            setObject({email: email, passwordBaru: value.password_baru});
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