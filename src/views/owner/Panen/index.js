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
import Paginate from '../../components/Paginate';
import AsyncFetch from '../../components/AsyncFetch';
import CreateHarvest from './CreatePanen';
import UpdateHarvest from './UpdatePanen';
import SwalDelete from '../../components/SwalDelete';
import { showNotification } from '../../components/Notification';
import { NotificationContainer } from 'react-notifications';

function Harvest() {
    const [loading, setLoading] = useState(true);
    const [hasRearing, setHasRearing] = useState(false);

    //Data Table
    const objectName = "Data Panen";
    const headings = ['Periode', 'Total Ayam', 'Total Berat', 'Rata-Rata Berat'];
    const columns = ['rear', 'numberLiveBird', 'totalWeight', 'averageWeight'];
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
    const [limit, setLimit] = useState(10);
    const [skip, setSkip] = useState(0);
    const [keyword, setKeyword] = useState('');

    //Modal
    const Modal = () => {
        return (
            <div>
                <CreateHarvest objectName={objectName} onSuccess={() => fetchData(keyword, limit, skip, () => {})}/>
                {updateModal && 
                <UpdateHarvest objectName={objectName} onSuccess={updateSuccess} data={object} modal={updateModal}
                    onCancel={() => setUpdateModal(false)}/>
                }
            </div>
        )
    }

    //Fetch List Data
    const fetchData = (keyword = '', limit_ = limit, skip_ = skip, callback) => {
        const q = `query{
                        harvests(keyword : "${keyword}", limit : ${limit_}, skip : ${skip_}){
                            totalCount
                            harvests{
                                _id
                                date
                                totalWeight
                                numberLiveBird
                                averageWeight
                                rearing {
                                    _id
                                    otherInformation
                                }
                            }
                        }
                    }
                `;
        const q2 = `query{
                        rearings(keyword: "${keyword}", limit: 0, skip: 0){
                            totalCount
                            rearings{
                                _id
                                otherInformation
                                house
                            }
                        }
                    }
                `;
        AsyncFetch(q2, (res) => {
            if(res.data.data.rearings.totalCount > 0) {
                setHasRearing(true);
                AsyncFetch(q, (res) => {
                    setLoading(false);
                    setObjects(res.data.data.harvests.harvests);
                    const page = Math.ceil(parseInt(res.data.data.harvests.totalCount) / limit_);
                    callback(page);
                })
            }
        })
    }

    // Fetch Update Data
    const showUpdateDialog = (_id) => {
        const q = `query{
                        harvest(_id : "${_id}"){
                            _id
                            date
                            totalWeight
                            numberLiveBird
                            rearing {
                                _id
                            }
                        }
                    }
                `;
        const q2 = `query{
                        rearings(keyword: "", limit: 0, skip: 0){
                            totalCount
                            rearings{
                                _id
                                otherInformation
                            }
                        }
                    }`
        let result = {
            harvest:{},
            rearing:{}
        };
        AsyncFetch(q, (res) => {
            result.harvest = res.data.data.harvest;
        });
        AsyncFetch(q2, (res) => {
            result.rearing = res.data.data.rearings.rearings;
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
        console.log(_id);
        setSwal(true);
        setDeleteObject(_id);
    }

    const confirmDelete = () => {
        const q = `mutation{
                    deleteFeedStock(_id : "${deleteObject}"){
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

    //Render Fetch Data
    const renderData = (objects) => {
        if(!hasRearing) {
            return (
                <tr>
                    <td className="text-center pt-5" colSpan="4">
                        <h3 style={{color:"gray"}}>TAMBAH PERIODE PEMELIHARAAN TERLEBIH DAHULU</h3>
                    </td>
                </tr>
            )
        } else {
            return objects.map(function (row, row_index) {
                row.index = row_index;
                return (
                    <tr key={row_index}>
                        {
                            columns.map((column, index) => {
                                if(column === 'rear') {
                                    return (
                                        <td key={column + index}>
                                            {row['rearing']['otherInformation']}
                                        </td>
                                    )
                                } else if(column === 'numberLiveBird') {
                                    return (
                                        <td key={column + index}>
                                            {row[column]} ekor
                                        </td>
                                    )
                                } else {
                                    return (
                                        <td key={column + index}>
                                            {row[column]} Kg
                                        </td>
                                    )
                                }
                            })
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
        </div>
    )
}

export default Harvest;