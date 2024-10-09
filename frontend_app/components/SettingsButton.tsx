import React from 'react';
import { router } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import { Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Using expo icons for cross-platform compatibility

const SettingsButton = () => {
  const route = useRoute();

  // Change colour of button if on catalogue page
  let colour = '#B6B6B6';
  if (route.name === 'settings') {
    colour = '#FFFFFF';
  }

  const navCatalogue = () => {
    router.push('/settings')
  };

  return (
    <TouchableOpacity onPress={navCatalogue}>
      <MaterialIcons name="settings" size={32} color={colour} />
    </TouchableOpacity>
  );
};

export default SettingsButton;
