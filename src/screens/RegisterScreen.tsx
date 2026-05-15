import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/GlassCard';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';

export const RegisterScreen = ({ navigation }: any) => {
  const { register, isLoading } = useContext(AuthContext);
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');

  const handleRegister = async () => {
    if (!nombre || !correo || !contrasena) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }
    try {
      await register(nombre, correo, contrasena);
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear la cuenta.');
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
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Crear Cuenta</Text>
            <Text style={styles.subtitle}>Únete a EcoPoints hoy</Text>
          </View>

          <GlassCard style={styles.card}>
            <Input
              label="Nombre"
              placeholder="Ej. Juan Pérez"
              value={nombre}
              onChangeText={setNombre}
            />
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
                title="Registrarse"
                onPress={handleRegister}
                isLoading={isLoading}
              />
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>¿Ya tienes una cuenta? </Text>
              <Text
                style={styles.linkText}
                onPress={() => navigation.navigate('Login')}
              >
                Inicia Sesión
              </Text>
            </View>
          </GlassCard>
        </ScrollView>
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
  },
  scrollContent: {
    flexGrow: 1,
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
