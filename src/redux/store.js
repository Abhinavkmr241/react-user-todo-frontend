import { createStore, combineReducers, applyMiddleware } from "redux";
import hardSet from "redux-persist/es/stateReconciler/hardSet";
import { persistStore, persistReducer } from "redux-persist";
import storage from 'redux-persist/lib/storage';
import { userDataReducer, loaderDataReducer } from './reducers';
import logger from "redux-logger";

const rootReducer = combineReducers({
    userData: userDataReducer,
    loaderData: loaderDataReducer
})

const persistConfig = {
    key: 'root',
    storage,
    keyPrefix: "",
    stateReconciler: hardSet
}

const pReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(
    pReducer,
    undefined,
    applyMiddleware(logger)
);

export const persistor = persistStore(store);