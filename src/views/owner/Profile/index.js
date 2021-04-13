import React, {useState, useEffect} from 'react';
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
  Form,
  Label
} from 'reactstrap';
import Loader from 'react-loader-spinner';
import { NotificationContainer } from 'react-notifications';
import { showNotification } from '../../components/Notification';
import UpdateProfile from './UpdateProfile';
import AsyncFetch from '../../components/AsyncFetch';
import { useForm } from '../../hooks/useForm';
import axios from '../../../axios';
import auth from '../../../auth';

function Profile(props) {
  const [type, setType] = useState("password");
  const [type2, setType2] = useState("password");
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [loading, setLoading] = useState(false);
  const [object, setObject] = useState([]);
  const [peternakan, setPeternakan] = useState([]);
  const [updateProfile, setUpdateProfile] = useState(false);

  const Modal = () => {
    return (
      <div>
          <UpdateProfile data={object} modal={updateProfile} onCancel={() => setUpdateProfile(false)}/>
      </div>
    )
  }

  const fetchDataProfile = () => {
    const q = `query{
                getProfile{
                  name
                  email
                  username
                  address
                  role
                }
              }
            `;
    AsyncFetch(q, (res) => {
      setObject(res.data.data.getProfile)
    })
  }

  useEffect(() => {
    fetchDataProfile();
  }, []);

  const fetchDataPeternakan = () => {
    const q = `query{
                companies(keyword:"",limit:0,skip:0){
                  totalCount,
                  companies{
                    name
                  }
                }
              }
            `;
    AsyncFetch(q, (res) => {
      setPeternakan(res.data.data.companies.companies);
    })
  }

  useEffect(() => {
    fetchDataPeternakan();
  }, []);

  const submitPassword = async(e) => {
    e.preventDefault();
    try {
      const q = {
        query: `mutation{
            updatePassword(passwordLama:"${pass1}", passwordBaru:"${pass2}")
          }`
      }

      setLoading(true);

      let res = await axios.post('graphql', JSON.stringify(q), {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + auth.getSession().token
        }
      });

      console.log(res);

      if(res.data.errors) {
          throw new Error('Kata sandi lama tidak sesuai');
      }

      showNotification("Kata Sandi berhasil diubah", "success", "Berhasil");
      setLoading(false);
      setPass1("");
      setPass2("");
    } catch (error) {
      setLoading(false);
      showNotification("Kata Sandi lama tidak sesuai", "danger");
      console.log(error);
    }
  }

  return (
    <div className="mt-5">
      <Container>
        <NotificationContainer/>
        <Modal/>
        <Row className="justify-content-center">
          <Col md="6">
            <CardGroup className="box-shadow">
            <Card className="text-black py-5 px-5">
                <Row>
                  <Col md="12">
                  <CardBody className="d-flex">
                    <div className="my-auto">
                      <h2 style={{"text-align": "center" }}>{object['name']}</h2>
                      <h4 style={{"color":"gray","text-align": "center" }}>({object['role']})</h4>
                      <br/>
                      <Row>
                        <Col md="12" className="mb-3">
                          <b style={{"display": "inline"}}>Nama Pengguna : </b>
                          <br></br>
                          <p style={{"display": "inline"}}>{object['username']}</p>
                        </Col>
                        <Col md="12" className="mb-3">
                          <b style={{"display": "inline"}}>Email : </b>
                          <br></br>
                          <p style={{"display": "inline"}}>{object['email']}</p>
                        </Col>
                        <Col md="12">
                          <b style={{"display": "inline"}}>Alamat : </b>
                          <br></br>
                          <p>{object['address']}</p>
                        </Col>
                        <Col md="12">
                        <b style={{"display": "inline"}}>Peternakan : </b>
                        <br></br>
                        {peternakan.map((data, index) => {
                          return(
                            <p key={index}>{data.name}</p>
                          )
                        })}
                        </Col>
                        <br/>
                        <br/>
                        <Col md="2"/>
                        <Col md="4">
                          <Button type="submit" color="primary" onClick={() => setUpdateProfile(true)} className="px-4" block>Ubah Profil</Button>
                        </Col>
                        <Col md="4">
                          <Button type="submit" color="warning"
                          onClick={() => props.history.push({pathname: 'change_email', state: {email: object['email']}})}
                          className="px-4" style={{"color":"white"}} block>Ubah Email</Button>
                        </Col>
                        <Col md="2"/>
                      </Row>
                      <br/>
                      <hr/>
                      <Form onSubmit={submitPassword}>
                        <Row>
                            <Col md="12">
                              <b>Ubah Kata Sandi</b><br/><br/>
                            </Col>
                            <Col md="12">
                              <InputGroup>
                                <Input type={type} name="passwordLama" value={pass1} onChange={(e) => setPass1(e.target.value)} placeholder="Kata Sandi Lama" disabled={loading}/>
                                <InputGroupAddon addonType="append">
                                  <Button onClick={() => {
                                    type === "text" ? setType("password") : setType("text");
                                  }}>
                                    <i className={type === "text" ? 'fa fa-eye' : 'fa fa-eye-slash'}/>
                                  </Button>
                                </InputGroupAddon>
                              </InputGroup>
                            </Col>
                            <Col md="12">
                              <InputGroup>
                                <Input type={type2} name="passwordBaru" value={pass2} onChange={(e) => setPass2(e.target.value)} placeholder="Kata Sandi Baru" disabled={loading}/>
                                <InputGroupAddon addonType="append">
                                  <Button onClick={() => {
                                    type2 === "text" ? setType2("password") : setType2("text");
                                  }}>
                                    <i className={type2 === "text" ? 'fa fa-eye' : 'fa fa-eye-slash'}/>
                                  </Button>
                                </InputGroupAddon>
                              </InputGroup>
                              <br/>
                            </Col>
                            <Col md="8"/>
                            <Col md="4" className="text-right">
                              <Button type="submit" color="danger" className="px-4" block>
                                {loading ? <Loader type="ThreeDots" height={20} width={40} color="#ffffff"/> : "Simpan"}
                              </Button>
                            </Col>
                        </Row>
                      </Form>
                    </div>
                  </CardBody>
                  </Col>
                </Row>
              </Card>
            </CardGroup>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Profile;