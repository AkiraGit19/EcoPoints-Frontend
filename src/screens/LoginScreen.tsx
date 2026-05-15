import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/GlassCard';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';

export const LoginScreen = ({ navigation }: any) => {
  const { login, isLoading } = useContext(AuthContext);
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');

  const handleLogin = async () => {
    if (!correo || !contrasena) {
      Alert.alert('Error', 'Por favor ingresa tu correo y contraseña.');
      return;
    }
    try {
      await login(correo, contrasena);
    } catch (error) {
      Alert.alert('Error de Autenticación', 'Credenciales inválidas.');
    }
  };

  return (
    <LinearGradient
      colors={[colors.background, '#0f2b20']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <Text style={styles.title}>EcoPoints</Text>
          <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
        </View>

        <GlassCard style={styles.card}>
          <Input
            label="Correo Electrónico"
            placeholder="ejemplo@correo.com"
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Contraseña"
            placeholder="••••••"
            value={contrasena}
            onChangeText={setContrasena}
            secureTextEntry
          />
          
          <View style={styles.buttonContainer}>
            <Button
              title="Iniciar Sesión"
              onPress={handleLogin}
              isLoading={isLoading}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿No tienes una cuenta? </Text>
            <Text
              style={styles.linkText}
              onPress={() => navigation.navigate('Register')}
            >
              Regístrate
            </Text>
          </View>
        </GlassCard>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    ...typography.h1,
    color: colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
  },
  card: {
    padding: 24,
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  footerText: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  linkText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: 'bold',
  },
});
