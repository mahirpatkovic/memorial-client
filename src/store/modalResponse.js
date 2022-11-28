import { createSlice } from '@reduxjs/toolkit';

const initialModalResponseState = {
    isModalResAlertVisible: false,
    modalResMessage: '',
    modalAlertType: 'success',
};

const modalResponseSlice = createSlice({
    name: 'modalResponse',
    initialState: initialModalResponseState,
    reducers: {
        setIsModalResAlertVisible(state) {
            state.isModalResAlertVisible = true;
        },
        setModalResMessage(state, action) {
            state.modalResMessage = action.payload;
        },
        setModalAlertType(state, action) {
            state.modalAlertType = action.payload;
        },
        setIsModalResAlertHidden(state) {
            state.isModalResAlertVisible = false;
        },
    },
});

export const modalResponseActions = modalResponseSlice.actions;

export default modalResponseSlice.reducer;
