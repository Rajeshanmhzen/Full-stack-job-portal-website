import { createSlice } from "@reduxjs/toolkit";

const initialState = {
        recommendations:[],
        resume:null,
    };

const resumeSlice = createSlice({
    name:"resume",
    initialState,
    reducers:{
        setRecommendations:(state, action)=> {
            state.recommendations = action.payload
        },
        setResume:(state,action) => {
            state.resume = action.payload;
        },
    },
});

export const {setRecommendations, setResume} = resumeSlice.actions
export default resumeSlice.reducer;