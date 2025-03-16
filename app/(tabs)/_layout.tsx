import { Tabs } from 'expo-router';
import React from 'react';

//temporarily using this imports to test the game tab bar
import { Platform, Text } from 'react-native';
import { PlatformPressable } from "@react-navigation/elements"
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';

export default function TabLayout() {
  const Colors = {
    light: {
      tint: '#000',
    },
    dark: {
      tint: '#fff',
    },
  };
  const colorScheme = "light";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: (props:BottomTabBarButtonProps ) => (<PlatformPressable  {...props} onPressIn={ (ev) => (props.onPressIn && props.onPressIn(ev)) }/>),
        tabBarBackground: undefined,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (<Text></Text>),
        }}
      />
      <Tabs.Screen
        name="NailTrim"
        options={{
          title: 'Nail Trim',
          tabBarIcon: ({ color }) => (<Text> &#127918;</Text>),
        }}
      />
    </Tabs>
  );
}
