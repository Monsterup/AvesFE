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
    Form,
    InputGroup,
    InputGroupAddon
} from 'reactstrap';
import Loader from 'react-loader-spinner';
import { AvForm, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import { NotificationContainer } from 'react-notifications';
import auth from '../../auth';
import logo from '../../assets/img/brand/logo_with_tagline.png';
import axios from '../../axios';
import { showNotification } from '../components/Notification';

function ResetPassword(props) {
    if(auth.isAuth()) {
        props.history.push('/')
    }

    const { match: { params } } = props;

    const [loading, setLoading] = useState(false);
    const [pass, setPass] = useState('');
    const [type, setType] = useState("text");

    // Input OnChange
    const onChangePass = (e) => {
        const value = e.target.value;
        setPass(value);
    }

    const onSubmit = async(e) => {
        e.persist();
        try {
            const q= {
                query: `mutation{
                    updatePassword2(email:"${params.email}", token: "${params.code}", passwordBaru:"${pass}")
                }`
            }

            setLoading(true);
            let res = await axios.post('graphql', JSON.stringify(q), {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if(res.data.errors) {
                showNotification("Email tidak terdaftar/Kode keamanan salah", "danger");
                throw new Error();
            }

            showNotification("Password berhasil diubah", "success", "Terima Kasih");

            setTimeout(() => {
                props.history.push('/login');
            }, 3000);

            setLoading(false);
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
                                        <AvForm>
                                            <h5>Pilih Kata Sandi Baru</h5><hr/>
                                            <Row>
                                                <Col md="1"/>
                                                <Col md="10">
                                                    Buat kata sandi baru yang berisi sedikitnya 6 karakter. Disarankan memakai kombinasi huruf, angka, dan tanda baca.<br/><br/>
                                                    <AvGroup>
                                                        <InputGroup>
                                                            <AvInput name="kata_sandi" placeholder="Kata sandi baru" type={type} value={pass} onChange={onChangePass} disabled={loading} required/>
                                                            <InputGroupAddon addonType="append">
                                                                <Button onClick={() => {
                                                                    type === "text" ? setType("password") : setType("text");
                                                                }}>
                                                                    {type === "text" ? 'Sembunyikan' : 'Tampilkan'}
                                                                </Button>
                                                            </InputGroupAddon>
                                                            <AvFeedback>Harap isi kata sandi baru</AvFeedback>
                                                        </InputGroup>
                                                    </AvGroup>
                                                </Col>
                                            </Row><br/><hr/>
                                            <div className="text-right">
                                                    <Button type="submit" color="primary" className="px-4 mx-3" disabled={loading}>
                                                        {loading ? <Loader type="ThreeDots" className="d-flex" height={20} width={40} color="#ffffff"/> : "Simpan"}
                                                    </Button>
                                                    <Link to="/">
                                                        <Button color="white" className="px-4" style={{border: "1px solid #000000"}} disabled={loading}>
                                                            Batalkan
                                                        </Button>
                                                    </Link>
                                            </div>
                                        </AvForm>
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

export default ResetPassword;