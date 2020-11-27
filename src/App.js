import React from 'react';
import logo from './logo.svg';
import {  HashRouter as Router, Route, Switch, Link, Redirect} from 'react-router-dom';
import HashLoader from 'react-spinners/HashLoader'
import LoadingOverlay from 'react-loading-overlay'
import 'react-notifications/lib/notifications.css';
import auth from './auth';

function App() {
  const loading = () =>
    <div className="app justify-content-center">
      <LoadingOverlay
          active={true}
          spinner={<HashLoader color={"#f5c33b"}/>}
      >
      </LoadingOverlay>
    </div>

  const Login = React.lazy(() => import('./views/auth/Login'));
  const Register = React.lazy(() => import('./views/auth/Register'));
  const Email = React.lazy(() => import('./views/resetPassword/email'));
  const RecoverCode = React.lazy(() => import('./views/resetPassword/recoverCode'));
  const ResetPassword = React.lazy(() => import('./views/resetPassword/resetPassword'));
  const DefaultLayout = React.lazy(() => import('./views/layout'));
  const PrivateRoute = ({ component: Component, ...rest }) => {
    const isLoggedIn = auth.isAuth()

    return(
      <Route
        {...rest}
        render={props => isLoggedIn ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: 'login', state: { from: props.location }}}/>
        )}
      />
    )
  }

  return (
    <Router>
      <React.Suspense fallback={loading()}>
        <Switch>
          <Route path="/login" render={props => <Login {...props}/>}/>
          <Route path="/register" render={props => <Register {...props}/>}/>
          <Route path="/reset-password" render={props => <Email {...props}/>}/>
          <Route path="/recover/code/email=:email" render={props => <RecoverCode {...props}/>}/>
          <Route path="/recover/password/email=:email&code=:code" render={props => <ResetPassword {...props}/>}/>
          <PrivateRoute path="/" component={DefaultLayout}/>
        </Switch>
      </React.Suspense>
    </Router>
  );
}

export default App;
