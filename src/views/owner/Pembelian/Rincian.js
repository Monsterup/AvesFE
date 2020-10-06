import React, {useEffect, useRef, useState} from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Row,
    Table,
    Button,
    Input,
    Modal
} from 'reactstrap';
import axios from "axios";
import Skeleton from 'react-loading-skeleton';
import Paginate from '../../components/Paginate';
import AsyncFetch from '../../components/AsyncFetch';
import PaymentFailed from './PembayaranGagal';
import Resi from './Resi';
import SwalDelete from '../../components/SwalDelete';
import SwalDelete2 from '../../components/SwalDelete3';
import { showNotification } from '../../components/Notification';

function Rincian(props) {
    const [loading, setLoading] = useState(true);
    let obj = {};

    //Data Table
    const objectName = "Detail Pemesanan";
    const headings = ['Kode Pesanan', 'Status', 'Total'];
    const columns = ['code', 'status', 'cost'];
    const [swal, setSwal] = useState(false);
    const [swal2, setSwal2] = useState(false);
    const [failed, setFailed] = useState(false);
    const [failedObject, setFailedObject] = useState(null);
    const [objects, setObjects] = useState([]);
    const [object, setObject] = useState(null);

    //Delete & Update
    const [resi, setResi] = useState(false);
    const [resiObject, setResiObject] = useState(false);
    const [deleteObject, setDeleteObject] = useState(null);
    const [finishObject, setFinishObject] = useState(null);

    //Pagination
    const ref = useRef('');
    const [pagination, setPagination] = useState([]);
    const [paginationActive, setPaginationActive] = useState(1);
    const [maxPage, setMaxPage] = useState(0);

    //Showed List
    const number = useRef(10);
    const option = [10, 25, 50, 100];

    //Query Params
    const [limit, setLimit] = useState(10);
    const [skip, setSkip] = useState(0);
    const [keyword, setKeyword] = useState('');

    //Modal
    const Modal = () => {
        return (
            <div>
                {failed && 
                <PaymentFailed data={failedObject} modal={failed}
                    onCancel={() => setFailed(false)}/>
                }
            </div>
        )
    }

    const Modal2 = () => {
        return (
            <div>
                {resi && 
                <Resi objectName={objectName} onSuccess={updateSuccess} data={resiObject} modal={resi}
                    onCancel={() => setResi(false)}/>
                }
            </div>
        )
    }

    //Fetch List Data
    const fetchData = (keyword = '', limit_ = limit, skip_ = skip, callback) => {
        const q = `query{
                        orders(keyword : "${keyword}", limit : ${limit_}, skip : ${skip_}){
                            totalCount
                            orders {
                                _id
                                code
                                status
                                cost
                                transferImage
                                transferName
                                resi
                                courier
                            }
                        }
                    }
                `;
        AsyncFetch(q, (res) => {
            setLoading(false);
            setObjects(res.data.data.orders.orders);
            const page = Math.ceil(parseInt(res.data.data.orders.totalCount) / limit_);
            callback(page);
        })
    }

    // Fetch Update Data
    const showUpdateDialog = (_id) => {
        const q = `query{
                        order(_id : "${_id}"){
                            _id
                            code
                            status
                            cost
                            transferImage
                            transferName
                        }
                    }
                `;
        AsyncFetch(q, (res) => {
            setObject(res.data.data.order);
        });
    }

    useEffect(() => {
        return () => {
            setResi(true)
        }
    }, [object]);

    const updateSuccess = () => {
        setResi(false);
        fetchData(keyword, limit, skip, () => {
        });
    };

    // Fetch Delete Data
    const showSwal = (_id) => {
        setSwal(true);
        setDeleteObject(_id);
    }

    const showSwal2 = (_id) => {
        setSwal2(true);
        setFinishObject(_id);
    }

    const confirmDelete = () => {
        const q = `mutation{
                    deleteOrder(_id : "${deleteObject}"){
                        deleted
                    }
                }
            `;
        AsyncFetch(q, (res) => {
            if (res) {
                setSwal(false)
                showNotification("Berhasil menghapus data " + objectName, "success")
                fetchData(keyword, limit, skip, () => {})
            }
        })
    }

    const confirmFinish = () => {
        const q = `query{
                    finishOrder(_id : "${finishObject}"){
                        _id
                    }
                }
            `;
        AsyncFetch(q, (res) => {
            if (res) {
                setSwal2(false)
                showNotification("Berhasil menyelesaikan pemesanan", "success")
                fetchData(keyword, limit, skip, () => {})
            }
        })
    }

    const switchRenderButton = (param, obj) => {
        switch (param) {
            case "Menunggu Pembayaran":
                return (
                    <span className="inline">
                        <Button color="primary" size="sm"
                            onClick={() => props.history.push({pathname: '/transaction/proof', state: {update: false, code: obj.code}})}
                            className="btn-square">
                            <i className="fa fa-pencil"></i>&nbsp;Unggah Bukti Pembayaran
                        </Button>
                        &nbsp;&nbsp;
                    </span>
                )
            case "Menunggu Konfirmasi Admin":
                return (
                    <span className="inline">
                        <Button color="primary" size="sm"
                            onClick={() => props.history.push({pathname: '/transaction/proof', state: {update: true, code: obj.code, TI: obj.img, TN: obj.name}})}
                            className="btn-square">
                            <i className="fa fa-pencil"></i>&nbsp;Ubah Bukti Pembayaran
                        </Button>
                        &nbsp;&nbsp;
                    </span>
                )
            case "Pembayaran Ditolak":
                return (
                    <span className="inline">
                        <Button color="primary" size="sm"
                            onClick={() => {setFailed(true); setFailedObject(obj.img)}}
                            className="btn-square">
                            <i className="fa fa-pencil"></i>&nbsp;Lihat Bukti Pembayaran
                        </Button>
                        &nbsp;&nbsp;
                    </span>
                )
            case "Dikirim":
                return (
                    <span className="inline">
                        <Button color="primary" size="sm"
                            onClick={async() => {
                                let courier = obj.courier;
                                courier = courier.split(" ")[0];
                                const waybill = obj.resi;
                                const res = await axios.post(`https://ongkir.glitch.me/track`, {
                                    resi: waybill,
                                    courier: courier
                                });
                                setResiObject({
                                    res: res.data.data.result,
                                    resi: waybill
                                });
                                setResi(true);
                            }}
                            className="btn-square">
                            <i className="fa fa-location-arrow"></i>&nbsp;Status Pengiriman
                        </Button>
                        &nbsp;&nbsp;
                    </span>
                )
            default:
                break;
        }
    }

    //Render Fetch Data
    const renderData = (objects) => {
        return objects.map(function (row, row_index) {
            row.index = row_index;
            obj = {
                _id: row['_id'],
                code: row['code'],
                img: row['transferImage'],
                name: row['transferName'],
                resi: row['resi'],
                courier: row['courier']
            }
            const stat = row['status'];
            return (
                <tr key={row_index}>
                    {
                        columns.map((column, index) => {
                            if(column === "cost") {
                                return (
                                    <td key={column + index}>
                                        Rp. {row[column]}
                                    </td>
                                )
                            } else {
                                return (
                                    <td key={column + index}>
                                        {row[column]}
                                    </td>
                                )
                            }
                        })
                    }
                    <td>
                        
                        {switchRenderButton(stat, obj)}
                        {
                            row['status'] === 'Dikirim' ?
                            <span className="inline">
                                <Button color="success" size="sm"
                                    onClick={() => showSwal2(row._id)}
                                    className="btn-square">
                                    <i className="fa fa-check"></i>&nbsp;Selesai
                                </Button>
                                &nbsp;&nbsp;
                            </span> : ''
                        }
                        <Button color="danger" size="sm"
                            onClick={() => showSwal(row._id)}
                                className="btn-square">
                            <i className="fa fa-trash"></i>&nbsp;Hapus
                        </Button>
                    </td>
                </tr>
            )
        })
    }

    useEffect(() => {
        fetchData(keyword, limit, skip, (page) => {
            setMaxPage(page);
            if (page > 5) {
                setPagination([1, 2, 3, '...', page]);
            } else {
                setPagination(Array.from(Array(page).keys()).map(x => ++x));
            }
        });
    }, []);

    const handleChangePagination = (target) => {
        fetchData(keyword, 10, (target - 1) * 10, () => {
        });
    };

    const handleSearchChange = (e) => {
        setKeyword(e.target.value);
        fetchData(e.target.value, limit, skip, (page) => {
            setMaxPage(page);
        });
        setPaginationActive(1);
    };

    return (
        <div className="animated fadeIn">
            <Row>
                <Col xs="12" lg="12" md="12">
                    <Modal/>
                    <Modal2/>
                    <Card>
                        <CardHeader>
                            <i className="fa fa-align-justify"></i> Tabel {objectName}
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col md="11">
                                    <Input type="text" id="search" onChange={(e) => handleSearchChange(e)}
                                        placeholder="Cari..."/>
                                </Col>
                                <Col md="1">
                                    <Input type="select" name="number" innerRef={number}>
                                        {option.map((data, key) => {
                                            return (<option key={key} value={data}>{data}</option>)
                                        })}
                                    </Input>
                                </Col>
                            </Row>
                            <br/>
                            <Table responsive>
                                <thead>
                                    <tr>
                                        {headings.map((heading, key) => {
                                            return (
                                                <th key={key}>{heading}</th>
                                            )
                                        })}
                                        <th>Pilihan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? 
                                    <tr>
                                        {columns.map((column, index) => {
                                            return (
                                            <td>
                                                <Skeleton height={20}/>
                                            </td>
                                            )
                                        })}
                                        <td>
                                            <Skeleton height={20}/>
                                        </td>
                                    </tr> : 
                                    renderData(objects)}
                                </tbody>
                            </Table>
                            {pagination.length > 1 && 
                            <Paginate ref={ref} maxPage={maxPage} paginationActive={paginationActive}
                                pagination={pagination} onChange={(target) => handleChangePagination(target)}/>
                            }
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <SwalDelete show={swal} onConfirm={confirmDelete} onCancel={() => setSwal(false)}/>
            <SwalDelete2 show={swal2} onConfirm={confirmFinish} onCancel={() => setSwal2(false)}/>
        </div>
    )
}

export default Rincian;