import React, { useContext, useEffect, useState } from 'react';
import NavBar from '../components/nav_bar/NavBar';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import axios from 'axios';
import TokenContext from '../context/TokenContext';
import { useNavigate } from 'react-router-dom';
import { showErrorMessage, showSuccessMessage } from '../helpers';

const Request = () => {
  const { accessToken, userId, role } = useContext(TokenContext);
  const [allStudents, setAllStudents] = useState([]);
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/profile/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = response.data;

      let res = data.students.map((id) =>
        axios.get(`http://localhost:5001/profile/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      );
      let responses = await Promise.all(res);

      let studentDetails = responses.map((response) => {
        const { id, username, profile_picture } = response.data;
        return { id, username, profile_picture };
      });
      setAllStudents(studentDetails);

      res = data.requests.map((id) =>
        axios.get(`http://localhost:5001/profile/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      );
      responses = await Promise.all(res);

      studentDetails = responses.map((response) => {
        const { id, username, profile_picture } = response.data;
        return { id, username, profile_picture };
      });
      setRequests(studentDetails);

    } catch (err) {
      showErrorMessage(err.response.data.error)
    }
  };

  useEffect(() => {
    // Check if valid token or role
    if (accessToken === null || role === 'student') {
      return navigate('/login');
    }

    fetchStudents(); // Get a list of all the students and requests
  }, [accessToken, navigate, role]);

  const handleClick = async (studentId, bool) => {
    try {
      await axios.post(
        `http://localhost:5001/tutor/request/response/${studentId}/${userId}`,
        {
          studentId: studentId,
          tutorId: userId,
          response: bool,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (bool === true) {
        showSuccessMessage('Accepted student request')
      }

      fetchStudents(); // call again
    } catch (err) {
      showErrorMessage(err.response.data.error)
    }
  };

  return (
    <div>
      <NavBar></NavBar>
      <div className='m-10 grid sm:grid-cols-2 gap-4'>
        <div>
          <h1 className='text-3xl font-medium mb-10'>Student Requests</h1>
          {requests.map((student) => (
            <div className='shadow-md border rounded-lg flex items-center p-3 m-2 justify-between'>
              <div className='flex items-center'>
                <img
                  src={student.profile_picture}
                  alt='profile-pic'
                  className='h-[75px] rounded-xl'
                />
                <h1 className='font-semibold ml-4'>{student.username}</h1>
              </div>

              <div className='flex items-center px-10'>
                <DoneIcon
                  className='cursor-pointer text-green-600'
                  onClick={() => handleClick(student.id, true)}
                />
                <ClearIcon
                  className='cursor-pointer text-red-600 ml-5'
                  onClick={() => handleClick(student.id, false)}
                />
              </div>
            </div>
          ))}
        </div>
          
        <div>
          <h1 className='text-3xl font-medium mb-10'>My Students</h1>
          {allStudents.map((student) => (
            <div className='shadow-md border rounded-lg flex items-center p-3 m-2 justify-between'>
              <div className='flex items-center'>
                <img
                  src={student.profile_picture}
                  alt='profile-pic'
                  className='h-[75px] rounded-xl'
                />
                <h1 className='font-semibold ml-4'>{student.username}</h1>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Request;
