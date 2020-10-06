import React, {useState} from "react";
import { Col, Row, Button} from "reactstrap";
import AvInput from "../../components/Input";
import CreateModal from "../../components/CreateModal";
import axios from "../../../axios";
import auth from "../../../auth";
import { showNotification } from "../../components/Notification";
import { NotificationContainer } from "react-notifications";
// import useApp from '../../hooks/useApp';

function UpdateProfile(props) {
    let name =  props.data.username;
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

        try {
            if(value.nama_pengguna !== name) {
                const query = {
                    query: `query{
                        usernameExist(username:"${value.nama_pengguna}")
                    }`
                }
                let res1 = await axios.post('graphql', JSON.stringify(query), {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + auth.getSession().token
                    }
                });
                const usernameExist = res1.data.data.usernameExist;
    
                if (usernameExist) {
                    showNotification("Username telah digunakan, silahkan gunakan username lain", "danger");
                    return;
                }
            }
            
            const queryUpdate = {
                query: `mutation{
                    updateUser(updateUserInput: {
                        address: "${value.alamat}"
                        username: "${value.nama_pengguna}"
                        name: "${value.nama_lengkap}"
                    }){
                        createdAt
                    }
                }`
            }
            let res = await axios.post('graphql', JSON.stringify(queryUpdate), {
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
            showNotification("Berhasil memperbaharui profil", "success");
            props.onSuccess();
        } catch (e) {
            console.log(e);
            showNotification("Data tidak valid", "danger")
        }
    }

    return (
        <CreateModal modal={props.modal} title={'Ubah Profil'} onCancel={props.onCancel}
            onSubmit={handleSubmit}>
            <NotificationContainer/>
            <Form/>
        </CreateModal>
    )
}

export default UpdateProfile;