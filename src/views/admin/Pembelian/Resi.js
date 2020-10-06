import React, {useState} from "react";
import { Col, Row} from "reactstrap";
import AvInput from "../../components/Input";
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import CreateModal from "../../components/CreateModal";
import {AvField, AvForm} from 'availity-reactstrap-validation';
import axios from "../../../axios";
import {showNotification} from "../../components/Notification";
import auth from "../../../auth";

function Lokasi(props) {
    return (
        <div>
            <Modal isOpen={true}>
                <ModalHeader toggle={props.onCancel}>STATUS PENGIRIMAN</ModalHeader>
                <ModalBody className="text-center">
                    <b>Nomor Resi</b>
                    <br/>
                    {console.log(props.data)}
                    {props.data.resi}
                    <br/><br/>
                    <b>Status</b>
                    <br/>
                    {props.data.res.delivery_status.status}
                    <br/>
                </ModalBody>
                <ModalFooter>
                    <Button type="submit" color="primary" onClick={props.onCancel}>Kembali</Button>
                </ModalFooter>
            </Modal>
        </div>
    )
}

export default Lokasi;