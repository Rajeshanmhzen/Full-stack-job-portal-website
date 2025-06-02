import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from "./userSlice";
import jobSlice from "./jobSlice";
import companySlice from "./companySlice";
import resumeSlice from "./resumeSlice";
import applicationSlice from "./applicationSlice";
import savedJobSlice from './savedJobSlice';

// Persist configuration
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user', 'resume', 'job', 'application', 'company', 'savedJob'] 
};

const rootReducer = combineReducers({
    user: userReducer,
    job: jobSlice,
    resume: resumeSlice,
    company: companySlice,
    application: applicationSlice,
    savedJob : savedJobSlice,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
});

store.subscribe(() => {
    console.log('Redux state changed:', store.getState());
});

export const persistor = persistStore(store);
export default store;