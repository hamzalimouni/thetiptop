import { Dispatch } from "redux";
import { loginFailure, loginStart, loginSuccess } from "../reducers/authSlice";
import { publicRequest } from "../../makeRequest";
import { NavigateFunction } from "react-router-dom";
import { setGoogle } from "../reducers/itemVisibleSlice";
import { LoginData, UserInfo } from "../../types/types";

export const login = async(dispatch: Dispatch, user: LoginData, navigate: NavigateFunction) => {
    dispatch(loginStart());
    try {
        const res = await publicRequest.post("auth/login", user);
        const token = res?.data?.token;
        const refreshToken = res?.data?.refreshToken;
        const userInfo: UserInfo = res?.data?.others;
        await dispatch(loginSuccess({token, refreshToken, userInfo}));
        navigate(0);
    } catch (error) {
        dispatch(loginFailure());
    }
}

export const loginGoogle = async(dispatch: Dispatch) => {
    try {
        const res = await publicRequest.get("auth/login/success", {
            withCredentials: true,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true,
            },
        });
        if(res.status === 200){
            const token = res?.data?.token;
            const refreshToken = res?.data?.refreshToken;
            const userInfo: UserInfo = res?.data?.others;
            await dispatch(loginSuccess({token, userInfo, refreshToken}));
            await dispatch(setGoogle(false));
            window.location.reload();
        }
    } catch (error) {
        console.log(error);
    }
}
