import React from 'react';
import { router } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import { Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Using expo icons for cross-platform compatibility

const CatalogueButton = () => {
  const route = useRoute();

  // Change colour of button if on catalogue page
  let colour = '#B6B6B6';
  if (route.name === 'catalogue') {
    colour = '#FFFFFF';
  }

  const navCatalogue = () => {
    router.push('/catalogue')
  };

  return (
    <TouchableOpacity onPress={navCatalogue} style={{ justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
      <MaterialIcons name="library-music" size={32} color={colour} />
      <Text style={{ fontSize: 12, color: colour, margin: 0 }}>Catalogue</Text>
    </TouchableOpacity>
  );
};

export default CatalogueButton;
