import React, { useState, useEffect,  } from 'react';
import { Link } from 'react-router-dom';
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
} from 'reactstrap';
import {
    AvForm,
    AvInput,
    AvGroup,
    AvFeedback
} from 'availity-reactstrap-validation';
import { NotificationContainer } from 'react-notifications';
import Loader from 'react-loader-spinner';
import auth from '../../auth';
import Axios from '../../axios';
import { showNotification } from '../components/Notification';
import { useForm } from '../hooks/useForm';
import Input from '../components/Input';
import logo from '../../assets/img/brand/logo_only.svg';

function Register(props) {
    if(auth.isAuth()) {
        props.history.push('/')
    }
    console.log(props.history.location)
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState("password");
    const [value, setValue] = useForm({ 
        nama_lengkap: props.history.location.state !== undefined ? props.history.location.state.name : "", 
        email: props.history.location.state !== undefined ? props.history.location.state.email : "",
        nama_pengguna: "", kata_sandi: "", nama_peternakan: "", jenis_peternakan: ""  
    });
    const oauth = props.history.location.state !== undefined ? props.history.location.state.oauth : "";
    const token = props.history.location.state !== undefined ? props.history.location.state.token : "";
    const [prov, setProv] = useState("");
    const [city, setCity] = useState("");
    const [dist, setDist] = useState("");
    const [vill, setVill] = useState("");

    const peternakan = [{value : 'Perusahaan Kemitraan' , option : 'Perusahaan Kemitraan'}, { value : 'Peternakan Mandiri', option : 'Peternakan Mandiri'}];
    const [provinsi, setProvinsi] = useState([]);
    const [kota, setKota] = useState([]);
    const [kotaOpt, setKotaOpt] = useState(true);
    const [kec, setKec] = useState([]);
    const [kecOpt, setKecOpt] = useState(true);
    const [desa, setDesa] = useState([]);
    const [desaOpt, setDesaOpt] = useState(true);

    // Get Semua Provinsi
    const getProvince = async(cb) => {
        const provinsi = await Axios.get('https://dev.farizdotid.com/api/daerahindonesia/provinsi');
        cb(provinsi.data.provinsi)
    }

    useEffect(() => {
        getProvince(res => {
            setProvinsi(res);
        })
    }, []);

    // Handle onChange Provinsi
    const handleProvince = async(e) => {
        const value = e.target.value;
        if(value !== ""){
            const id = value.split(",")[0];
            const val = value.split(",")[1];
            setProv(val);
            await Axios.get(`https://dev.farizdotid.com/api/daerahindonesia/kota?id_provinsi=${id}`)
                .then(res => {
                    setKota(res.data.kota_kabupaten);
                    setKotaOpt(false);
                    setKecOpt(true);
                    setDesaOpt(true);
                    setKec([]);
                    setDesa([]);                    
                })
                .catch(err => {
                    console.log(err);
                })
        } else {
            setKotaOpt(true);
            setKecOpt(true);
            setDesaOpt(true);
            setKota([]);
            setKec([]);
            setDesa([]);
        }
    }

    // Handle onChange Kabupaten
    const handleCity = async(e) => {
        const value = e.target.value;
        if(value !== ""){
            const id = value.split(",")[0];
            const val = value.split(",")[1];
            setCity(val);
            await Axios.get(`https://dev.farizdotid.com/api/daerahindonesia/kecamatan?id_kota=${id}`)
            .then(res => {
                setKec(res.data.kecamatan)
                setKecOpt(false);
                setDesaOpt(true);
                setDesa([]);
            })
            .catch(err => {
                console.log(err)
            })
        } else {
            setKecOpt(true)
            setDesaOpt(true)
            setKec([])
            setDesa([])
        }
    }

    // Handle onChange kecamatan
    const handleDistrict = async(e) => {
        const value = e.target.value;
        if(value !== ""){
            const id = value.split(",")[0];
            const val = value.split(",")[1];
            setDist(val);
            await Axios.get(`https://dev.farizdotid.com/api/daerahindonesia/kelurahan?id_kecamatan=${id}`)
                .then(res => {
                    setDesa(res.data.kelurahan)
                    setDesaOpt(false)
                })
                .catch(err => {
                    console.log(err);
                })
        } else {
            setDesaOpt(true);
            setDesa([]);
        }
    }

    // Handle onChange desa
    const handleVillage = async(e) => {
        const value = e.target.value;
        let val = value;
        if(value !== ""){
            val = value.split(",")[1];
        }
        setVill(val);
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            const alamat = dist + ", " + dist + ", " + city + ", " + prov;
            const q = {
                query: `mutation{
                    register(registerInput: {
                        name : "${value.nama_lengkap}"
                        email : "${value.email}"
                        username : "${value.nama_pengguna}"
                        password : "${value.kata_sandi}"
                        address : "${alamat}"
                        companyName : "${value.nama_peternakan}"
                        companyType : "${value.jenis_peternakan}"
                        type : "owner"
                        oauthType: "${oauth}"
                        token: "${token}"
                    }){
                        name
                        email
                    }
                    }
                `
            };
            setLoading(true);
            let res = await Axios.post('graphql', JSON.stringify(q), {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            const resData = res.data;
            if (resData.errors){
                showNotification("Email/username sudah terdaftar","danger", "Ups!");
                setLoading(false);
                return;
            }
            if(value.oauth === "facebook" || value.oauth === "google")
                showNotification("Silahkan lakukan login", "success", "Terima Kasih");
            else
                showNotification("Silahkan lakukan verifikasi email anda untuk login", "success", "Terima Kasih");
            setTimeout(() => {
                props.history.push('/login');
            }, 5000);
            setLoading(false);
        } catch (error) {
            showNotification("Input tidak valid", "danger", "Ups!")
        }
    }

    return (
        <div className="app flex-row align-items-center">
            <NotificationContainer/>
            <Container>
                <Row className="justify-content-center">
                    <Col md="10">
                        <CardGroup className="box-shadow">
                            <Card className="text-black p-5 d-md-down-none" style={{"maxWidth":"350px"}}>
                                <CardBody className="text-center justify-content-center d-flex">
                                    <div className="my-auto">
                                        <img src={logo} alt="Avesbox"/><br/><br/>
                                        <h1 className="font-5xl font-weight-bold">avesbox</h1>
                                        <p className="font-italic" style={{"fontWeight":500}}>empowering chicken farms</p>
                                    </div>
                                </CardBody>
                            </Card>
                            <Card className="p-4 bg-avesbox-orange">
                                <CardBody>
                                    <h1 className="font-weight-bold">Daftar</h1><br/>
                                    <Form>
                                        <AvForm onSubmit={handleSubmit} disabled={loading}>
                                            <Row>
                                                <AvInput hidden name="oauth" value={oauth}/>
                                                <AvInput hidden name="token" value={token}/>
                                                <Col md="12">
                                                    <h5>Data Akun</h5><hr/>
                                                </Col>
                                                <Col md="6">
                                                    <Input label="Nama Lengkap" minLength="5"
                                                        value={value.nama_lengkap} onChange={setValue}
                                                    />
                                                </Col>
                                                <Col md="6">
                                                    <Input label="Email" minLength="5"
                                                        value={value.email} onChange={setValue}
                                                    />
                                                </Col>
                                                <Col md="6">
                                                    <Input label="Nama Pengguna" value={value.nama_pengguna} onChange={setValue} pattern/>
                                                </Col>
                                                <Col md="6">
                                                    <AvGroup>
                                                        <Label>Kata Sandi</Label>
                                                        <InputGroup>
                                                            <AvInput name="kata_sandi" type={type} value={value.kata_sandi} onChange={setValue} required/>
                                                            <InputGroupAddon addonType="append">
                                                                <Button onClick={() => {
                                                                    type === "text" ? setType("password") : setType("text");
                                                                }}>
                                                                    <i className={type === "text" ? 'fa fa-eye' : 'fa fa-eye-slash'}/>
                                                                </Button>
                                                            </InputGroupAddon>
                                                            <AvFeedback>Kata Sandi Wajib diisi</AvFeedback>
                                                        </InputGroup>
                                                    </AvGroup><br/>
                                                </Col>
                                                <Col md="12">
                                                    <h5>Data Peternakan</h5><hr/>
                                                </Col>
                                                <Col md="6">
                                                    <Input label="Nama Peternakan" value={value.nama_peternakan} onChange={setValue}/>
                                                </Col>
                                                <Col md="6">
                                                    <Input type="select" label="Jenis Peternakan" value={value.jenis_peternakan} onChange={setValue}>
                                                        <option></option>
                                                        {peternakan.map((data,key) => {
                                                            return(<option key={key} value={data.value}>{data.option}</option>)
                                                        })}
                                                    </Input>
                                                </Col>
                                                <Col md="6">
                                                    <Input type="select" onChange={handleProvince} label="Provinsi" required>
                                                        <option></option>
                                                        {provinsi.map(r => {
                                                            let value = r.id + "," + r.nama;
                                                            return <option key={r.id} value={value}>{r.nama}</option>
                                                        })}
                                                    </Input>
                                                </Col>
                                                <Col md="6">
                                                    <Input type="select" onChange={handleCity} label="Kota" disabled={kotaOpt} required>
                                                        <option></option>
                                                        {kota.map(r => {
                                                            let value = r.id + "," + r.nama;
                                                            return <option key={r.id} value={value}>{r.nama}</option>
                                                        })}
                                                    </Input>
                                                </Col>
                                                <Col md="6">
                                                    <Input type="select" onChange={handleDistrict} label="Kecamatan" disabled={kecOpt} required>
                                                        <option></option>
                                                        {kec.map(r => {
                                                            let value = r.id + "," + r.nama;
                                                            return <option key={r.id} value={value}>{r.nama}</option>
                                                        })}
                                                    </Input>
                                                </Col>
                                                <Col md="6">
                                                    <Input type="select" onChange={handleVillage} label="Desa" disabled={desaOpt} required>
                                                        <option></option>
                                                        {desa.map(r => {
                                                            let value = r.id + "," + r.nama;
                                                            return <option key={r.id} value={value}>{r.nama}</option>
                                                        })}
                                                    </Input>
                                                </Col>
                                                <Col md="12" className="text-right">
                                                    <hr/>
                                                    <Button type="submit" color="primary" className="px-4" block disabled={loading}>
                                                        {loading ? <Loader type="ThreeDots" height={20} width={40} color="#ffffff"/> : "Daftar"}
                                                    </Button>
                                                    <hr/>
                                                </Col>
                                            </Row>
                                        </AvForm>
                                    </Form>
                                    <p> Sudah memiliki Akun? 
                                        <Link to="/login" className="font-weight-bold" style={{"letterSpacing":.5}}> Masuk</Link> Sekarang!
                                    </p>
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