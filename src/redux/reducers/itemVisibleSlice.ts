import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type ItemVisibleStateType = {
    banner: boolean;
    cookie: boolean;
    google: boolean;
}

const initialState: ItemVisibleStateType = {
    banner: true,
    cookie: true,
    google: false,
}

export const itemVisibleSlice = createSlice({
    name: "itemVisible",
    initialState,
    reducers: {
        closeBanner: (state) => {
            state.banner = false;
        },
        closeCookie: (state) => {
            state.cookie = false;
        },
        setGoogle: (state, action: PayloadAction<boolean>) => {
            state.google = action.payload;
        }
    }
})

export const {closeBanner, closeCookie, setGoogle} = itemVisibleSlice.actions;
export default itemVisibleSlice.reducer;