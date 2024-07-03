import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Token } from "../../types/types";

type UserInfo = {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    phone?: string;
    gender: string;
    birth?: string;
    profilePic?: string;
    createdAt: string;
}

type User = {
    token: string;
    refreshToken: string;
    userInfo: UserInfo;
}

type AuthStateType = {
    currentUser: User | null;
    pending: boolean;
    error: boolean;
}

const initialState: AuthStateType = {
    currentUser: null,
    pending: false,
    error: false,
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginStart: (state) => {
            state.pending = true;
            state.error = false;
        },
        loginSuccess: (state, action: PayloadAction<User>) => {
            state.pending = false;
            state.currentUser = action.payload;
        },
        loginFailure: (state) => {
            state.pending = false;
            state.error = true;
        },
        refreshToken: (state, action: PayloadAction<Token>) => {
            if (state.currentUser) {
                state.currentUser.token = action.payload.token;
                state.currentUser.refreshToken = action.payload.refreshToken;
            }
        },
        logout: (state) => {
            state.currentUser = null;
            state.pending = false;
            state.error = false;
            localStorage.clear();
        },
        resetAuthVars: (state) => {
            state.pending = false;
            state.error = false;
        },
        setUserInfo: (state, action: PayloadAction<UserInfo>) => {
            if (state.currentUser) {
                state.currentUser.userInfo = action.payload;
            }
        }
    }
})

export const {loginStart, loginSuccess, loginFailure, logout, refreshToken, resetAuthVars, setUserInfo} = authSlice.actions;
export default authSlice.reducer;