import React, {useState, useEffect} from 'react'
import {Button, Col, Row, Input, InputGroup, InputGroupAddon, InputGroupText, Label} from'reactstrap'
import moment from 'moment'
import {AvField, AvGroup, AvInput as AvInput2, AvForm} from 'availity-reactstrap-validation';
import AvInput from '../../components/Input'
import CreateModal from '../../components/CreateModal'
import axios from '../../../axios'
import {showNotification} from '../../components/Notification'
import { NotificationContainer } from 'react-notifications';
import auth from '../../../auth'
import AsyncFetch from '../../components/AsyncFetch';

export default function UpdateUser(props) {
    const type = ['admin', 'owner'];
    const [user, setUser] = useState({
        name:'',
        username: '',
        address: '',
        email: '',
        type: ''
    });
    let _id;

    if(typeof(props.location.state) === 'undefined') {
        props.history.push('user')
    } else {
        _id = props.location.state._id;
    }

    const getUser = async () => {
        const q = `query{
                    user(_id : "${_id}"){
                        _id
                        username
                        name
                        address
                        type
                        email
                    }
                }`;
        AsyncFetch(q, (res) => {
            setUser(res.data.data.user)
        });
    }

    useEffect(() => {
        getUser()
    }, [])

    const submit = async(e, err, value) => {
        try {
            const query = {
                query: `mutation{
                        updateUser2(updateUserInput2: {
                            user: "${_id}"
                            type: "${value.tipe_pengguna}"
                        }){
                            createdAt
                        }
                    }
                `
            };
            let res = await axios.post('graphql', JSON.stringify(query), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + auth.getSession().token
                }
            });
            
            const resData = res.data;
            if (resData.errors){
                showNotification(resData.errors[0].message,"danger", "Ups!")
                return;
            }

            showNotification("Berhasil merubah tipe pengguna", "success", "Terima Kasih");
            setTimeout(() => {
                props.history.push('/adm/user');
            }, 3000);
        } catch (e) {
            showNotification("Input tidak valid", "danger", "Ups!")
        }
    }

    return (
        <div className="text-center">
            <NotificationContainer/>
            <h2>UBAH PENGGUNA</h2>
            <br/>
            <br/>
            <form>
                <AvForm onSubmit={submit}>
                    <Row>
                        <Col md="4"/>
                        <Col md="4">
                            <AvInput value={user.name} label="Nama Lengkap" disabled/>
                        </Col>
                        <Col md="4"/>
                        <Col md="4"/>
                        <Col md="2">
                            <AvInput value={user.username} label="Nama Pengguna" disabled/>
                        </Col>
                        <Col md="2">
                        <AvInput value={user.type} label="Tipe Pengguna" type="select">
                            <option></option>
                            {type.map((data, key) => {
                                return (
                                    <option key={key} value={data}>{data}</option>
                                )
                            })}
                        </AvInput>
                        </Col>
                        <Col md="4"/>
                        <Col md="4"/>
                        <Col md="4">
                            <AvInput value={user.email} label="Email" className="text-center" disabled/>
                        </Col>
                        <Col md="4"/>
                        <Col md="4"/>
                        <Col md="4">
                            <AvInput type="textarea" value={user.address} label="Alamat" className="text-center" disabled/>
                        </Col>
                        <Col md="4"/>
                        <Col md="12">
                            <br/>
                            <br/>
                        </Col>
                        <Col md="4"/>
                        <Col md="2">
                            <Button color="secondary" className="px-4" block onClick={() => props.history.push('user')}>Kembali</Button>
                        </Col>
                        <Col md="2">
                            <Button type="submit" color="primary" className="px-4" block>Simpan</Button>
                        </Col>
                        <Col md="4"/>
                    </Row>
                </AvForm>
            </form>
        </div>
    )
}