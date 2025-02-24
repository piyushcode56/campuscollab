import {toast} from 'react-toastify';
import { ToastContainer } from 'react-toastify';
export const handleSuccess = (msg) => {
    toast.success(msg);
}
export const handleError = (msg) => {
    toast.error(msg);
}

export const handleWarn = (msg) =>{
    toast.warn(msg);
}


