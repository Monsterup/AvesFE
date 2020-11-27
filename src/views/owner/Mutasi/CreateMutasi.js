import React, {useState, useEffect} from 'react'
import {Button, Col, Row, Input, InputGroup, InputGroupAddon, InputGroupText, Label} from'reactstrap'
import {AvField, AvGroup, AvInput as AvInput2} from 'availity-reactstrap-validation';
import AvInput from '../../components/Input'
import CreateModal from '../../components/CreateModal'
import axios from '../../../axios'
import {showNotification} from '../../components/Notification'
import auth from '../../../auth'
import AsyncFetch from '../../components/AsyncFetch';
import moment, { now } from 'moment';

export default function CreateMutasi(props) {
    const [modal, setModal] = useState(false);
    const [rearingOptions, setRearingOptions] = useState([]);
    const [feedOptions, setFeedOptions] = useState([]);
    let curren = moment(new Date(now())).format('YYYY-MM-DD');

    const selectRearingQuery = (keyword, cb) => {
        const q = `query{
                    rearings(keyword: "${keyword}", limit: 0, skip: 0){
                        totalCount
                        rearings{
                            _id
                            otherInformation
                        }
                    }
                }`
        
        AsyncFetch(q, (res) => {
            cb(res.data.data.rearings.rearings);
        })
    }

    const selectFeedQuery = (keyword, cb) => {
        const q = `query{
                    feeds(keyword: "${keyword}", limit: 0, skip: 0){
                        feeds{
                            _id
                            code
                            type
                        }
                    }
                }`
        
        AsyncFetch(q, (res) => {
            cb(res.data.data.feeds.feeds);
        })
    }

    useEffect(() => {
        selectRearingQuery('', res => {
            setRearingOptions(res);
        })
    }, []);

    useEffect(() => {
        selectFeedQuery('', res => {
            setFeedOptions(res);
        })
    }, []);

    const Form = () => {
        return (<Row>
            <Col md="12">
                <AvInput label="Periode" type="select">
                    <option></option>
                    {rearingOptions.map((data, key) => {
                        return (
                            <option key={key} value={data._id}>{data.otherInformation}</option>
                        )
                    })}
                </AvInput>
            </Col>
            <Col md="12">
                <Label>Tanggal</Label>
                <AvInput2 value={curren} label="Tanggal" name="tanggal" type="date"/>
            <br/>
            </Col>
            <Col md="12">
                <b>Mutasi</b>
            </Col>
            <hr/>
            <Col md="6">
                <AvInput label="Jumlah Mati"/>
            </Col>
            <Col md="6">
                <AvInput label="Jumlah Afkir"/>
            </Col>
            <Col md="12">
                <b>Pemberian Pakan</b>
            </Col>
            <hr/>
            <Col md="6">
                <AvInput label="Jenis Pakan" type="select">
                    <option></option>
                    {feedOptions.map((data, key) => {
                        return (
                            <option key={key} value={data._id}>P{data.code} - {data.type}</option>
                        )
                    })}
                </AvInput>
            </Col>
            <Col md="6">
                <AvGroup>
                    <Label>Jumlah</Label>
                    <InputGroup>
                        <AvInput2 name="jumlah_pakan" required/>
                        <InputGroupAddon addonType="append">
                            <InputGroupText>Kg</InputGroupText>
                        </InputGroupAddon>
                    </InputGroup>
                </AvGroup>
            </Col>
            <Col md="12">
                <b>Pertumbuhan</b>
            </Col>
            <hr/>
            <Col md="6">
                <AvGroup>
                    <Label>Berat Total</Label>
                    <InputGroup>
                        <AvInput2 name="berat" required/>
                        <InputGroupAddon addonType="append">
                            <InputGroupText>Kg</InputGroupText>
                        </InputGroupAddon>
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
                        createRearingRecord(rearingRecordInput: {
                            date : "${value.tanggal}"
                            death : ${parseInt(value.jumlah_mati)}
                            reject : ${parseInt(value.jumlah_afkir)}
                            growing : ${parseInt(value.berat)}
                            feedType : "${value.jenis_pakan}"
                            feedTotal : ${parseInt(value.jumlah_pakan)}
                            rearing : "${value.periode}"
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