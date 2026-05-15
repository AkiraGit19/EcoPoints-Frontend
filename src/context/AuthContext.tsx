import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export interface User {
  id: string;
  nombre: string;
  correo: string;
  rol: string;
  puntosTotales: number;
}

interface AuthContextData {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (correo: string, contrasena: string) => Promise<void>;
  register: (nombre: string, correo: string, contrasena: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (nombre: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    
    const loadStorageData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        const storedUser = await AsyncStorage.getItem('userData');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error('Error al cargar datos del almacenamiento:', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadStorageData();
  }, []);

  const login = async (correo: string, contrasena: string) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { correo, contrasena });
      const { usuario, token: jwtToken } = response.data;

      const mappedUser = {
        ...usuario,
        puntosTotales: usuario.puntos_totales || 0
      };

      setToken(jwtToken);
      setUser(mappedUser);

      await AsyncStorage.setItem('userToken', jwtToken);
      await AsyncStorage.setItem('userData', JSON.stringify(mappedUser));
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (nombre: string, correo: string, contrasena: string) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/register', { nombre, correo, contrasena });
      const { usuario, token: jwtToken } = response.data;

      const mappedUser = {
        ...usuario,
        puntosTotales: usuario.puntos_totales || 0
      };

      setToken(jwtToken);
      setUser(mappedUser);

      await AsyncStorage.setItem('userToken', jwtToken);
      await AsyncStorage.setItem('userData', JSON.stringify(mappedUser));
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Error al hacer logout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (nombre: string) => {
    if (!user) return;
    
    try {
      const response = await api.patch(`/usuarios/${user.id}`, { nombre });
      const updatedUser = response.data.usuario;
      
      const mappedUser = {
        ...updatedUser,
        puntosTotales: updatedUser.puntos_totales !== undefined ? updatedUser.puntos_totales : user.puntosTotales
      };
      
      setUser(mappedUser);
      await AsyncStorage.setItem('userData', JSON.stringify(mappedUser));
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
