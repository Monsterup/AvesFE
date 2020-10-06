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
} from 'reactstrap'
import UpdateProfile from './UpdateProfile'
import AsyncFetch from '../../components/AsyncFetch';

function Profile(props) {

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

  return (
    <div className="mt-5">
      <Container>
        <Modal/>
        <Row className="justify-content-center">
          <Col md="8">
            <CardGroup className="box-shadow">
            <Card className="text-black py-5">
                <Row>
                  <Col md="12">
                  <CardBody className="text-center justify-content-center d-flex">
                    <div className="my-auto">
                      <h2>{object['name']}</h2>
                      <h4 style={{"color":"gray"}}>({object['role']})</h4>
                      <br/>
                      <div>
                        <h6 style={{"display": "inline"}}>Nama Pengguna : </h6>
                        <p style={{"display": "inline"}}>{object['username']}</p>
                      </div>
                      <div>
                        <h6 style={{"display": "inline"}}>Email : </h6>
                        <p style={{"display": "inline"}}>{object['email']}</p>
                      </div>
                      <div>
                        <h6 style={{"display": "inline"}}>Alamat : </h6>
                        <p>{object['address']}</p>
                      </div>
                      <div>
                        <h6 style={{"display": "inline"}}>Peternakan : </h6>
                        {peternakan.map(data => {
                          return(
                            <p>{data.name}</p>
                          )
                        })}
                      </div>
                      <br/>
                      <Row>
                        <Col md="2"/>
                        <Col md="8">
                        <Button type="submit" color="primary" 
                        onClick={() => setUpdateProfile(true)}
                        className="px-4" block>Ubah Profil</Button>                            
                        </Col>
                        <Col md="2"/>
                      </Row>
                      <br/>
                      <Row>
                        <Col md="2"/>
                        <Col md="4">
                          <Button type="submit" color="warning"
                          onClick={() => props.history.push({pathname: 'change_email', state: {email: object['email']}})}
                          className="px-4" style={{"color":"white"}} block>Ubah<br/>Email</Button>
                        </Col>
                        <Col md="4">
                          <Button type="submit" color="danger"
                          onClick={() => props.history.push({pathname: 'change_password', state: {email: object['email']}})}
                          className="px-4" block>Ubah Password</Button>
                        </Col>
                        <Col md="2"/>
                      </Row>
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