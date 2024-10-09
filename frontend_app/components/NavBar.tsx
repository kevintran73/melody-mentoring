import React from 'react';
import { View } from 'react-native';
import CatalogueButton from './CatalogueButton';
import NotificationsButton from './NotificationsButton';
import CreateButton from './CreateButton';
import ActivityButton from './ActivityButton';
import SettingsButton from './SettingsButton';
import UploadsButton from './UploadsButton';
import { styled } from 'nativewind';

const StyledView = styled(View);

const NavBar = () => {
  return (
    <StyledView className="flex flex-row justify-between items-center p-4 bg-[#020E37] h-[75px]">
      <NotificationsButton />

      <StyledView className="flex flex-row items-center space-x-5">
        <CreateButton />
        <CatalogueButton />
        <UploadsButton />
      </StyledView>

      <StyledView className="flex flex-row items-center space-x-5">
        <ActivityButton />
        <SettingsButton />
      </StyledView>
    </StyledView>
  );
};

export default NavBar;
