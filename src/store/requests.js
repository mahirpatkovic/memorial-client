import { createSlice } from '@reduxjs/toolkit';

const initialRequestsState = {
    allRequests: [],
    isRequestModalVisible: false,
    selectedRequest: {},
};

const requestsSlice = createSlice({
    name: 'requests',
    initialState: initialRequestsState,
    reducers: {
        setAllRequests(state, action) {
            state.allRequests = action.payload;
        },
        setRequestModalVisible(state) {
            state.isRequestModalVisible = true;
        },
        setSelectedRequest(state, action) {
            state.selectedRequest = action.payload;
        },
        resetInitialState(state) {
            state.isRequestModalVisible = false;
            state.selectedRequest = {};
        },
    },
});

export const requestsActions = requestsSlice.actions;

export default requestsSlice.reducer;
