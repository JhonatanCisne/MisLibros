import * as SQLite from 'expo-sqlite';
import { Libro } from '../modelos/Libro';
import { Carpeta } from '../modelos/Carpeta';

const db=SQLite.openDatabaseSync('biblioteca.db');

export const inicializarBaseDeDatos=()=>{
    db.execSync('PRAGMA foreign_keys = ON;');
    //tabla de Carpetas
    db.execSync(`
        CREATE TABLE IF NOT EXISTS carpetas(
            id TEXT PRIMARY KEY NOT NULL,
            nombre TEXT NOT NULL,
            uri TEXT NOT NULL,
            fecha_seleccion TEXT NOT NULL
        );
        `);

    //tabla de Libros
    db.execSync(`
        CREATE TABLE IF NOT EXISTS libros(
            id TEXT PRIMARY KEY NOT NULL,
            id_carpeta TEXT NOT NULL,
            nombre_archivo TEXT NOT NULL,
            titulo TEXT NOT NULL,
            ruta_completa TEXT NOT NULL,
            formato TEXT NOT NULL,
            portada_uri TEXT NOT NULL,
            paginas_totales INTEGER NOT NULL,
            pagina_actual INTEGER NOT NULL,
            progreso_porcentaje REAL DEFAULT 0,
            estado_oculto INTEGER DEFAULT 0,
            ultimo_abierto TEXT,
            fecha_agregado TEXT NOT NULL,
            FOREIGN KEY(id_carpeta) REFERENCES carpetas(id)
            );
        `);
        console.log('Base de datos lista');
};

//Adaptador para crear o verificar una carpeta
export const crearOVerificarCarpeta = (idCarpeta: string, nombre: string = 'Carpeta Principal') => {
  try {
    db.runSync(
      `INSERT OR IGNORE INTO carpetas (id, nombre, uri, fecha_seleccion)
       VALUES (?, ?, ?, ?)`,
      [idCarpeta, nombre, '', new Date().toISOString()]
    );
  } catch (error) {
    console.error('Error al crear/verificar carpeta:', error);
  }
};

//Adaptador para guardar un libro 
export const guardarLibro = (libro: Libro) => {
    try{
        db.runSync(
        `INSERT OR REPLACE INTO libros
        (id, id_carpeta, nombre_archivo, titulo, ruta_completa, formato, portada_uri, paginas_totales, pagina_actual, progreso_porcentaje, estado_oculto, ultimo_abierto, fecha_agregado)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            libro.id.toString(), 
            libro.idCarpeta.toString(), 
            libro.nombreArchivo.toString(), 
            libro.titulo.toString(),
            libro.rutaCompleta.toString(), 
            libro.formato.toString(), 
            libro.portadaUri.toString(), 
            libro.paginasTotales, 
            libro.paginaActual, 
            libro.progresoPorcentaje,
            libro.estadoOculto ? 1 : 0, 
            libro.ultimoAbierto ? libro.ultimoAbierto.toISOString() : null,
            libro.fechaAgregado.toISOString()
        ]
    );
} catch (error) {
    console.error('Error al guardar el libro:', error);
}
};

//Adaptador para actualizar un libro 
export const actualizarLibro = (libro: Libro) => {
    try{
        db.runSync(
        `UPDATE libros SET
        nombre_archivo = ?, titulo = ?, ruta_completa = ?, formato = ?, portada_uri = ?, 
        paginas_totales = ?, pagina_actual = ?, progreso_porcentaje = ?, estado_oculto = ?, 
        ultimo_abierto = ?, fecha_agregado = ?
        WHERE id = ?`,
        [
            libro.nombreArchivo.toString(), 
            libro.titulo.toString(),
            libro.rutaCompleta.toString(), 
            libro.formato.toString(), 
            libro.portadaUri.toString(), 
            libro.paginasTotales, 
            libro.paginaActual, 
            libro.progresoPorcentaje,
            libro.estadoOculto ? 1 : 0, 
            libro.ultimoAbierto ? libro.ultimoAbierto.toISOString() : null,
            libro.fechaAgregado.toISOString(),
            libro.id.toString()
        ]
    );
} catch (error) {
    console.error('Error al actualizar el libro:', error);
}
};

//Adaptador para eliminar un libro
export const eliminarLibro = (idLibro: string) => {
    try {
        db.runSync('DELETE FROM libros WHERE id = ?', [idLibro]);
    } catch (error) {
        console.error('Error al eliminar el libro:', error);
    }
};

export const obtenerTodosLosLibros = async (): Promise<Libro[]> => {
  const todos = await db.getAllAsync('SELECT * FROM libros WHERE estado_oculto = 0');
  
  // Mapeo: De SQL (snake_case) a Dominio (camelCase)
  return todos.map((fila: any) => ({
    id: fila.id,
    idCarpeta: fila.id_carpeta,
    nombreArchivo: fila.nombre_archivo,
    titulo: fila.titulo,
    rutaCompleta: fila.ruta_completa,
    formato: fila.formato,
    portadaUri: fila.portada_uri,
    paginasTotales: fila.paginas_totales,
    paginaActual: fila.pagina_actual,
    progresoPorcentaje: fila.progreso_porcentaje,
    estadoOculto: fila.estado_oculto === 1,
    fechaAgregado: new Date(fila.fecha_agregado),
    ultimoAbierto: fila.ultimo_abierto ? new Date(fila.ultimo_abierto) : null,
  }));
};
