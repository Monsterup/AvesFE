import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from '../../axios';
import {
    Button,
    Card,
    CardGroup,
    CardBody,
    Col,
    Container,
    InputGroup,
    InputGroupAddon,
    Form,
    Row,
    Label
} from 'reactstrap'
import {
    AvForm,
    AvInput,
    AvGroup,
    AvField
} from 'availity-reactstrap-validation';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import {showNotification} from '../components/Notification'
import logo from '../../assets/img/brand/logo_only.svg'
import Input from '../components/Input'

function Register(props) {
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState([]);
    const [kota, setKota] = useState([]);
    const [kotaOpt, setKotaOpt] = useState(true);
    const [kec, setKec] = useState([]);
    const [kecOpt, setKecOpt] = useState(true);
    const [desa, setDesa] = useState([]);
    const [desaOpt, setDesaOpt] = useState(true);
    const [typePass, setTypePass] = useState('password');
    const [email, setEmail] = useState('');
    const [emailOpt, setEmailOpt] = useState(false);
    const type = [{value : 'Perusahaan Kemitraan' , option : 'Perusahaan Kemitraan'}, { value : 'Peternakan Mandiri', option : 'Peternakan Mandiri'}];

    const showPass = () => {
        typePass === 'password' ? setTypePass('text') : setTypePass('password');
    }

    const handleRegister = async(e, err, value) => {
        try {
            const alamat = value.desa.split(",")[1]+", "+value.kecamatan.split(",")[1]+", "+
                value.kabupaten.split(",")[1]+", "+value.provinsi.split(",")[1];
            const query = {
                query: `mutation{
                      register(registerInput: {
                        name : "${value.nama_lengkap}"
                        email : "${value.email}"
                        username : "${value.nama_pengguna}"
                        password : "${value.password}"
                        address : "${alamat}"
                        companyName : "${value.nama_peternakan}"
                        companyType : "${value.jenis_peternakan}"
                        type : "owner"
                        oauthType: "${value.oauth}"
                        token: "${value.token}"
                      }){
                        name
                        email
                      }
                    }
                `
            };
            let res = await axios.post('graphql', JSON.stringify(query), {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            const resData = res.data;
            if (resData.errors){
                showNotification("Email/username sudah terdaftar","danger", "Ups!")
                return;
            }
            if(value.oauth === "facebook" || value.oauth === "google")
                showNotification("Silahkan lakukan login", "success", "Terima Kasih");
            else
                showNotification("Silahkan lakukan verifikasi email anda untuk login", "success", "Terima Kasih");
            setTimeout(() => {
                props.history.push('/login');
            }, 5000);
        } catch (e) {
            showNotification("Input tidak valid", "danger", "Ups!")
        }
    }

    const selectAddress = async (cb) => {
        // const kode = await axios.get()
        const provinsi = await axios.get('https://dev.farizdotid.com/api/daerahindonesia/provinsi');
        cb(provinsi.data.provinsi)
    }

    useEffect(() => {
        selectAddress(res => {
            console.log(res);
            setAddress(res)
        })
    }, [])

    const handleProvince = async(e) => {
        const value = e.target.value;
        let id;
        if(value === "") {
            setKotaOpt(true)
            setKecOpt(true)
            setDesaOpt(true)
            setKota([])
            setKec([])
            setDesa([])
        }
        if(value !== ""){
            id = value.split(",")[0];
            await axios.get(`https://dev.farizdotid.com/api/daerahindonesia/kota?id_provinsi=${id}`)
            .then(res => {
                setKota(res.data.kota_kabupaten)
                setKotaOpt(false)
            })
            .catch(err => {
                console.log(err)
            })
        }
    }

    const handleKabupaten = async(e) => {
        const value = e.target.value;
        let id;
        if(value === "") {
            setKecOpt(true)
            setDesaOpt(true)
            setKec([])
            setDesa([])
        }
        if(value !== ""){
            id = value.split(",")[0];
            await axios.get(`https://dev.farizdotid.com/api/daerahindonesia/kecamatan?id_kota=${id}`)
            .then(res => {
                if(res.data.kecamatan !== null)
                    setKec(res.data.kecamatan)
                setKecOpt(false)
            })
            .catch(err => {
                console.log(err)
            })
        }
    }

    const handleKecamatan = async(e) => {
        const value = e.target.value;
        let id;
        if(value === "") {
            setDesaOpt(true)
            setDesa([])
        }
        if(value !== ""){
            id = value.split(",")[0];
            await axios.get(`https://dev.farizdotid.com/api/daerahindonesia/kelurahan?id_kecamatan=${id}`)
            .then(res => {
                setDesa(res.data.kelurahan)
                setDesaOpt(false)
            })
            .catch(err => {
                console.log(err)
            })
        }
    }

    return (
        <div className="app flex-row align-items-center">
            <NotificationContainer/>
            <Container fluid={false}>
                <Row className="justify-content-center">
                    <Col md="10">
                        <CardGroup className="box-shadow">
                            <Card className="text-black p-5 d-md-down-none" style={{"maxWidth":"350px"}}>
                                <CardBody className="text-center justify-content-center d-flex">
                                    <div className="my-auto">
                                        <img src={logo} alt="Avesbox"/>
                                        <br/>
                                        <br/>
                                        <h1 className="font-5xl font-weight-bold">avesbox</h1>
                                        <p className="font-italic" style={{"fontWeight":500}}>empowering chicken farms</p>
                                    </div>
                                </CardBody>
                            </Card>
                            <Card className="p-4 bg-avesbox-orange">
                            <CardBody>
                                <h1 className="font-weight-bold">Daftar</h1>
                                <br/>
                                <Form>
                                    <AvForm onSubmit={handleRegister}>
                                        <Row>
                                            <AvInput hidden name="oauth"
                                                value={props.history.location.state !== undefined ? props.history.location.state.data.oauth : ''}
                                            />
                                            <AvInput hidden name="token"
                                                value={props.history.location.state !== undefined ? props.history.location.state.data.accessToken : ''}
                                            />
                                            <Col md="6">
                                                <Input label="Nama Lengkap" minLength="5"
                                                    value={props.history.location.state !== undefined ? props.history.location.state.data.name : ''}
                                                />
                                            </Col>
                                            <Col md="6">
                                                <Input  type="email" label="Email" minLength="5" 
                                                    value={props.history.location.state !== undefined ? props.history.location.state.data.email : ''}
                                                />
                                            </Col>
                                            <Col md="6">
                                                <Input  label="Nama Pengguna" pattern/>
                                            </Col>
                                            <Col md="6">
                                            <AvGroup>
                                                <Label>Password</Label>
                                                <InputGroup>
                                                <AvInput name="password" type={typePass} required/>
                                                <InputGroupAddon addonType="append">
                                                    <Button className="btn btn-light" onClick={showPass} style={{"color": "black"}}><i className={typePass === 'text' ? 'fa fa-eye' : 'fa fa-eye-slash'}></i></Button>
                                                </InputGroupAddon>
                                                </InputGroup>
                                            </AvGroup>
                                            </Col>
                                            <Col md="6">
                                                <AvField type="select" onChange={handleProvince} name="provinsi" label="Provinsi">
                                                    <option></option>
                                                    {address.map(r => {
                                                        let value = r.id + "," + r.nama;
                                                        return <option key={r.id} value={value}>{r.nama}</option>
                                                    })}
                                                </AvField>
                                            </Col>
                                            <Col md="6">
                                                <AvField type="select" onChange={handleKabupaten} name="kabupaten" label="Kabupaten" disabled={kotaOpt}>
                                                    <option></option>
                                                    {kota.map(r => {
                                                        let value = r.id + "," + r.nama;
                                                        return <option key={r.id} value={value}>{r.nama}</option>
                                                    })}
                                                </AvField>
                                            </Col>
                                            <Col md="6">
                                                <AvField type="select" onChange={handleKecamatan} name="kecamatan" label="Kecamatan" disabled={kecOpt}>
                                                    <option></option>
                                                    {kec.map(r => {
                                                        let value = r.id + "," + r.nama;
                                                        return <option key={r.id} value={value}>{r.nama}</option>
                                                    })}
                                                </AvField>
                                            </Col>
                                            <Col md="6">
                                                <AvField type="select" name="desa" label="Desa" disabled={desaOpt}>
                                                    <option></option>
                                                    {desa.map(r => {
                                                        let value = r.id + "," + r.nama;
                                                        return <option key={r.id} value={value}>{r.nama}</option>
                                                    })}
                                                </AvField>
                                            </Col>
                                            <Col md="6">
                                                <Input  label="Nama Peternakan"/>
                                            </Col>
                                            <Col md="6">
                                                <AvField required={true} type="select" name="jenis_usaha_peternakan" label="Jenis Peternakan" >
                                                    <option></option>
                                                    {type.map((data,key) => {
                                                        return(<option key={key} value={data.value}>{data.option}</option>)
                                                    })}
                                                </AvField>
                                            </Col>
                                            <Col md="12">
                                                <br/>
                                            </Col>
                                            <Col md="12" className="text-right">
                                                <Button type="submit" color="primary" className="px-4" block>Daftar</Button>
                                            </Col>
                                        </Row>
                                    </AvForm>
                                    <br/>
                                    <p> Sudah memiliki Akun ? <Link
                                        to="/login" className="font-weight-bold" style={{"letterSpacing":.5}}>Masuk</Link> Sekarang!</p>
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

export default Register;