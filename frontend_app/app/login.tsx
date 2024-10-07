import { Text, View, TextInput, Pressable } from "react-native";
import { Link } from 'expo-router'; 
import React, { useState } from 'react';

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  const handleSignup = () => {
    if (email === '' || password === '') {
      setError(true)
    
    } else {
      setError(false)
      // Make request to backend
      
    }
  }

  return (
    <View className="items-center flex-1 justify-center">
      <View className="px-4 py-4 border border-gray-300 w-[50%] rounded-lg">
        <Text>Email</Text>
        <TextInput 
          className="border border-gray-300 rounded-md px-3 py-1 my-1"
          placeholder="Email"
          onChangeText={setEmail}
          keyboardType="email-address"
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
          <Text className="text-white text-center">Login</Text>
        </Pressable>
        <Link href="/signup" className="underline">Don't have an account?</Link>
      </View>
    </View>
  );
}
