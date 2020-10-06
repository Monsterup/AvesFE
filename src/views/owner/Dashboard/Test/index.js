import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import moment from 'moment';
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
} from 'reactstrap'
import { AvInput } from 'availity-reactstrap-validation';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import AsyncFetch from '../../../components/AsyncFetch';

const brandPrimary = getStyle('--primary')
const brandSuccess = getStyle('--success')
const brandInfo = getStyle('--info')
const brandWarning = getStyle('--warning')
const brandDanger = getStyle('--danger')

function Test() {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);
    const [periodes, setPeriodes] = useState([]);
    const [periode, setPeriode] = useState(0);
    const [data, setData] = useState(null);
    const [cardData, setCardData] = useState({
        house: 0,
        device: 0,
        order: 0
    });
    const [monitor, setMonitor] = useState([]);
    const [growing, setGrowing] = useState([]);
    const [harvest, setHarvest] = useState(null);
    let data1 = [];
    let data2 = [];
    let data3 = [];
    let data4 = [];

    const fetchAllPeriodes = () => {
        const q = `query{
                    rearings(keyword : "", limit : 0, skip : 0){
                        totalCount
                        rearings {
                            _id
                            chickInDate
                            chickInWeight
                            population
                            otherInformation
                            house
                            houseid
                        }
                    }
                }`;
        
        AsyncFetch(q, (res) => {
            if(res.data.data.rearings.totalCount > 0) {
                setPeriodes(res.data.data.rearings.rearings);
                setData(res.data.data.rearings.rearings[0])
            } else {
                setPeriodes(['none'])
            }
        })
    }

    useEffect(() => {
        fetchAllPeriodes();
    }, [])
    
    const fetch = (periode) => {
        const q = `query{
                    rearing(_id: "${periode}"){
                        _id
                        chickInDate
                        otherInformation
                        population
                        chickInWeight
                        house {
                            _id
                            name
                        }
                    }
                }`;

        AsyncFetch(q, (res) => {
            if(res.data.data.rearing !== null) {
                setData(res.data.data.rearing)
            } else {
                setData(null);
            }
        })
    }

    useEffect(() => {
        fetch();
    }, [])

    const fetchGrowing = (periode) => {
        const q = `query{
                    rearingRecords(keyword:"",limit:0,skip:0){
                        rearingRecords{
                            death
                            reject
                            date
                            growing
                            rearingid
                        }
                    }
                }`;

        AsyncFetch(q, (res) => {
            if(res.data.data.rearingRecords.rearingRecords !== null) {
                setGrowing(res.data.data.rearingRecords.rearingRecords)
            } else {
                setGrowing(null);
            }
        })
    }

    useEffect(() => {
        fetchGrowing();
    }, [])

    const fetchHarvest = (periode) => {
        const q = `query{
                    harvests(keyword:"",limit:0,skip:0){
                        harvests{
                            date
                            rearing {
                                _id
                            }
                        }
                    }
                }`;

        AsyncFetch(q, (res) => {
            if(res.data.data.harvests.harvests !== null) {
                setHarvest(res.data.data.harvests.harvests)
            } else {
                setHarvest(null);
            }
        })
    }

    useEffect(() => {
        fetchHarvest();
    }, [])

    const fetchMonitor = () => {
        const q = `query{
                    deviceRecords(keyword:"",limit:0,skip:0){
                        deviceRecords{
                            _id
                            value
                            sensorType
                            device
                            house
                            date
                        }
                    }
                }`;

        AsyncFetch(q, (res) => {
            if(res.data.data.deviceRecords.deviceRecords !== null) {
                setMonitor(res.data.data.deviceRecords.deviceRecords)
            } else {
                setData(null);
            }
        })
    }

    useEffect(() => {
        fetchMonitor();
    }, [])

    const fetchCard = () => {
        const house = `query{
                        houses(keyword:"",limit:0,skip:0){
                            totalCount
                        }
                    }`;
        const device = `query{
                        devices(keyword:"",limit:0,skip:0){
                            totalCount
                        }
                    }`;
        const order = `query{
                        orders(keyword:"",limit:0,skip:0){
                            totalCount
                        }
                    }`;
        let result = {
            house: 0,
            device: 0,
            order: 0
        }
        AsyncFetch(order, (res) => {
            result.order = res.data.data.orders.totalCount
        })
        AsyncFetch(device, (res) => {
            result.device = res.data.data.devices.totalCount
        })
        AsyncFetch(house, (res) => {
            result.house = res.data.data.houses.totalCount
            setCardData(result);
        })
    }

    useEffect(() => {
        fetchCard();
    }, [])

    const getLabel = () => {
        let arr = [];
        let now = new Date().getTime();
        let diff;
        if(data !== null) {
            if(harvest !== null) {
                harvest.map(x => {
                    if(data._id === x.rearing._id) {
                        now = x.date;
                    }
                })
            }
            const oneDay = 24 * 60 * 60 * 1000;
            let res = Math.round(Math.floor(now - data.chickInDate) / oneDay, 2);
            for(let i=1; i<=res; i++) {
                arr.push(`${i}`)
            }
        }
        return arr;
    }

    const getGrowing = () => {
        let arr = [];
        let now = new Date().getTime();
        if(data !== null) {
            const oneDay = 24 * 60 * 60 * 1000;
            let res = Math.round(Math.floor(now - data.chickInDate) / oneDay, 2);
            for(let i=1; i<=res; i++) {
                arr.push(0)
            }
            for(let i=0; i<res; i++) {
                let d = new Date(data.chickInDate * 1);
                d = moment((d.setDate(d.getDate() + i)) * 1).format('DD/MM/YYYY');
                growing.map(x => {
                    if(x.rearingid === data._id) {
                        let tgl = moment((x.date) * 1).format('DD/MM/YYYY');
                        if(d === tgl) {
                            let res = x.growing / (data.population - x.death - x.reject);
                            arr[i] = res.toFixed(2) * 10;
                        }
                    }
                })
            }
        }
        return arr;
    }

    const getData = (param) => {
        let arr = [];
        let now = new Date().getTime();
        if(data !== null) {
            const oneDay = 24 * 60 * 60 * 1000;
            let res = Math.round(Math.floor(now - data.chickInDate) / oneDay, 2);
            for(let i=1; i<=res; i++) {
                arr.push(0)
            }
            for(let i=0; i<res; i++) {
                let d = new Date(data.chickInDate * 1);
                d = moment((d.setDate(d.getDate() + i)) * 1).format('DD/MM/YYYY');
                monitor.map(x => {
                    if(x.house === data.house._id || x.house === data.houseid) {
                        let tgl = moment((x.date) * 1).format('DD/MM/YYYY');
                        if(d === tgl) {
                            if(x.sensorType === param) {
                                arr[i] = x.value
                            }
                        }
                    }
                    
                })
            }
        }
        return arr;
    }

    const mainChart = {
        labels: getLabel(),
        datasets: [
            {
                label: 'Amonia (ppm)',
                backgroundColor: hexToRgba(brandWarning, 10),
                borderColor: brandWarning,
                pointHoverBackgroundColor: '#fff',
                borderWidth: 2,
                data: getData('Amonia'),
            },
            {
                label: 'Suhu (°C)',
                backgroundColor: hexToRgba(brandDanger, 10),
                borderColor: brandDanger,
                pointHoverBackgroundColor: '#fff',
                borderWidth: 2,
                data: getData('Suhu'),
            },
            {
                label: 'Kelembaban (%)',
                backgroundColor: hexToRgba(brandInfo, 10),
                borderColor: brandInfo,
                pointHoverBackgroundColor: '#fff',
                borderWidth: 2,
                data: getData('Kelembaban'),
            },
            {
                label: 'Berat Rata Rata (x10 Kg)',
                backgroundColor: hexToRgba(brandSuccess, 10),
                borderColor: brandSuccess,
                pointHoverBackgroundColor: '#fff',
                borderWidth: 2,
                data: getGrowing(),
            }
        ],
    }

    const mainChartOpts = {
        maintainAspectRatio: false,
        scales: {
            xAxes: [
            {
                gridLines: {
                    drawOnChartArea: true,
                },
            }],
            yAxes: [
            {
                ticks: {
                    beginAtZero: true,
                    maxTicksLimit: 10,
                    stepSize: Math.ceil(250 / 5),
                },
            }],
        },
        elements: {
            point: {
            radius: 0,
            hitRadius: 10,
            hoverRadius: 4,
            hoverBorderWidth: 3,
            },
        },
    };

    return (
        <div className="animated fadeIn">
            <Row>
                <Col xs="12" sm="6" lg="3">
                    <Card className="text-white bg-info">
                    <CardBody className="pb-0">
                        <div>Total Kandang</div>
                        <div className="text-value">{cardData.house}</div>
                    </CardBody>
                    <div className="chart-wrapper mx-3" style={{ height: '50px' }}>
                    </div>
                    </Card>
                </Col>
                <Col xs="12" sm="6" lg="3">
                    <Card className="text-white bg-warning">
                    <CardBody className="pb-0">
                        <div>Total Alat IoT</div>
                        <div className="text-value">{cardData.device}</div>
                    </CardBody>
                    <div className="chart-wrapper mx-3" style={{ height: '50px' }}>
                    </div>
                    </Card>
                </Col>
                <Col xs="12" sm="6" lg="3">
                    <Card className="text-white bg-danger">
                    <CardBody className="pb-0">
                        <div>Total Transaksi</div>
                        <div className="text-value">{cardData.order}</div>
                    </CardBody>
                    <div className="chart-wrapper mx-3" style={{ height: '50px' }}>
                    </div>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <CardBody>
                            <Row>
                                <Col sm="5">
                                    <h5>Grafik Pemeliharaan</h5>
                                    Periode Pemeliharaan : &nbsp;
                                    <ButtonGroup>
                                        <ButtonDropdown id='graph1' isOpen={isOpen2} toggle={() => { setIsOpen2(!isOpen2) }}>
                                            <DropdownToggle caret className="p-0" color="black">
                                                {data === null ?
                                                    <span>Pilih Periode</span> :
                                                    <span>{data.otherInformation}</span>
                                                }
                                            </DropdownToggle>
                                            <DropdownMenu left>
                                                {periodes.map(x => (
                                                    <DropdownItem onClick={() => {
                                                        fetch(x._id)
                                                    }}>
                                                        {x.otherInformation} {x.house}
                                                    </DropdownItem>
                                                ))}
                                            </DropdownMenu>
                                        </ButtonDropdown>
                                    </ButtonGroup>
                                </Col>
                                <Col sm="7" className="d-none d-sm-inline-block">
                                    <ButtonGroup className="float-right">
                                        <ButtonDropdown id='graph1' isOpen={isOpen} toggle={() => { setIsOpen(!isOpen) }}>
                                            <DropdownToggle caret className="p-0" color="black">
                                                <i className="icon-settings"></i>
                                            </DropdownToggle>
                                            <DropdownMenu right>
                                                <DropdownItem>Analisa Budidaya</DropdownItem>
                                                <DropdownItem>Pakan</DropdownItem>
                                                <DropdownItem disabled>Sensor Suhu</DropdownItem>
                                                <DropdownItem disabled>Sensor Kelembaban</DropdownItem>
                                                <DropdownItem disabled>Sensor Amonia</DropdownItem>
                                            </DropdownMenu>
                                        </ButtonDropdown>
                                    </ButtonGroup>
                                </Col>
                            </Row>
                            <div className="chart-wrapper" style={{ height: 300 + 'px', marginTop: 40 + 'px' }}>
                                {data === null ? 
                                    <h1 className="text-center pt-5" style={{color:"gray"}}>NO DATA</h1> :
                                    <Line data={mainChart} options={mainChartOpts} height={300} />
                                }
                                
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default Test;