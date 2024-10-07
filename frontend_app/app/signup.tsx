import { Text, View, TextInput, Pressable } from "react-native";
import { Link, router } from 'expo-router'; 
import React, { useState } from 'react';

export default function SignupScreen() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  const handleSignup = () => {
    if (email === '' || password === '') {
      setError(true)
    
    } else {
      setError(false)
      // Make request to backend

      // If sign up is successful, navigate page to verification page
      router.push('/verification')
    }
  }

  return (
    <View className="items-center flex-1 justify-center">
      <View className="px-4 py-4 border border-gray-300 w-[50%] rounded-lg">
        <Text>Email</Text>
        <TextInput 
          className="border border-gray-300 rounded-md px-3 py-1 my-1"
          placeholder="Email"
          keyboardType="email-address"
          onChangeText={setEmail}
        />
        <Text className="mt-4">Password</Text>
        <TextInput 
          className="border border-gray-300 rounded-md px-3 py-1 my-1"
          placeholder="Password"
          onChangeText={setPassword}
          secureTextEntry
        />
        {error && <Text className='mt-4 bg-red-400 rounded-md px-4 py-2'>Enter both email and password</Text>}
        
        <Pressable className="bg-gray-700 rounded-lg py-2 px-10 my-4" onPress={handleSignup}>
          <Text className="text-white text-center">Sign Up</Text>
        </Pressable>
        <Link href="/login" className="underline">Already have an account?</Link>
      </View>
    </View>
  );
}
