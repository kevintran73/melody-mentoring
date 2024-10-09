import { Text, View, TextInput, Pressable, Alert } from "react-native";
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import axios from 'axios';
import * as SecureStore from "expo-secure-store";
import { LOCAL_IP } from '@env';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  // function to store access, id and refresh tokens
  const storeTokens = async (access_token: string, id_token: string, refresh_token: string) => {
      try {
        await SecureStore.setItemAsync('access_token', access_token)
        await SecureStore.setItemAsync('id_token', id_token)
        await SecureStore.setItemAsync('refresh_token', refresh_token)
      } catch (error) {
        console.log(error)
      }
  }

  const handleLogin = async () => {
    if (email === '' || password === '') {
      setError(true)

    } else {
      setError(false)
      try {
        const response = await axios.post(`http://${LOCAL_IP}:5001/login`, {
          email: email,
          password: password,
        });

        // Store the tokens
        const {access_token, id_token, refresh_token} = response.data
        await storeTokens(access_token, id_token, refresh_token)

        router.push('/catalogue')  // redirect to main page

      } catch (error) {
        Alert.alert(error.response.data.error)
      }
    }
  }

  const goBack = () => {
    router.push('/')
  };

  return (
    <>
    <View className="absolute top-4 left-4 ">
      <AntDesign name="arrowleft" size={24} onPress={() => router.back()}/>
    </View>

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

        <Pressable className="bg-gray-700 rounded-lg py-2 px-10 my-4" onPress={handleLogin}>
          <Text className="text-white text-center">Login</Text>
        </Pressable>
        <Link href="/signup" className="underline">Don't have an account?</Link>
      </View>
    </View>
    </>
    </>
  );
}
