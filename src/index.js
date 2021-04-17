import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './App.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { ApolloProvider } from '@apollo/react-hooks'
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-client-preset'
import { Provider } from 'react-redux';
import store from './views/owner/Pembelian/store';
const client = new ApolloClient({
  link: new HttpLink({ uri: 'https://avesbox-2020.glitch.me' }),
  cache: new InMemoryCache(),
});


ReactDOM.render(
  <Provider store={store}>
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
