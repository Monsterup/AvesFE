import React, {useState, useEffect} from 'react'
import {Button, Col, Row, Input, InputGroup, InputGroupAddon, InputGroupText, Label} from'reactstrap'
import {AvField, AvGroup, AvInput as AvInput2} from 'availity-reactstrap-validation';
import AvInput from '../../../components/Input'
import CreateModal from '../../../components/CreateModal'
import axios from '../../../../axios'
import {showNotification} from '../../../components/Notification'
import auth from '../../../../auth'
import AsyncFetch from '../../../components/AsyncFetch';

export default function CreateAlat(props) {
    const [modal, setModal] = useState(false);
    const [sensor, setSensor] = useState(['Suhu', 'Kelembaban', 'Amonia']);
    const [getSensor, setGetSensor] = useState('Suhu');
    const [device, setDevice] = useState([]);

    const selectDeviceQuery = () => {
        const q = `query{
                    devices(keyword: "", limit: 0, skip: 0){
                        totalCount
                        devices{
                            _id
                            serialNumber
                            house
                        }
                    }
                }`
        
        AsyncFetch(q, (res) => {
            setDevice(res.data.data.devices.devices);
        })
    }

    useEffect(() => {
        selectDeviceQuery();
    }, []);

    const Form = () => {
        return (<Row>
            <Col md="6">
                <AvField type="select" name="alat" label="Alat IoT">
                    <option></option>
                    {device.map((data, key) => {
                        if(data.house !== '-')
                            return (<option  key={key} value={data._id}>{data.serialNumber}</option>)
                    })}
                </AvField>
            </Col>
            <Col md="6">
                <AvField type="select" name="tipe_sensor" label="Tipe Sensor">
                    <option></option>
                    {sensor.map((data, key) => {
                        return (<option  key={key} value={data}>{data}</option>)
                    })}
                </AvField>
            </Col>
            <Col md="6">
                <AvInput label="Hasil"/>
            </Col>
            <Col md="6">
                <AvInput type="date" label="Tanggal"/>
            </Col>
        </Row>)
    };

    // query create
    const queryCreate = (value) => {
        console.log(value);
        return {
            query: `mutation{
                        createDeviceRecord(deviceRecordInput: {
                            value : ${parseInt(value.hasil)}
                            sensorType : "${value.tipe_sensor}"
                            device : "${value.alat}"
                            date : "${value.tanggal}"
                        }){
                            _id
                        }
                    }
                `
        }
    };

    const handleSubmit = async (e, err, value) => {
        console.log(value);
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
            <Button onClick={() => setModal(true)} color="primary"><i
                className="fa fa-plus"></i> Tambah {props.objectName}</Button>
            <CreateModal title={'Tambah ' + props.objectName} modal={modal} onCancel={() => setModal(!modal)}
                onSubmit={handleSubmit}>
                <Form/>
            </CreateModal>
        </div>
    )
}