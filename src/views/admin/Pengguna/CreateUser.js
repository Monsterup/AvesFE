import React, {useState, useEffect} from 'react'
import {Button, Col, Row, Input, InputGroup, InputGroupAddon, InputGroupText, Label} from'reactstrap'
import moment from 'moment'
import {AvField, AvGroup, AvInput as AvInput2, AvForm} from 'availity-reactstrap-validation';
import AvInput from '../../components/Input'
import CreateModal from '../../components/CreateModal'
import axios from '../../../axios'
import {showNotification} from '../../components/Notification'
import { NotificationContainer } from 'react-notifications';
import auth from '../../../auth'
import AsyncFetch from '../../components/AsyncFetch';

export default function CreateUser(props) {
    const type = ['admin', 'owner'];
    const [isAdmin, setIsAdmin] = useState(false);
    const [address, setAddress] = useState([]);
    const [kota, setKota] = useState([]);
    const [kotaOpt, setKotaOpt] = useState(true);
    const [kec, setKec] = useState([]);
    const [kecOpt, setKecOpt] = useState(true);
    const [desa, setDesa] = useState([]);
    const [desaOpt, setDesaOpt] = useState(true);
    const type2 = [{value : 'Perusahaan Kemitraan' , option : 'Perusahaan Kemitraan'}, { value : 'Peternakan Mandiri', option : 'Peternakan Mandiri'}];
    
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

    const submit = async(e, err, value) => {
        try {
            const alamat = value.desa.split(",")[1]+", "+value.kecamatan.split(",")[1]+", "+
                value.kabupaten.split(",")[1]+", "+value.provinsi.split(",")[1];
            
            if(isAdmin){
                value.nama_peternakan = 'admin'
                value.jenis_peternakan = 'Peternakan Mandiri'
            }

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
                showNotification(resData.errors[0].message,"danger", "Ups!")
                return;
            }

            showNotification("Lakukan verifikasi pada email yang telah didaftarkan", "success", "Terima Kasih");
            setTimeout(() => {
                props.history.push('/adm/user');
            }, 5000);
        } catch (e) {
            showNotification("Input tidak valid", "danger", "Ups!")
        }
    }

    return (
        <div className="text-center">
            <NotificationContainer/>
            <h2>TAMBAH PENGGUNA</h2>
            <br/>
            <br/>
            <form>
                <AvForm onSubmit={submit}>
                    <Row>
                        <Col md="4"/>
                        <Col md="4">
                            <AvInput label="Nama Lengkap"/>
                        </Col>
                        <Col md="4"/>
                        <Col md="4"/>
                        <Col md="2">
                            <AvInput label="Nama Pengguna"/>
                        </Col>
                        <Col md="2">
                        <AvInput label="Tipe Pengguna" type="select" onChange={
                                e => {
                                    if(e.target.value === 'admin') setIsAdmin(true)
                                    else setIsAdmin(false)
                                }
                            }
                        >
                            <option></option>
                            {type.map((data, key) => {
                                return (
                                    <option key={key} value={data}>{data}</option>
                                )
                            })}
                        </AvInput>
                        </Col>
                        <Col md="4"/>
                        <Col md="4"/>
                        <Col md="2">
                            <AvInput label="Email"/>
                        </Col>
                        <Col md="2">
                            <AvInput label="Password"/>
                        </Col>
                        <Col md="4"/>
                        <Col md="4"/>
                        <Col md="2">
                            <AvInput type="select" onChange={handleProvince} name="provinsi" label="Provinsi">
                                <option></option>
                                {address.map(r => {
                                    let value = r.id + "," + r.nama;
                                    return <option key={r.id} value={value}>{r.nama}</option>
                                })}
                            </AvInput>
                        </Col>
                        <Col md="2">
                            <AvInput type="select" onChange={handleKabupaten} name="kabupaten" label="Kabupaten" disabled={kotaOpt}>
                                <option></option>
                                {kota.map(r => {
                                    let value = r.id + "," + r.nama;
                                    return <option key={r.id} value={value}>{r.nama}</option>
                                })}
                            </AvInput>
                        </Col>
                        <Col md="4"/>
                        <Col md="4"/>
                        <Col md="2">
                            <AvInput type="select" onChange={handleKecamatan} name="kecamatan" label="Kecamatan" disabled={kecOpt}>
                                <option></option>
                                {kec.map(r => {
                                    let value = r.id + "," + r.nama;
                                    return <option key={r.id} value={value}>{r.nama}</option>
                                })}
                            </AvInput>
                        </Col>
                        <Col md="2">
                            <AvInput type="select" name="desa" label="Desa" disabled={desaOpt}>
                                <option></option>
                                {desa.map(r => {
                                    let value = r.id + "," + r.nama;
                                    return <option key={r.id} value={value}>{r.nama}</option>
                                })}
                            </AvInput>
                        </Col>
                        <Col md="4"/>
                        <Col md="4"/>
                        <Col md="2">
                            <AvInput label="Nama Peternakan" disabled={isAdmin} required={!isAdmin}/>
                        </Col>
                        <Col md="2">
                            <AvInput type="select" name="jenis_usaha_peternakan" label="Jenis Peternakan" disabled={isAdmin} required={!isAdmin}>
                                <option></option>
                                {type2.map((data,key) => {
                                    return(<option key={key} value={data.value}>{data.option}</option>)
                                })}
                            </AvInput>
                        </Col>
                        <Col md="4"/>
                        <Col md="12">
                            <br/>
                            <br/>
                        </Col>
                        <Col md="4"/>
                        <Col md="2">
                            <Button color="secondary" className="px-4" block onClick={() => props.history.push('user')}>Kembali</Button>
                        </Col>
                        <Col md="2">
                            <Button type="submit" color="primary" className="px-4" block>Simpan</Button>
                        </Col>
                        <Col md="4"/>
                    </Row>
                </AvForm>
            </form>
        </div>
    )
}