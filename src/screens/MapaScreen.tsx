import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { getCentros, Centro } from '../services/centroService';
import { MapaVista } from '../components/MapaVista';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

// US-0003-0001 / US-0003-0002: mapa de centros de reciclaje con su información.
export const MapaScreen = () => {
  const [centros, setCentros] = useState<Centro[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCentros()
      .then(setCentros)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return <MapaVista centros={centros} />;
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
});
