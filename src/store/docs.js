import { createSlice } from '@reduxjs/toolkit';

const initialDocsState = {
    isSearchStarted: false,
    searchQuery: '',
    allDocs: [],
};

const docsSlice = createSlice({
    name: 'docs',
    initialState: initialDocsState,
    reducers: {
        startSearch(state, action) {
            state.isSearchStarted = true;
            state.searchQuery = action.payload;
        },
    },
});

export const docsActions = docsSlice.actions;

export default docsSlice.reducer;
