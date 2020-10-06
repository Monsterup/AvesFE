import React, {useState} from "react";
import { Col, Row} from "reactstrap";
import AvInput from "../../components/Input";
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import CreateModal from "../../components/CreateModal";
import {AvField, AvForm} from 'availity-reactstrap-validation';
import axios from "../../../axios";
import {showNotification} from "../../components/Notification";
import auth from "../../../auth";

function PembayaranGagal(props) {
    const img = `https://avesbox-2020.glitch.me/uploads/${props.data}`;
    return (
        <div>
            <Modal isOpen={true}>
                <ModalHeader toggle={props.onCancel}>BUKTI PEMBAYARAN</ModalHeader>
                <ModalBody className="text-center">
                    <img src={img} alt="" style={{'maxWidth':"400px"}}/>
                </ModalBody>
                <ModalFooter>
                    <Button type="submit" color="primary" onClick={props.onCancel}>Kembali</Button>
                </ModalFooter>
            </Modal>
        </div>
    )
}

export default PembayaranGagal;