import React, {useState} from "react";
import { Col, Row, Label, InputGroup, InputGroupAddon, InputGroupText} from "reactstrap";
import moment from 'moment';
import AvInput from "../../components/Input";
import CreateModal from "../../components/CreateModal";
import {AvField, AvInput as AvInput2, AvGroup} from 'availity-reactstrap-validation';
import axios from "../../../axios";
import {showNotification} from "../../components/Notification";
import auth from "../../../auth";

function UpdateHouse(props) {
    console.log(props.data);
    const tgl = moment(props.data.rearingRecord.date * 1).format('YYYY-MM-DD');
    const Form = () => {
        return(<Row>
            <Col md="12">
                <AvInput value={props.data.rearingRecord.rearing._id} label="Periode" type="select">
                    <option></option>
                    {props.data.rearing.map((data, key) => {
                        return (
                            <option key={key} value={data._id}>{data.otherInformation}</option>
                        )
                    })}
                </AvInput>
            </Col>
            <Col md="12">
                <Label>Tanggal</Label>
                <AvInput2 label="Tanggal" name="tanggal" type="date" value={tgl}/>
            <br/>
            </Col>
            <Col md="12">
                <b>Mutasi</b>
            </Col>
            <hr/>
            <Col md="6">
                <AvInput label="Jumlah Mati" value={props.data.rearingRecord.death}/>
            </Col>
            <Col md="6">
                <AvInput label="Jumlah Afkir" value={props.data.rearingRecord.reject}/>
            </Col>
            <Col md="12">
                <b>Pemberian Pakan</b>
            </Col>
            <hr/>
            <Col md="6">
                <AvInput value={props.data.rearingRecord.feedType} label="Jenis Pakan" type="select">
                    <option></option>
                    {props.data.feed.map((data, key) => {
                        return (
                            <option key={key} value={data._id}>P{data.code} - {data.type}</option>
                        )
                    })}
                </AvInput>
            </Col>
            <Col md="6">
                <AvGroup>
                    <Label>Jumlah</Label>
                    <InputGroup>
                        <AvInput2 name="jumlah_pakan" value={props.data.rearingRecord.feedTotal} required/>
                        <InputGroupAddon addonType="append">
                            <InputGroupText>Kg</InputGroupText>
                        </InputGroupAddon>
                    </InputGroup>
                </AvGroup>
            </Col>
            <Col md="12">
                <b>Pertumbuhan</b>
            </Col>
            <hr/>
            <Col md="6">
                <AvGroup>
                    <Label>Berat Total</Label>
                    <InputGroup>
                        <AvInput2 name="berat" value={props.data.rearingRecord.growing} required/>
                        <InputGroupAddon addonType="append">
                            <InputGroupText>Kg</InputGroupText>
                        </InputGroupAddon>
                    </InputGroup>
                </AvGroup>
            </Col>
        </Row>);
    };

    //query update
    const queryUpdate = (value) => {
        return {
            query: `mutation{
                        updateRearingRecord(_id : "${props.data.rearingRecord._id}", updateRearingRecordInput : {
                            date : "${value.tanggal}"
                            death : ${parseInt(value.jumlah_mati)}
                            reject : ${parseInt(value.jumlah_afkir)}
                            growing : ${parseInt(value.berat)}
                            feedType : "${value.jenis_pakan}"
                            feedTotal : ${parseInt(value.jumlah_pakan)}
                            rearing : "${value.periode}"
                        }){
                            _id
                        }
                    }
                `
        }
    }

    /**
     * ========================================================================================================================
     * STOP!! You are not allow edit code below
     * ========================================================================================================================
     *
     * Author : Jati Pikukuh
     */

    const handleSubmit = async (e, err, value) => {
        if (err.length > 0) {
            return;
        }
        try {
            let res = await axios.post('graphql', JSON.stringify(queryUpdate(value)), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + auth.getSession().token
                }
            });
            const resData = res.data;
            if (resData.errors) {
                showNotification(resData.errors[0].message, "danger");
                return;
            }
            showNotification("Berhasil memperbaharui "+ props.objectName, "success");
            props.onSuccess();
        } catch (e) {
            console.log(e);
            showNotification("Data tidak valid", "danger")
        }
    }

    return (
        <CreateModal title={'Ubah '+ props.objectName} modal={props.modal} onCancel={props.onCancel}
            onSubmit={handleSubmit}>
            <Form/>
        </CreateModal>
    )
}

export default UpdateHouse;