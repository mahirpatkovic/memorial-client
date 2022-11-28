import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import authReducer from './auth';
import docsReducer from './docs';
import requestsReducer from './requests';
import modalResponseReducer from './modalResponse';

const store = configureStore({
    reducer: {
        auth: authReducer,
        docs: docsReducer,
        requests: requestsReducer,
        modalResponse: modalResponseReducer,
    },
    middleware: () =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;
