import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RetosScreen } from '../screens/RetosScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import DetalleRetoScreen from '../screens/DetalleRetoScreen';
import { RecompensasScreen } from '../screens/RecompensasScreen';
import { MapaScreen } from '../screens/MapaScreen';
import { NotificacionesScreen } from '../screens/NotificacionesScreen';

import { colors } from '../theme/colors';
import { Leaf, User, Gift, MapPin } from 'lucide-react-native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const RetosStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="RetosLista"
        component={RetosScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="DetalleReto"
        component={DetalleRetoScreen}
        options={{
          title: 'Detalle del reto',
          headerStyle: {
            backgroundColor: '#0a1612',
          },
          headerTintColor: '#ffffff',
        }}
      />

      <Stack.Screen
        name="Notificaciones"
        component={NotificacionesScreen}
        options={{
          title: 'Notificaciones',
          headerStyle: { backgroundColor: '#0a1612' },
          headerTintColor: '#ffffff',
        }}
      />
    </Stack.Navigator>
  );
};

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
        component={RetosStack}
        options={{
          tabBarIcon: ({ color, size }) => <Leaf color={color} size={size} />,
        }}
      />

      <Tab.Screen
        name="Mapa"
        component={MapaScreen}
        options={{
          tabBarIcon: ({ color, size }) => <MapPin color={color} size={size} />,
        }}
      />

      <Tab.Screen
        name="Recompensas"
        component={RecompensasScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Gift color={color} size={size} />,
        }}
      />

      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};
