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
import moment from 'moment';
import Skeleton from 'react-loading-skeleton';
import Paginate from '../../components/Paginate';
import AsyncFetch from '../../components/AsyncFetch';
import UpdateMutasi from './UpdateUser';
import SwalDelete from '../../components/SwalDelete';
import { showNotification } from '../../components/Notification';

function User(props) {
    moment.locale('id', {
        months: 'Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_November_Desember'.split('_')
    });
    const [loading, setLoading] = useState(true);

    //Data Table
    const objectName = "Pengguna";
    const headings = ['Nama Pengguna', 'Nama', 'Alamat', 'Email', 'Waktu Daftar'];
    const columns = ['username', 'name', 'address', 'email', 'createdAt'];
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
                {updateModal && 
                <UpdateMutasi objectName={objectName} onSuccess={updateSuccess} data={object} modal={updateModal}
                    onCancel={() => setUpdateModal(false)}/>
                }
            </div>
        )
    }

    //Fetch List Data
    const fetchData = (keyword = '', limit_ = limit, skip_ = skip, callback) => {
        const q = `query{
                        users(keyword : "${keyword}", limit : ${limit_}, skip : ${skip_}){
                            totalCount
                            users {
                                _id
                                username
                                name
                                address
                                email
                                createdAt
                            }
                        }
                    }
                `;
        AsyncFetch(q, (res) => {
            setLoading(false);
            setObjects(res.data.data.users.users);
            const page = Math.ceil(parseInt(res.data.data.users.totalCount) / limit_);
            callback(page);
        })
    }

    // Fetch Update Data
    const showUpdateDialog = (_id) => {
        const q = `query{
                        rearingRecord(_id : "${_id}"){
                            _id
                            date
                            death
                            reject
                            feedType
                            feedTotal
                            growing
                            rearing {
                                _id
                            }
                        }
                    }
                `;
        const q2 = `query{
                        rearings(keyword: "${keyword}", limit: 0, skip: 0){
                            rearings{
                                _id
                                otherInformation
                                house
                            }
                        }
                    }
                `;
        const q3 = `query{
                        feeds(keyword: "${keyword}", limit: 0, skip: 0){
                            feeds{
                                _id
                                code
                                type
                            }
                        }
                    }
                `;
        let result = {
            rearingRecord:{},
            rearing:[],
            feed:[]
        };
        AsyncFetch(q, (res) => {
            result.rearingRecord = res.data.data.rearingRecord;
        });
        AsyncFetch(q2, (res) => {
            result.rearing = res.data.data.rearings.rearings;
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
        setSwal(true);
        console.log(_id)
        setDeleteObject(_id);
    }

    const confirmDelete = () => {
        const q = `mutation{
                    deleteUser(_id : "${deleteObject}"){
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
        return objects.map(function (row, row_index) {
            row.index = row_index;
            return (
                <tr key={row_index}>
                    {
                        columns.map((column, index) => {
                            if(column === 'date') {
                                const localeB = moment(row[column] * 1).format('DD MMMM YYYY');
                                return (
                                    <td key={column + index}>
                                        {localeB}
                                    </td>
                                )
                            }
                            else {
                                return (
                                    <td key={column + index}>
                                        {row[column]}
                                    </td>
                                )
                            }
                        })
                    }
                    <td>
                        <Button color="primary" size="sm"
                            onClick={() => props.history.push({pathname: '/adm/user_update', state: {_id: row['_id']}})}
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
            <Button onClick={() => props.history.push('/adm/user_create')} color="primary"><i
                className="fa fa-plus"></i> Tambah Pengguna</Button>
            <Row>
                <Col xs="12" lg="12" md="12">
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
                                                <Skeleton key={index} height={20}/>
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

export default User;