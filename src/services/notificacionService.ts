import api from './api';

export interface Notificacion {
  id: string;
  mensaje: string;
  tipo: string;
  leida: boolean;
  fecha_creacion: string;
}

export const getNotificaciones = async (): Promise<Notificacion[]> => {
  const response = await api.get('/notificaciones');
  return response.data;
};

export const marcarLeida = async (id: string): Promise<void> => {
  await api.patch(`/notificaciones/${id}/leida`);
};
