import React from 'react';
import { router } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import { Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Using expo icons for cross-platform compatibility

const UploadsButton = () => {
  const route = useRoute();

  // Change colour of button if on catalogue page
  let colour = '#B6B6B6';
  if (route.name === 'uploaded') {
    colour = '#FFFFFF';
  }

  const navCatalogue = () => {
    router.push('/uploaded')
  };

  return (
    <TouchableOpacity onPress={navCatalogue} style={{ justifyContent: 'center', alignItems: 'center' }}>
      <MaterialIcons name="book" size={32} color={colour} />
      <Text style={{ fontSize: 12, color: colour, margin: 0 }}>Uploaded</Text>
    </TouchableOpacity>
  );
};

export default UploadsButton;
