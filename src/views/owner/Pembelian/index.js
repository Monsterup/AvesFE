import React, { useEffect, useState } from 'react';
import {
    Button,
    Col,
    Form,
    Row,
    Modal,
    ModalHeader,
    ModalBody,
    Card,
    cardData,
    CRow,
    CCol,
    CardBody,
    CardFooter,
    CardTitle,
    ModalFooter
} from 'reactstrap'
import {
    AvForm
} from 'availity-reactstrap-validation';
import axios from '../../../axios';
import Input from '../../components/Input';
import AsyncFetch from '../../components/AsyncFetch';
import {showNotification} from '../../components/Notification'
import auth from '../../../auth'
import { BrowserRouter, Route } from 'react-router-dom';
import ProductScreen from './screens/ProductScreen';
import HomeScreen from './screens/HomeScreen';
import dataIot from './dataIot';
import Product from './components/Product';

function Pembelian(props) {
    const arrBeli = [1,2,3,4,5,6,7,8,9,10,15,20];
    const [jumlah, setJumlah] = useState(0);
    const [modal, setModal] = useState(false);
    const [getKandang, setGetKandang] = useState([]);
    const [nama, setNama] = useState('');
    const [alamat, setAlamat] = useState('');
    const [kandang, setKandang] = useState('');
    const [provinsi, setProvinsi] = useState([]);
    const [kota, setKota] = useState([]);
    const [tiki, setTiki] = useState([]);
    const [jne, setJne] = useState([]);
    const [pos, setPos] = useState([]);
    const [kurir, setKurir] = useState('');
    const [tipe, setTipe] = useState('');
    const [ongkir, setOngkir] = useState(0);

    const fetchKandang = async () => {
        const q = `query{
                    houses(keyword : "", limit : 0, skip : 0){
                        totalCount
                        houses {
                            _id
                            name
                            capacity
                            address
                        }
                    }
                }
            `;
        AsyncFetch(q, (res) => {
            setGetKandang(res.data.data.houses.houses);
            console.log(res);
        })
    }

    useEffect(() => {
        fetchKandang();
    }, []);

    const prov = async (cb) => {
        // const kode = await axios.get()
        const res = await axios.get('https://ongkir.glitch.me/province', {
            'headers': {
                'Content-Type': 'application/json',
            }
        });

        setProvinsi(res.data.data.rajaongkir.results);
    }

    useEffect(() => {
        prov();
    }, []);

    const handleProvinsi = async(e) => {
        const value = e.target.value;
        await axios.post('https://ongkir.glitch.me/city', {
            prov: value
        })
        .then(res => {
            setKota(res.data.data.rajaongkir.results)
        })
        .catch(err => {
            console.log(err)
        })
    }

    const handleKota = async(e) => {
        const value = e.target.value;
        let berat = jumlah * 0.5;
        if(berat < 1) {
            berat = 1
        }
        const tiki = await axios.post('https://ongkir.glitch.me/cost_tiki', {
            des: value,
            weight: berat
        });
        console.log(tiki);
        setTiki(tiki.data.data.rajaongkir.results);
        const pos = await axios.post('https://ongkir.glitch.me/cost_pos', {
            des: value,
            weight: berat
        });
        setPos(pos.data.data.rajaongkir.results);
        const jne = await axios.post('https://ongkir.glitch.me/cost_jne', {
            des: value,
            weight: berat
        });
        setJne(jne.data.data.rajaongkir.results);
    }

    const handleOngkir = async(e) => {
        const value = e.target.value;
        let kurir = value.split(",")[0];
        let tipe = value.split(",")[1];
        let harga = value.split(",")[2];
        setOngkir(parseInt(harga));
        setTipe(tipe)
        setKurir(kurir);
    }

    const queryCreate = () => {
        const kurirLengkap = kurir + " " + tipe;
        const totalBayar = jumlah * 50000 + ongkir;
        return {
            query: `mutation{
                        createOrder(orderInput: {
                            name : "${nama}"
                            amount : ${parseInt(jumlah)}
                            address : "${alamat}"
                            courier : "${kurirLengkap}"
                            cost : "${totalBayar}"
                            status : "Menunggu Pembayaran"
                        }){
                            _id
                        }
                    }`
        }
    };

    const submit = async(e, err) => {
        if (err.length > 0) {
            return;
        }
        try {
            const query = queryCreate();
            let res = await axios.post('graphql', JSON.stringify(query), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + auth.getSession().token
                }
            });
            const resData = res.data;
            if (resData.errors) {
                showNotification(resData.errors[0].message, "danger")
                return;
            }
            showNotification("Berhasil membuat pesanan, segera upload bukti pembayaran", "success");
            props.history.push('detail');
            setModal(false);
        } catch (error) {
            showNotification("Ada kesalahan pada data/sistem", "danger")
            setModal(false);            
        }
        
    }

    const Mod = () => {
        return (
            <Modal isOpen={modal} classNameName="modal-lg">
                <ModalHeader>Detail Pembayaran</ModalHeader>
                <AvForm onSubmit={submit}>
                    <ModalBody classNameName="text-center">
                        <b>Pembayaran ke rekening : </b> <br/><br/>
                        <h4>03312387292 (BCA)</h4>
                        <b>AvesboxGroup</b>
                        <br/>
                        <br/>
                        <br/>
                        <p style={{color:'Red'}}>*Bukti transfer harap difoto <br/>
                        *Segera upload bukti transfer setelah melakukan pembayaran pada menu rincian</p>
                    </ModalBody>
                    <ModalFooter>
                    <Button type="submit" color="primary">Konfirmasi</Button>
                    <Button type="button" color="secondary" onClick={() => {setModal(false)}}>Kembali</Button>
                    </ModalFooter>
                </AvForm>
            </Modal>
        )
    }

    return (
    <BrowserRouter>
      <div className="grid-container">
      <header className="rowA">
        <div>
          <a className="brand" href="/">amazona</a>
        </div>
        <div>
          <a href="/cart">Cart</a>
          <a href="/signin">Sign In</a>
        </div>
      </header>

      <main>
      <Route path="/product/:id" component={ProductScreen}></Route>
          <Route path="/" component={HomeScreen} exact></Route>
      </main>

      <footer className="rowA center">All right reserved</footer>
      </div>
    </BrowserRouter>
    )
}

export default Pembelian;