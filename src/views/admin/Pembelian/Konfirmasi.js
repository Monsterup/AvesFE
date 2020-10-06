import React, {useState} from "react";
import { Col, Row} from "reactstrap";
import AvInput from "../../components/Input";
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import SwalDelete from '../../components/SwalDelete';
import CreateModal from "../../components/CreateModal";
import {AvField, AvForm, AvInput as AI} from 'availity-reactstrap-validation';
import axios from "../../../axios";
import {showNotification} from "../../components/Notification";
import AsyncFetch from '../../components/AsyncFetch';
import auth from "../../../auth";

function Konfirmasi(props) {
    const img = `https://avesbox-2020.glitch.me/uploads/${props.data.img}`;
    let rows = [];

    for(let i=0; i<props.data.amount; i++) {
        rows.push(i+1);
    }

    const [state, setState] = useState(rows);

    const queryCreate = (value) => {
        return {
            query: `mutation{
                        resi(_id : "${props.data._id}", resi: "${value.nomor_resi}"){
                            _id
                        }
                    }
                `
        }
    };

    const onChange = index => e => {
        let newArr = [...state];
        newArr[index] = e.target.value;

        setState(newArr);
    }

    const handleSubmit = async (e, err, value) => {
        if (err.length > 0) {
            return;
        }
        try {
            let q;
            let resData2;
            state.map(async x => {
                q = {
                    query: `mutation{
                        createSN(SN: [{serialNumber:"${x}"}], creator: "${props.data.creator}"){
                            created
                        }
                    }`
                }
                let res2 = await axios.post('graphql', JSON.stringify(q), {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + auth.getSession().token
                    }
                });

                resData2 = res2.data;
                if (resData2.errors) {
                    showNotification(resData2.errors[0].message, "danger")
                    return;
                }
            })
            
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
            showNotification("Berhasil mengubah status", "success");
            props.onSuccess();
        } catch (e) {
            console.log(e);
            showNotification("Data tidak valid", "danger")
        }
    }

    return (
        <div>
            <Modal isOpen={true}>
                <ModalHeader toggle={props.onCancel}>KONFIRMASI PEMBAYARAN</ModalHeader>
                <form>
                    <AvForm onSubmit={handleSubmit}>
                        <ModalBody className="text-center">
                            <label>Bukti Pembayaran</label><br/>
                            <img src={img} alt="" style={{'maxWidth':"400px"}}/>
                            <br/>
                            <br/>
                                <Row>
                                    <Col md="2"/>
                                    <Col md="8">
                                        <AvInput label="Nomor Resi" helpMessage="*Isi jika pembayaran valid"/>
                                    </Col>
                                    <Col md="2"/>
                                </Row>
                                <label>Nomor Serial</label>
                                    {
                                        rows.map((x, key) => {
                                            console.log(x);
                                            return (
                                                <Row>
                                                    <Col md="2"/>
                                                        <Col md="8">
                                                            <AI name="serial" value={state[x-1]} onChange={onChange(key)}/>
                                                        </Col>
                                                    <Col md="2"/>
                                                </Row>
                                            )
                                        })
                                    }
                        </ModalBody>
                        <ModalFooter>
                            <Button type="submit" color="success">Kofirmasi</Button>
                            <Button type="button" color="primary" onClick={props.onCancel}>Kembali</Button>
                        </ModalFooter>
                    </AvForm>
                </form>
            </Modal>
        </div>
    )
}

export default Konfirmasi;