import React, {useState} from "react";
import { Col, Row} from "reactstrap";
import AvInput from "../../components/Input";
import CreateModal from "../../components/CreateModal";
import {AvField} from 'availity-reactstrap-validation';
import axios from "../../../axios";
import {showNotification} from "../../components/Notification";
import auth from "../../../auth";

function UpdateKandang(props) {
    console.log(props);

    const Form = () => {
        return(<Row>
            <Col md="6">
                <AvInput value={props.data.name} label="Nama" minLength="3"/>
            </Col>
            <Col md="6">
                <AvInput value={props.data.capacity} label="Kapasitas"/>
            </Col>
            <Col md="6">
                <AvInput value={props.data.address} required={false} type="textarea" label="Alamat"/>
            </Col>
            <Col md="6">
                <AvInput value={props.data.otherInformation} required={false} type="textarea" label="Keterangan"/>
            </Col>
        </Row>);
    };

    //query update
    const queryUpdate = (value) => {
        return {
            query: `mutation{
                          updateHouse(_id : "${props.data._id}", updateHouseInput : {
                            name : "${value.nama}",
                            address : "${value.alamat}",
                            capacity : ${parseInt(value.kapasitas)},
                            otherInformation : "${value.keterangan}"
                          }){
                            _id
                            name
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

export default UpdateKandang;