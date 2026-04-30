import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Modal, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SeleccionarYEscanearCarpeta } from '../../src/api/gestorArchivos';
import { useBibliotecaStore } from '../../src/contextos/bibliotecaStore';
import Colors from '../../constants/Colors';

export default function PantallaAjustes() {
  const { cargarBiblioteca, modoNoche, alternarModoNoche } = useBibliotecaStore();
  const tema = modoNoche ? 'dark' : 'light';
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [errorPermisos, setErrorPermisos] = useState('');

  const manejarSeleccionCarpeta = () => {
    setErrorPermisos('');
    setModalVisible(true);
  };

  const confirmarSeleccionCarpeta = async () => {
    setModalVisible(false);
    setCargando(true);

    const exito = await SeleccionarYEscanearCarpeta('raiz_principal');

    if (exito) {
      await cargarBiblioteca();
      router.replace('/(tabs)');
      setErrorPermisos('');
    } else {
      setErrorPermisos('No se concedieron permisos o hubo un error al leer la carpeta.');
    }

    setCargando(false);
  };

  return (
    <View style={[styles.contenedor, { backgroundColor: Colors[tema].background }]}> 
      <Text style={[styles.titulo, { color: Colors[tema].text }]}>Configuración</Text>
      
      {/* Botón para Escanear */}
      <TouchableOpacity style={styles.boton} onPress={manejarSeleccionCarpeta} disabled={cargando}>
        <Text style={styles.textoBoton}>Seleccionar Libros PDF</Text>
      </TouchableOpacity>

      {errorPermisos ? <Text style={styles.errorTexto}>{errorPermisos}</Text> : null}

      {/* Switch de Modo Noche */}
      <TouchableOpacity 
        style={[styles.boton, { backgroundColor: '#555' }]} 
        onPress={alternarModoNoche}
      >
        <Text style={styles.textoBoton}>
          {modoNoche ? 'Cambiar a Modo Día' : 'Cambiar a Modo Noche'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.info}>
        Selecciona los archivos PDF que desees agregar a tu biblioteca. Se generarán portadas automáticamente.
      </Text>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: Colors[tema].card }]}> 
            <Text style={[styles.modalTitle, { color: Colors[tema].text }]}>Seleccionar libros</Text>
            <Text style={[styles.modalBody, { color: Colors[tema].text }]}>Elige los archivos PDF que deseas añadir a tu biblioteca. Puedes seleccionar varios a la vez.</Text>

            <View style={styles.modalActions}>
              <Pressable
                style={({ pressed }) => [
                  styles.modalButton,
                  styles.cancelButton,
                  pressed && styles.modalButtonPressed,
                ]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.modalButton,
                  styles.confirmButton,
                  pressed && styles.modalButtonPressed,
                ]}
                onPress={confirmarSeleccionCarpeta}
              >
                <Text style={styles.modalButtonText}>Continuar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {cargando ? (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator size="small" color="#ffffff" />
          <Text style={styles.loadingText}>Procesando libros...</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  boton: {
    backgroundColor: '#2f95dc',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  textoBoton: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  info: {
    marginTop: 20,
    textAlign: 'center',
    color: '#888',
    fontSize: 12,
  },
  errorTexto: {
    marginTop: 10,
    color: '#d9534f',
    textAlign: 'center',
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalBody: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelButton: {
    backgroundColor: '#777',
  },
  confirmButton: {
    backgroundColor: '#2f95dc',
  },
  modalButtonPressed: {
    opacity: 0.8,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  loadingWrapper: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    marginLeft: 10,
    color: '#fff',
    fontSize: 14,
  },
});