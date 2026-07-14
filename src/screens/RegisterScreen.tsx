import React, {
  useContext,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/GlassCard';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';

interface ErroresRegistro {
  nombre?: string;
  correo?: string;
  contrasena?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const RegisterScreen = ({
  navigation,
}: any) => {
  const { register, isLoading } =
    useContext(AuthContext);

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] =
    useState('');

  const [errores, setErrores] =
    useState<ErroresRegistro>({});

  const validarFormulario = (): boolean => {
    const nuevosErrores: ErroresRegistro = {};

    const nombreLimpio = nombre.trim();
    const correoLimpio = correo.trim();

    if (!nombreLimpio) {
      nuevosErrores.nombre =
        'Ingresa tu nombre.';
    } else if (nombreLimpio.length < 2) {
      nuevosErrores.nombre =
        'El nombre debe tener al menos 2 caracteres.';
    }

    if (!correoLimpio) {
      nuevosErrores.correo =
        'Ingresa tu correo electrónico.';
    } else if (
      !EMAIL_RE.test(correoLimpio)
    ) {
      nuevosErrores.correo =
        'Ingresa un correo electrónico válido.';
    }

    if (!contrasena) {
      nuevosErrores.contrasena =
        'Ingresa una contraseña.';
    } else if (contrasena.length < 6) {
      nuevosErrores.contrasena =
        'La contraseña debe tener al menos 6 caracteres.';
    }

    setErrores(nuevosErrores);

    return (
      Object.keys(nuevosErrores).length === 0
    );
  };

  const handleRegister = async () => {
    if (!validarFormulario()) {
      return;
    }

    try {
      await register(
        nombre.trim(),
        correo.trim().toLowerCase(),
        contrasena
      );
    } catch (error: any) {
      const mensaje =
        error?.response?.data?.error ||
        'No se pudo crear la cuenta.';

      Alert.alert('Error', mensaje);
    }
  };

  return (
    <LinearGradient
      colors={[
        colors.background,
        '#0f2b20',
      ]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : 'height'
        }
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={
            styles.scrollContent
          }
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>
              Crear Cuenta
            </Text>

            <Text style={styles.subtitle}>
              Únete a EcoPoints hoy
            </Text>
          </View>

          <GlassCard style={styles.card}>
            <Input
              label="Nombre"
              placeholder="Ej. Juan Pérez"
              value={nombre}
              error={errores.nombre}
              onChangeText={(texto) => {
                setNombre(texto);

                if (errores.nombre) {
                  setErrores(
                    (erroresAnteriores) => ({
                      ...erroresAnteriores,
                      nombre: undefined,
                    })
                  );
                }
              }}
            />

            <Input
              label="Correo Electrónico"
              placeholder="ejemplo@correo.com"
              value={correo}
              error={errores.correo}
              onChangeText={(texto) => {
                setCorreo(texto);

                if (errores.correo) {
                  setErrores(
                    (erroresAnteriores) => ({
                      ...erroresAnteriores,
                      correo: undefined,
                    })
                  );
                }
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Input
              label="Contraseña"
              placeholder="••••••"
              value={contrasena}
              error={errores.contrasena}
              onChangeText={(texto) => {
                setContrasena(texto);

                if (errores.contrasena) {
                  setErrores(
                    (erroresAnteriores) => ({
                      ...erroresAnteriores,
                      contrasena: undefined,
                    })
                  );
                }
              }}
              secureTextEntry
            />

            <View
              style={styles.buttonContainer}
            >
              <Button
                title="Registrarse"
                onPress={handleRegister}
                isLoading={isLoading}
              />
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                ¿Ya tienes una cuenta?{' '}
              </Text>

              <Text
                style={styles.linkText}
                onPress={() =>
                  navigation.navigate('Login')
                }
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