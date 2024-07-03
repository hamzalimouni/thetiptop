import { configureStore } from "@reduxjs/toolkit";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { encryptTransform } from 'redux-persist-transform-encrypt';
import rootReducer from "./reducers/rootReducer";

const ENABLE_REDUX_DEV_TOOLS = true;

const encryptor = encryptTransform({
    secretKey: import.meta.env.VITE_REACT_APP_REDUX_SECRET_KEY,
    onError: function (error) {
        console.log(error)
    },
})

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    transforms: [encryptor]
}

// const rootReducer = combineReducers({auth: authReducer, itemVisible: itemVisibleReducer, ticket: ticketReducer});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    devTools: ENABLE_REDUX_DEV_TOOLS,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
    }),
});

export let persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store;