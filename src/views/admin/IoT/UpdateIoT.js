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
    console.log(props);
    const type = ['Perusahaan Kemitraan', 'Peternakan Mandiri'];

    const Form = () => {
        return(<Row>
            <Col md="6">
                <AvInput value={props.data.device.serialNumber} label="Nomor Seri"/>
            </Col>
            <Col md="6">
                <AvInput value={props.data.device.creator._id} label="Pemilik" type="select">
                    <option></option>
                    {props.data.users.map((data, key) => {
                        return (
                            <option key={key} value={data._id}>{data.username}</option>
                        )
                    })}
                </AvInput>
            </Col>
        </Row>);
    };

    //query update
    const queryUpdate = (value) => {
        return {
            query: `mutation{
                        updateDeviceAdmin(_id : "${props.data.device._id}", updateDeviceInput : {
                            serialNumber: "${value.nomor_seri}"
                            creator: "${value.pemilik}"
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