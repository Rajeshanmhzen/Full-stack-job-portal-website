import axios from "axios"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { NOTIFICATION_API_END_POINT } from "../utils/constant"
import { setNotifications, refreshNotifications } from "../store/notificationSlice"

const useGetAllNotifications = ()=> {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user)
    
    useEffect(()=> {
        if (!user) return
        
        const fetchNotifications = async()=> {
            try {
                const res = await axios.get(`${NOTIFICATION_API_END_POINT}`, {withCredentials:true})
                if(res.data.success){
                    dispatch(setNotifications(res.data.notifications))
                }
            } catch (err) {
                console.log("Error from the notification",err.message)
            }
        }
        
        fetchNotifications()
        const interval = setInterval(fetchNotifications, 1000)
        
        return () => clearInterval(interval)
    }, [user, dispatch])
}

export default useGetAllNotifications