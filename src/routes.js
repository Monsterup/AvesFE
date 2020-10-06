import React from 'react'

const Dashboard = React.lazy(() => import('./views/owner/Dashboard/Test'));
const ProfileOwner = React.lazy(() => import('./views/owner/Profile'));
const UbahEmail = React.lazy(() => import('./views/owner/Profile/UpdateEmail'));
const UbahPassword = React.lazy(() => import('./views/owner/Profile/UpdatePassword'));
const Rearing = React.lazy(() => import('./views/owner/Periode Pemeliharaan'));
const Panen = React.lazy(() => import('./views/owner/Panen'));
const Kandang = React.lazy(() => import('./views/owner/Kandang'));
const Pakan = React.lazy(() => import('./views/owner/Pakan'));
const StokPakan = React.lazy(() => import('./views/owner/StokPakan'));
const Mutation = React.lazy(() => import('./views/owner/Mutasi'));
const Monitor = React.lazy(() => import('./views/owner/IoT/Monitor'));
const Alat = React.lazy(() => import('./views/owner/IoT/Alat'));
const Pembelian = React.lazy(() => import('./views/owner/Pembelian'));
const Rincian = React.lazy(() => import('./views/owner/Pembelian/Rincian'));
const Pembayaran = React.lazy(() => import('./views/owner/Pembelian/Pembayaran'));

const routes = [
    { path: '/dashboard', name: 'Dashboard', component: Dashboard },
    { path: '/iot/monitor', name: 'IoT / Monitor', component: Monitor },
    { path: '/iot/device', name: 'IoT / Alat', component: Alat },
    { path: '/profile', name: 'Profile', component: ProfileOwner },
    { path: '/change_email', name: 'Profile / Ubah Email', component: UbahEmail },
    { path: '/change_password', name: 'Profile / Ubah Password', component: UbahPassword },
    { path: '/master/house', name: 'Master / Kandang', component: Kandang },
    { path: '/master/feed', name: 'Master / Pakan', component: Pakan },
    { path: '/daily_recording', name: 'Pencatatan Harian', component: Mutation },
    { path: '/feed_stock', name: 'Stok Pakan', component: StokPakan },
    { path: '/rearing', name: 'Periode Pemeliharaan', component: Rearing },
    { path: '/harvest', name: 'Panen', component: Panen },
    { path: '/transaction/order', name: 'Pemesanan', component: Pembelian },
    { path: '/transaction/detail', name: 'Rincian', component: Rincian },
    { path: '/transaction/proof', name: 'Rincian / Bukti Pembayaran', component: Pembayaran },
    { path: '/transaction', name: 'Pembelian', component: Dashboard },
]

export default routes;