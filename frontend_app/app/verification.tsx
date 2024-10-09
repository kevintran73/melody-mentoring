import { Text, View, TextInput, Pressable, Alert} from "react-native";
import React, { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import axios from 'axios';


export default function VerificationScreen() {

  const [code, setCode] = useState('')
  const { username } = useLocalSearchParams()

  const handleResend = async () => {
    try {
      const response = await axios.post('http://localhost:5001/resendConfirmation', {
        username: username,
      });
      Alert.alert(response.data.message)

    } catch (error) {
      console.log(error)
    }
  }

  const handleConfirmation = async () => {
    try {
      await axios.post('http://localhost:5001/confirmSignup', {
        code: code,
        username: username,
      });

      // if confirmation is successful, redirect to login page for user to login with their credentials
      router.push('/login')

    } catch (error) {
      alert(error.response.data.error)
    }
  }

  return (
    <View className="items-center flex-1 justify-center">
      <View className="w-[50%]">
        <Text className="font-bold text-2xl text-center">Verify your email address </Text>
        <Text className="my-3">Check your email inbox for a 6-digit code</Text>

        <Text className="font-bold">Enter your 6-digit code</Text>
        <TextInput
          className="border border-gray-300 rounded-md px-3 py-1 my-1"
          placeholder="Enter code"
          keyboardType="default"
          onChangeText={setCode}
        />

        <Text className="my-2">
          Didn't receive an email?
          <Text className="underline text-blue-600" onPress={handleResend}> Send a new code</Text>
        </Text>

        <Pressable onPress={handleConfirmation} className="bg-gray-700 rounded-lg py-2 my-4 px-10 mx-auto">
          <Text className="text-white text-center">Verify</Text>
        </Pressable>

      </View>
    </View>
  );
}
