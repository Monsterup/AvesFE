import React from 'react'

const Dashboard = React.lazy(() => import('./views/admin/Dashboard'));
const Transaction = React.lazy(() => import('./views/admin/Pembelian'));
const User = React.lazy(() => import('./views/admin/Pengguna'));
const UserCreate = React.lazy(() => import('./views/admin/Pengguna/CreateUser'));
const UserUpdate = React.lazy(() => import('./views/admin/Pengguna/UpdateUser'));
const Company = React.lazy(() => import('./views/admin/Peternakan'));
const Device = React.lazy(() => import('./views/admin/IoT'));
const SensorType = React.lazy(() => import('./views/admin/SensorType'));
const Profile = React.lazy(() => import('./views/admin/Profile'));
const UbahEmail = React.lazy(() => import('./views/admin/Profile/UpdateEmail'));
const UbahPassword = React.lazy(() => import('./views/admin/Profile/UpdatePassword'));

const routes = [
    { path: '/adm/dashboard', name: 'Dashboard', component: Dashboard },
    { path: '/adm/transaction', name: 'Transaction', component: Transaction },
    { path: '/adm/user', name: 'User', component: User },
    { path: '/adm/user_create', name: 'User', component: UserCreate },
    { path: '/adm/user_update', name: 'User', component: UserUpdate },
    { path: '/adm/company', name: 'Company', component: Company },
    { path: '/adm/iot/list', name: 'IoT', component: Device },
    { path: '/adm/iot/sensor', name: 'Sensor', component: SensorType },
    { path: '/adm/profile', name: 'Profile', component: Profile },
    { path: '/adm/change_email', name: 'Profile / Ubah Email', component: UbahEmail },
    { path: '/adm/change_password', name: 'Profile / Ubah Password', component: UbahPassword },
]

export default routes;