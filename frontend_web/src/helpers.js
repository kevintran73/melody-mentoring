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

/** Given a string with substrings separated by commas, map to an array
 *
 * @param {String} string
 * @returns {Array}
 */
export const mapCommaStringToArray = (string) => {
  // Check if input is an empty string or contains no commas
  if (!string.includes(',')) {
    return string ? [string] : [];
  }

  // Split the input string by commas and filter out any empty strings caused by trailing commas
  return string.split(',').filter((substring) => substring !== '');
};

/**
 * Returns the file as a base64 string
 * @param {File} file
 * @returns
 */
export const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
