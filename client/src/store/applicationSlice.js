import { createSlice } from "@reduxjs/toolkit";

const applicationSlice = createSlice({
    name:'application',
    initialState:{
        applicants:null,
        applications:[],
        stats:{},
    },
    reducers:{
        setAllApplicants:(state,action) => {
            state.applicants = action.payload;
        },
        setApplications:(state,action) => {
            state.applications = action.payload;
        },
        setApplicationStats:(state,action) => {
            state.stats = action.payload;
        },
        updateApplicationStatus:(state,action) => {
            const { applicationId, status } = action.payload;
            const application = state.applications.find(app => app._id === applicationId);
            if (application) {
                application.status = status;
            }
        }
    }
});
export const {setAllApplicants, setApplications, setApplicationStats, updateApplicationStatus} = applicationSlice.actions;
export default applicationSlice.reducer;