import React, {useState} from "react";
import {Button, Col, Row, Input, InputGroup, InputGroupAddon, InputGroupText, Label} from'reactstrap'
import AvInput from "../../components/Input";
import CreateModal from "../../components/CreateModal";
import {AvField, AvGroup, AvInput as AvInput2} from 'availity-reactstrap-validation';
import axios from "../../../axios";
import {showNotification} from "../../components/Notification";
import auth from "../../../auth";

function UpdateHouse(props) {
    console.log(props);

    const Form = () => {
        return(<Row>
            <Col md="12">
                <AvInput value={props.data.feedStocks.house._id} label="Kandang" type="select">
                    <option></option>
                    {props.data.house.map((data, key) => {
                        return (
                            <option key={key} value={data._id}>{data.name}</option>
                        )
                    })}
                </AvInput>
            </Col>
            <Col md="10">
                <AvInput value={props.data.feedStocks.feed._id} label="Kode Pakan" type="select">
                    <option></option>
                    {props.data.feed.map((data, key) => {
                        return (
                            <option key={key} value={data._id}>{data.code} - {data.type}</option>
                        )
                    })}
                </AvInput>
            </Col>
            <Col md="2">
                <AvGroup>
                    <Label>Jumlah</Label>
                    <InputGroup>
                        <AvInput2 value={props.data.feedStocks.number} name="jumlah" required/>
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
                        updateFeedStock(_id : "${props.data.feedStocks._id}", updateFeedStockInput : {
                            number : ${parseInt(value.jumlah)},
                            feed : "${value.kode_pakan}",
                            house : "${value.kandang}"
                        }){
                            createdAt
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