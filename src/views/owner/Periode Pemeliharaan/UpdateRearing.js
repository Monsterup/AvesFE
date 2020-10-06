import React, {useState} from "react";
import { Col, Row} from "reactstrap";
import AvInput from "../../components/Input";
import CreateModal from "../../components/CreateModal";
import {AvField, AvGroup, AvInput as AvInput2, AvFeedback} from 'availity-reactstrap-validation';
import {Button, Label, InputGroupAddon, InputGroupText, InputGroup} from'reactstrap'
import axios from "../../../axios";
import {showNotification} from "../../components/Notification";
import auth from "../../../auth";
import moment, { now } from 'moment';

function UpdateRearing(props) {
    let curren = moment(new Date(props.data.rearing.chickInDate * 1)).format('YYYY-MM-DD');

    const Form = () => {
        return(<Row>
            <Col md="12">
                <AvField value={props.data.rearing.house._id} required={false} type="select" name="kandang" label="Kandang">
                    <option></option>
                    {props.data.house.map((data, key) => {
                        return (
                            <option key={key} value={data._id}>{data.name}</option>
                        )
                    })}
                </AvField>
            </Col>
            <Col md="6">
                <AvInput value={props.data.rearing.otherInformation} label="Periode" minLength="3"/>
            </Col>
            <Col md="6">
                <AvInput value={curren} type="Date" label="Tanggal Masuk"/>
            </Col>
            <Col md="6">
                <AvGroup>
                    <Label>Populasi Awal Ternak</Label>
                    <InputGroup>
                        <AvInput2 value={props.data.rearing.population} name="populasi" required/>
                        <InputGroupAddon addonType="append">
                            <InputGroupText>Ekor</InputGroupText>
                        </InputGroupAddon>
                        <AvFeedback>Populasi awal ternak wajib diisi</AvFeedback>
                    </InputGroup>
                </AvGroup>
            </Col>
            <Col md="6">
                <AvGroup>
                    <Label>Total Berat Ternak</Label>
                    <InputGroup>
                        <AvInput2 value={props.data.rearing.chickInWeight}  name="total_berat" required/>
                        <InputGroupAddon addonType="append">
                            <InputGroupText>Kg</InputGroupText>
                        </InputGroupAddon>
                        <AvFeedback>Total berat ternak wajib diisi</AvFeedback>
                    </InputGroup>
                </AvGroup>
            </Col>
        </Row>);
    };

    //query update
    const queryUpdate = (value) => {
        return {
            query: `mutation{
                          updateRearing(_id : "${props.data.rearing._id}", updateRearingInput : {
                            chickInDate : "${value.tanggal_masuk}",
                            chickInWeight : ${parseInt(value.total_berat)},                            
                            house : "${value.kandang}",
                            population : ${parseInt(value.populasi)},
                            otherInformation : "${value.periode}"
                          }){
                            _id
                            otherInformation
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

export default UpdateRearing;