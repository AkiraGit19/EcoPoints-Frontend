import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Alert, ScrollView, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { User, LogOut, Award, Edit2, Target, Camera } from 'lucide-react-native';
import { AuthContext } from '../context/AuthContext';
import { GlassCard } from '../components/ui/GlassCard';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';
import { useFocusEffect } from '@react-navigation/native';
import api from '../services/api';

export const ProfileScreen = () => {
  const { user, logout, updateProfile, addPoints } = useContext(AuthContext);
  const [nombre, setNombre] = useState(user?.nombre || '');
  const [correo, setCorreo] = useState(user?.correo || '');
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(user?.fotoPerfil || null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [displayPoints, setDisplayPoints] = useState(user?.puntosTotales || 0);

  useFocusEffect(
    React.useCallback(() => {
      const fetchLatestProfile = async () => {
        if (!user) return;
        try {
          const response = await api.get(`/usuarios/${user.id}`);
          const latestData = response.data;
          if (latestData && latestData.puntos_totales !== undefined) {
            setDisplayPoints(latestData.puntos_totales);
            if (latestData.foto_perfil !== undefined) setFotoPerfil(latestData.foto_perfil);
            // Sync with context silently
            const diff = latestData.puntos_totales - user.puntosTotales;
            if (diff !== 0 && addPoints) {
              await addPoints(diff);
            }
          }
        } catch (error) {
          console.error('Error fetching latest profile:', error);
        }
      };
      fetchLatestProfile();
    }, [user, addPoints])
  );

  const seleccionarFoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a tus fotos para cambiar la imagen de perfil.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.4,
      base64: true,
    });
    if (!result.canceled && result.assets[0]?.base64) {
      setFotoPerfil(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const handleUpdate = async () => {
    if (!nombre.trim()) {
      Alert.alert('Error', 'El nombre no puede estar vacío.');
      return;
    }
    if (!correo.trim()) {
      Alert.alert('Error', 'El correo no puede estar vacío.');
      return;
    }
    setIsSaving(true);
    try {
      await updateProfile({ nombre: nombre.trim(), correo: correo.trim(), fotoPerfil: fotoPerfil ?? undefined });
      Alert.alert('Éxito', 'Perfil actualizado correctamente.');
      setIsEditing(false);
    } catch (error: any) {
      const msg = error?.response?.data?.error || 'No se pudo actualizar el perfil.';
      Alert.alert('Error', msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      
      logout();
    } else {
      Alert.alert(
        'Cerrar Sesión',
        '¿Estás seguro que deseas cerrar sesión?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Sí, Salir', onPress: logout, style: 'destructive' },
        ]
      );
    }
  };

  if (!user) return null;

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
            <View style={styles.avatarContainer}>
              {fotoPerfil ? (
                <Image source={{ uri: fotoPerfil }} style={styles.avatarImage} />
              ) : (
                <User size={48} color={colors.primary} />
              )}
            </View>
            <Text style={styles.name}>{user.nombre}</Text>
            <Text style={styles.email}>{user.correo}</Text>
          </View>

          <GlassCard style={styles.statsCard}>
            <View style={styles.statItem}>
              <Award size={32} color={colors.accent} />
              <Text style={styles.statValue}>{displayPoints}</Text>
              <Text style={styles.statLabel}>EcoPoints Totales</Text>
            </View>
          </GlassCard>

          <GlassCard style={styles.editCard}>
            <View style={styles.editHeader}>
              <Text style={styles.sectionTitle}>Información Personal</Text>
              <Button
                title={isEditing ? "Cancelar" : "Editar"}
                onPress={() => {
                  setIsEditing(!isEditing);
                  setNombre(user.nombre);
                  setCorreo(user.correo);
                  setFotoPerfil(user.fotoPerfil || null);
                }}
                variant="outline"
              />
            </View>

            {isEditing ? (
              <View style={styles.formContainer}>
                <TouchableOpacity style={styles.changePhotoButton} onPress={seleccionarFoto}>
                  <Camera size={18} color={colors.primary} />
                  <Text style={styles.changePhotoText}>Cambiar foto de perfil</Text>
                </TouchableOpacity>
                <Input
                  label="Nombre"
                  value={nombre}
                  onChangeText={setNombre}
                />
                <Input
                  label="Correo Electrónico"
                  value={correo}
                  onChangeText={setCorreo}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <Button
                  title="Guardar Cambios"
                  onPress={handleUpdate}
                  isLoading={isSaving}
                  style={styles.saveButton}
                />
              </View>
            ) : (
              <View style={styles.infoContainer}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Nombre Completo</Text>
                  <Text style={styles.infoValue}>{user.nombre}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Rol</Text>
                  <Text style={styles.infoValue}>{user.rol}</Text>
                </View>
              </View>
            )}
          </GlassCard>

          {}
          <GlassCard style={styles.impactCard}>
            <Text style={styles.sectionTitle}>Tu Impacto</Text>
            <View style={styles.impactRow}>
              <View style={styles.impactIconContainer}>
                <Target size={24} color={colors.primary} />
              </View>
              <View style={styles.impactTextContainer}>
                <Text style={styles.impactTitle}>Desafíos completados</Text>
                <Text style={styles.impactSubtitle}>0 desafíos (próximamente)</Text>
              </View>
            </View>
          </GlassCard>

          <Button
            title="Cerrar Sesión"
            onPress={handleLogout}
            variant="outline"
          />
          
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
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.primary,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  changePhotoText: {
    ...typography.button,
    color: colors.primary,
    fontSize: 14,
  },
  name: {
    ...typography.h2,
    color: colors.text,
  },
  email: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: 4,
  },
  statsCard: {
    marginBottom: 24,
    alignItems: 'center',
    paddingVertical: 32,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...typography.h1,
    color: colors.accent,
    marginTop: 8,
  },
  statLabel: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginTop: 4,
  },
  impactCard: {
    marginBottom: 24,
    padding: 20,
  },
  impactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 16,
    borderRadius: 12,
  },
  impactIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  impactTextContainer: {
    flex: 1,
  },
  impactTitle: {
    ...typography.h3,
    color: colors.text,
    fontSize: 16,
  },
  impactSubtitle: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginTop: 2,
  },
  editCard: {
    marginBottom: 24,
  },
  editHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
  },
  formContainer: {
    marginTop: 8,
  },
  saveButton: {
    marginTop: 16,
  },
  infoContainer: {
    marginTop: 8,
  },
  infoRow: {
    marginBottom: 16,
  },
  infoLabel: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginBottom: 4,
  },
  infoValue: {
    ...typography.body,
    color: colors.text,
  },
});
