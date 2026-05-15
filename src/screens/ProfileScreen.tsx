import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, LogOut, Award, Edit2, Target } from 'lucide-react-native';
import { AuthContext } from '../context/AuthContext';
import { GlassCard } from '../components/ui/GlassCard';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';

export const ProfileScreen = () => {
  const { user, logout, updateProfile } = useContext(AuthContext);
  const [nombre, setNombre] = useState(user?.nombre || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdate = async () => {
    if (!nombre.trim()) {
      Alert.alert('Error', 'El nombre no puede estar vacío.');
      return;
    }
    setIsSaving(true);
    try {
      await updateProfile(nombre);
      Alert.alert('Éxito', 'Perfil actualizado correctamente.');
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el perfil.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      // En la web los modales a veces son bloqueados por el navegador o iframes
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
              <User size={48} color={colors.primary} />
            </View>
            <Text style={styles.name}>{user.nombre}</Text>
            <Text style={styles.email}>{user.correo}</Text>
          </View>

          <GlassCard style={styles.statsCard}>
            <View style={styles.statItem}>
              <Award size={32} color={colors.accent} />
              <Text style={styles.statValue}>{user.puntosTotales}</Text>
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
                }}
                variant="outline"
              />
            </View>

            {isEditing ? (
              <View style={styles.formContainer}>
                <Input
                  label="Nombre"
                  value={nombre}
                  onChangeText={setNombre}
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

          {/* Sección Tu Impacto movida abajo */}
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
