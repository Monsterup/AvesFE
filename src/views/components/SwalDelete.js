import React from "react";
import SweetAlert from "react-bootstrap-sweetalert";

function SwalDelete(props) {
    return (
        <SweetAlert
            show={props.show}
            warning
            showCancel
            confirmBtnText="Ya, Hapus!"
            confirmBtnBsStyle="danger"
            cancelBtnText="Batal"
            title="Apakah anda yakin?"
            onConfirm={props.onConfirm}
            onCancel={props.onCancel}
            focusCancelBtn
            reverseButtons={true}
        >Anda tidak bisa mengembalikan data yang telah terhapus!</SweetAlert>
    );
}

export default SwalDelete