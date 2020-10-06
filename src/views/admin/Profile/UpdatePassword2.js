import React, {useState, useEffect} from "react";
import { Link } from 'react-router-dom'
import { Col, Row, Button} from "reactstrap";
import Countdown from 'react-countdown';
import {AvField} from 'availity-reactstrap-validation';
import {NotificationContainer} from 'react-notifications';
import axios from "../../../axios";
import {showNotification} from "../../components/Notification";
import CreateModal from "../../components/CreateModal";
import DefaultPhoto from '../../../assets/img/avatar/logo_only_250.svg';
// import useApp from '../../hooks/useApp';

function UpdateProfile(props) {
    const [minutes, setMinute] = useState(Date.now());
    const [loading, setLoading] = useState(false);
    
    const handleResend = async (e, err, value) => {
        e.preventDefault();
        try {
            setLoading(true);
            const q3 = {
                query: `mutation{
                    otp(email:"${props.data.email}", emailBaru:"${props.data.email}"){
                        code
                    }
                }`
            }

            let resOTP = await axios.post('graphql', JSON.stringify(q3), {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const resOTPData = resOTP.data;

            if (resOTPData.errors) {
                showNotification("Error, silahkan periksa koneksi anda", "danger");
                return;
            }
            setMinute(Date.now()+60*1000);
            setLoading(false);
            showNotification("Silakan cek kotak masuk email baru Anda", "success");
        } catch (error) {
            console.log(error)
        }
    }

    const timer = ({ minutes, seconds, completed}) => {
        if(completed) {
            return (
                <Button onClick={handleResend} className="font-weight-bold" style={{"letterSpacing":.5}} disabled={loading}>Kirim Ulang</Button>
            )
        } else {
            return(
                <span>
                    {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                </span>
            )
        }
    }

    const Form = () => {
        return (
            <Row>
                <Col md="12">
                    <br/>
                </Col>
                <Col md="3"/>
                <Col md="6" className="text-center">
                    <p>Masukkan kode OTP</p>
                    <AvField name="otp" type="number"/>
                </Col>
                <Col md="3"/>
            </Row>
        )
    }

    const handleSubmit2 = async (e, err, value) => {
        e.preventDefault();
        if (err.length > 0) {
            return;
        }
        console.log(value)

        try {
            const q = {
                query: `mutation{
                    cekOtp(resetPasswordToken:${parseInt(value.otp)})
                }`
            }

            let res = await axios.post('graphql', JSON.stringify(q), {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const resData = res.data;

            if (resData.errors) {
                showNotification("Kode OTP Salah / Kadaluarsa", "danger");
                return;
            }

            const q2 = {
                query: `mutation{
                    updatePassword(email:"${props.data.email}", passwordBaru:"${props.data.passwordBaru}")
                }`
            }

            let res2 = await axios.post('graphql', JSON.stringify(q2), {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const resData2 = res2.data;

            if (resData2.errors) {
                showNotification(resData2.errors[0].message, "danger");
                return;
            }
            showNotification("Berhasil memperbaharui password", "success");
            setTimeout(() => {
                props.onSuccess();
            }, 4000);
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <CreateModal modal={props.modal} title={'Verifikasi OTP'} onCancel={props.onCancel}
            onSubmit={handleSubmit2} kembali={true}>
            <Form/>
            <div className="text-center">
                <p style={{color:"red", fontSize:"10px"}}>Kode OTP dikirimkan ke email anda, dan valid selama 1 jam</p>
            </div>
        </CreateModal>
    )
}

export default UpdateProfile;