import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Row,
} from 'reactstrap';
import { NotificationContainer } from 'react-notifications';
import { GoogleLogin } from 'react-google-login';
import Loader from 'react-loader-spinner';
import axios from '../../axios';
import logoWithTagline from '../../assets/img/brand/logo_with_tagline.png';
import { useForm } from '../hooks/useForm';
import inputWithIcon from '../components/inputWithIcon';
import { showNotification } from '../components/Notification';
import auth from '../../auth';

function Login(props) {
  if(auth.isAuth()) {
    props.history.push('/dashboard')
  }

  const [loading, setLoading] = useState(false);
  const [values, setValues] = useForm({ email: "", password: "" });

  const responseGoogle = async (res) => {
    try {
      const { profileObj, accessToken } = res;
      const name = profileObj.givenName + " " + (profileObj.familyName || "");
      const email = profileObj.email;
      let q = {
          query: `mutation{
              loginOAuth(type:"google", token:"${accessToken}"){
                  registered
              }
          }`
      }

      let apiResponse = await axios.post('graphql', JSON.stringify(q), {
        headers: {
            'Content-Type': 'application/json',
        }
      });

      if(!apiResponse.data.data.loginOAuth.registered){
        props.history.push({pathname: '/register', state: {name, email, oauth: "facebook", accessToken}});
      } else {
        q = {
            query: `query{
                emailVerified(email:"${email}")
            }`
        }
        apiResponse = await axios.post('graphql', JSON.stringify(q), {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        q = {
            query: `mutation{
                loginOAuth2(type:"google", token:"${email}"){
                    name
                    type
                    token
                    company
                }
            }`
        }
        apiResponse = await axios.post('graphql', JSON.stringify(q), {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if(!apiResponse.data.errors){
            let result = apiResponse.data.data.loginOAuth2;
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
        }
        console.log(apiResponse);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const googleContent = (<GoogleLogin
      clientId="622300448191-7j0qjsfdknjr2qvnl675ab0tt81ijo2e.apps.googleusercontent.com"
      buttonText="Masuk dengan Google"
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
  />)

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
          showNotification("Email belum terverifikasi", "danger")
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
                    <img className="login-logo" src={logoWithTagline} alt="Avesbox Logo"/>
                  </div>
                </CardBody>
              </Card>
              <Card className="p-4 bg-avesbox-orange">
                <CardBody>
                  <form onSubmit={handleLogin} disabled={loading}>
                    <h2>Masuk</h2>
                    <hr/>
                    {googleContent}
                    <hr/>
                    <p>Masuk menggunakan akun anda</p>
                    {inputWithIcon("mb-3", "prepend", "icon-user", "text", "email", values.email, setValues, "email / nama pengguna", loading)}
                    {inputWithIcon("mb-4", "prepend", "icon-lock", "password", "password", values.password, setValues, "password", loading)}
                    <Row>
                      <Col xs="6">
                        <Link to="/reset-password" className="font-weight-bold" style={{"letterSpacing":.5}}>Lupa Kata Sandi?</Link>
                      </Col>
                      <Col xs="6" className="text-right">
                        <Button type="submit" color="primary" className="px-4" disabled={loading}>
                          {loading ? <Loader type="ThreeDots" className="d-flex" height={20} width={40} color="#ffffff"/> : "Masuk"}
                        </Button>
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