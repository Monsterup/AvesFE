import React, {useEffect, useRef, useState} from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Row,
    Table,
    Button,
    Input
} from 'reactstrap';
import Skeleton from 'react-loading-skeleton';
import HashLoader from 'react-spinners/HashLoader'
import LoadingOverlay from 'react-loading-overlay'
import Paginate from '../../components/Paginate';
import Loading from '../../components/loading';
import AsyncFetch from '../../components/AsyncFetch';
import CreateRearing from './CreateRearing';
import UpdateRearing from './UpdateRearing';
import SwalDelete from '../../components/SwalDelete';
import { showNotification } from '../../components/Notification';
import { NotificationContainer } from 'react-notifications';

function Kandang() {
    const [loading, setLoading] = useState(true);
    const [hasHouse, setHasHouse] = useState(false);

    //Data Table
    const objectName = "Periode Pemeliharaan";
    const headings = ['Periode', 'Kandang', 'Populasi Awal', 'Total Berat'];
    const columns = ['otherInformation', 'house', 'population', 'chickInWeight'];
    const [swal, setSwal] = useState(false);
    const [objects, setObjects] = useState([]);
    const [object, setObject] = useState(null);

    //Delete & Update
    const [updateModal, setUpdateModal] = useState(false);
    const [deleteObject, setDeleteObject] = useState(null);

    //Pagination
    const ref = useRef('');
    const [pagination, setPagination] = useState([]);
    const [paginationActive, setPaginationActive] = useState(1);
    const [maxPage, setMaxPage] = useState(0);

    //Showed List
    const number = useRef(10);
    const option = [10, 25, 50, 100];

    //Query Params
    const [limit, setLimit] = useState(sessionStorage.getItem('limit') || 10);
    const [skip, setSkip] = useState(0);
    const [keyword, setKeyword] = useState('');

    //Modal
    const Modal = () => {
        return (
            <div>
                <CreateRearing objectName={objectName} onSuccess={() => fetchData(keyword, limit, skip, () => {})}/>
                {updateModal && 
                <UpdateRearing objectName={objectName} onSuccess={updateSuccess} data={object} modal={updateModal}
                    onCancel={() => setUpdateModal(false)}/>
                }
            </div>
        )
    }

    //Fetch List Data
    const fetchData = (keyword = '', limit_ = limit, skip_ = skip, callback) => {
        setLoading(true);
        const house = `query{
                            houses(keyword:"", limit:0, skip:0){
                                totalCount
                            }
                        }
                    `;
        const q = `query{
                        rearings(keyword : "${keyword}", limit : ${limit_}, skip : ${skip_}){
                            totalCount
                            rearings {
                                _id
                                chickInDate
                                chickInWeight
                                population
                                otherInformation
                                house
                            }
                        }
                    }
                `;
        AsyncFetch(house, (res) => {
            if(res.data.data.houses.totalCount > 0) {
                setHasHouse(true);
                AsyncFetch(q, (res) => {
                    setLoading(false);
                    setObjects(res.data.data.rearings.rearings);
                    const page = Math.ceil(parseInt(res.data.data.rearings.totalCount) / limit_);
                    callback(page);
                })
            } else {
                setHasHouse(false);
                setLoading(false);
            }
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

    // Fetch Update Data
    const showUpdateDialog = (_id) => {
        const q = `query{
                        rearing(_id : "${_id}"){
                            _id
                            chickInDate
                            chickInWeight
                            population
                            house {
                                _id
                                name
                            }
                            otherInformation
                        }
                    }
                `;
        const q2 = `query{
            houses(keyword: "${keyword}", limit: 0, skip: 0){
                houses{
                    _id
                    name
                }
            }
        }`
        let result = {
            rearing:{},
            house:[]
        };
        AsyncFetch(q2, (res) => {
            result.house = res.data.data.houses.houses;
        });
        AsyncFetch(q, (res) => {
            result.rearing = res.data.data.rearing;
            setObject(result);
        });
    }

    useEffect(() => {
        return () => {
            setUpdateModal(true)
        }
    }, [object]);

    const updateSuccess = () => {
        setUpdateModal(false);
        fetchData(keyword, limit, skip, () => {
        });
    };

    // Fetch Delete Data
    const showSwal = (_id) => {
        setSwal(true);
        setDeleteObject(_id);
    }

    const confirmDelete = () => {
        const q = `mutation{
                        deleteRearing(_id : "${deleteObject}"){
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

    const handleSearchChange = (e) => {
        setKeyword(e.target.value);
        fetchData(e.target.value, limit, skip, (page) => {
            setMaxPage(page);
            if (page > 5) {
                setPagination([1, 2, 3, '...', page]);
            } else {
                setPagination(Array.from(Array(page).keys()).map(x => ++x));
            }
        });
        setPaginationActive(1);
    };

    const handleLimitChange = (e) => {
        setLimit(e.target.value);
        sessionStorage.setItem('limit', e.target.value);
        fetchData(keyword, e.target.value, skip, (page) => {
            setMaxPage(page);
            if (page > 5) {
                setPagination([1, 2, 3, '...', page]);
            } else {
                setPagination(Array.from(Array(page).keys()).map(x => ++x));
            }
        })
    }

    const handleChangePagination = (target) => {
        fetchData(keyword, 10, (target - 1) * 10, () => {
        });
    };

    //Render Fetch Data
    const renderData = (objects) => {
        if(!hasHouse) {
            return (
                <tr>
                    <td className="text-center pt-5" colSpan="4">
                        <h3 style={{color:"gray"}}>TAMBAH MASTER KANDANG TERLEBIH DAHULU</h3>
                    </td>
                </tr>
            )
        } else {
            return objects.map(function (row, row_index) {
                row.index = row_index;

                return (
                    <tr key={row_index}>
                        {
                            columns.map((column, index) => (
                                <td key={column + index}>
                                    {row[column]}
                                </td>
                            ))
                        }
                        <td>
                            <Button color="primary" size="sm"
                                onClick={() => showUpdateDialog(row._id)}
                                className="btn-square">
                                <i className="fa fa-pencil"></i>&nbsp;Edit
                            </Button>
                            &nbsp;&nbsp;
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
    }

    return (
        <div className="animated fadeIn">
            <Row>
                <Col xs="12" lg="12" md="12">
                    <NotificationContainer/>
                    <Modal/>
                    <br/>
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
                                    <Input type="select" value={limit} onChange={handleLimitChange} name="number" innerRef={number}>
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
        </div>
    )
}

export default Kandang;