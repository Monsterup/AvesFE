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
import CreateHouse from './CreateStokPakan';
import UpdateHouse from './UpdateStokPakan';
import SwalDelete from '../../components/SwalDelete';
import { showNotification } from '../../components/Notification';
import { NotificationContainer } from 'react-notifications';

function StokPakan() {
    const [loading, setLoading] = useState(true);
    const [hasHouse, setHasHouse] = useState(false);

    //Data Table
    const objectName = "Stok Pakan";
    const headings = ['Kandang', 'Kode Pakan', 'Jenis Pakan', 'Jumlah'];
    const columns = ['house', 'feed', 'type', 'number'];
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
                <CreateHouse objectName={objectName} onSuccess={() => fetchData(keyword, limit, skip, () => {})}/>
                {updateModal && 
                <UpdateHouse objectName={objectName} onSuccess={updateSuccess} data={object} modal={updateModal}
                    onCancel={() => setUpdateModal(false)}/>
                }
            </div>
        )
    }

    //Fetch List Data
    const fetchData = (keyword = '', limit_ = limit, skip_ = skip, callback) => {
        const house = `query{
                            houses(keyword:"", limit:0, skip:0){
                                totalCount
                            }
                        }
                    `;
        const feed = `query{
                            feeds(keyword:"", limit:0, skip:0){
                                totalCount
                            }
                        }
                    `;
        const q = `query{
                        feedStocks(keyword : "${keyword}", limit : ${limit_}, skip : ${skip_}){
                            totalCount
                            feedStocks{
                                _id
                                number
                                feed
                                type
                                house
                            }
                        }
                    }
                `;
        AsyncFetch(house, (res) => {
            if(res.data.data.houses.totalCount > 0) {
                AsyncFetch(feed, (res) => {
                    if(res.data.data.feeds.totalCount > 0) {
                        setHasHouse(true);
                        AsyncFetch(q, (res) => {
                            setLoading(false);
                            setObjects(res.data.data.feedStocks.feedStocks);
                            const page = Math.ceil(parseInt(res.data.data.feedStocks.totalCount) / limit_);
                            callback(page);
                        })
                    }
                })
            }
        })
    }

    // Fetch Update Data
    const showUpdateDialog = (_id) => {
        const q = `query{
                        feedStock(_id : "${_id}"){
                            _id
                            number
                            house{
                                _id
                                name
                            }
                            feed{
                                _id
                                code
                                type
                            }
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
        const q3 = `query{
                    feeds(keyword: "${keyword}", limit: 0, skip: 0){
                        feeds{
                            _id
                            code
                            type
                        }
                    }
                }`
        let result = {
            feedStocks:{},
            feed:[],
            house:[]
        };
        AsyncFetch(q, (res) => {
            result.feedStocks = res.data.data.feedStock;
        });
        AsyncFetch(q2, (res) => {
            result.house = res.data.data.houses.houses;
        });
        AsyncFetch(q3, (res) => {
            result.feed = res.data.data.feeds.feeds;
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
        if(!hasHouse) {
            return (
                <tr>
                    <td className="text-center pt-5" colSpan="4">
                        <h3 style={{color:"gray"}}>TAMBAH MASTER KANDANG & PAKAN TERLEBIH DAHULU</h3>
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
            // if (page > 5) {
            //     ref.current.handleSearch([1, 2, 3, '...', page], page);
            // } else {
            //     ref.current.handleSearch(Array.from(Array(page).keys()).map(x => ++x), page);
            // }
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

export default StokPakan;