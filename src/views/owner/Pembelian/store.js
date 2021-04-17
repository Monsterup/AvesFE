import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import dataIot from './dataIot';

const initialState = {};
const reducer = (state, action) =>{
return{products : dataIot.products};
};
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
    reducer,
    initialState,
    composeEnhancer(applyMiddleware(thunk))
    );

export default store;