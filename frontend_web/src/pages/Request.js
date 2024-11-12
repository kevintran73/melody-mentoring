import React from 'react'
import NavBar from '../components/nav_bar/NavBar'
import pic from '../assets/default-img.png'
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';

const Request = () => {

  const students = [
    {
      name: 'Daniel',
      img: pic,
    },
    {
      name: 'Victor',
      img: pic,
    },
    {
      name: 'Kevin',
      img: pic,
    },
    {
      name: 'Damon',
      img: pic,
    },
  ]

  // call GET route to render list of student requests, useEffect



  const handleAccept = (userId) => {
    alert(userId)
    // call route that accepts student

    // call GET route to rerender the updated list

  }

  // call route that deletes student from pending, and then grab the resulting list again 
  const handleDeny = (userId) => {
    alert(userId)

    // call route that denies student

    // call GET route to rerender the updated list

  }

  return (
    <div>
      <NavBar></NavBar>
      <div className='m-10 flex flex-col'>
        <h1 className='text-3xl font-medium mb-10'>Student Requests</h1>
        {students.map((student) => (
          <div className='shadow-md border rounded-lg flex items-center p-3 justify-between'>
            <div className='flex items-center'>
              <img src={student.img} alt="profile-pic" className='h-[75px] rounded-xl' />
              <h1 className='font-semibold ml-4'>
              {student.name}
              </h1>
            </div>
            
            <div className='flex items-center px-10'>
              <DoneIcon className='cursor-pointer text-green-600' onClick={() => handleAccept(student.name)} />
              <ClearIcon className='cursor-pointer text-red-600 ml-5' onClick={() => handleDeny(student.name)} />
            </div>
          </div>
          
        ))}
     
      </div>
    </div>
  )
}

export default Request