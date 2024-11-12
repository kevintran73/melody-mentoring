import React from 'react'
import NavBar from '../components/nav_bar/NavBar'
import { useNavigate } from 'react-router-dom';
import pic from '../assets/default-img.png'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PrevArrow from '../components/tutor_interface/PrevArrow';
import NextArrow from '../components/tutor_interface/NextArrow';
 
const students = [
  {
    name: 'Daniel',
    img: pic
  },
  {
    name: 'Victor',
    img: pic
  },
  {
    name: 'Kevin',
    img: pic
  },
]
const songs = [
  {
    songName: 'Song',
    artist: 'Artist',
    difficulty: 'Easy',
    img: pic,
  },
  {
    songName: 'Song',
    artist: 'Artist',
    difficulty: 'Easy',
    img: pic,
  },
  {
    songName: 'Song',
    artist: 'Artist',
    difficulty: 'Easy',
    img: pic,
  },
]

const Dashboard = () => {

  const navigate = useNavigate();

  const settings = {
    infinite: false,
    dots: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };
  const handleClick = (song) => {
    navigate(`/review/${song}`)
  }

  return (
    <div>
      <NavBar></NavBar>
      <div className='m-10 flex flex-col'>
      <h1 className='text-3xl font-medium mb-10'>Your Students' Attempts</h1>
      {students.map((student) => (
        <div className='mb-10'>
          <h1 className='text-2xl font-medium mb-4'>{student.name}'s Attempts</h1>
        <Slider {...settings}>
          {songs.map((song) => (
            <div className='text-black border-2 rounded-xl shadow-lg cursor-pointer flex flex-col ' onClick={() => handleClick(song.songName)}>
              <div className='flex justify-center my-2'>
                <img src={song.img} alt="" className='h-[100px] rounded-xl' />
              </div>
            
              <div className='text-center'>
                <p className='font-semibold text-lg'>{song.songName}</p>
                <p className='text-gray-600'>{song.artist}</p>
                <p className='text-gray-600 text-sm'>{song.difficulty}</p>
            </div>
            </div>
          ))}
        </Slider>
        </div>
      ))}
    </div>
    </div>
  )
}

export default Dashboard