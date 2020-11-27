import React, { useState } from "react";
import { Col, Row} from "reactstrap";
import AvInput from "../../components/Input";
import CreateModal from "../../components/CreateModal";
import { useForm } from '../../hooks/useForm';
import { showNotification } from "../../components/Notification";
import axios from "../../../axios";
import auth from "../../../auth";

function UpdateKandang(props) {
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useForm({
        nama_kandang: props.data.name, kapasitas: props.data.capacity, alamat: props.data.address, keterangan: props.otherInformation
    });

    const handleSubmit = async(e) => {
        try {
            setLoading(true);
            const q = {
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
                }`
            }

            let res = await axios.post('graphql', JSON.stringify(q), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + auth.getSession().token
                }
            });

            const resData = res.data;
            if (resData.errors) {
                showNotification(resData.errors[0].message, "danger");
                setLoading(false);
                return;
            }

            showNotification("Berhasil memperbaharui "+ props.objectName, "success");
            props.onSuccess();
        } catch (error) {
            console.log(e);
            showNotification("Data tidak valid", "danger");
        }
    }

    return (
        <CreateModal title={'Ubah '+ props.objectName} modal={props.modal} onCancel={props.onCancel}
            onSubmit={handleSubmit} onLoad={loading}>
            <Row>
                <Col md="6">
                    <AvInput value={value.nama_kandang} onChange={setValue} label="Nama" minLength="3"/>
                </Col>
                <Col md="6">
                    <AvInput value={value.kapasitas} onChange={setValue} type="number" label="Kapasitas"/>
                </Col>
                <Col md="6">
                    <AvInput value={value.alamat} onChange={setValue} type="textarea" label="Alamat"/>
                </Col>
                <Col md="6">
                    <AvInput value={value.keterangan} onChange={setValue} type="textarea" label="Keterangan" required={false}/>
                </Col>
            </Row>
        </CreateModal>
    )
}

export default UpdateKandang;