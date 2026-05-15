import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RetosScreen } from '../screens/RetosScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { colors } from '../theme/colors';
import { Leaf, User } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

export const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0a1612',
          borderTopColor: 'rgba(167, 243, 208, 0.1)',
          
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          minHeight: Platform.OS === 'ios' ? 88 : 65,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tab.Screen 
        name="Retos" 
        component={RetosScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Leaf color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Perfil" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />
        }}
      />
    </Tab.Navigator>
  );
};
