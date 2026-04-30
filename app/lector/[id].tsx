import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Pdf from 'react-native-pdf';
import { useBibliotecaStore } from '../../src/contextos/bibliotecaStore';
import Colors from '../../constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import { Libro } from '../../src/modelos/Libro';

export default function LectorPDF() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { libros, actualizarLibroEnEstado } = useBibliotecaStore();
  const modoNoche = useBibliotecaStore((state) => state.modoNoche);
  const tema = modoNoche ? 'dark' : 'light';

  const [libro, setLibro] = useState<Libro | null>(null);
  const [cargando, setCargando] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);
  const [paginasTotales, setPaginasTotales] = useState(0);

  useEffect(() => {
    const libroEncontrado = libros.find(l => l.id === id);
    if (libroEncontrado) {
      setLibro(libroEncontrado);
      setPaginaActual(libroEncontrado.paginaActual || 1);
      setPaginasTotales(libroEncontrado.paginasTotales || 0);
    }
    setCargando(false);
  }, [id, libros]);

  const manejarCambioPagina = async (pagina: number, totalPaginas: number) => {
    setPaginaActual(pagina);
    setPaginasTotales(totalPaginas);

    // Actualizar el progreso en la base de datos
    if (libro) {
      const progreso = Math.round((pagina / totalPaginas) * 100);
      const libroActualizado = {
        ...libro,
        paginaActual: pagina,
        paginasTotales: totalPaginas,
        progresoPorcentaje: progreso,
        ultimoAbierto: new Date(),
      };
      await actualizarLibroEnEstado(libroActualizado);
    }
  };

  if (cargando) {
    return (
      <View style={[styles.contenedor, { backgroundColor: Colors[tema].background }]}>
        <ActivityIndicator size="large" color={Colors[tema].tint} />
        <Text style={[styles.textoCargando, { color: Colors[tema].text }]}>
          Cargando libro...
        </Text>
      </View>
    );
  }

  if (!libro) {
    return (
      <View style={[styles.contenedor, { backgroundColor: Colors[tema].background }]}>
        <Text style={[styles.textoError, { color: Colors[tema].text }]}>
          Libro no encontrado
        </Text>
        <TouchableOpacity
          style={[styles.botonVolver, { backgroundColor: Colors[tema].tint }]}
          onPress={() => router.back()}
        >
          <Text style={styles.textoBoton}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.contenedor, { backgroundColor: Colors[tema].background }]}>
      {/* Barra superior con controles */}
      <View style={[styles.barraSuperior, { backgroundColor: Colors[tema].card }]}>
        <TouchableOpacity
          style={styles.botonIcono}
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={20} color={Colors[tema].text} />
        </TouchableOpacity>

        <View style={styles.infoLibro}>
          <Text
            numberOfLines={1}
            style={[styles.tituloLibro, { color: Colors[tema].text }]}
          >
            {libro.titulo}
          </Text>
          <Text style={[styles.infoPaginas, { color: Colors[tema].text }]}>
            Página {paginaActual} de {paginasTotales}
          </Text>
        </View>

        <TouchableOpacity style={styles.botonIcono}>
          <FontAwesome name="cog" size={20} color={Colors[tema].text} />
        </TouchableOpacity>
      </View>

      {/* Visor de PDF */}
      <Pdf
        source={{ uri: libro.rutaCompleta }}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`PDF cargado: ${numberOfPages} páginas`);
          setPaginasTotales(numberOfPages);
        }}
        onPageChanged={(page, numberOfPages) => {
          manejarCambioPagina(page, numberOfPages);
        }}
        onError={(error) => {
          console.log('Error al cargar PDF:', error);
        }}
        style={styles.pdf}
        enablePaging={true}
        horizontal={false}
        fitPolicy={0}
        enableAnnotationRendering={true}
        enableAntialiasing={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
  },
  textoCargando: {
    marginTop: 16,
    fontSize: 16,
  },
  textoError: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  botonVolver: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'center',
  },
  textoBoton: {
    color: 'white',
    fontWeight: '600',
  },
  barraSuperior: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50, // Para el notch/status bar
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  botonIcono: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoLibro: {
    flex: 1,
    marginHorizontal: 16,
  },
  tituloLibro: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  infoPaginas: {
    fontSize: 12,
    opacity: 0.7,
  },
  pdf: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
});