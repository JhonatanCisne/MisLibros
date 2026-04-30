import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Libro } from '../modelos/Libro';
import { useBibliotecaStore } from '../contextos/bibliotecaStore';
import Colors from '../../constants/Colors';
import { FontAwesome } from '@expo/vector-icons'; 
interface Props {
  libro: Libro;
  onPress: (libro: Libro) => void;
  onDelete: (idLibro: string) => void;
}

export const LibroCard = ({ libro, onPress, onDelete }: Props) => {
  const modoNoche = useBibliotecaStore((state) => state.modoNoche);
  const tema = modoNoche ? 'dark' : 'light';

  const confirmarEliminar = () => {
    Alert.alert(
      'Eliminar libro',
      `¿Estás seguro de que quieres eliminar "${libro.titulo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => onDelete(libro.id) },
      ]
    );
  };

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity 
        style={[styles.card, { backgroundColor: Colors[tema].background }]} 
        onPress={() => onPress(libro)}
      >
        {/* Contenedor de la Portada */}
        <View style={styles.contenedorImagen}>
          <Image 
            source={{ uri: libro.portadaUri }} 
            style={styles.portada} 
            resizeMode="cover"
          />
          {/* Barra de Progreso Minimalista */}
          <View style={styles.contenedorProgreso}>
            <View style={[styles.barraProgreso, { width: `${libro.progresoPorcentaje}%` }]} />
          </View>
        </View>

        {/* Información del Libro */}
        <View style={styles.info}>
          <Text numberOfLines={2} style={[styles.titulo, { color: Colors[tema].text }]}>
            {libro.titulo}
          </Text>
          <Text style={styles.metadatos}>
            {libro.formato.toUpperCase()} • {libro.paginasTotales} pág.
          </Text>
        </View>
      </TouchableOpacity>

      {/* Botón de eliminar */}
      <TouchableOpacity
        style={[styles.botonEliminar, { backgroundColor: Colors[tema].card }]}
        onPress={confirmarEliminar}
      >
        <FontAwesome name="trash" size={16} color="#ff4444" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  contenedorImagen: {
    width: '100%',
    aspectRatio: 2 / 3, 
    backgroundColor: '#e1e1e1',
  },
  portada: {
    flex: 1,
  },
  contenedorProgreso: {
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  barraProgreso: {
    height: '100%',
    backgroundColor: '#2f95dc', 
  },
  info: {
    padding: 10,
  },
  titulo: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  metadatos: {
    fontSize: 11,
    color: '#888',
  },
  cardContainer: {
    flex: 1,
  },
  botonEliminar: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});