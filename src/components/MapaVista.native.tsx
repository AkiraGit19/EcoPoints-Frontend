import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { MapPin, Clock, X, Navigation } from 'lucide-react-native';
import { Centro } from '../services/centroService';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

// Región inicial: Lima (donde están los centros sembrados).
const REGION_INICIAL: Region = {
  latitude: -12.11,
  longitude: -77.02,
  latitudeDelta: 0.12,
  longitudeDelta: 0.12,
};

export const MapaVista = ({ centros }: { centros: Centro[] }) => {
  const mapRef = useRef<MapView>(null);
  const [miUbicacion, setMiUbicacion] = useState<{ latitude: number; longitude: number } | null>(null);
  const [seleccionado, setSeleccionado] = useState<Centro | null>(null);

  // HIJO1: obtener y mostrar la ubicación actual del usuario por GPS.
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const pos = await Location.getCurrentPositionAsync({});
      setMiUbicacion({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
    })();
  }, []);

  const centrarEnMiUbicacion = () => {
    if (miUbicacion) {
      mapRef.current?.animateToRegion({ ...miUbicacion, latitudeDelta: 0.05, longitudeDelta: 0.05 }, 600);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_DEFAULT}
        style={StyleSheet.absoluteFill}
        initialRegion={REGION_INICIAL}
        showsUserLocation={!!miUbicacion}
        showsMyLocationButton={false}
      >
        {/* HIJO2: un marcador por cada centro de reciclaje */}
        {centros.map((c) => (
          <Marker
            key={c.id}
            coordinate={{ latitude: Number(c.latitud), longitude: Number(c.longitud) }}
            title={c.nombre}
            description={c.direccion}
            pinColor={colors.primary}
            onPress={() => setSeleccionado(c)}
          />
        ))}
      </MapView>

      {miUbicacion && (
        <TouchableOpacity style={styles.locBtn} onPress={centrarEnMiUbicacion}>
          <Navigation size={22} color={colors.background} />
        </TouchableOpacity>
      )}

      {/* HIJO3 + US-0003-0002: al seleccionar un marcador, su info básica */}
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
  locBtn: {
    position: 'absolute',
    right: 20,
    bottom: 40,
    backgroundColor: colors.primary,
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
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
