import React, { Component, useEffect, useState } from 'react';
import {
  ButtonDropdown,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Progress,
  Row,
} from 'reactstrap';
import AsyncFetch from '../../components/AsyncFetch';

function Dashboard(props) {
  const [user, setUser] = useState(0);
  const [device, setDevice] = useState(0);
  const [company, setCompany] = useState(0);
  const [order, setOrder] = useState(0);
  const [stat1, setStat1] = useState(0);
  const [stat2, setStat2] = useState(0);
  const [stat3, setStat3] = useState(0);
  const [stat4, setStat4] = useState(0);
  const fetchCard = () => {
    const device = `query{
                    devicesAll(keyword:"",limit:0,skip:0){
                        totalCount
                    }
                }`;
    const order = `query{
                    adminOrders(keyword:"",limit:0,skip:0){
                        totalCount
                        orders {
                          status
                        }
                    }
                }`;
    const user = `query{
                    users(keyword:"",limit:0,skip:0){
                        totalCount
                    }
                }`;
    AsyncFetch(order, (res) => {
        setOrder(res.data.data.adminOrders.totalCount)
        const stat = res.data.data.adminOrders.orders;
        let c1 = 0, c2=0, c3=0, c4=0;
        stat.map(x => {
          if(x.status === "Menunggu Pembayaran") c1++;
          else if(x.status === "Menunggu Konfirmasi Admin") c2++;
          else if(x.status === "Dikirim") c3++;
          else c4++
        });
        setStat1(c1)
        setStat2(c2)
        setStat3(c3)
        setStat4(c4)
    })
    AsyncFetch(device, (res) => {
        setDevice(res.data.data.devicesAll.totalCount)
    })
    AsyncFetch(user, (res) => {
        setUser(res.data.data.users.totalCount)
    })
  }
  
  useEffect(() => {
    fetchCard();
  }, [])
    return (
      <div className="animated fadeIn">
        <Row>
        <Col lg="12">
            <h1>Dashboard</h1>
            <br/>
        </Col>

          <Col xs="12" sm="6" lg="3">
            <Card className="text-white bg-info">
            <CardBody className="pb-0">
                <div>Total Pengguna</div>
                <div className="text-value">{user}</div>
            </CardBody>
            <div className="chart-wrapper mx-3" style={{ height: '50px' }}>
            </div>
            </Card>
          </Col>
      
          <Col xs="12" sm="6" lg="3">
              <Card className="text-white bg-info">
              <CardBody className="pb-0">
                  <div>Total Transaksi</div>
                  <div className="text-value">{order}</div>
              </CardBody>
              <div className="chart-wrapper mx-3" style={{ height: '50px' }}>
              </div>
              </Card>
          </Col>

          <Col xs="12" sm="6" lg="3">
              <Card className="text-white bg-info">
              <CardBody className="pb-0">
                  <div>Total IoT</div>
                  <div className="text-value">{device}</div>
              </CardBody>
              <div className="chart-wrapper mx-3" style={{ height: '50px' }}>
              </div>
              </Card>
          </Col>
          
          <Col lg="12">
            <h4>Status Transaksi</h4>
            <br/>
          </Col>
          
          <Col xs="12" sm="6" lg="3">
              <Card className="text-white bg-warning">
              <CardBody className="pb-0">
                  <div>Menunggu Pembayaran</div>
                  <div className="text-value">{stat1}</div>
              </CardBody>
              <div className="chart-wrapper mx-3" style={{ height: '50px' }}>
              </div>
              </Card>
          </Col>
          <Col xs="12" sm="6" lg="3">
              <Card className="text-white bg-danger">
              <CardBody className="pb-0">
                  <div>Menunggu Konfirmasi Admin</div>
                  <div className="text-value">{stat2}</div>
              </CardBody>
              <div className="chart-wrapper mx-3" style={{ height: '50px' }}>
              </div>
              </Card>
          </Col>
          <Col xs="12" sm="6" lg="3">
              <Card className="text-white bg-info">
              <CardBody className="pb-0">
                  <div>Dikirim</div>
                  <div className="text-value">{stat3}</div>
              </CardBody>
              <div className="chart-wrapper mx-3" style={{ height: '50px' }}>
              </div>
              </Card>
          </Col>
          <Col xs="12" sm="6" lg="3">
              <Card className="text-white bg-success">
              <CardBody className="pb-0">
                  <div>Selesai</div>
                  <div className="text-value">{stat4}</div>
              </CardBody>
              <div className="chart-wrapper mx-3" style={{ height: '50px' }}>
              </div>
              </Card>
          </Col>
        </Row>
      </div>
    );
}

export default Dashboard;