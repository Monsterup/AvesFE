import React, {useState, useEffect} from 'react'
import {Button, Col, Row, Label, InputGroupAddon, InputGroupText, InputGroup} from'reactstrap'
import {AvGroup, AvInput as AvInput2, AvFeedback} from 'availity-reactstrap-validation'
import AvInput from '../../components/Input'
import CreateModal from '../../components/CreateModal'
import axios from '../../../axios'
import {showNotification} from '../../components/Notification'
import auth from '../../../auth'
import AsyncFetch from '../../components/AsyncFetch';
import moment, { now } from 'moment';

export default function CreateRearing(props) {
    let curren = moment(new Date(now())).format('YYYY-MM-DD');

    const [modal, setModal] = useState(false);
    const [houseOptions, setHouseOptions] = useState([]);

    const selectHouseQuery = (keyword, cb) => {
        const q = `query{
                    houses(keyword: "${keyword}", limit: 0, skip: 0){
                        totalCount
                        houses{
                            _id
                            name
                        }
                    }
                }`
        
        AsyncFetch(q, (res) => {
                cb(res.data.data.houses.houses);
        })
    }

    useEffect(() => {
        selectHouseQuery('', res => {
            setHouseOptions(res);
        })
    }, []);

    const Form = () => {
        return (<Row>
            <Col md="12">
                <AvInput label="Kandang" type="select">
                    <option></option>
                    {houseOptions.map((data, key) => {
                        return (
                            <option key={key} value={data._id}>{data.name}</option>
                        )
                    })}
                </AvInput>
            </Col>
            <Col md="6">
                <AvInput label="Nama Periode"/>
            </Col>
            <Col md="6">
                <AvInput value={curren} type="date" label="Tanggal Masuk"/>
            </Col>
            <Col md="6">
                <AvGroup>
                    <Label>Populasi Awal Ternak</Label>
                    <InputGroup>
                        <AvInput2 name="populasi" required/>
                        <InputGroupAddon addonType="append">
                            <InputGroupText>Ekor</InputGroupText>
                        </InputGroupAddon>
                        <AvFeedback>Populasi awal ternak wajib diisi</AvFeedback>
                    </InputGroup>
                </AvGroup>
            </Col>
            <Col md="6">
                <AvGroup>
                    <Label>Total Berat Ternak</Label>
                    <InputGroup>
                        <AvInput2 name="total_berat" required/>
                        <InputGroupAddon addonType="append">
                            <InputGroupText>Kg</InputGroupText>
                        </InputGroupAddon>
                        <AvFeedback>Total berat ternak wajib diisi</AvFeedback>
                    </InputGroup>
                </AvGroup>
            </Col>
        </Row>)
    };

    // query create
    const queryCreate = (value) => {
        console.log(value);
        return {
            query: `mutation{
                        createRearing(rearingInput: {
                            house: "${value.kandang}"
                            chickInDate : "${value.tanggal_masuk}"
                            chickInWeight : ${parseInt(value.total_berat)}
                            population: ${parseInt(value.populasi)}
                            otherInformation : "${value.nama_periode}"
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