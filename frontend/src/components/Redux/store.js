import { configureStore } from '@reduxjs/toolkit'
import AuthReducer from "./slices/AuthSlice";
import UserReducer from './slices/UserSlice';

export const store = configureStore({
    reducer:{
        auth: AuthReducer,
        users: UserReducer,
    }
})