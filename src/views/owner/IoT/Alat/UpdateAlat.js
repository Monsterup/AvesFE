import React, {useState} from "react";
import { Col, Row} from "reactstrap";
import AvInput from "../../../components/Input";
import CreateModal from "../../../components/CreateModal";
import {AvField} from 'availity-reactstrap-validation';
import axios from "../../../../axios";
import {showNotification} from "../../../components/Notification";
import auth from "../../../../auth";

function UpdateAlat(props) {
    console.log(props);
    const Form = () => {
        return(<Row>
            <Col md="6">
                <AvInput label="Nomor Seri" value={props.data.device.serialNumber} disabled/>
            </Col>
            <Col md="6">
            <AvField required={false} type="select" name="kandang" label="Kandang">
                    <option></option>
                    {props.data.house.map((data, key) => {
                        return (
                            <option key={key} value={data._id}>{data.name}</option>
                        )
                    })}
                </AvField>
            </Col>
        </Row>);
    };

    //query update
    const queryUpdate = (value) => {
        return {
            query: `mutation{
                        updateDevice(_id : "${props.data.device._id}", updateDeviceInput : {
                            serialNumber : "${value.nomor_seri}",
                            house : "${value.kandang}",
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

export default UpdateAlat;