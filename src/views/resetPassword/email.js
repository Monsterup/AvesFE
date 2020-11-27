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
import auth from '../../auth';
import logo from '../../assets/img/brand/logo_with_tagline.png';
import axios from '../../axios';
import { showNotification } from '../components/Notification';

function Email(props) {
    if(auth.isAuth()) {
        props.history.push('/')
    }

    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');

    // Input OnChange
    const onChangeEmail = (e) => {
        const value = e.target.value;
        setEmail(value);
    }

    const onSubmit = async(e) => {
        e.persist();
        try {
            const q = {
                query: `mutation{
                    sendLinkForgetPassword(email:"${email}"){
                        email
                    }
                }`
            }

            setLoading(true);
            let res = await axios.post('graphql', JSON.stringify(q), {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if(res.data.errors) {
                showNotification("Email tidak terdaftar", "danger");
                throw new Error();
            }
            
            props.history.push(`/recover/code/email=${email}`);

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
                                        <h5>Reset Kata Sandi</h5><hr/>
                                        <Row>
                                            <Col md="2"/>
                                            <Col md="8">
                                                Ketik email Anda untuk mencari akun Anda.
                                                <Input name="email" placeholder="email" value={email} onChange={onChangeEmail} disabled={loading}/>
                                            </Col>
                                        </Row><br/><hr/>
                                        <div className="text-right">
                                                <Button type="submit" color="primary" className="px-4 mx-3" disabled={loading}>
                                                    {loading ? <Loader type="ThreeDots" className="d-flex" height={20} width={40} color="#ffffff"/> : "Cari"}
                                                </Button>
                                                <Link to="/">
                                                    <Button color="white" className="px-4" style={{border: "1px solid #000000"}} disabled={loading}>
                                                        Batalkan
                                                    </Button>
                                                </Link>
                                        </div>
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

export default Email;