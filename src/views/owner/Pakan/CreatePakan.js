import React, { useState } from 'react';
import { Button, Col, Row, Input, InputGroup, InputGroupAddon, InputGroupText, Label } from "reactstrap";
import { AvField } from 'availity-reactstrap-validation';
import { useForm } from '../../hooks/useForm';
import AvInput from '../../components/Input'
import CreateModal from '../../components/CreateModal'
import axios from '../../../axios'
import { showNotification } from '../../components/Notification'
import auth from '../../../auth'

export default function CreateKandang(props) {
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState(false);
    const [value, setValue] = useForm({
        kode: "", perusahaan: "", jenis_pakan: "", tahun_produksi: "", keterangan: ""
    });
    // option jenis pakan
    const arrType = ['starter', 'growing'];
    // option tahun produksi
    const year = [];
    const now = new Date().getFullYear();
    for (let i = now; i > now - 3; i--) year.push(i);

    const handleSubmit = async(e) => {
        console.log(value);
        try {
            setLoading(true);
            const q = {
                query: `mutation{
                    createFeed(feedInput: {
                        code : "P${value.kode}"
                        producer : "${value.perusahaan}"
                        type : "${value.jenis_pakan}"
                        year : "${value.tahun_produksi}"
                        otherInformation : "${value.keterangan}"
                    }){
                        code
                        producer
                    }
                }`
            }
            let res = await axios.post('graphql', JSON.stringify(q), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + auth.getSession().token
                }
            });
            const resData = res.data;
            if (resData.errors) {
                showNotification(resData.errors[0].message, "danger");
                setLoading(false);
                return;
            }
            showNotification("Berhasil menambah " + props.objectName, "success");
            props.onSuccess();
            setModal(false);
        } catch (error) {
            console.log(error);
            showNotification("Data tidak valid", "danger")
        }
    }

    return (
        <div>
            <Button onClick={() => setModal(true)} color="primary">
                <i className="fa fa-plus"/> Tambah {props.objectName}
            </Button>
            <CreateModal title={'Tambah ' + props.objectName} modal={modal} onCancel={() => setModal(!modal)}
                onSubmit={handleSubmit} onLoad={loading}>
                <Row>
                    <Col md="6">
                        <Label>Kode</Label>
                        <InputGroup>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                    <b>P</b>
                                </InputGroupText>
                            </InputGroupAddon>
                            <Input type="text" name="kode" value={value.kode} 
                                onChange={setValue}/>
                        </InputGroup>
                    </Col>
                    <Col md="6">
                        <AvInput value={value.perusahaan} onChange={setValue} label="Perusahaan"/>
                    </Col>
                    <Col md="6">
                        <AvField value={value.jenis_pakan} onChange={setValue} required={false} type="select" name="jenis_pakan" label="Jenis Pakan">
                            <option></option>
                            {arrType.map((data, key) => {
                                return (<option  key={key} value={data}>{data}</option>)
                            })}
                        </AvField>
                    </Col>
                    <Col md="6">
                        <AvField value={value.tahun_produksi} onChange={setValue} required={false} type="select" name="tahun_produksi" label="Tahun Produksi">
                            <option></option>
                            {year.map((data, key) => {
                                return (<option key={key} value={data}>{data}</option>)
                            })}
                        </AvField>
                    </Col>
                    <Col md="12">
                        <AvInput value={value.keterangan} onChange={setValue} type="textarea" label="Keterangan" required={false}/>
                    </Col>
                </Row>
            </CreateModal>
        </div>
    )
}