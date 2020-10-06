export default {
    items: [
        {
            name: 'Dashboard',
            url: '/dashboard',
            icon: 'icon-speedometer'
        },
        {
            title: true,
            name: 'Manajemen Kandang',
            wrapper: {
                element: '',
                attributes: {},
            },
        },
        {
            name: 'Periode Pemeliharaan',
            url: '/rearing',
            icon: 'icon-note'
        },
        {
            name: 'Pencatatan Harian',
            url: '/daily_recording',
            icon: 'icon-calculator',
        },
        {
            name: 'Panen',
            url: '/harvest',
            icon: 'icon-target',
        },
        {
            name: 'Stok Pakan',
            url: '/feed_stock',
            icon: 'icon-basket-loaded'
        },
        {
            name: 'Internet of Things',
            url: '/iot',
            icon: 'icon-feed',
            children: [
                {
                    name: 'Monitor',
                    url: '/iot/monitor'
                },
                {
                    name: 'Alat',
                    url: '/iot/device'
                }
            ]
        },
        {
            name: 'Master',
            url: '/master',
            icon: 'icon-doc',
            children: [
                {
                    name: 'Kandang',
                    url: '/master/house'
                },
                {
                    name: 'Pakan',
                    url: '/master/feed'
                }
            ]
        },
        {
            name: 'Pembelian',
            url: '/transaction',
            icon: 'icon-basket',
            children: [
                {
                    name: 'Pemesanan',
                    url: '/transaction/order'
                },
                {
                    name: 'Rincian',
                    url: '/transaction/detail'
                }
            ]
        },
    ],
};
