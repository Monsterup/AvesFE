import React, { useState } from 'react'
import {Link} from 'react-router-dom';
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
import {NotificationContainer} from 'react-notifications';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import {GoogleLogin} from 'react-google-login';
import Loader from 'react-loader-spinner';
import axios from '../../axios';
import logoWithTagline from '../../assets/img/brand/logo_with_tagline.png'
import { useForm } from '../hooks/useForm'
import inputWithIcon from '../components/inputWithIcon'
import {showNotification} from '../components/Notification'
import auth from '../../auth';

function Login(props) {

  if(auth.isAuth()) {
    props.history.push('/dashboard')
  }

  const [loading, setLoading] = useState(false);
  const [values, handleChange] = useForm({ email: "", password: "" });
  const [fbButton, setFbButton] = useState(false);
  const responseFb = async (res) => {
    try {
      setFbButton(true);
      const { name, email, id, accessToken } = res;
      const q = {
        query: `mutation{
          loginOAuth(type:"facebook", token:"${accessToken}"){
            registered
          }
        }`
      }

      let apiResponse = await axios.post('graphql', JSON.stringify(q), {
        headers: {
            'Content-Type': 'application/json',
        }
      })
      if(!apiResponse.data.data.loginOAuth.registered){
        props.history.push('/register', { data: {name, email, oauth: "facebook", accessToken} })
      } else {
        const query = {
          query: `mutation{
            loginOAuth2(type:"facebook", token:"${id}"){
              name
              type
              token
              company
            }
          }`
        }
        let resD = await axios.post('graphql', JSON.stringify(query), {
          headers: {
              'Content-Type': 'application/json',
          }
        })
        if(!resD.data.errors) {
          let result = resD.data.data.loginOAuth2;
          auth.setSession(
            result.userId, result.name, result.token, result.company, null, result.type,
            function (resData) {
              console.log(resData);
            }
          )
          if(res.type === 'admin')
            props.history.push('/adm/dashboard');
          else
            props.history.push('/dashboard');
        } else {
          showNotification("Email atau password salah", "danger")
        }
      }

      setFbButton(false);
    } catch (error) {
      console.log(error)
    }
  }

  const responseGoogle = async (res) => {
    try {
      return;
      const {email, name, googleId} = res.profileObj;
      const q = {
        query: `query{
          checkEmail(email:"${email}"){
            registered
          }
        }`
      }
      let apiResponse = await axios.post('graphql', JSON.stringify(q), {
        headers: {
            'Content-Type': 'application/json',
        }
      });
      if(!apiResponse.data.data.checkEmail.registered){
        props.history.push('/register', { data: {name, email, oauth: "google"} })
      }
      const query = {
                    query: `mutation{
                          loginOAuth(email:"${email}"){
                            token
                            name
                            userId
                            company
                            tokenExpiration
                          }
                        }
                    `
                };

                const res = await axios.post('https://avesbox.glitch.me/graphql', query);
    } catch (error) {
      console.log(error);
    }
  }

  const fbContent = (<FacebookLogin
    appId="503158447021063"
    autoLoad={false}
    fields="name,email,picture"
    callback={responseFb}
    render={renderProps => (
        <Button onClick={renderProps.onClick}
            style={{"backgroundColor":"#4267b2", "border": "none", "color": "white", "width": "60%"}} disabled={fbButton}> <span
            className="fa fa-facebook"></span> &nbsp;&nbsp; Masuk dengan
            Facebook</Button>
    )}
  />);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (values.email.trim().length === 0 || values.password.trim().length === 0) {
      showNotification("Harap isi username dan password","", "warning");
      return;
    }

    try {
      const q = {
        query: `query{
            login(email:"${values.email}", password:"${values.password}"){
              name
              type
              token
              company
            }
          }`
      }

      setLoading(true);

      let apiResponse = await axios.post('graphql', JSON.stringify(q), {
        headers: {
            'Content-Type': 'application/json',
        }
      })
  
      if(apiResponse.data.errors) {
        if(apiResponse.data.errors[0].message === "Not verified")
          showNotification("Email belum terverifikasi", "", "danger")
        else
          showNotification("Email atau password salah", "danger")
        throw new Error();
      }
  
      const res = apiResponse.data.data.login;
  
      auth.setSession(
        res.userId, res.name, res.token, res.company, null, res.type,
        function (resData) {
          console.log(resData);
        }
      )
      setLoading(false);
      if(res.type === 'admin')
        props.history.push('/adm/dashboard');
      else
        props.history.push('/dashboard');

    } catch (error) {
      console.log(error);
      setLoading(false);
    }
    
  }

  return (
    <div className="app flex-row align-items-center">
      <Container>
      <NotificationContainer/>
        <Row className="justify-content-center">
          <Col md="10">
            <CardGroup className="box-shadow">
              <Card className="text-black py-5 d-md-down-none">
                <CardBody className="text-center justify-content-center d-flex">
                  <div className="my-auto">
                    <img className="login-logo" src={logoWithTagline}
                      alt="Avesbox Logo"/>
                  </div>
                </CardBody>
              </Card>
              <Card className="p-4 bg-avesbox-orange">
                <CardBody>
                  <form onSubmit={handleLogin}>
                    <h2>Masuk</h2>
                    <br/>
                    {fbContent}
                    {/* <br/><br/> */}
                    {/* {googContent} */}
                    <hr/>
                    <p>Masuk menggunakan akun anda</p>
                    {inputWithIcon("mb-3", "prepend", "icon-user", "text", "email", values.email, handleChange, "email / nama pengguna")}
                    {inputWithIcon("mb-4", "prepend", "icon-lock", "password", "password", values.password, handleChange, "password")}
                    <Row>
                      <Col xs="6">
                        <Button type="submit" color="primary" className="px-4">
                          {loading ? <Loader type="ThreeDots" className="d-flex" height={20} width={40} color="#ffffff"/> : "Masuk"}
                        </Button>
                      </Col>
                      <Col xs="6" className="text-right">
                        <Link to="/" className="font-weight-bold" style={{"letterSpacing":.5}}>Lupa Password?</Link>
                      </Col>
                    </Row>
                    <br/>
                      <p className="text-muted"> Belum memiliki Akun ? <Link
                        to="/register" className="font-weight-bold">Daftar</Link> Sekarang!</p>
                  </form>
                </CardBody>
              </Card>
            </CardGroup>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Login;