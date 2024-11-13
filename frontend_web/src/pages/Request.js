import React, { useContext, useEffect, useState } from 'react'
import NavBar from '../components/nav_bar/NavBar'
import pic from '../assets/default-img.png'
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import axios from 'axios';
import TokenContext from '../context/TokenContext';
import { Button } from '@mui/material';

const Request = () => {

  const {accessToken, userId} = useContext(TokenContext);
  const [allStudents, setAllStudents] = useState([]); 
  const [requests, setRequests] = useState([]);
  // for each student, must get the username and profile pic 

  const students = [
    {
      name: 'Daniel',
      img: pic,
    },
    {
      name: 'Victor',
      img: pic,
    },
  ]

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/profile/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = response.data;

      const res = data.students.map((id) => 
        axios.get(`http://localhost:5001/profile/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      )
      const responses = await Promise.all(res);

      const studentDetails = responses.map((response) => {
        const { id, username, profile_picture } = response.data; 
        return { id, username, profile_picture }
      });      
      setAllStudents(studentDetails) 

      res = data.requests.map((id) => 
        axios.get(`http://localhost:5001/profile/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      )
      responses = await Promise.all(res);

      studentDetails = responses.map((response) => {
        const { id, username, profile_picture } = response.data; 
        return { id, username, profile_picture }
      });      
      setRequests(studentDetails) 

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchStudents(); // Get a list of all the students and requests
  }, []);


  const handleClick = async (studentId, bool) => {

    try {
      await axios.post(`http://localhost:5001/tutor/request/response/${studentId}/${userId}`, 
        {
          studentId: studentId,
          tutorId: userId,
          response: bool,
        }, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      
      fetchStudents();  // call again
    } catch (error) {
      console.error('Error fetching data:', error);
    } 

  }

  return (
    <div>
      <NavBar></NavBar>
      <div className='m-10 grid grid-cols-2 gap-4'>
        <div>
          <h1 className='text-3xl font-medium mb-10'>Student Requests</h1>
          {requests.map((student) => (
            <div className='shadow-md border rounded-lg flex items-center p-3 justify-between'>
              <div className='flex items-center'>
                <img src={student.profile_picture} alt="profile-pic" className='h-[75px] rounded-xl' />
                <h1 className='font-semibold ml-4'>
                {student.username}
                </h1>
              </div>
              
              <div className='flex items-center px-10'>
                <DoneIcon className='cursor-pointer text-green-600' onClick={() => handleClick(student.id, true)} />
                <ClearIcon className='cursor-pointer text-red-600 ml-5' onClick={() => handleClick(student.id, false)} />
              </div>
            </div>
          ))}
        </div>

        <div>
          <h1 className='text-3xl font-medium mb-10'>My Students</h1>
          {allStudents.map((student) => (
            <div className='shadow-md border rounded-lg flex items-center p-3 justify-between'>
              <div className='flex items-center'>
                <img src={student.profile_picture} alt="profile-pic" className='h-[75px] rounded-xl' />
                <h1 className='font-semibold ml-4'>
                {student.username}
                </h1>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Request