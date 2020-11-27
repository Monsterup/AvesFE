import React, {useState, useEffect} from 'react'
import {Button, Col, Row, Input, InputGroup, InputGroupAddon, InputGroupText, Label} from'reactstrap'
import {AvField, AvGroup, AvInput as AvInput2} from 'availity-reactstrap-validation';
import AvInput from '../../components/Input'
import CreateModal from '../../components/CreateModal'
import axios from '../../../axios'
import {showNotification} from '../../components/Notification'
import auth from '../../../auth'
import AsyncFetch from '../../components/AsyncFetch';

export default function CreatePanen(props) {
    const [modal, setModal] = useState(false);
    const [rearingOptions, setRearingOptions] = useState([]);
    const [hasRearing, setHasRearing] = useState(true);

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
            if(res.data.data.rearings.totalCount > 0) {
                setHasRearing(false);
                cb(res.data.data.rearings.rearings);
            }
        })
    }

    useEffect(() => {
        selectRearingQuery('', res => {
            setRearingOptions(res);
        })
    }, []);

    const Form = () => {
        return (<Row>
            <Col md="6">
                <AvInput label="Periode" type="select">
                    <option></option>
                    {rearingOptions.map((data, key) => {
                        return (
                            <option key={key} value={data._id}>{data.otherInformation}</option>
                        )
                    })}
                </AvInput>
            </Col>
            <Col md="6">
                <AvInput type="date" label="Tanggal Panen"/>
            </Col>
            <Col md="6">
                <AvGroup>
                    <Label>Total Ayam Hidup</Label>
                    <InputGroup>
                        <AvInput2 name="jumlah" required/>
                        <InputGroupAddon addonType="append">
                            <InputGroupText>Ekor</InputGroupText>
                        </InputGroupAddon>
                    </InputGroup>
                </AvGroup>
            </Col>
            <Col md="6">
                <AvGroup>
                    <Label>Total Berat</Label>
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
        let avg = parseFloat(value.berat) / parseFloat(value.jumlah);
        avg = (Math.round(avg * 100)/100).toFixed(2);
        return {
            query: `mutation{
                        createHarvest(harvestInput: {
                            date: "${value.tanggal_panen}"
                            totalWeight : ${parseInt(value.berat)}
                            numberLiveBird : ${parseInt(value.jumlah)}
                            averageWeight : ${parseInt(avg)}
                            rearing: "${value.periode}"
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
            <Button onClick={() => setModal(true)} color="primary" disabled={hasRearing}><i
                className="fa fa-plus"></i> Tambah {props.objectName}</Button>
            <CreateModal title={'Tambah ' + props.objectName} modal={modal} onCancel={() => setModal(!modal)}
                onSubmit={handleSubmit}>
                <Form/>
            </CreateModal>
        </div>
    )
}