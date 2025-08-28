import { setAllJobs } from "../store/jobSlice";
import { JOB_API_END_POINT } from "../utils/constant";
import { useDispatch, useSelector } from 'react-redux'
import axios from "axios";
import { useEffect } from "react";
const useGetAllJobs = () => {
 const dispatch = useDispatch()
 const fetchData =async ()=> {
    try {
        const res = await axios.get(`${JOB_API_END_POINT}/get?keyword=${searchQuery}`)
        if(res.data.success) {
            dispatch(setAllJobs(res.data.jobs))
        }
    } catch (error) {
        console.log(error)
    }
 }
 const {searchQuery} = useSelector(store=> store.job)
 useEffect(()=> {
    fetchData()
 })
}

export default useGetAllJobs