import React, {useState} from "react";
import { Col, Row} from "reactstrap";
import AvInput from "../../components/Input";
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import SwalDelete from '../../components/SwalDelete';
import CreateModal from "../../components/CreateModal";
import {AvField, AvForm, AvInput as AI} from 'availity-reactstrap-validation';
import axios from "../../../axios";
import {showNotification} from "../../components/Notification";
import AsyncFetch from '../../components/AsyncFetch';
import auth from "../../../auth";

function Konfirmasi(props) {
    const status = ['Menunggu Pembayaran', 'Menunggu Konfirmasi Admin', 'Dikirim', 'Pembayaran Ditolak', 'Selesai'];

    const queryCreate = (value) => {
        return {
            query: `mutation{
                        updateOrderStatus(_id : "${props.data._id}", status: "${value.status}"){
                            _id
                        }
                    }`
        }
    };

    const handleSubmit = async (e, err, value) => {
        if (err.length > 0) {
            return;
        }
        try {
            const query = queryCreate(value);
            let res = await axios.post('graphql', JSON.stringify(query), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + auth.getSession().token
                }
            });
            const resData = res.data;
            if (resData.errors) {
                showNotification(resData.errors[0].message, "danger")
                return;
            }
            showNotification("Berhasil mengubah status", "success");
            props.onSuccess();
        } catch (e) {
            console.log(e);
            showNotification("Data tidak valid", "danger")
        }
    }

    return (
        <div>
            <Modal isOpen={true}>
                <ModalHeader toggle={props.onCancel}>UBAH STATUS</ModalHeader>
                <form>
                    <AvForm onSubmit={handleSubmit}>
                        <ModalBody className="text-center">
                            <Row>
                                <Col md="2"/>
                                <Col md="8">
                                <AvField type="select" name="status" label="Status">
                                    <option></option>
                                    {status.map((data, key) => {
                                        if(data.house !== '-')
                                            return (<option  key={key} value={data}>{data}</option>)
                                    })}
                                </AvField>
                                </Col>
                                <Col md="2"/>
                            </Row>
                        </ModalBody>
                        <ModalFooter>
                            <Button type="submit" color="success">Simpan</Button>
                            <Button type="button" color="primary" onClick={props.onCancel}>Kembali</Button>
                        </ModalFooter>
                    </AvForm>
                </form>
            </Modal>
        </div>
    )
}

export default Konfirmasi;