import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// URL base configurable (usar IP local para pruebas en emulador Android o localhost para iOS)
export const API_URL = 'http://localhost:3000'; // Puedes cambiarlo a tu IP local si usas dispositivo real (ej: http://192.168.1.X:3000) o 10.0.2.2 para Android Emulator

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para inyectar el token JWT en cada petición
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
