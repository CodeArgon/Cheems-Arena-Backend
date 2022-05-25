import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
// import { persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
// Front
// import Layout from './layout/reducer';

// Authentication Module
import Auth from "./Auth/reducer";

// import persistReducer from 'redux-persist/es/persistReducer';
// import AuthReducer

// const authPersistConfig = {
//     key: 'auth',
//     storage: storage,
//     keyPrefix: 'redux-',
//     whitelist: ['auth']
//   };

const rootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    Auth,
  });

export default rootReducer;
