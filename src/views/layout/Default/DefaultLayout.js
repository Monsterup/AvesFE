import React, {Suspense} from 'react'
import {Redirect, Route, Switch} from 'react-router-dom';
import * as router from 'react-router-dom';
import {Container} from 'reactstrap';
import {
    AppAside,
    AppHeader,
    AppSidebar,
    AppSidebarFooter,
    AppSidebarForm,
    AppSidebarHeader,
    AppSidebarMinimizer,
    AppBreadcrumb2 as AppBreadcrumb,
    AppSidebarNav2 as AppSidebarNav,
} from '@coreui/react';
import ReactNotification from 'react-notifications-component'
import HashLoader from 'react-spinners/HashLoader'
import LoadingOverlay from 'react-loading-overlay'
import {showNotification} from '../../components/Notification'
import routes from '../../../routes';
import routesAdmin from '../../../routes_admin';
import navigationDefAdmin from '../../_nav_admin';
import navigationDefOwner from '../../_nav_owner';
import navigationAds from '../../_nav_ads';
import auth from '../../../auth';

navigationDefOwner.items.push(navigationAds.items[0]);

function DefaultLayout(props) {
    const loading = () => 
    <div>
        Loading...
    </div>
    const DefaultHeader = React.lazy(() => import('./DefaultHeader'));
    const DefaultAside = React.lazy(() => import('./DefaultAside'));
    const logout = () => {
        auth.logout();
        props.history.push('/login');
    }
    
    return (
        <div className="app">
            <AppHeader fixed>
                <Suspense fallback={loading()}>
                    <DefaultHeader onLogout={logout}/>
                </Suspense>
            </AppHeader>
            <div className="app-body">
                <AppSidebar fixed display="lg">
                    <AppSidebarHeader/>
                    <AppSidebarForm/>
                    <Suspense>
                        {auth.getSession().type === 'owner' ? 
                            <AppSidebarNav navConfig={navigationDefOwner} {...props} router={router}/> :
                            <AppSidebarNav navConfig={navigationDefAdmin} {...props} router={router}/>
                        }
                    </Suspense>
                    <AppSidebarFooter/>
                    <AppSidebarMinimizer/>
                </AppSidebar>
                <main className="main">
                    <AppBreadcrumb appRoutes={routes} router={router}/>
                    <Container fluid>
                <ReactNotification/>
                    <Suspense fallback={loading()}>
                        <Switch>
                            {auth.getSession().type === 'owner' ?
                                routes.map((route, idx) => {
                                    return (
                                        <Route
                                            key={idx}
                                            path={route.path}
                                            exact={route.exact}
                                            name={route.name}
                                            render={props => (
                                                <route.component {...props} />
                                            )}/>
                                    );
                                }) : 
                                routesAdmin.map((route, idx) => {
                                    return (
                                        <Route
                                            key={idx}
                                            path={route.path}
                                            exact={route.exact}
                                            name={route.name}
                                            render={props => (
                                                <route.component {...props} />
                                            )}/>
                                    );
                                })
                            }
                            {
                                auth.getSession().type === 'owner' ?
                                <Redirect from="/" to="/dashboard"/> :
                                <Redirect from="/" to="/adm/dashboard"/>
                            }
                        </Switch>
                    </Suspense>
                    </Container>
                </main>
                <AppAside fixed>
                    <Suspense fallback={loading()}>
                        <DefaultAside/>
                    </Suspense>
                </AppAside>
            </div>
        </div>
    )
}

export default DefaultLayout;