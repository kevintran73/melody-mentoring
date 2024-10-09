import React from 'react';
import { View } from 'react-native';
import CatalogueButton from './CatalogueButton';
import NotificationsButton from './NotificationsButton';
import CreateButton from './CreateButton';
import ActivityButton from './ActivityButton';
import SettingsButton from './SettingsButton';
import UploadsButton from './UploadsButton';

const NavBar = () => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#020E37', height: 75 }}>
      <NotificationsButton />

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <CreateButton />
        <CatalogueButton />
        <UploadsButton />
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <ActivityButton />
        <SettingsButton />
      </View>
    </View>
  );
};

export default NavBar;
