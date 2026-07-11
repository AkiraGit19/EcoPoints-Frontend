import api from './api';

export interface Recompensa {
  id: string;
  nombre: string;
  descripcion: string;
  costo_puntos: number;
  stock: number;
}

export const getRecompensas = async (): Promise<Recompensa[]> => {
  const response = await api.get('/recompensas');
  return response.data;
};

export const canjearRecompensa = async (id: string): Promise<{ mensaje: string; saldoRestante: number }> => {
  const response = await api.post(`/recompensas/${id}/canjear`);
  return response.data;
};
