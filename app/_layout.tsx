import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { inicializarBaseDeDatos } from '../src/api/baseDeDatos';
import { useBibliotecaStore } from '../src/contextos/bibliotecaStore';

export default function RootLayout() {
  const cargarBiblioteca = useBibliotecaStore((state) => state.cargarBiblioteca);

  useEffect(() => {
    // Preparamos la infraestructura
    inicializarBaseDeDatos();
    
    // Llenamos el Store con los datos de la DB
    cargarBiblioteca();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  );
}