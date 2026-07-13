import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapPin, Clock, X } from 'lucide-react-native';
import { Centro } from '../services/centroService';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const icono = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export const MapaVista = ({ centros }: { centros: Centro[] }) => {
  const [seleccionado, setSeleccionado] = useState<Centro | null>(null);

  return (
    <View style={styles.container}>
      <MapContainer center={[-12.11, -77.02] as [number, number]} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {centros.map((c) => (
          <Marker
            key={c.id}
            position={[Number(c.latitud), Number(c.longitud)] as [number, number]}
            icon={icono}
            eventHandlers={{ click: () => setSeleccionado(c) }}
          >
            <Popup>{c.nombre}</Popup>
          </Marker>
        ))}
      </MapContainer>

      {seleccionado && (
        <View style={styles.card}>
          <TouchableOpacity style={styles.close} onPress={() => setSeleccionado(null)}>
            <X size={20} color={colors.textMuted} />
          </TouchableOpacity>
          <Text style={styles.nombre}>{seleccionado.nombre}</Text>
          <View style={styles.row}>
            <MapPin size={16} color={colors.primary} />
            <Text style={styles.rowText}>{seleccionado.direccion}</Text>
          </View>
          <View style={styles.row}>
            <Clock size={16} color={colors.primary} />
            <Text style={styles.rowText}>{seleccionado.horario_atencion}</Text>
          </View>
          <View style={styles.chips}>
            {(seleccionado.materiales_aceptados || []).map((m) => (
              <View key={m} style={styles.chip}>
                <Text style={styles.chipText}>{m}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  card: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 32,
    backgroundColor: '#0f2b20',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  close: { position: 'absolute', top: 14, right: 14, zIndex: 2 },
  nombre: { ...typography.h3, color: colors.text, marginBottom: 12, marginRight: 24 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  rowText: { ...typography.body, color: colors.textMuted, flex: 1 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  chip: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  chipText: { ...typography.bodySmall, color: colors.primary },
});
