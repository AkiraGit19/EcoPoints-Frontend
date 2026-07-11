import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Clock, Info } from 'lucide-react-native';
import { Centro } from '../services/centroService';
import { GlassCard } from './ui/GlassCard';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

// El mapa nativo no corre en web; mostramos los centros como lista con su info.
// ponytail: fallback web. El mapa real (marcadores/GPS) va en MapaVista.native.
export const MapaVista = ({ centros }: { centros: Centro[] }) => {
  return (
    <LinearGradient colors={[colors.background, '#0f2b20']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Centros de Reciclaje</Text>
        <View style={styles.note}>
          <Info size={14} color={colors.textMuted} />
          <Text style={styles.noteText}>Abre la app en tu móvil para ver el mapa interactivo.</Text>
        </View>
      </View>
      <FlatList
        data={centros}
        keyExtractor={(c) => c.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <GlassCard style={styles.card}>
            <Text style={styles.nombre}>{item.nombre}</Text>
            <View style={styles.row}>
              <MapPin size={16} color={colors.primary} />
              <Text style={styles.rowText}>{item.direccion}</Text>
            </View>
            <View style={styles.row}>
              <Clock size={16} color={colors.primary} />
              <Text style={styles.rowText}>{item.horario_atencion}</Text>
            </View>
            <View style={styles.chips}>
              {(item.materiales_aceptados || []).map((m) => (
                <View key={m} style={styles.chip}><Text style={styles.chipText}>{m}</Text></View>
              ))}
            </View>
          </GlassCard>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No hay centros registrados.</Text>}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 16 },
  title: { ...typography.h1, color: colors.primary },
  note: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  noteText: { ...typography.bodySmall, color: colors.textMuted },
  list: { padding: 24, paddingTop: 8 },
  card: { marginBottom: 16 },
  nombre: { ...typography.h3, color: colors.text, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  rowText: { ...typography.body, color: colors.textMuted, flex: 1 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  chip: { backgroundColor: 'rgba(16, 185, 129, 0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14 },
  chipText: { ...typography.bodySmall, color: colors.primary },
  empty: { ...typography.body, color: colors.textMuted, textAlign: 'center', marginTop: 40 },
});
