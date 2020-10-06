import React, {useState, useEffect} from "react";
import { Col, Row} from "reactstrap";
import AvInput from "../../components/Input";
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import CreateModal from "../../components/CreateModal";
import {AvField, AvForm} from 'availity-reactstrap-validation';
import {NotificationContainer} from 'react-notifications';
import axios from "../../../axios";
import {showNotification} from "../../components/Notification";
import auth from "../../../auth";

function Pembayaran(props) {
    const [file, setFile] = useState(props.location.state.TI ? `https://avesbox-2020.glitch.me/uploads/${props.location.state.TI}` : null);
    let name;
    const [image, setImage] = useState('');
    const [update, setUpdate] = useState(props.location.state.update ? true : false);
    const [failed, setFailed] = useState(props.location.state.failed ? true : false);
    let code = 0;

    if(typeof(props.location.state) === 'undefined') {
        props.history.push('detail');
    } else {
        code = props.location.state.code;
    }

    if(update) {
        name = props.location.state.TN;
    }

    const onChange = (e) => {
        if(e.target.files[0] !== undefined) {
            setImage(e.target.files[0])
            const URI = window.URL.createObjectURL(e.target.files[0]);
            setFile(URI);
        }
    }

    const submit = async(e, err, value) => {
        if (err.length > 0) {
            return;
        }
        try {
            const formData = new FormData();
            formData.append('myImage', image);
            formData.append('name', value.nama_pengirim);
            formData.append('code', code);
            const config = {
                headers: {
                    'content-type': 'multipart/form-data',
                    'Authorization': 'Bearer ' + auth.getSession().token
                }
            }
            let res;
            if(update) {
                res = await axios.post('/upload2', formData, config);
            } else {
                res = await axios.post('/upload', formData, config);
            }
            if (res.data.errors) {
                showNotification(res.data.errors[0].message, "danger")
                return;
            }
            showNotification("Berhasil mengunggah bukti pembayaran", "success");
            setTimeout(() => {
                props.history.push('detail');
            }, 2000);
        } catch (error) {
            showNotification("Ada kesalahan pada data/sistem", "danger")       
        }
        
    }

    return (
        <div className="text-center justify-content-center">
            <NotificationContainer/>
            {
                update ?
                <h3>Ubah Bukti Pembayaran</h3> :
                failed ?
                <h3>Lihat Bukti Pembayaran</h3> :
                <h3>Unggah Bukti Pembayaran</h3>
            }
            <br/>
            <form>
                <AvForm onSubmit={submit}>
                    <Row>
                        <Col md="4"/>
                        <Col md="4">
                            <AvInput label="Nama Pengirim" value={name}/>
                        </Col>
                        <Col md="4"/>
                        <Col md="4"/>
                        <Col md="4">
                            <label>Bukti Pembayaran</label>
                            <br/>
                            <input type="file" onChange={onChange}/>
                            <br/>
                            <br/>
                            <img src={file} alt="" style={{'maxWidth':"400px"}}/>
                            <br/>
                            <i style={{'color':'Red'}}>
                            {
                                file === null ?
                                '' :
                                '*Pastikan gambar sudah benar'
                            }
                            </i>
                            <br/>
                            <br/>
                        </Col>
                        <Col md="4"/>
                        <Col md="5"/>
                        <Col md="2" className="text-right">
                            <Button type="submit" color="primary" className="px-4" block>Unggah</Button>
                        </Col>
                        <Col md="5"/>
                    </Row>
                </AvForm>
            </form>
        </div>
    )
}

export default Pembayaran;