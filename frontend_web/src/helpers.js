import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Determines whether the given username is valid
 * @param {String} message
 *
 */
export const showErrorMessage = (message) => {
  toast.error(message, {
    position: 'bottom-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'colored',
  });
};
