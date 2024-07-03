import { combineReducers, Dispatch } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import itemVisibleReducer from './itemVisibleSlice';
import configReducer from './configSlice';

const appReducer = combineReducers({
    auth: authReducer,
    itemVisible: itemVisibleReducer,
    config: configReducer
});

// const rootReducer = (state: any, action: any) => {
//     if (action.type === 'RESET_WEBAPP') {
//         state = undefined;
//     }
//     return appReducer(state, action);
// }
const rootReducer = (state: any, action: any) => {
    if (action.type === 'RESET_WEBAPP') {
        const { itemVisible, ...otherSlices } = state;
        state = {
            itemVisible,
            ...otherSlices
        };
    }
    return appReducer(state, action);
}

export const resetAppAction = () => (dispatch: Dispatch) => {
    dispatch({ type: 'RESET_WEBAPP' });
};

export default rootReducer;