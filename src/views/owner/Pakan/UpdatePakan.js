import React, {useState} from "react";
import { Col, Row} from "reactstrap";
import AvInput from "../../components/Input";
import CreateModal from "../../components/CreateModal";
import {AvField} from 'availity-reactstrap-validation';
import axios from "../../../axios";
import {showNotification} from "../../components/Notification";
import auth from "../../../auth";

function UpdatePakan(props) {
    // option jenis pakan
    const arrType = ['starter', 'growing'];
    //option tahun produksi
    const year = [];
    for (let i = new Date().getFullYear(); i > 2015; i--) year.push(i);

    const Form = () => {
        return(<Row>
            <Col md="6">
                <AvInput value={props.data.code} label="Kode" minLength="3"/>
            </Col>
            <Col md="6">
                <AvInput value={props.data.producer} label="Perusahaan"/>
            </Col>
            <Col md="6">
                <AvField value={props.data.type} required={false} type="select" name="jenis_pakan" label="Jenis Pakan">
                    <option></option>
                    {arrType.map((data, key) => {
                        return (<option  key={key} value={data}>{data}</option>)
                    })}
                </AvField>
            </Col>
            <Col md="6">
                <AvField value={props.data.year} required={false} type="select" name="tahun_produksi" label="Tahun Produksi">
                    <option></option>
                    {year.map((data, key) => {
                        return (<option key={key} value={data}>{data}</option>)
                    })}
                </AvField>
            </Col>
            <Col md="12">
                <AvInput value={props.data.otherInformation} required={false} type="textarea" label="Keterangan"/>
            </Col>
        </Row>);
    };

    //query update
    const queryUpdate = (value) => {
        return {
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

export default UpdatePakan;