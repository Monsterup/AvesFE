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

export default function CreateStokPakan(props) {
    const [modal, setModal] = useState(false);
    const [feedOptions, setFeedOptions] = useState([]);
    const [houseOptions, setHouseOptions] = useState([]);
    const [hasHouse, setHasHouse] = useState(true);
    let curren = moment(new Date(now())).format('YYYY-MM-DD');

    const selectFeedQuery = (keyword, cb) => {
        const q = `query{
                    feeds(keyword: "${keyword}", limit: 0, skip: 0){
                        totalCount
                        feeds{
                            _id
                            code
                            type
                        }
                    }
                }`
        
        AsyncFetch(q, (res) => {
            if(res.data.data.feeds.totalCount > 0) {
                setHasHouse(false);
                cb(res.data.data.feeds.feeds);
            }
        })
    }

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
            if(res.data.data.houses.totalCount > 0) {
                setHasHouse(false);
                cb(res.data.data.houses.houses);
            }
        })
    }

    useEffect(() => {
        selectFeedQuery('', res => {
            setFeedOptions(res);
        })
    }, []);

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
            <Col md="10">
                <AvInput label="Kode Pakan" type="select">
                    <option></option>
                    {feedOptions.map((data, key) => {
                        return (
                            <option key={key} value={data._id}>P{data.code} - {data.type}</option>
                        )
                    })}
                </AvInput>
            </Col>
            <Col md="2">
                <AvGroup>
                    <Label>Jumlah</Label>
                    <InputGroup>
                        <AvInput2 name="jumlah" required/>
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
                        createFeedStock(feedStockInput: {
                            house : "${value.kandang}"
                            feed : "${value.kode_pakan}"
                            number : ${parseInt(value.jumlah)}
                        }){
                            number
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
            <Button onClick={() => setModal(true)} color="primary" disabled={hasHouse}><i
                className="fa fa-plus"></i> Tambah {props.objectName}</Button>
            <CreateModal title={'Tambah ' + props.objectName} modal={modal} onCancel={() => setModal(!modal)}
                onSubmit={handleSubmit}>
                <Form/>
            </CreateModal>
        </div>
    )
}