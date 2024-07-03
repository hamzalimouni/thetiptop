import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Config } from "../../types/types";

const initialState: Config = {
    dateOfStart: null,
    dateOfEnd: null,
    dateOfValidate: null,
    status: null
}

export const configSlice = createSlice({
    name: "config",
    initialState,
    reducers: {
        setConfigs: (state, action: PayloadAction<Config>) => {
            state.dateOfStart = action.payload.dateOfStart;
            state.dateOfEnd = action.payload.dateOfEnd;
            state.dateOfValidate = action.payload.dateOfValidate;
            state.status = action.payload.status;
        },
        resetConfigs: (state) => {
            state.dateOfStart = null;
            state.dateOfEnd = null;
            state.dateOfValidate = null;
            state.status = null;
        }
    }
})

export const {setConfigs, resetConfigs} = configSlice.actions;
export default configSlice.reducer;