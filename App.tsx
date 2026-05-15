import 'react-native-reanimated';
import React, { useEffect, useState } from 'react';
import { AuthProvider } from './src/context/AuthContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { View, ActivityIndicator, Platform, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0B1310' }}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  const appContent = (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );

  // Si estamos en la web, envolvemos la app en un "marco" de celular centrado
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webWrapper}>
        <View style={styles.mobileFrame}>
          {appContent}
        </View>
      </View>
    );
  }

  return appContent;
}

const styles = StyleSheet.create({
  webWrapper: {
    flex: 1,
    backgroundColor: '#050A08', // Fondo oscuro para el resto de la pantalla web
    justifyContent: 'center',
    alignItems: 'center',
  },
  mobileFrame: {
    width: 390, // Ancho típico de un iPhone
    height: 844, // Alto típico de un iPhone
    borderRadius: 40,
    overflow: 'hidden',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 20,
    borderColor: '#192A23',
    borderWidth: 8,
  },
});
