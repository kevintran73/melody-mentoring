import { toast } from 'react-toastify';
import axios from 'axios';

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

/**
 * Given a presigned post data URL from a backend post request, upload the given file
 * @param {Object} presignedPostData - from response.data.uploader
 * @param {File} file
 */
export const uploadFileToS3 = async (presignedPostData, file) => {
  // create a form obj
  const formData = new FormData();

  // append the fields in presignedPostData in formData
  Object.keys(presignedPostData.fields).forEach((key) => {
    formData.append(key, presignedPostData.fields[key]);
  });

  // append the file
  formData.append('file', file);

  // post the data on the s3 url
  axios
    .post(presignedPostData.url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .catch((err) => {
      showErrorMessage(err);
    });
};
