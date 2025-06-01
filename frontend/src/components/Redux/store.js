import { configureStore } from '@reduxjs/toolkit'
import AuthReducer from "./slices/AuthSlice";
import UserReducer from './slices/UserSlice';
import CartReducer from './slices/CartSlice';
import StockReducer from './slices/StockSlice';
import OrdersReducer from './slices/OrderSlice';
import LoadingReducer from './slices/LoadingSlice';
import MedicinesReducer from './slices/MedicineSlice';
import ProvidersReducer from './slices/ProviderSlice';
import LocationsReducer from './slices/LocationSlice';
import NotificationReducer from './slices/NotificationSlice';

export const store = configureStore({
    reducer:{
        auth: AuthReducer,
        cart: CartReducer,
        users: UserReducer,
        stock: StockReducer,
        orders: OrdersReducer,
        loading: LoadingReducer,
        medicines: MedicinesReducer,
        providers: ProvidersReducer,
        locations: LocationsReducer,
        notifications: NotificationReducer,
    }
})