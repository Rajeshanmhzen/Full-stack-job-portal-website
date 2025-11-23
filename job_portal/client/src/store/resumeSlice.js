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
        ClearRecommendations:(state)=> {
            state.recommendations = []
            state.resume = null
        }, 
        clearResume: (state) => {
      state.resume = null;
    },
    },
});

export const {setRecommendations, setResume, ClearRecommendations,clearResume} = resumeSlice.actions
export default resumeSlice.reducer;