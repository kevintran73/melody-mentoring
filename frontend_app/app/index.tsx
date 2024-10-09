import { Text, View, Image } from "react-native";
import { Link } from 'expo-router';

export default function Index() {
  return (
    <View className="items-center flex-1 flex-row">
      <View className="w-1/2 items-center">
        <Text className="text-3xl font-bold">Melody Mentoring</Text>
        <Text className="text-xl font-bold my-4">Discover the Musician in You</Text>
        <Link href="/login" className="bg-gray-700 text-white rounded-3xl py-2 px-10">Login</Link>
        <View className="bg-gray-700 h-0.5 w-[80%] mt-8 mb-4"/>
        <Text className="text-lg font-bold mb-2">Don't have an account?</Text>
        <Link href="/signup" className="bg-gray-700 text-white rounded-3xl py-2 px-10">Sign Up</Link>
      </View>

      <View className="w-1/2 items-center">
        <Image source={require("../assets/images/piano.jpg")} className="rounded-3xl object-contain w-60 h-60" />
      </View>

    </View>
  );
}
