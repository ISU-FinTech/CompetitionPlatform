import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authReducer, { logout } from './slices/auth';
import loadingReducer from './slices/loading';
import competitionReducer, { resetCompetitions } from './slices/competitions';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  loading: loadingReducer,
  competitions: competitionReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);

export const handleLogout = () => {
    store.dispatch(logout());
    store.dispatch(resetCompetitions());
    persistor.purge(); 
  };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
