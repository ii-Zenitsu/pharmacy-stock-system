import { configureStore } from '@reduxjs/toolkit'
import AuthReducer from "./slices/AuthSlice";
import UserReducer from './slices/UserSlice';
import StockReducer from './slices/StockSlice';
import MedicinesReducer from './slices/MedicineSlice';
import ProvidersReducer from './slices/ProviderSlice';
import LocationsReducer from './slices/LocationSlice';
import CartReducer from './slices/CartSlice';

export const store = configureStore({
    reducer:{
        auth: AuthReducer,
        users: UserReducer,
        stock: StockReducer,
        medicines: MedicinesReducer,
        providers: ProvidersReducer,
        locations: LocationsReducer,
        cart: CartReducer,
    }
})