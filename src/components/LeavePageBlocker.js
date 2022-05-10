import React, { useEffect } from 'react'
import { Prompt } from 'react-router-dom'


const LeavePageBlocker = ({ when }) => {
    const message = "You have unsaved changes, are you sure you want to leave?"

    useEffect(() => {
        if (!when) return () => { }

        const beforeUnloadCallback = (event) => {
            event.preventDefault()
            event.returnValue = message
            return message
        }

        window.addEventListener('beforeunload', beforeUnloadCallback)
        return () => {
            window.removeEventListener('beforeunload', beforeUnloadCallback)
        }
    }, [when, message])

    return <Prompt when={when} message={message} />
}


export default LeavePageBlocker