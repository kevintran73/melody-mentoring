import { Text, View, TextInput, Pressable, Alert } from "react-native";
import { Link, router } from 'expo-router'; 
import React, { useState } from 'react';
import axios from 'axios';
import { LOCAL_IP } from '@env';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function SignupScreen() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState(false)

  const handleSignup = async () => {
    if (email === '' || password === '' || username === '') {
      setError(true)
    
    } else {
      setError(false)

      try {
        await axios.post(`http://${LOCAL_IP}:5001/signup`, {
          username: username,
          email: email,
          password: password,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        router.push({
          pathname: '/verification',
          params: {
            username: username,
          },
        })
      } catch (error) {
        Alert.alert(error.response.data.error)
      }
    }
  }

  return (
    <>
    <View className="absolute top-4 left-4 ">
      <AntDesign name="arrowleft" size={24} onPress={() => router.back()}/>
    </View>

    <View className="items-center flex-1 justify-center">
      <View className="px-4 py-4 border border-gray-300 w-[50%] rounded-lg">
      <Text>Username</Text>
        <TextInput 
          className="border border-gray-300 rounded-md px-3 py-1 my-1"
          placeholder="Username"
          onChangeText={setUsername}
        />
        <Text className="mt-2">Email</Text>
        <TextInput 
          className="border border-gray-300 rounded-md px-3 py-1 my-1"
          placeholder="Email"
          keyboardType="email-address"
          onChangeText={setEmail}
        />
        <Text className="mt-2">Password</Text>
        <TextInput 
          className="border border-gray-300 rounded-md px-3 py-1 my-1"
          placeholder="Password"
          onChangeText={setPassword}
          secureTextEntry
        />
        {error && <Text className='mt-4 bg-red-400 rounded-md px-4 py-2'>Fill in all fields</Text>}
        
        <Pressable className="bg-gray-700 rounded-lg py-2 px-10 my-4" onPress={handleSignup}>
          <Text className="text-white text-center">Sign Up</Text>
        </Pressable>
        <Link href="/login" className="underline">Already have an account?</Link>
      </View>
    </View>
    </>
  );
}
