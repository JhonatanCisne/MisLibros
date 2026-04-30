import { Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Libro } from '../modelos/Libro';
import { guardarLibro, crearOVerificarCarpeta } from './baseDeDatos';

export const SeleccionarYEscanearCarpeta = async (idCarpeta: string): Promise<boolean> => {
  if (Platform.OS !== 'android') {
    console.error('Esta funcionalidad solo está disponible en Android.');
    return false;
  }

  try {
    // Usar DocumentPicker para seleccionar múltiples PDFs
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      multiple: true,
    });

    if (result.canceled) {
      console.log('El usuario canceló la selección.');
      return false;
    }

    const archivos = result.assets || [];
    console.log(`Se seleccionaron ${archivos.length} archivos PDF.`);

    // Crear la carpeta antes de guardar libros
    crearOVerificarCarpeta(idCarpeta, 'Raíz Principal');

    for (const archivo of archivos) {
      try {
        // Extraer y limpiar el nombre del archivo para el título
        const nombreReal = archivo.name || 'Libro_Desconocido.pdf';
        const tituloLimpio = nombreReal.replace('.pdf', '').replace(/_/g, ' ');

        // Generar miniatura (Portada) de la primera página
        let portadaUri = archivo.uri; // fallback al URI del PDF
        try {
          // Por ahora usamos el URI del PDF como placeholder
          // TODO: Implementar generación de miniaturas con una librería compatible con Expo
          portadaUri = archivo.uri;
        } catch (thumbnailError) {
          console.warn(`No se pudo generar miniatura para ${tituloLimpio}:`, thumbnailError);
        }

        // Mapear los datos al Modelo de Dominio 'Libro'
        const nuevoLibro: Libro = {
          id: Math.random().toString(36).substring(7),
          idCarpeta: idCarpeta,
          nombreArchivo: nombreReal,
          titulo: tituloLimpio,
          rutaCompleta: archivo.uri,
          formato: 'pdf',
          portadaUri: portadaUri,
          paginasTotales: 0,
          paginaActual: 0,
          progresoPorcentaje: 0,
          estadoOculto: false,
          fechaAgregado: new Date(),
          ultimoAbierto: null,
        };

        // Persistir en la Infraestructura
        await guardarLibro(nuevoLibro);

        console.log(`Procesado con éxito: ${tituloLimpio}`);
      } catch (err) {
        console.error(
          `Error procesando el archivo ${archivo.name}:`,
          err
        );
      }
    }

    console.log(`--- Escaneo finalizado: ${archivos.length} libros procesados ---`);
    return true;
  } catch (error) {
    console.error('Error crítico en la selección de archivos:', error);
    return false;
  }
};