import React, {useState} from "react";
import {Button, Col, Row, Input, InputGroup, InputGroupAddon, InputGroupText, Label} from'reactstrap'
import moment from 'moment'
import AvInput from "../../components/Input";
import CreateModal from "../../components/CreateModal";
import {AvField, AvInput as AvInput2, AvGroup} from 'availity-reactstrap-validation';
import axios from "../../../axios";
import {showNotification} from "../../components/Notification";
import auth from "../../../auth";

function UpdateHouse(props) {
    let curren = moment(new Date(props.data.harvest.date * 1)).format('YYYY-MM-DD');

    const Form = () => {
        return(<Row>
            <Col md="6">
                <AvInput value={props.data.harvest.rearing._id} label="Periode" type="select">
                    <option></option>
                    {props.data.rearing.map((data, key) => {
                        return (
                            <option key={key} value={data._id}>{data.otherInformation}</option>
                        )
                    })}
                </AvInput>
            </Col>
            <Col md="6">
                <AvInput value={curren} type="date" label="Tanggal Panen"/>
            </Col>
            <Col md="6">
                <AvGroup>
                    <Label>Total Ayam Hidup</Label>
                    <InputGroup>
                        <AvInput2 value={props.data.harvest.numberLiveBird} name="jumlah" required/>
                        <InputGroupAddon addonType="append">
                            <InputGroupText>Ekor</InputGroupText>
                        </InputGroupAddon>
                    </InputGroup>
                </AvGroup>
            </Col>
            <Col md="6">
                <AvGroup>
                    <Label>Total Berat</Label>
                    <InputGroup>
                        <AvInput2 value={props.data.harvest.totalWeight} name="berat" required/>
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
        let avg = parseFloat(value.berat) / parseFloat(value.jumlah);
        avg = (Math.round(avg * 100)/100).toFixed(2);
        return {
            query: `mutation{
                        updateHarvest(_id : "${props.data.harvest._id}", updateHarvestInput : {
                            date : "${value.tanggal_panen}",
                            totalWeight : ${parseInt(value.berat)},
                            numberLiveBird : ${parseInt(value.jumlah)},
                            rearing : "${value.periode}",
                            averageWeight : ${parseFloat(avg)}
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