import React, { useState, useMemo } from 'react';
import { StyleSheet, FlatList, TextInput, View, Text } from 'react-native';
import { useBibliotecaStore } from '../../src/contextos/bibliotecaStore';
import { LibroCard } from '../../src/componentes/LibroCard';
import Colors from '../../constants/Colors';

export default function PantallaCatalogo() {
  const { libros, modoNoche, cargando, eliminarLibroEnEstado } = useBibliotecaStore();
  const [busqueda, setBusqueda] = useState('');

  const tema = modoNoche ? 'dark' : 'light';

  // Filtro de búsqueda eficiente 
  const librosFiltrados = useMemo(() => {
    return libros.filter(libro => 
      libro.titulo.toLowerCase().includes(busqueda.toLowerCase())
    );
  }, [libros, busqueda]);

  const manejarPresionarLibro = (libro: any) => {
    console.log("Abrir lector para:", libro.titulo);
    // conectaremos con el visor de PDF más adelante
  };

  const manejarEliminarLibro = (idLibro: string) => {
    eliminarLibroEnEstado(idLibro);
  };

  return (
    <View style={[styles.contenedor, { backgroundColor: Colors[tema].background }]}>
      {/* Buscador Minimalista */}
      <View style={styles.contenedorBusqueda}>
        <TextInput
          placeholder="Buscar en mi biblioteca..."
          placeholderTextColor="#888"
          style={[styles.inputBusqueda, { color: Colors[tema].text, backgroundColor: modoNoche ? '#333' : '#f0f0f0' }]}
          value={busqueda}
          onChangeText={setBusqueda}
        />
      </View>

      {/* Rejilla de Libros */}
      <FlatList
        data={librosFiltrados}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <LibroCard libro={item} onPress={manejarPresionarLibro} onDelete={manejarEliminarLibro} />
        )}
        ListEmptyComponent={
          <View style={styles.contenedorVacio}>
            <Text style={{ color: '#888' }}>
              {cargando ? "Cargando biblioteca..." : "No se encontraron libros."}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    paddingTop: 50, 
  },
  contenedorBusqueda: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  inputBusqueda: {
    height: 45,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  lista: {
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
  contenedorVacio: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
});