import React, {useState} from "react";
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {AvForm} from "availity-reactstrap-validation";

function CreateModal(props) {
    return (
        <Modal isOpen={props.modal} toggle={props.onCancel} className="modal-lg">
            <ModalHeader toggle={props.onCancel}>{props.title}</ModalHeader>
            <AvForm onSubmit={props.onSubmit}>
                <ModalBody>
                    {props.children}
                </ModalBody>
                <ModalFooter>
                    <Button type="submit" color="primary">{props.lanjut === true ? "Lanjut" : "Simpan"}</Button>{' '}
                    <Button type="button" color="secondary" onClick={props.onCancel}>{props.kembali === true ? "Kembali" : "Batal"}</Button>
                </ModalFooter>
            </AvForm>
        </Modal>
    )
}

export default CreateModal;