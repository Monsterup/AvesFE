import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Button,
    Card,
    CardBody,
    CardGroup,
    Col,
    Container,
    Row,
    Input,
    Form
} from 'reactstrap';
import Loader from 'react-loader-spinner';
import { NotificationContainer } from 'react-notifications';
import { showNotification } from '../components/Notification';
import auth from '../../auth';
import logo from '../../assets/img/brand/logo_with_tagline.png'
import axios from '../../axios';

function RecoverCode(props) {
    if(auth.isAuth()) {
        props.history.push('/')
    }

    const { match: { params } } = props;

    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [kode, setKode] = useState('');

    // Input OnChange
    const onChangeKode = (e) => {
        const value = e.target.value;
        setKode(value);
    }

    const resendCode = async(e) => {
        e.persist();
        try {
            const q = {
                query: `mutation{
                    sendLinkForgetPassword(email:"${params.email}"){
                        email
                    }
                }`
            }

            setLoading2(true);
            let res = await axios.post('graphql', JSON.stringify(q), {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if(res.data.errors) {
                showNotification("Email tidak terdaftar", "danger");
                throw new Error();
            }

            showNotification("Silahkan cek kotak masuk email anda")
            setLoading2(false);
        } catch (error) {
            console.log(error);
            setLoading2(false);
        }
    }

    const onSubmit = async(e) => {
        e.preventDefault();
        try {
            const q = {
                query: `mutation{
                    cekOtp(resetPasswordToken:"${kode}")
                }`
            }

            setLoading(true);
            let res = await axios.post('graphql', JSON.stringify(q), {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if(res.data.errors) {
                showNotification("Kode keamanan salah", "danger");
                throw new Error();
            }

            props.history.push(`/recover/password/email=${params.email}&code=${kode}`);

            setLoading(true);
            console.log(kode);
            // setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    return (
        <div className="app flex-row align-items-center">
            <Container>
                <NotificationContainer/>
                <div className="text-center justify-content-center d-flex">
                    <img src={logo} style={{maxWidth:"300px"}} alt="Avesbox"/>
                </div><br/>
                <Row className="justify-content-center">
                    <Col md="8">
                        <CardGroup className="box-shadow">
                            <Card className="text-black">
                                <CardBody>
                                    <Form onSubmit={onSubmit}>
                                        <h5>Masukkan Kode Keamanan</h5><hr/>
                                        <Row>
                                            <Col md="1"/>
                                            <Col md="10">
                                                Periksa email apakah menerima pesan yang berisi kode Anda. Kode sepanjang 6 digit. <br/><br/>
                                            </Col>
                                            <Col md="1"/>
                                            <Col md="1"/>
                                            <Col md="6">
                                                <Input name="email" className="mt-1" placeholder="Masukkan kode" value={kode} onChange={onChangeKode} disabled={loading}/>
                                            </Col>
                                            <Col md="4">
                                                <b>Kami mengirimi Anda kode ke: </b>
                                                {params.email}
                                            </Col>
                                            <Col md="1"/>
                                        </Row><br/><hr/>
                                        <Row>
                                            <Col md="6" className="pt-1">
                                                <Button className="font-weight-bold" onClick={resendCode} disabled={loading2}> 
                                                    {loading2 ? <Loader type="ThreeDots" className="d-flex" height={20} width={40} color="#ffffff"/> : "Belum menerima kode?"}
                                                </Button>
                                            </Col>
                                            <Col md="6">
                                                <div className="text-right">
                                                    <Button type="submit" color="primary" className="px-4 mx-3" disabled={loading}>
                                                        {loading ? <Loader type="ThreeDots" className="d-flex" height={20} width={40} color="#ffffff"/> : "Lanjutkan"}
                                                    </Button>
                                                    <Link to="/">
                                                        <Button color="white" className="px-4" style={{border: "1px solid #000000"}} disabled={loading}>
                                                            Batalkan
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Form>
                                </CardBody>
                            </Card>
                        </CardGroup>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default RecoverCode;