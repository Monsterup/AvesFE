import React, {useState} from "react";
import { Col, Row} from "reactstrap";
import AvInput from "../../../components/Input";
import CreateModal from "../../../components/CreateModal";
import {AvField} from 'availity-reactstrap-validation';
import moment from 'moment';
import axios from "../../../../axios";
import {showNotification} from "../../../components/Notification";
import auth from "../../../../auth";

function UpdateAlat(props) {
    const [sensor, setSensor] = useState(['Suhu', 'Kelembaban', 'Amonia']);
    let curren = moment(new Date(props.data.deviceRecord.date * 1)).format('YYYY-MM-DD');
    console.log(props);
    const Form = () => {
        return(<Row>
            <Col md="6">
                <AvField value={props.data.deviceRecord.device._id} type="select" name="alat" label="Alat IoT">
                    <option></option>
                    {props.data.device.map((data, key) => {
                        return (<option  key={key} value={data._id}>{data.serialNumber}</option>)
                    })}
                </AvField>
            </Col>
            <Col md="6">
                <AvField value={props.data.deviceRecord.sensorType} type="select" name="tipe_sensor" label="Tipe Sensor">
                    <option></option>
                    {sensor.map((data, key) => {
                        return (<option  key={key} value={data}>{data}</option>)
                    })}
                </AvField>
            </Col>
            <Col md="6">
                <AvInput value={props.data.deviceRecord.value} label="Hasil"/>
            </Col>
            <Col md="6">
                <AvInput value={curren} type="date" label="Tanggal"/>
            </Col>
        </Row>);
    };

    //query update
    const queryUpdate = (value) => {
        return {
            query: `mutation{
                        updateDeviceRecord(_id : "${props.data.deviceRecord._id}", updateDeviceRecordInput : {
                            value : ${parseInt(value.hasil)}
                            sensorType : "${value.tipe_sensor}"
                            device : "${value.alat}"
                            date : "${value.tanggal}"
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