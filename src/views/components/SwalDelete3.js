import React from "react";
import SweetAlert from "react-bootstrap-sweetalert";

function SwalDelete(props) {
    return (
        <SweetAlert
            show={props.show}
            warning
            showCancel
            confirmBtnText="Ya, Yakin!"
            confirmBtnBsStyle="danger"
            cancelBtnText="Batal"
            title="Apakah anda yakin?"
            onConfirm={props.onConfirm}
            onCancel={props.onCancel}
            focusCancelBtn
            reverseButtons={true}
        >Pastikan anda sudah menerima pesanan anda!</SweetAlert>
    );
}

export default SwalDelete