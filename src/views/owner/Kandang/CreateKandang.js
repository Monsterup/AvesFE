import React, { useState } from 'react'
import { Button, Col, Row } from'reactstrap'
import { useForm } from '../../hooks/useForm';
import AvInput from '../../components/Input'
import CreateModal from '../../components/CreateModal'
import axios from '../../../axios'
import { showNotification } from '../../components/Notification'
import auth from '../../../auth'

export default function CreateKandang(props) {
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState(false);
    const [value, setValue] = useForm({
        nama_kandang: "", kapasitas: 0, alamat: "", keterangan: "" 
    });

    const handleSubmit = async(e) => {
        try {
            setLoading(true);
            const query = {
                query: `mutation{
                    createHouse(houseInput: {
                        name : "${value.nama_kandang}"
                        capacity : ${parseInt(value.kapasitas)}
                        address: "${value.alamat}"
                        otherInformation : "${value.keterangan}"
                    }){
                        _id
                    }
                }`
            }
            let res = await axios.post('graphql', query, {
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
            showNotification("Berhasil menambah " + props.objectName, "success");
            props.onSuccess();
            setModal(false);
        } catch (e) {
            console.log(e);
            showNotification("Data tidak valid", "danger")
        }
    }

    return (
        <div>
            <Button onClick={() => setModal(true)} color="primary">
                <i className="fa fa-plus"/> Tambah {props.objectName}
            </Button>
            <CreateModal title={'Tambah ' + props.objectName} modal={modal} onCancel={() => setModal(!modal)}
                    onSubmit={handleSubmit} onLoad={loading}>
                <Row>
                    <Col md="6">
                        <AvInput label="Nama Kandang" minLength="3" value={value.nama_kandang} onChange={setValue}/>
                    </Col>
                    <Col md="6">
                        <AvInput type="number" label="Kapasitas" value={value.kapasitas} onChange={setValue}/>
                    </Col>
                    <Col md="6">
                        <AvInput type="textarea" label="Alamat" value={value.alamat} onChange={setValue}/>
                    </Col>
                    <Col md="6">
                        <AvInput required={false} type="textarea" label="Keterangan" value={value.keterangan} onChange={setValue}/>
                    </Col>
                </Row>
            </CreateModal>
        </div>
    )
}