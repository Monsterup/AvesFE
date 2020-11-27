export default {
    items: [
        {
            name: 'Dashboard',
            url: '/adm/dashboard',
            icon: 'icon-speedometer'
        },
        {
            name: 'Daftar Pengguna',
            url: '/adm/user',
            icon: 'icon-user'
        },
        {
            name: 'Daftar Peternakan',
            url: '/adm/company',
            icon: 'icon-home'
        },
        {
            name: 'Transaksi',
            url: '/adm/transaction',
            icon: 'icon-credit-card'
        },
        {
            name: 'Internet of Things',
            url: '/adm/iot',
            icon: 'icon-feed',
            children: [
                {
                    name: 'Daftar IoT',
                    url: '/adm/iot/list'
                },
                {
                    name: 'Tipe Sensor',
                    url: '/adm/iot/sensor'
                }
            ]
        },
    ],
};
