import React, { useState } from "react";
import { Col, Row, Input, InputGroup, InputGroupAddon, InputGroupText, Label } from "reactstrap";
import { AvField } from 'availity-reactstrap-validation';
import AvInput from "../../components/Input";
import CreateModal from "../../components/CreateModal";
import { useForm } from '../../hooks/useForm';
import axios from "../../../axios";
import { showNotification } from "../../components/Notification";
import auth from "../../../auth";

function UpdatePakan(props) {
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useForm({
        kode: props.data.code, perusahaan: props.data.producer, jenis_pakan: props.data.type,
        tahun_produksi: props.data.year, keterangan: props.data.otherInformation
    });
    // option jenis pakan
    const arrType = ['starter', 'growing'];
    // option tahun produksi
    const year = [];
    const now = new Date().getFullYear();
    for (let i = now; i > now - 3; i--) year.push(i);

    const handleSubmit = async(e) => {
        try {
            setLoading(true);
            const q = {
                query: `mutation{
                    updateFeed(_id : "${props.data._id}", updateFeedInput : {
                        code : "${value.kode}",
                        type : "${value.jenis_pakan}",
                        year : "${value.tahun_produksi}",
                        producer : "${value.perusahaan}",
                        otherInformation : "${value.keterangan}"
                    }){
                        _id
                        code
                        producer
                        type
                        year
                        otherInformation
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

            showNotification("Berhasil memperbaharui "+ props.objectName, "success");
            props.onSuccess();
        } catch (error) {
            console.log(e);
            showNotification("Data tidak valid", "danger");
        }
    }

    return (
        <CreateModal title={'Ubah '+ props.objectName} modal={props.modal} onCancel={props.onCancel}
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
    )
}

export default UpdatePakan;