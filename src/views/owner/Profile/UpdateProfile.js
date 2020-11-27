import React, {useState} from "react";
import { Col, Row, Button} from "reactstrap";
import { showNotification } from '../../components/Notification';
import AvInput from "../../components/Input";
import CreateModal from "../../components/CreateModal";
import DefaultPhoto from '../../../assets/img/avatar/logo_only_250.svg';
// import useApp from '../../hooks/useApp';

function UpdateProfile(props) {

    const Form = () => {
        return (
            <Row>
                <Col md="6">
                    <AvInput value={props.data.name} label="Nama Lengkap"/>
                </Col>
                <Col md="6">
                    <AvInput value={props.data.username} label="Nama Pengguna"/>
                </Col>
                <Col md="12">
                    <AvInput value={props.data.address} type="textarea" label="Alamat"/>
                </Col>
            </Row>
        )
    }

    const handleSubmit = async (e, err, value) => {
        if (err.length > 0) {
            return;
        }
        showNotification("check");
        console.log(value);
        // try {
        //     let res = await axios.post('graphql', JSON.stringify(queryUpdate(value)), {
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'Authorization': 'Bearer ' + auth.getSession().token
        //         }
        //     });
        //     const resData = res.data;
        //     if (resData.errors) {
        //         showNotification(resData.errors[0].message, "danger");
        //         return;
        //     }
        //     showNotification("Berhasil memperbaharui "+ props.objectName, "success");
        //     props.onSuccess();
        // } catch (e) {
        //     console.log(e);
        //     showNotification("Data tidak valid", "danger")
        // }
    }

    return (
        <CreateModal modal={props.modal} title={'Ubah Profil'} onCancel={props.onCancel}
            onSubmit={handleSubmit}>
            <Form/>
        </CreateModal>
    )
}

export default UpdateProfile;