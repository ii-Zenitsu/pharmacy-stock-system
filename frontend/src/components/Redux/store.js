import { configureStore } from '@reduxjs/toolkit'
import AuthReducer from "./slices/AuthSlice";
import UserReducer from './slices/UserSlice';
import StockReducer from './slices/StockSlice';
import MedicinesReducer from './slices/MedicineSlice';
import ProvidersReducer from './slices/ProviderSlice';
import OrdersReducer from './slices/OrderSlice';
import LocationsReducer from './slices/LocationSlice';
import CartReducer from './slices/CartSlice';
import NotificationReducer from './slices/NotificationSlice';

export const store = configureStore({
    reducer:{
        auth: AuthReducer,
        cart: CartReducer,
        users: UserReducer,
        stock: StockReducer,
        orders: OrdersReducer,
        medicines: MedicinesReducer,
        providers: ProvidersReducer,
        locations: LocationsReducer,
        notifications: NotificationReducer,
    }
})