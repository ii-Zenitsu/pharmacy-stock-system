import { configureStore } from '@reduxjs/toolkit'
import AuthReducer from "./slices/AuthSlice";
import UserReducer from './slices/UserSlice';
import MedicinesReducer from './slices/MedicineSlice';
import ProvidersReducer from './slices/ProviderSlice';
import OrdersReducer from './slices/OrderSlice';
import LocationsReducer from './slices/LocationSlice';
import Orders from '../../assets/api/Orders';

export const store = configureStore({
    reducer:{
        auth: AuthReducer,
        users: UserReducer,
        medicines: MedicinesReducer,
        providers: ProvidersReducer,
        locations: LocationsReducer,
        Orders: OrdersReducer
    }
})