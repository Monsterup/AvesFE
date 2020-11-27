import React, {useState, useEffect} from 'react'
import {Button, Col, Row, Input, InputGroup, InputGroupAddon, InputGroupText, Label} from'reactstrap'
import moment from 'moment'
import {AvField, AvGroup, AvInput as AvInput2} from 'availity-reactstrap-validation';
import AvInput from '../../components/Input'
import CreateModal from '../../components/CreateModal'
import axios from '../../../axios'
import {showNotification} from '../../components/Notification'
import auth from '../../../auth'
import AsyncFetch from '../../components/AsyncFetch';

export default function CreateMutasi(props) {
    const [modal, setModal] = useState(false);
    const [userOptions, setUserOptions] = useState([]);

    const selectUserQuery = (keyword, cb) => {
        const q = `query{
                    users(keyword: "${keyword}", limit: 0, skip: 0){
                        users{
                            _id
                            username
                        }
                    }
                }`
        
        AsyncFetch(q, (res) => {
            cb(res.data.data.users.users);
        })
    }

    useEffect(() => {
        selectUserQuery('', res => {
            setUserOptions(res);
        })
    }, []);

    const Form = () => {
        return (<Row>
            <Col md="6">
                <AvInput label="Nomor Seri"/>
            </Col>
            <Col md="6">
                <AvInput label="Pemilik" type="select">
                    <option></option>
                    {userOptions.map((data, key) => {
                        return (
                            <option key={key} value={data._id}>{data.username}</option>
                        )
                    })}
                </AvInput>
            </Col>
        </Row>)
    };

    const handleSubmit = async (e, err, value) => {
        console.log(value);
        if (err.length > 0) {
            return;
        }
        try {
            const q = {
                query: `mutation{
                    createSN(SN: [{serialNumber:"${value.nomor_seri}"}], creator: "${value.pemilik}"){
                        created
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