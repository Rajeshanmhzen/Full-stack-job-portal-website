import React from "react";
import { notifications } from "@mantine/notifications";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export const showSuccess = (title, message)=> {
    notifications.show({
        title,
        message,
        color:"teal",
        icon: React.createElement(FaCheckCircle),
        withBorder:true
    })
};
export const showError = (title, message)=> {
    notifications.show({
        title,
        message,
        color:"red",
        icon: React.createElement(FaTimesCircle),
        withBorder:true
    })
};